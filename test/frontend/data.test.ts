import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Data', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('populates from a JSON object', () => {
    const data: any[] = [];
    const date = new Date(2000, 0, 1);
    data.push({
      time: +date,
      value: 10,
    });

    cal.on('fill', () => {
      expect(select('.graph-domain:nth-child(1) g text').html()).toBe('10');
    });

    cal.paint({
      range: 1,
      date: { start: date },
      data: { source: data, x: 'time', y: 'value' },
      domain: { type: 'year' },
      subDomain: {
        type: 'month',
        label: (d, v) => `${v}`,
      },
    });
  });
  it.todo('populates from an URL as json');
  it.todo('populates from an URL as csv');
  it.todo('populates from an URL as tsv');
  it.todo('populates from an URL as text');
  it.todo('process the data');
});
