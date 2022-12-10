import { select } from 'd3-selection';
import { merge } from 'lodash-es';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('DomainLabelPainter', () => {
  const defaultOptions = {
    range: 1,
    domain: { type: 'year' },
    subDomain: { type: 'month' },
  };
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

  describe('when positionned on top', () => {
    it('aligns the text on the left', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'top', textAlign: 'start' },
        }),
      );

      expect(select('.graph-label').attr('x')).toBe('0');
      expect(select('.graph-label').attr('y')).toBe(`${25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('start');
    });
    it('aligns the text on the middle', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'top', textAlign: 'middle' },
        }),
      );
      const width = select('.graph-domain').attr('width');

      expect(select('.graph-label').attr('x')).toBe(`${width / 2}`);
      expect(select('.graph-label').attr('y')).toBe(`${25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('middle');
    });
    it('aligns the text on the right', () => {
      cal.init(
        merge(defaultOptions, { label: { position: 'top', textAlign: 'end' } }),
      );
      const width = select('.graph-domain').attr('width');

      expect(+select('.graph-label').attr('x')).toBeGreaterThan(width / 2);
      expect(select('.graph-label').attr('y')).toBe(`${25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('end');
    });
  });

  describe('when positionned on bottom', () => {
    it('aligns the text on the left', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'bottom', textAlign: 'start' },
        }),
      );

      expect(select('.graph-label').attr('x')).toBe('0');
      expect(select('.graph-label').attr('y')).toBe(`${10 + 25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('start');
    });

    it('aligns the text on the middle', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'bottom', textAlign: 'middle' },
        }),
      );
      const width = select('.graph-domain').attr('width');

      expect(select('.graph-label').attr('x')).toBe(`${+width / 2}`);
      expect(select('.graph-label').attr('y')).toBe(`${10 + 25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('middle');
    });
    it('aligns the text on the right', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'bottom', textAlign: 'end' },
        }),
      );
      const width = select('.graph-domain').attr('width');

      expect(+select('.graph-label').attr('x')).toBeGreaterThan(width / 2);
      expect(select('.graph-label').attr('y')).toBe(`${10 + 25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('end');
    });
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
