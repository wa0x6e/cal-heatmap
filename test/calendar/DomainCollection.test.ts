// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';

import DomainCollection from '../../src/calendar/DomainCollection';

import type { DataOptions } from '../../src/options/Options';
import type DateHelper from '../../src/helpers/DateHelper';

describe('DomainCollection', () => {
  let d: DomainCollection;

  const dummyDateHelper = {
    intervals: () => [[2, 20], 1, 3, 4, 6, 5],
    date: () => {},
    format: () => {},
  } as unknown as DateHelper;

  beforeEach(() => {
    d = new DomainCollection(dummyDateHelper, 'day', 1, 1);
  });

  it('get the specified key from the collection', () => {
    expect(d.get(2)).toBe(20);
  });

  it('returns null when getting a key that does not exist', () => {
    expect(d.get(21)).toBeUndefined();
  });

  it('returns the keys sorted', () => {
    expect(d.keys).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('return the key at the specified index', () => {
    expect(d.at(1)).toBe(2);
  });

  it('iterates the collection', () => {
    const mock = jest.fn();
    d.forEach(mock);

    expect(mock).toHaveBeenCalledTimes(6);
  });

  describe('slice()', () => {
    it('slices from the start', () => {
      d.slice(4, true);
      expect(d.keys).toEqual([3, 4, 5, 6]);
    });

    it('slices from the end', () => {
      d.slice(4, false);
      expect(d.keys).toEqual([1, 2, 3, 4]);
    });

    it('returns itself', () => {
      expect(d.slice(4)).toBe(d);
    });

    it.each([
      { count: 20, title: 'greater than the collection size' },
      { count: 6, title: 'the size of the collection' },
      { count: undefined, title: 'undefined' },
    ])('do nothing when the limit is $title', ({ count }) => {
      d.slice(count);
      expect(d.keys.length).toBe(6);
    });
  });

  it('clamps the domain to the minimum limit', () => {
    d.clamp(3);
    expect(d.keys).toEqual([3, 4, 5, 6]);
  });

  it('clamps the domain to the maximum limit', () => {
    d.clamp(0, 3);
    expect(d.keys).toEqual([1, 2, 3]);
  });

  it('does nothing when min clamp time is lower than collection min', () => {
    d.clamp(-2);
    expect(d.keys.length).toBe(6);
  });

  it('does nothing when max clamp time is higher than collection max', () => {
    d.clamp(0, 25);
    expect(d.keys.length).toBe(6);
  });

  it('creates an empty collection when no intervals params', () => {
    const h = new DomainCollection(dummyDateHelper);
    expect(h.keys.length).toBe(0);
  });

  it.todo('creates a collection with the specified intervals value');

  describe('when merging with another collection', () => {
    const dummyDateHelperA = {
      intervals: () => [-2, -1, 0, 1],
      date: () => {},
      format: () => {},
    } as unknown as DateHelper;
    const dummyDateHelperB = {
      intervals: () => [10, 20, 30],
      date: () => {},
      format: () => {},
    } as unknown as DateHelper;
    let h: DomainCollection;
    let g: DomainCollection;

    beforeEach(() => {
      h = new DomainCollection(dummyDateHelperA, 'day', 1, 1);
      g = new DomainCollection(dummyDateHelperB, 'day', 1, 1);
    });

    it('prepends the new collection', () => {
      d.merge(h, 6, () => {});
      expect(d.keys).toEqual([-2, -1, 0, 1, 2, 3]);
    });

    it('appends the new collection', () => {
      d.merge(g, 6, () => {});
      expect(d.keys).toEqual([4, 5, 6, 10, 20, 30]);
    });

    it('remembers the deleted domains', () => {
      d.merge(h, 6, () => {});
      expect(d.yankedDomains).toEqual([4, 5, 6]);
    });
  });

  describe('when filling with data', () => {
    let filledDomainCollection: DomainCollection;

    beforeEach(() => {
      filledDomainCollection = new DomainCollection(
        dummyDateHelper,
        'day',
        1,
        1,
      );
      filledDomainCollection.collection = new Map([
        [
          1,
          [
            {
              t: 1,
              x: 0,
              y: 0,
              v: 100,
            },
            {
              t: 3,
              x: 0,
              y: 0,
              v: 100,
            },
          ],
        ],
        [
          2,
          [
            {
              t: 4,
              x: 0,
              y: 0,
              v: 100,
            },
          ],
        ],
      ]);
      filledDomainCollection.keys = [1, 2];

      filledDomainCollection.fill(
        [],
        {
          x: '',
          y: '',
          defaultValue: null,
        } as DataOptions,
        () => {},
      );
    });

    it('resets all values to null', () => {
      expect(filledDomainCollection.get(1)).toEqual([
        {
          t: 1,
          x: 0,
          y: 0,
          v: null,
        },
        {
          t: 3,
          x: 0,
          y: 0,
          v: null,
        },
      ]);
      expect(filledDomainCollection.get(2)).toEqual([
        {
          t: 4,
          x: 0,
          y: 0,
          v: null,
        },
      ]);
    });

    it.todo('parse a date field as timestamp');
    it.todo('parse a date field as string');
    it.todo('groups the value using a string argument');
    it.todo('groups the value using a function');
  });

  describe('extractTimestamp()', () => {
    const dd = new DomainCollection(dummyDateHelper, 'day', 1, 1);

    it.each([
      {
        param: dd.extractTimestamp(
          { date: 1577836800000 },
          'date',
          (a: any) => a,
        ),
        title: 'a timestamp',
      },
      {
        param: dd.extractTimestamp(
          { date: '2020-01-01' },
          'date',
          (a: any) => a,
        ),
        title: 'a date without timezone',
      },
      {
        param: dd.extractTimestamp(
          { date: '2020-01-01T00:00:00.000Z' },
          'date',
          (a: any) => a,
        ),
        title: 'a date with UTC timezone',
      },
      {
        param: dd.extractTimestamp(
          { date: 'Wed Jan 01 2020 04:00:00 GMT+0400 (Gulf Standard Time)' },
          'date',
          (a: any) => a,
        ),
        title: 'a date with a custom timezone',
      },
      {
        param: dd.extractTimestamp(
          { date: '2020-01-01 04:00:00.000+04:00' },
          'date',
          (a: any) => a,
        ),
        title: 'a date with a another custom timezone format',
      },
    ])('extracts the timestamp from $title', ({ param }) => {
      expect(param).toBe(1577836800000);
    });
  });

  describe('groupValues()', () => {
    describe('on number values', () => {
      it('executes the specified group function name', () => {
        expect(d.groupValues([10, 20, 30, null], 'sum')).toBe(60);
      });
      it('returns the result from the function', () => {
        expect(d.groupValues([10, 20, 30], (n) => n[0])).toBe(10);
      });
    });

    describe('on string values', () => {
      it('returns the result from the function', () => {
        expect(d.groupValues(['Asia', 'Europe', 'America'], (n) => n[0])).toBe(
          'Asia',
        );
      });

      it('executes the specified group function name', () => {
        expect(
          d.groupValues(['Asia', 'Europe', 'America', null], 'count'),
        ).toBe(3);
      });
    });
  });
});
