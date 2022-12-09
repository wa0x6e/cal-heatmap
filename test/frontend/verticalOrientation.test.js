import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('on horizontal orientation', () => {
  beforeEach(() => {
    const cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');

    cal.init({
      range: 5,
    });
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders the domains side by side', () => {
    const selection = select('#cal-heatmap').selectAll('.graph-domain');
    let posX = -1;

    // eslint-disable-next-line no-restricted-syntax
    for (const elem of selection) {
      expect(+select(elem).attr('y')).toBe(0);
      expect(+select(elem).attr('x')).toBeGreaterThan(posX);
      posX = +select(elem).attr('x');
    }
  });
});

describe('on vertical orientation', () => {
  beforeEach(() => {
    const cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');

    cal.init({
      range: 5,
      verticalOrientation: true,
    });
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders the domains below one other', () => {
    const selection = select('#cal-heatmap').selectAll('.graph-domain');
    let posY = -1;

    // eslint-disable-next-line no-restricted-syntax
    for (const elem of selection) {
      expect(+select(elem).attr('x')).toBe(0);
      expect(+select(elem).attr('y')).toBeGreaterThan(posY);
      posY = +select(elem).attr('y');
    }
  });
});
