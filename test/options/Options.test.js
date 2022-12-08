import Options from '../../src/options/Options';

describe('Options', () => {
  describe('set()', () => {
    let options;
    const defaultValue = 'Hello';

    beforeEach(() => {
      options = new Options();
      options.options = { data: defaultValue };
    });

    it('sets the new value', () => {
      expect(options.set('data', 'new Hello')).toEqual(true);
      expect(options.options.data).toEqual('new Hello');
    });

    it('ignores if setting an invalid key', () => {
      expect(options.set('test', 0)).toEqual(false);
      expect(options.options.data).toEqual(defaultValue);
    });

    it('ignores if setting a key with the same value', () => {
      expect(options.set('data', defaultValue)).toEqual(false);
      expect(options.options.data).toEqual(defaultValue);
    });

    it('runs the preProcessor before setting the key if necessary', () => {
      options.preProcessors = {
        data: (v) => `${v}-processed`,
      };

      options.set('data', 'bonjour');
      expect(options.options.data).toBe('bonjour-processed');
    });
  });

  describe('init()', () => {
    let options = null;

    beforeEach(() => {
      options = new Options();
      options.options = { data: '' };
    });

    it('runs the preProcessor before setting the key if necessary', () => {
      options.preProcessors = {
        data: (v) => `${v}-processed`,
      };

      options.set('data', 'bonjour');
      expect(options.options.data).toBe('bonjour-processed');
    });
  });
});
