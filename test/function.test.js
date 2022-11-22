import { expandMarginSetting } from '../src/function';

describe('expandMarginSetting()', () => {
  const defaultSettings = [0, 0, 0, 0];

  describe('when passing a single number', () => {
    it('assigns the value to all directions', () => {
      expect(expandMarginSetting(1)).toEqual([1, 1, 1, 1]);
    });
  });

  describe('when passing an array of 1 value', () => {
    it('assigns the value to all directions', () => {
      expect(expandMarginSetting([1])).toEqual([1, 1, 1, 1]);
    });
  });

  describe('when passing an array of 2 values', () => {
    it('assigns the value to all directions', () => {
      expect(expandMarginSetting([1, 2])).toEqual([1, 2, 1, 2]);
    });
  });

  describe('when passing an array of 3 values', () => {
    it('assigns the value to all directions', () => {
      expect(expandMarginSetting([1, 2, 3])).toEqual([1, 2, 3, 2]);
    });
  });

  describe('when passing an array of 4 values', () => {
    it('assigns the value to all directions', () => {
      expect(expandMarginSetting([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });
  });

  describe('when passing an array of > 4 values', () => {
    it(
      'assigns the value to all directions, ' +
        'and ignore all irrelevant values',
      () => {
        expect(expandMarginSetting([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4]);
      },
    );
  });

  describe('when passing anything other than a number', () => {
    it('fallbacks to the default settings', () => {
      expect(expandMarginSetting('a')).toEqual(defaultSettings);
      expect(expandMarginSetting(null)).toEqual(defaultSettings);
      expect(expandMarginSetting({})).toEqual(defaultSettings);
      expect(expandMarginSetting(['a'])).toEqual(defaultSettings);
      expect(expandMarginSetting([null])).toEqual(defaultSettings);
      expect(expandMarginSetting([{}])).toEqual(defaultSettings);
    });
  });
});
