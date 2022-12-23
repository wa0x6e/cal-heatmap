import OptionsPreProcessors from '../../src/options/OptionsPreProcessors';

describe('OptionsPreProcessors', () => {
  describe('validate()', () => {
    it('ensures range is always >= 1', () => {
      expect(OptionsPreProcessors.range(3)).toBe(3);
      expect(OptionsPreProcessors.range(0)).toBe(1);
      expect(OptionsPreProcessors.range(-20)).toBe(1);
    });

    it('always cast highlight as array', () => {
      const date = new Date();
      expect(OptionsPreProcessors['date.highlight'](date)).toEqual([date]);
      expect(OptionsPreProcessors['date.highlight']([date])).toEqual([date]);
    });

    it('only accepts valid values subDomain label formatter', () => {
      const key = 'subDomain.label';
      const fn = () => '';

      expect(OptionsPreProcessors[key]('')).toBe(null);
      expect(OptionsPreProcessors[key](null)).toBe(null);

      expect(OptionsPreProcessors[key]('A')).toBe('A');
      expect(OptionsPreProcessors[key](fn)).toBe(fn);
    });
  });
});
