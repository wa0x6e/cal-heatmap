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
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
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
      const width: number = +select('.graph-domain').attr('width');

      expect(select('.graph-label').attr('x')).toBe(`${width / 2}`);
      expect(select('.graph-label').attr('y')).toBe(`${25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('middle');
    });
    it('aligns the text on the right', () => {
      cal.init(
        merge(defaultOptions, { label: { position: 'top', textAlign: 'end' } }),
      );
      const width: number = +select('.graph-domain').attr('width');

      expect(select('.graph-label').attr('x')).toBe(`${width}`);
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

      expect(select('.graph-label').attr('x')).toBe(`${width}`);
      expect(select('.graph-label').attr('y')).toBe(`${10 + 25 / 2}`);
      expect(select('.graph-label').attr('text-anchor')).toBe('end');
    });
  });

  describe('when positionned on the left', () => {
    it('aligns the text on the left', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'left', textAlign: 'start', width: 50 },
        }),
      );

      expect(select('.graph-label').attr('x')).toBe('0');
      expect(select('.graph-label').attr('y')).toBe('0');
      expect(select('.graph-label').attr('text-anchor')).toBe('start');
      expect(select('.graph-label').attr('dominant-baseline')).toBe('hanging');
      expect(select('.graph-subdomain-group').attr('x')).toBe('50');
    });

    it('aligns the text on the middle', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'left', textAlign: 'middle', width: 50 },
        }),
      );

      expect(select('.graph-label').attr('x')).toBe('25');
      expect(select('.graph-label').attr('y')).toBe('0');
      expect(select('.graph-label').attr('text-anchor')).toBe('middle');
      expect(select('.graph-label').attr('dominant-baseline')).toBe('hanging');
      expect(select('.graph-subdomain-group').attr('x')).toBe('50');
    });
    it('aligns the text on the right', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'left', textAlign: 'end', width: 50 },
        }),
      );

      expect(select('.graph-label').attr('x')).toBe('50');
      expect(select('.graph-label').attr('y')).toBe('0');
      expect(select('.graph-label').attr('text-anchor')).toBe('end');
      expect(select('.graph-label').attr('dominant-baseline')).toBe('hanging');
      expect(select('.graph-subdomain-group').attr('x')).toBe('50');
    });
    it.todo('rotate the text left');
    it.todo('rotate the text right');
  });

  describe('when positionned on the right', () => {
    it('aligns the text on the left', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'right', textAlign: 'start', width: 50 },
        }),
      );

      const width: number = +select('.graph-domain').attr('width');
      expect(select('.graph-label').attr('x')).toBe(`${width - 50}`);
      expect(select('.graph-label').attr('y')).toBe('0');
      expect(select('.graph-label').attr('text-anchor')).toBe('start');
      expect(select('.graph-label').attr('dominant-baseline')).toBe('hanging');
      expect(select('.graph-subdomain-group').attr('x')).toBe('0');
    });
    it('aligns the text on the middle', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'right', textAlign: 'middle', width: 50 },
        }),
      );

      const width: number = +select('.graph-domain').attr('width');
      expect(select('.graph-label').attr('x')).toBe(`${width - 50 + 25}`);
      expect(select('.graph-label').attr('y')).toBe('0');
      expect(select('.graph-label').attr('text-anchor')).toBe('middle');
      expect(select('.graph-label').attr('dominant-baseline')).toBe('hanging');
      expect(select('.graph-subdomain-group').attr('x')).toBe('0');
    });
    it('aligns the text on the right', () => {
      cal.init(
        merge(defaultOptions, {
          label: { position: 'right', textAlign: 'end', width: 50 },
        }),
      );

      const width: number = +select('.graph-domain').attr('width');
      expect(select('.graph-label').attr('x')).toBe(`${width}`);
      expect(select('.graph-label').attr('y')).toBe('0');
      expect(select('.graph-label').attr('text-anchor')).toBe('end');
      expect(select('.graph-label').attr('dominant-baseline')).toBe('hanging');
      expect(select('.graph-subdomain-group').attr('x')).toBe('0');
    });
    it.todo('rotate the text left');
    it.todo('rotate the text right');
  });
});
