import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('itemSelector', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders the calendar inside the default itemSelector', () => {
    const cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
    cal.init();
    expect(
      select('#cal-heatmap').select('.cal-heatmap-container').node(),
    ).not.toBeNull();
  });

  it('renders nothing when the itemSelector is not valid', () => {
    select('body').append('div').attr('id', 'cal-heatmap');
    const html = select('body').html();

    ['.not-existing', null, false].forEach((selector) => {
      const cal = new CalHeatmap();
      cal.init({ itemSelector: selector });
      expect(select('body').html()).toBe(html);
    });
  });

  it('renders the calendar inside the given itemSelector', () => {
    const cal2 = new CalHeatmap();
    select('body').append('div').attr('class', 'test-selector');
    select('body').append('div').attr('id', '#cal-heatmap');
    cal2.init({ itemSelector: '.test-selector' });

    expect(select('#cal-heatmap').select('#cal-heatmap').node()).toBeNull();
    expect(
      select('.test-selector').select('.cal-heatmap-container').node(),
    ).not.toBeNull();
  });
});
