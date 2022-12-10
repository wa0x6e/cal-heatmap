import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Date', () => {
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

  it('start the calendar with the given date', () => {
    const startDate = new Date(2020, 6, 15, 2, 6);

    cal.init({
      domain: { type: 'month' },
      subDomain: { type: 'day' },
      date: { start: startDate },
      formatter: {
        subDomainLabel: (date) => date.toISOString(),
      },
    });

    expect(select(select('.subdomain-text').nodes()[0]).html()).toBe(
      new Date(2020, 6, 1, 0, 0).toISOString(),
    );
  });

  it.todo('set the calendar timezone');
  it('set the calendar locale', () => {
    cal.init({
      range: 1,
      date: { start: new Date(2020, 0, 15), locale: 'fr' },
      domain: { type: 'month' },
      subDomain: { type: 'day' },
    });

    expect(select('.graph-label').html()).toBe('janvier');
  });
  it('set the given dates as highlighted', () => {
    const startDate = new Date(2020, 6, 15, 2, 6);
    const highlight = [startDate, new Date(2020, 6, 25, 6, 25)];

    cal.init({
      range: 1,
      domain: { type: 'month' },
      subDomain: { type: 'day' },
      date: { start: startDate, highlight },
    });

    expect(
      select('.graph-subdomain-group g:nth-child(15) rect').attr('class'),
    ).toContain('highlight');

    expect(
      select('.graph-subdomain-group g:nth-child(25) rect').attr('class'),
    ).toContain('highlight');
  });
});
