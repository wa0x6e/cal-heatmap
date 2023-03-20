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

    const testOptions = [
      {
        title: 'sets the new value',
        key: 'itemSelector',
        value: 'new Hello',
        return: true,
        itemSelector: 'new Hello',
      },
      {
        title: 'ignores if setting an invalid key',
        key: 'test',
        value: 0,
        return: false,
        itemSelector: defaultValue,
      },
      {
        title: 'ignores if setting a key with the same value',
        key: 'itemSelector',
        value: defaultValue,
        return: false,
        itemSelector: defaultValue,
      },
    ];

    it.each(testOptions)('$title', ({ title, ...data }) => {
      expect(options.set(data.key, data.value)).toEqual(data.return);
      expect(options.options.itemSelector).toEqual(data.itemSelector);
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
