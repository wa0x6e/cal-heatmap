import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('domain.dynamicDimension', () => {
  let cal: CalHeatmap;

  beforeEach(() => {
    select('body').append('div').attr('id', 'cal-heatmap');
    cal = new CalHeatmap();
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders domains with same size when disabled', () => {
    cal.paint({
      range: 5,
      domain: { type: 'month', dynamicDimension: false },
      subDomain: { type: 'day', gutter: 0, width: 10 },
    });

    const selection = selectAll('.graph-domain');
    const widths = new Set();

    // eslint-disable-next-line no-restricted-syntax
    for (const elem of selection) {
      widths.add(select(elem).attr('width'));
    }

    expect(widths.size).toBe(1);
    expect(widths.values().next().value).toBe('60');
  });

  it('renders domains with different width when enabled', () => {
    cal.paint({
      range: 5,
      domain: { type: 'month', dynamicDimension: true },
      subDomain: { type: 'day', gutter: 0 },
    });

    const selection = selectAll('.graph-domain');
    const widths = new Set();

    // eslint-disable-next-line no-restricted-syntax
    for (const elem of selection) {
      widths.add(select(elem).attr('width'));
    }

    expect(widths.size).toBeGreaterThan(1);
  });
});
