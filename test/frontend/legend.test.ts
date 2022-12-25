import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';
import Legend from '../../src/plugins/Legend';

describe('Legend', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
    select('body').append('div').attr('id', 'legend');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders the legend after the calendar', () => {
    cal.paint({}, [[Legend]]);
    expect(select('#cal-heatmap .graph-legend')).not.toBeNull();
  });

  it('renders the legend in the itemSelector', () => {
    cal.paint({}, [[Legend, { itemSelector: '#legend' }]]);
    expect(select('#cal-heatmap .graph-legend').node()).toBeNull();
    expect(select('#legend svg').node()).not.toBeNull();
  });

  it('does not render the legend', () => {
    cal.paint({}, [[Legend, { enabled: false }]]);
    expect(select('.graph-legend').node()).toBeNull();
  });

  it('adds a title to the legend', () => {
    cal.paint({}, [[Legend, { itemSelector: '#legend', label: 'Test' }]]);

    expect(select('#legend svg > text').html()).toBe('Test');
  });

  it('paints the subDomain with the colors', () => {
    const range = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];
    cal.paint(
      {
        scale: {
          as: 'color',
          range,
        },
      },
      [[Legend, { enabled: true, itemSelector: '#legend' }]],
    );

    const rects = selectAll('#legend rect').nodes();

    const colors = rects.map((d) => select(d).attr('fill'));
    expect(colors).toEqual(range);

    expect(colors.length).toBe(5);
  });

  it('is destroyed alongside the calendar', () => {
    cal.paint({ range: 1 }, [[Legend]]);
    expect(select('.graph-legend').size()).toBe(1);

    return cal.destroy().then(() => {
      expect(select('.graph-legend').size()).toBe(0);
    });
  });
});
