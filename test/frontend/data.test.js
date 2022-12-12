import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Data', () => {
  let cal = null;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    cal = null;
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('populates from a JSON object', () => {
    const data = {};
    const date = new Date('2000-01-01T00:00:00.000Z');
    data[+date / 1000] = 10;

    cal.on('fill', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(select('.graph-domain:nth-child(1) g').node().__data__.t).toBe(
        +date,
      );
      // eslint-disable-next-line no-underscore-dangle
      expect(select('.graph-domain:nth-child(1) g').node().__data__.v).toBe(10);
      expect(select('.graph-domain:nth-child(1) g text').html()).toBe('10');
    });

    cal.init({
      range: 1,
      date: { start: date, timezone: 'utc' },
      data: { source: data },
      domain: { type: 'year' },
      subDomain: {
        type: 'month',
        label: (d, v) => v,
      },
    });
  });
  it.todo('populates from an URL as json');
  it.todo('populates from an URL as csv');
  it.todo('populates from an URL as tsv');
  it.todo('populates from an URL as text');
  it.todo('process the data');
});
