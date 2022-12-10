import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('DomainLabelPainter', () => {
  let cal = null;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  describe('when positionned on top', () => {
    it('aligns the text on the left', () => {
      cal.init({ range: 1, label: { textAlign: 'start' } });

      expect(select('.graph-label').attr('x')).toBe('0');
      expect(select('.graph-label').attr('text-anchor')).toBe('start');
    });
    it('aligns the text on the middle', () => {
      cal.init({ range: 1 });
      const width = select('.graph-domain').attr('width');

      expect(select('.graph-label').attr('x')).toBe(`${width / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('middle');
    });
    it('aligns the text on the right', () => {
      cal.init({ range: 1, label: { textAlign: 'end' } });
      const width = select('.graph-domain').attr('width');

      expect(+select('.graph-label').attr('x')).toBeGreaterThan(width / 2);
      expect(select('.graph-label').attr('text-anchor')).toBe('end');
    });
  });

  describe('when positionned on bottom', () => {
    it('aligns the text on the left', () => {
      cal.init({ range: 1, label: { textAlign: 'start' } });

      expect(select('.graph-label').attr('x')).toBe('0');
    });
    it('aligns the text on the middle', () => {
      cal.init({ range: 1 });
      const width = select('.graph-domain').attr('width');

      expect(select('.graph-label').attr('x')).toBe(`${width / 2}`);
    });
    it.todo('aligns the text on the right');
  });
  describe('when positionned on the left', () => {
    it.todo('aligns the text on the left');
    it.todo('aligns the text on the middle');
    it.todo('aligns the text on the right');
  });
  describe('when positionned on the right', () => {
    it.todo('aligns the text on the left');
    it.todo('aligns the text on the middle');
    it.todo('aligns the text on the right');
  });
});
