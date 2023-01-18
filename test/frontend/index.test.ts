/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/valid-title */
import { select, selectAll } from 'd3-selection';
/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';
// @ts-ignore
import suite from './export';

suite.forEach((testSuite: any) => {
  describe(testSuite.title, () => {
    let cal: CalHeatmap;

    beforeEach(() => {
      // @ts-ignore
      window.defaultOptions = {
        animationDuration: 100,
        domain: { type: 'year' },
        subDomain: { type: 'month' },
        range: 1,
      };
      cal = new CalHeatmap();
      select('body').html('');
      select('body').append('div').attr('id', 'cal-heatmap');
    });

    afterEach(() => {
      cal.destroy();
      document.getElementsByTagName('html')[0].innerHTML = '';
    });

    testSuite.tests.forEach((test: any) => {
      const d3 = { select, selectAll };

      if (test.expectations) {
        it(
          test.title,
          async () => {
            let executeReturn: any;
            const setupPromise = test.setup(cal, d3);
            await setupPromise;

            if (test.preExpectations) {
              const results = test.preExpectations.map(async (e: any) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                expect(e.current(d3)).toBe(e.expected()));
              await Promise.allSettled(results);
            }

            if (test.execute) {
              const executePromise: any = test.execute(cal, d3);
              executeReturn = await executePromise;
            }

            test.expectations.forEach((e: any) => {
              const current = e.current(d3);

              if (e.notExpected) {
                expect(current).not.toBe(e.notExpected(executeReturn));
              }
              if (e.expected) {
                expect(current).toBe(e.expected(executeReturn));
              }
              if (e.expectedContain) {
                expect(current).toContain(e.expectedContain(executeReturn));
              }
            });

            expect.assertions(
              test.expectations.length +
                (test.preExpectations ? test.preExpectations.length : 0),
            );
          },
          5000,
        );
      } else {
        it.todo(test.title);
      }
    });
  });
});
