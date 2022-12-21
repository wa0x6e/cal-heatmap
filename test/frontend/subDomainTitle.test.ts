import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('subDomainTitle', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('formats the title with the user function', () => {
    const date = new Date(2000, 0, 5);
    const data: any[] = [];
    data.push({
      time: +date,
      value: 10,
    });

    cal.on('fill', () => {
      expect(
        select(selectAll('.graph-rect').nodes()[0]).attr('aria-labelledby'),
      ).toBe('2000-10');
      expect(
        select(selectAll('.graph-rect').nodes()[11]).attr('aria-labelledby'),
      ).toBe('2000-null');
    });

    cal.paint({
      range: 1,
      date: { start: date },
      data: { source: data, x: 'time', y: 'value' },
      domain: { type: 'year' },
      subDomain: {
        type: 'month',
        label: (d, v) => `${v}`,
        title: (d: number, value: number) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          `${new Date(d).getFullYear()}-${value}`,
      },
    });
  });

  it('formats the title with the default function', () => {
    const date = new Date(2000, 0, 5);
    const data: any[] = [];
    data.push({
      time: +date,
      value: 10,
    });

    cal.on('fill', () => {
      expect(
        select(selectAll('.graph-rect').nodes()[0]).attr('aria-labelledby'),
      ).toBe(`10 - ${new Date(2000, 0, 1).toISOString()}`);
      expect(
        select(selectAll('.graph-rect').nodes()[11]).attr('aria-labelledby'),
      ).toBe(`null - ${new Date(2000, 11, 1).toISOString()}`);
    });

    cal.paint({
      range: 1,
      date: { start: date },
      data: { source: data, x: 'time', y: 'value' },
      domain: { type: 'year' },
      subDomain: {
        type: 'month',
      },
    });
  });
});
