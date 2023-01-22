/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/valid-title */
import { Builder } from 'selenium-webdriver';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';

// @ts-ignore
import suite from '../frontend/export';

function getArrowFunctionBody(f: any) {
  const matches = f
    .toString()
    .match(/^(?:\s*\(?(?:\s*\w*\s*,?\s*)*\)?\s*?=>\s*){?([\s\S]*)}?$/);
  if (!matches) {
    return null;
  }

  const firstPass = matches[1];

  // Needed because the RegExp doesn't handle the last '}'.
  const secondPass =
    (firstPass.match(/{/g) || []).length ===
    (firstPass.match(/}/g) || []).length - 1 ?
      firstPass.slice(0, firstPass.lastIndexOf('}')) :
      firstPass;

  return secondPass;
}

const Runner = (
  name: string,
  file: string,
  customCapabilities: any = { 'bstack:options': {}, browserName: 'Chrome' },
) => {
  if (
    process.env.LOCAL === '1' &&
    Object.keys(customCapabilities['bstack:options']).length > 0
  ) {
    // eslint-disable-next-line jest/no-disabled-tests, jest/expect-expect
    it.skip('is skipped on local', () => {});
    return;
  }

  let timeout = 2000;
  if (process.env.LOCAL !== '1') {
    jest.retryTimes(2);
    timeout = 10000;
  }

  describe(name, () => {
    let driver: any;
    let driverBuilder: any;

    if (process.env.LOCAL === '1') {
      driverBuilder = () => new Builder().forBrowser('chrome').build();
    } else {
      const username = process.env.BROWSERSTACK_USERNAME;
      const accesskey = process.env.BROWSERSTACK_ACCESS_KEY;

      const capabilities = {
        ...customCapabilities,
        'bstack:options': {
          projectName: 'Testing CalHeatmap and d3js on browsers matrix',
          local: false,
          // timezone: 'Paris',
          ...customCapabilities['bstack:options'],
        },
      };

      driverBuilder = () => new Builder()
        .usingServer(
          `https://${username}:${accesskey}@hub-cloud.browserstack.com/wd/hub`,
        )
        .withCapabilities(capabilities)
        .build();
    }

    beforeAll(async () => {
      driver = await driverBuilder();
    }, 45000);

    afterAll(async () => {
      await driver.quit();
    }, 20000);

    beforeEach(async () => {
      let prefix = 'https://cal-heatmap.com/tests/';
      if (process.env.LOCAL === '1') {
        prefix = 'http://localhost:3003/test/e2e/';
      }

      await driver.get(`${prefix}${file}`);
      await driver.executeScript(
        `window.defaultOptions = {
          animationDuration: 100,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          range: 1,
        };`,
      );
    }, timeout);

    suite.forEach((testSuite: any) => {
      describe(testSuite.title, () => {
        testSuite.tests.forEach((test: any) => {
          if (test.expectations) {
            it(
              test.title,
              async () => {
                let executeReturn: any;
                const setupPromise = await driver.executeScript(
                  getArrowFunctionBody(test.setup),
                );
                await setupPromise;

                if (test.preExpectations) {
                  const results = test.preExpectations.map(async (e: any) => {
                    const current = await driver.executeScript(
                      getArrowFunctionBody(e.current),
                    );
                    expect(current).toBe(e.expected());
                  });

                  await Promise.allSettled(results);
                }

                if (test.execute) {
                  const executePromise: any = await driver.executeScript(
                    getArrowFunctionBody(test.execute),
                  );
                  executeReturn = await executePromise;
                }

                const results = test.expectations.map(async (e: any) => {
                  const current = await driver.executeScript(
                    getArrowFunctionBody(e.current),
                  );

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

                return Promise.allSettled(results).then(() => {
                  expect.assertions(
                    test.expectations.length +
                      (test.preExpectations ? test.preExpectations.length : 0),
                  );
                });
              },
              timeout,
            );
          } else {
            it.todo(test.title);
          }
        });
      });
    });
  });
};

// eslint-disable-next-line jest/no-export
export default Runner;
