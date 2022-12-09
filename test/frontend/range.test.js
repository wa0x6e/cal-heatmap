import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

it('renders the given number of domains', () => {
  const cal = new CalHeatmap();
  select('body').append('div').attr('id', 'cal-heatmap');

  cal.init({ range: 1 });
  expect(select('#cal-heatmap').selectAll('.graph-domain').size()).toBe(1);

  cal.init({ range: 5 });
  expect(select('#cal-heatmap').selectAll('.graph-domain').size()).toBe(5);
});
