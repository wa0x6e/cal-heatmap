// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';

import DomainCollection from '../../src/calendar/DomainCollection';

describe('DomainCollection', () => {
  let d = null;

  const dateHelper = {
    intervals: () => [[2, 20], 1, 3, 4, 6, 5],
  };

  beforeEach(() => {
    d = new DomainCollection(dateHelper, 'day', true, true, true);
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

    it('do nothing when the limit is greater than the collection size', () => {
      d.slice(20);
      expect(d.keys.length).toBe(6);
    });

    it('do nothing when the limit is the size of the collection', () => {
      d.slice(6);
      expect(d.keys.length).toBe(6);
    });

    it('do nothing when limit is undefined', () => {
      d.slice();
      expect(d.keys.length).toBe(6);
    });
  });

  it('returns the index of the key in the collection', () => {
    expect(d.keyIndex(1)).toBe(0);
    expect(d.keyIndex(2)).toBe(1);
    expect(d.keyIndex(5)).toBe(4);
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
    const h = new DomainCollection({});
    expect(h.keys.length).toBe(0);
  });

  it.todo('creates a collection with the specified intervals value');

  describe('when merging with another collection', () => {
    const dateHelperA = {
      intervals: () => [-2, -1, 0, 1],
    };
    const dateHelperB = {
      intervals: () => [10, 20, 30],
    };
    let h = null;
    let g = null;

    beforeEach(() => {
      h = new DomainCollection(dateHelperA, 'day', true, true, true);
      g = new DomainCollection(dateHelperB, 'day', true, true, true);
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
});
