import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('subDomainTitle', () => {
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

  it('formats the title with the user function', () => {
    const date = new Date('2000-01-01T00:00:00.000Z');
    const data = {};
    data[+date / 1000] = 10;

    cal.on('fill', () => {
      expect(
        select(selectAll('.graph-rect').nodes()[0]).attr('aria-labelledby'),
      ).toBe('2000-10');
      expect(
        select(selectAll('.graph-rect').nodes()[11]).attr('aria-labelledby'),
      ).toBe('2000-null');
    });

    cal.init({
      range: 1,
      date: { start: date, timezone: 'utc' },
      data: { source: data },
      domain: { type: 'year' },
      subDomain: {
        type: 'month',
        label: (d, v) => v,
        title: (d, value) => `${d.getFullYear()}-${value}`,
      },
    });
  });

  it('formats the title with the default function', () => {
    const date = new Date('2000-01-01T00:00:00.000Z');
    const data = {};
    data[+date / 1000] = 10;

    cal.on('fill', () => {
      expect(
        select(selectAll('.graph-rect').nodes()[0]).attr('aria-labelledby'),
      ).toBe('10 - 2000-01-01T00:00:00.000Z');
      expect(
        select(selectAll('.graph-rect').nodes()[11]).attr('aria-labelledby'),
      ).toBe('null - 2000-12-01T00:00:00.000Z');
    });

    cal.init({
      range: 1,
      date: { start: date, timezone: 'utc' },
      data: { source: data },
      domain: { type: 'year' },
      subDomain: {
        type: 'month',
      },
    });
  });
});
