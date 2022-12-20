import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

[0, 10].forEach((gutter) => {
  describe(`on subdomain gutter = ${gutter}`, () => {
    let cal: CalHeatmap;
    beforeEach(() => {
      cal = new CalHeatmap();
      select('body').append('div').attr('id', 'cal-heatmap');

      cal.paint({
        range: 1,
        domain: { type: 'hour' },
        subDomain: {
          type: 'minute',
          gutter,
        },
      });
    });

    afterEach(() => {
      cal.destroy();
      document.getElementsByTagName('html')[0].innerHTML = '';
    });

    it('renders the subDomain cells with the given gutter', () => {
      expect(
        select('.graph-subdomain-group g:nth-child(1) .graph-rect').attr('x'),
      ).toBe('0');
      expect(
        select('.graph-subdomain-group g:nth-child(1) .graph-rect').attr('y'),
      ).toBe('0');

      expect(
        select('.graph-subdomain-group g:nth-child(2) .graph-rect').attr('x'),
      ).toBe('0');
      expect(
        select('.graph-subdomain-group g:nth-child(2) .graph-rect').attr('y'),
      ).toBe(`${gutter + 10}`);

      expect(
        select('.graph-subdomain-group g:nth-child(11) .graph-rect').attr('x'),
      ).toBe(`${gutter + 10}`);
      expect(
        select('.graph-subdomain-group g:nth-child(11) .graph-rect').attr('y'),
      ).toBe('0');
    });
  });
});
