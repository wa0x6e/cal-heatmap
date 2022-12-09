import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

it('destroys the calendar', () => {
  const cal = new CalHeatmap();
  select('body').append('div').attr('id', 'cal-heatmap');

  cal.init({ range: 1 });
  expect(select('#cal-heatmap').selectAll('.graph-domain').size()).toBe(1);

  cal.destroy(() => {
    expect(select('#cal-heatmap').html()).toBe('');
  });
});
