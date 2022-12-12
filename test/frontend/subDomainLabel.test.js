import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('subDomainlabel', () => {
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

  it('do not show the label', () => {
    cal.init({ subDomain: { label: null } });

    const n = selectAll('.subdomain-text').nodes();

    expect(n.length).toBe(0);
  });
  it('shows the label', () => {
    cal.init({
      range: 1,
      domain: { type: 'year' },
      subDomain: { type: 'month', label: '-' },
    });

    const n = selectAll('.subdomain-text').nodes();

    expect(n.length).toBe(12);
  });

  it('formats the label from a string', () => {
    cal.init({
      range: 1,
      date: { start: new Date(2020, 0, 1) },
      domain: { type: 'year' },
      subDomain: { type: 'month', label: 'MMMM YYYY' },
    });

    const n = selectAll('.subdomain-text').nodes();

    expect(select(n[0]).html()).toBe('January 2020');
    expect(select(n[11]).html()).toBe('December 2020');
  });

  it('formats the label from a function', () => {
    const date = new Date(2020, 0, 1);
    const data = {};
    data[+date / 1000] = 10;

    cal.on('fill', () => {
      const n = selectAll('.subdomain-text').nodes();

      expect(select(n[0]).html()).toBe('0-10');
      expect(select(n[11]).html()).toBe('11-null');
    });

    cal.init({
      range: 1,
      date: { start: date },
      data: { source: data },
      domain: { type: 'year' },
      subDomain: {
        type: 'month',
        label: (d, v) => `${d.getMonth()}-${v}`,
      },
    });
  });
});
