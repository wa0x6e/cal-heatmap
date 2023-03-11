import { select } from 'd3-selection';
import merge from 'lodash-es/merge';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';
import type { OptionsType } from '../../src/options/Options';

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
    it('aligns the text on the left', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'top', textAlign: 'start' } },
        }) as OptionsType,
      );

      expect(select('.ch-domain-text').attr('x')).toBe('0');
      expect(select('.ch-domain-text').attr('y')).toBe(`${25 / 2}`);
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('start');
    });
    it('aligns the text on the middle', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'top', textAlign: 'middle' } },
        }) as OptionsType,
      );
      const width: number = +select('.ch-domain').attr('width');

      expect(select('.ch-domain-text').attr('x')).toBe(`${width / 2}`);
      expect(select('.ch-domain-text').attr('y')).toBe(`${25 / 2}`);
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('middle');
    });
    it('aligns the text on the right', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'top', textAlign: 'end' } },
        }) as OptionsType,
      );
      const width: number = +select('.ch-domain').attr('width');

      expect(select('.ch-domain-text').attr('x')).toBe(`${width}`);
      expect(select('.ch-domain-text').attr('y')).toBe(`${25 / 2}`);
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('end');
    });
  });

  describe('when positionned on bottom', () => {
    it('aligns the text on the left', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'bottom', textAlign: 'start' } },
        }) as OptionsType,
      );

      expect(select('.ch-domain-text').attr('x')).toBe('0');
      expect(select('.ch-domain-text').attr('y')).toBe(`${10 + 25 / 2}`);
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('start');
    });

    it('aligns the text on the middle', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'bottom', textAlign: 'middle' } },
        }) as OptionsType,
      );
      const width = select('.ch-domain').attr('width');

      expect(select('.ch-domain-text').attr('x')).toBe(`${+width / 2}`);
      expect(select('.ch-domain-text').attr('y')).toBe(`${10 + 25 / 2}`);
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('middle');
    });
    it('aligns the text on the right', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'bottom', textAlign: 'end' } },
        }) as OptionsType,
      );
      const width = select('.ch-domain').attr('width');

      expect(select('.ch-domain-text').attr('x')).toBe(`${width}`);
      expect(select('.ch-domain-text').attr('y')).toBe(`${10 + 25 / 2}`);
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('end');
    });
  });

  describe('when positionned on the left', () => {
    it('aligns the text on the left', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: {
            label: { position: 'left', textAlign: 'start', width: 50 },
          },
        }) as OptionsType,
      );

      expect(select('.ch-domain-text').attr('x')).toBe('0');
      expect(select('.ch-domain-text').attr('y')).toBe('0');
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('start');
      expect(select('.ch-domain-text').attr('dominant-baseline')).toBe(
        'hanging',
      );
      expect(select('.ch-subdomain-container').attr('x')).toBe('50');
    });

    it('aligns the text on the middle', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: {
            label: { position: 'left', textAlign: 'middle', width: 50 },
          },
        }) as OptionsType,
      );

      expect(select('.ch-domain-text').attr('x')).toBe('25');
      expect(select('.ch-domain-text').attr('y')).toBe('0');
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('middle');
      expect(select('.ch-domain-text').attr('dominant-baseline')).toBe(
        'hanging',
      );
      expect(select('.ch-subdomain-container').attr('x')).toBe('50');
    });
    it('aligns the text on the right', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'left', textAlign: 'end', width: 50 } },
        }) as OptionsType,
      );

      expect(select('.ch-domain-text').attr('x')).toBe('50');
      expect(select('.ch-domain-text').attr('y')).toBe('0');
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('end');
      expect(select('.ch-domain-text').attr('dominant-baseline')).toBe(
        'hanging',
      );
      expect(select('.ch-subdomain-container').attr('x')).toBe('50');
    });
    it.todo('rotate the text left');
    it.todo('rotate the text right');
  });

  describe('when positionned on the right', () => {
    it('aligns the text on the left', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: {
            label: { position: 'right', textAlign: 'start', width: 50 },
          },
        }) as OptionsType,
      );

      const width: number = +select('.ch-domain').attr('width');
      expect(select('.ch-domain-text').attr('x')).toBe(`${width - 50}`);
      expect(select('.ch-domain-text').attr('y')).toBe('0');
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('start');
      expect(select('.ch-domain-text').attr('dominant-baseline')).toBe(
        'hanging',
      );
      expect(select('.ch-subdomain-container').attr('x')).toBe('0');
    });
    it('aligns the text on the middle', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: {
            label: { position: 'right', textAlign: 'middle', width: 50 },
          },
        }) as OptionsType,
      );

      const width: number = +select('.ch-domain').attr('width');
      expect(select('.ch-domain-text').attr('x')).toBe(`${width - 50 + 25}`);
      expect(select('.ch-domain-text').attr('y')).toBe('0');
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('middle');
      expect(select('.ch-domain-text').attr('dominant-baseline')).toBe(
        'hanging',
      );
      expect(select('.ch-subdomain-container').attr('x')).toBe('0');
    });
    it('aligns the text on the right', async () => {
      await cal.paint(
        merge(defaultOptions, {
          domain: { label: { position: 'right', textAlign: 'end', width: 50 } },
        }) as OptionsType,
      );

      const width: number = +select('.ch-domain').attr('width');
      expect(select('.ch-domain-text').attr('x')).toBe(`${width}`);
      expect(select('.ch-domain-text').attr('y')).toBe('0');
      expect(select('.ch-domain-text').attr('text-anchor')).toBe('end');
      expect(select('.ch-domain-text').attr('dominant-baseline')).toBe(
        'hanging',
      );
      expect(select('.ch-subdomain-container').attr('x')).toBe('0');
    });
    it.todo('rotate the text left');
    it.todo('rotate the text right');
  });
});
