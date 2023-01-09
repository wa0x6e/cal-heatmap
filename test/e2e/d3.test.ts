/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/valid-title */

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

describe('d3js matrix', () => {
  let driver: any;

  beforeAll(async () => {
    // @ts-ignore
    driver = await globalThis.buildDriver();
  }, 15000);

  afterAll(async () => {
    await driver.quit();
  }, 20000);

  const testFamily: any = {
    'D3JS v7 / UMD': 'http://localhost:3003/test/e2e/index-d3v7.html',
    'D3JS v6 / UMD': 'http://localhost:3003/test/e2e/index-d3v6.html',
    'D3JS v7 / ESM': 'http://localhost:3003/test/e2e/index-esm-d3v7.html',
  };

  Object.keys(testFamily).forEach((name: string) => {
    describe(name, () => {
      beforeEach(async () => {
        await driver.get(testFamily[name]);
        await driver.executeScript(
          `window.defaultOptions = {
            animationDuration: 100,
            domain: { type: 'year' },
            subDomain: { type: 'month' },
            range: 1,
          };`,
        );
      }, 10000);

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
                  });

                  return Promise.allSettled(results).then(() => {
                    expect.assertions(
                      test.expectations.length +
                        (test.preExpectations ?
                          test.preExpectations.length :
                          0),
                    );
                  });
                },
                5000,
              );
            } else {
              it.todo(test.title);
            }
          });
        });
      });
    });
  });
});
