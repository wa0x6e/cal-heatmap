import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('itemSelector', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders the calendar inside the default itemSelector', () => {
    cal.init({});
    expect(select('#cal-heatmap .cal-heatmap-container').node()).not.toBeNull();
  });

  it('renders nothing when the itemSelector is not valid', () => {
    const html = select('body').html();

    cal.init({ itemSelector: '.not-existing' });
    expect(select('body').html()).toBe(html);
  });

  it('renders the calendar inside the empty given itemSelector', () => {
    select('body').append('div').attr('class', 'test-selector');
    cal.init({ itemSelector: '.test-selector' });

    expect(select('#cal-heatmap .cal-heatmap-container').node()).toBeNull();
    expect(
      select('.test-selector .cal-heatmap-container').node(),
    ).not.toBeNull();
  });

  it('renders the calendar inside the not empty given itemSelector', () => {
    const content = 'some content';
    select('body')
      .append('div')
      .attr('class', 'test-selector')
      .append('span')
      .html(content);
    cal.init({ itemSelector: '.test-selector' });

    expect(select('#cal-heatmap .cal-heatmap-container').node()).toBeNull();
    expect(
      select('.test-selector .cal-heatmap-container').node(),
    ).not.toBeNull();
    expect(select('.test-selector > span').html()).toBe(content);
  });
});
