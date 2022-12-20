import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Tooltip', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('enables the tooltip', () => {
    expect(select('#ch-tooltip').node()).toBeNull();

    cal.on('fill', () => {
      cal.eventEmitter.emit('mouseover', {
        target: select('.graph-rect').node(),
      });

      expect(select('#ch-tooltip').attr('data-show')).toBe('1');
      expect(select('#ch-tooltip-body').html()).not.toBeNull();
    });

    cal.paint({ tooltip: true });
    expect(select('#ch-tooltip').node()).not.toBeNull();
  });

  it('disables the tooltip', () => {
    expect(select('#ch-tooltip').node()).toBeNull();

    cal.paint({ tooltip: false });

    expect(select('#ch-tooltip').node()).toBeNull();
  });
});
