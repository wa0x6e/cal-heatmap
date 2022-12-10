import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

[0, 10].forEach((radius) => {
  describe(`on subdomain radius = ${radius}`, () => {
    let cal = null;
    beforeEach(() => {
      cal = new CalHeatmap();
      select('body').append('div').attr('id', 'cal-heatmap');

      cal.init({
        range: 2,
        domain: { type: 'year' },
        subDomain: {
          type: 'month',
          radius,
        },
        formatter: { domainLabel: null },
      });
    });

    afterEach(() => {
      cal.destroy();
      cal = null;
      document.getElementsByTagName('html')[0].innerHTML = '';
    });

    it('renders the subDomain cells with the given radius', () => {
      const selection = select('#cal-heatmap').selectAll('.graph-rect');
      const expectedRadius = radius > 0 ? `${radius}` : null;

      // eslint-disable-next-line no-restricted-syntax
      for (const elem of selection) {
        expect(select(elem).attr('rx')).toBe(expectedRadius);
        expect(select(elem).attr('ry')).toBe(expectedRadius);
      }
    });
  });
});
