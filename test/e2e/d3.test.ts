import { By } from 'selenium-webdriver';

describe('d3js matrix', () => {
  let driver: any;

  beforeAll(async () => {
    // @ts-ignore
    driver = await globalThis.buildDriver();
  }, 30000);

  afterAll(async () => {
    await driver.quit();
  }, 40000);

  ['v6', 'v7'].forEach((version: string) => {
    describe(`D3js ${version}`, () => {
      beforeAll(async () => {
        await driver.get(
          `http://localhost:3003/test/e2e/index-d3${version}.html`,
        );
      }, 30000);

      it('renders the default number of domains;', async () => {
        await driver.findElement(By.id('cal-heatmap'));
        const paintPromise = await driver.executeScript(
          'return cal.paint({ animationDuration: 0 });',
        );
        await paintPromise;

        expect(
          await driver.executeScript(
            "return d3.select('#cal-heatmap')." +
              "selectAll('.graph-domain').size()",
          ),
        ).toBe(12);
      }, 35000);

      it('renders the given number of domains', async () => {
        await driver.findElement(By.id('cal-heatmap'));
        const paintPromise = await driver.executeScript(
          'return cal.paint({ animationDuration: 0, range: 5 });',
        );
        await paintPromise;

        expect(
          await driver.executeScript(
            "return d3.select('#cal-heatmap')." +
              "selectAll('.graph-domain').size()",
          ),
        ).toBe(5);
      }, 35000);

      it('scrolls back by the given number of domains', async () => {
        expect.assertions(4);
        await driver.findElement(By.id('cal-heatmap'));
        const paintPromise = await driver.executeScript(
          'return cal.paint({ animationDuration: 0, ' +
            "date: { start: new Date(2020, 1) }, domain: { type: 'year' }, " +
            "subDomain: { type: 'month' } });",
        );
        await paintPromise;

        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(1)').attr('class')",
          ),
        ).toContain('y_2020');
        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(2)').attr('class')",
          ),
        ).toContain('y_2021');

        const navPromise = await driver.executeScript('cal.previous(5)');
        await navPromise;

        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(1)').attr('class')",
          ),
        ).toContain('y_2015');
        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(2)').attr('class')",
          ),
        ).toContain('y_2016');
      }, 35000);

      it('scrolls forward by the given number of domains', async () => {
        expect.assertions(4);
        await driver.findElement(By.id('cal-heatmap'));
        const paintPromise = await driver.executeScript(
          'return cal.paint({ animationDuration: 0, ' +
            "date: { start: new Date(2020, 1) }, domain: { type: 'year' }, " +
            "subDomain: { type: 'month' } });",
        );
        await paintPromise;

        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(1)').attr('class')",
          ),
        ).toContain('y_2020');
        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(2)').attr('class')",
          ),
        ).toContain('y_2021');

        const navPromise = await driver.executeScript('cal.next(5)');
        await navPromise;

        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(1)').attr('class')",
          ),
        ).toContain('y_2025');
        expect(
          await driver.executeScript(
            "return d3.select('.graph-domain:nth-child(2)').attr('class')",
          ),
        ).toContain('y_2026');
      }, 35000);

      it('returns the dimensions', async () => {
        await driver.findElement(By.id('cal-heatmap'));
        const paintPromise = await driver.executeScript('return cal.paint();');
        await paintPromise;

        const dimensions = await driver.executeScript(
          'return cal.dimensions()',
        );

        const dom = await driver.findElement(
          By.className('cal-heatmap-container'),
        );

        expect(dimensions.width.toString()).toBe(
          await dom.getAttribute('width'),
        );
        expect(dimensions.height.toString()).toBe(
          await dom.getAttribute('height'),
        );
      });

      it('destroys the calendar', async () => {
        await driver.findElement(By.id('cal-heatmap'));
        const paintPromise = await driver.executeScript('return cal.paint();');
        await paintPromise;

        const destroyPromise = await driver.executeScript(
          'return cal.destroy()',
        );
        await destroyPromise;

        expect(
          await driver.executeScript("return d3.select('#cal-heatmap').html()"),
        ).toBe('');
      }, 35000);
    });
  });
});
