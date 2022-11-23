import DomainCollection from '../../src/calendar/DomainCollection';

describe('DomainCollection class', () => {
  let d = null;
  beforeEach(() => {
    d = new DomainCollection([
      [20, 1],
      [10, 2],
      [30, 3],
    ]);
  });

  describe('setBatch()', () => {
    it('populates the collection with the passed array', () => {
      const keys = [0, 1, 2, 100];
      d.setBatch(keys);
      expect(d.keys).toEqual([0, 1, 2, 10, 20, 30, 100]);
    });
  });

  describe('pop()', () => {
    it('removes the last item of the collection', () => {
      expect(d.pop()).toEqual(true);
      expect(d.keys).toEqual([10, 20]);
    });
  });

  describe('shift()', () => {
    it('removes the first item of the collection', () => {
      expect(d.shift()).toEqual(true);
      expect(d.keys).toEqual([20, 30]);
    });
  });

  describe('delete()', () => {
    it('removes the specified key from the collection', () => {
      expect(d.delete(20)).toEqual(true);
      expect(d.keys).toEqual([10, 30]);
    });
  });

  describe('set()', () => {
    it('set the specified key/value in the collection', () => {
      expect(d.set(25, 1)).toEqual(true);
      expect(d.keys).toEqual([10, 20, 25, 30]);
    });
  });

  describe('get()', () => {
    it('get the specified key from the collection', () => {
      expect(d.get(20)).toEqual(1);
    });

    describe('when key does not exists', () => {
      it('returns null', () => {
        expect(d.get(21)).toBeUndefined();
      });
    });
  });

  describe('keyIndex()', () => {
    it('returns the index of the key in the collection', () => {
      expect(d.keyIndex(10)).toEqual(0);
      expect(d.keyIndex(20)).toEqual(1);
      expect(d.keyIndex(30)).toEqual(2);
    });
  });
});
