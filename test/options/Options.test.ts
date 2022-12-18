import Options from '../../src/options/Options';
import preProcessors from '../../src/options/OptionsPreProcessors';

describe('Options', () => {
  describe('set()', () => {
    let options: Options;
    const defaultValue = 'Hello';

    beforeEach(() => {
      options = new Options(preProcessors);
      options.options.itemSelector = defaultValue;
    });

    it('sets the new value', () => {
      expect(options.set('itemSelector', 'new Hello')).toEqual(true);
      expect(options.options.itemSelector).toEqual('new Hello');
    });

    it('ignores if setting an invalid key', () => {
      expect(options.set('test', 0)).toEqual(false);
      expect(options.options.itemSelector).toEqual(defaultValue);
    });

    it('ignores if setting a key with the same value', () => {
      expect(options.set('itemSelector', defaultValue)).toEqual(false);
      expect(options.options.itemSelector).toEqual(defaultValue);
    });

    it('runs the preProcessor before setting the key if necessary', () => {
      options.set('range', -5);
      expect(options.options.range).toBe(1);
    });
  });

  describe('init()', () => {
    let options: Options;

    beforeEach(() => {
      options = new Options(preProcessors);
    });

    it('runs the preProcessor before setting the key if necessary', () => {
      options.init({ range: -5 });
      expect(options.options.range).toBe(1);
    });
  });
});
