// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Methods', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  describe('paint()', () => {
    it('returns a Promise', () => {
      expect(cal.paint()).toBeInstanceOf(Promise);
    });

    it('returns a rejected Promise on options critical error', async () => {
      // @ts-ignore
      await expect(cal.paint({ domain: { type: 'hello' } })).rejects.toThrow();
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that fully resolve on success', () => {
      // @ts-ignore
      return cal.paint().then((data) => {
        // @ts-ignore
        data.forEach((pr) => {
          // @ts-ignore
          expect(pr.status).toBe('fulfilled');
        });
      });
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that contains a rejected promise', () => {
      // @ts-ignore
      return cal.paint({ data: { source: 'unknown.csv' } }).then((data) => {
        // @ts-ignore
        const r = data.map((pr) => pr.status);

        expect(r).toContain('fulfilled');
        expect(r).toContain('rejected');
      });
    });
  });

  describe('next()', () => {
    beforeEach(() => {
      cal.paint();
    });

    it('returns a Promise', () => {
      expect(cal.next()).toBeInstanceOf(Promise);
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that fully resolve on success', () => {
      // @ts-ignore
      return cal.next().then((data) => {
        // @ts-ignore
        data.forEach((pr) => {
          // @ts-ignore
          expect(pr.status).toBe('fulfilled');
        });
      });
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that contains a rejected promise', () => {
      cal.fill = jest.fn(() => Promise.reject());

      // @ts-ignore
      return cal.next().then((data) => {
        // @ts-ignore
        const r = data.map((pr) => pr.status);

        expect(r).toContain('fulfilled');
        expect(r).toContain('rejected');
      });
    });
  });

  describe('previous()', () => {
    beforeEach(() => {
      cal.paint();
    });

    it('returns a Promise', () => {
      expect(cal.previous()).toBeInstanceOf(Promise);
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that fully resolve on success', () => {
      // @ts-ignore
      return cal.previous().then((data) => {
        // @ts-ignore
        data.forEach((pr) => {
          // @ts-ignore
          expect(pr.status).toBe('fulfilled');
        });
      });
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that contains a rejected promise', () => {
      cal.fill = jest.fn(() => Promise.reject());

      // @ts-ignore
      return cal.previous().then((data) => {
        // @ts-ignore
        const r = data.map((pr) => pr.status);

        expect(r).toContain('fulfilled');
        expect(r).toContain('rejected');
      });
    });
  });

  describe('jumpTo()', () => {
    beforeEach(() => {
      cal.paint();
    });

    it('returns a Promise', () => {
      expect(cal.jumpTo(new Date())).toBeInstanceOf(Promise);
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that fully resolve on success', () => {
      // @ts-ignore
      return cal.jumpTo(new Date()).then((data) => {
        // @ts-ignore
        data.forEach((pr) => {
          // @ts-ignore
          expect(pr.status).toBe('fulfilled');
        });
      });
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a Promise that contains a rejected promise', () => {
      cal.fill = jest.fn(() => Promise.reject());

      // @ts-ignore
      return cal.jumpTo(new Date()).then((data) => {
        // @ts-ignore
        const r = data.map((pr) => pr.status);

        expect(r).toContain('fulfilled');
        expect(r).toContain('rejected');
      });
    });
  });

  describe('destroy()', () => {
    beforeEach(() => {
      cal.paint();
    });

    it('returns a Promise', () => {
      expect(cal.destroy()).toBeInstanceOf(Promise);
    });
  });

  describe('fill()', () => {
    beforeEach(() => {
      cal.paint();
    });

    it('returns a Promise', () => {
      expect(cal.fill()).toBeInstanceOf(Promise);
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a resolved promise', () => {
      return expect(cal.fill([])).resolves.toBe(null);
    });

    // eslint-disable-next-line arrow-body-style
    it('returns a rejected Promise', () => {
      return expect(cal.fill('data.csv')).rejects.toThrow();
    });
  });
});
