import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Legend', () => {
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

  it.todo('renders the legend with the passed options');
  it('does not render the legend', () => {
    cal.init({ legend: { show: false } });
    expect(select('.graph-legend').node()).toBeNull();
  });

  it.todo('adds a title to the legend');
});
