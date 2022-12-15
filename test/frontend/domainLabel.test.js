import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('domainlabel', () => {
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

  [false, null, ''].forEach((formatter) => {
    it('does not render a label when formatter is disabled', () => {
      cal.init({
        range: 1,
        domain: { type: 'year', label: formatter },
        subDomain: { type: 'month' },
      });

      expect(selectAll('.graph-label').nodes().length).toBe(0);
    });
  });

  it('renders the default label when formatter is undefined', () => {
    cal.init({
      range: 1,
      domain: { type: 'month', label: undefined },
      subDomain: { type: 'week' },
      date: { start: new Date(2020, 0, 15) },
    });

    expect(selectAll('.graph-label').html()).toBe('January');
  });

  it('renders the return value of the given function', () => {
    cal.init({
      range: 1,
      domain: { type: 'month', label: (date) => `${date.getMonth()};` },
      subDomain: { type: 'week' },
      date: { start: new Date(2020, 0, 15) },
    });

    expect(selectAll('.graph-label').html()).toBe('0;');
  });

  it('renders the format output of the given string format', () => {
    cal.init({
      range: 1,
      domain: { type: 'month', label: 'MMM' },
      subDomain: { type: 'week' },
      date: { start: new Date(2020, 0, 15) },
    });

    expect(selectAll('.graph-label').html()).toBe('Jan');
  });
});
