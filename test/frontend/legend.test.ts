import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Legend', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders the legend after the calendar', () => {
    cal.init({ legend: { show: true } });
    expect(select('#cal-heatmap .graph-legend')).not.toBeNull();
  });

  it('renders the legend in the itemSelector', () => {
    select('body').append('div').attr('id', 'legend');
    cal.init({ legend: { show: true, itemSelector: '#legend' } });
    expect(select('#cal-heatmap .graph-legend').node()).toBeNull();
    expect(select('#legend svg').node()).not.toBeNull();
  });

  it('does not render the legend', () => {
    cal.init({ legend: { show: false } });
    expect(select('.graph-legend').node()).toBeNull();
  });

  it('adds a title to the legend', () => {
    select('body').append('div').attr('id', 'legend');
    cal.init({
      legend: { show: true, label: 'Test', itemSelector: '#legend' },
    });

    expect(select('#legend svg > text').html()).toBe('Test');
  });

  it('paints the subDomain with the colors', () => {
    select('body').append('div').attr('id', 'legend');
    const range = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];
    cal.init({
      legend: { show: true, itemSelector: '#legend' },
      scale: {
        as: 'color',
        range,
      },
    });

    const rects = selectAll('#legend rect').nodes();

    const colors = rects.map((d) => select(d).attr('fill'));
    expect(colors).toEqual(range);

    expect(colors.length).toBe(5);
  });
});
