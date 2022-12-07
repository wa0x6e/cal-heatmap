import Options from '../../src/options/Options';
import SubDomainTemplate from '../../src/calendar/SubDomainTemplate';

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

  describe('validate()', () => {
    let options = null;

    beforeEach(() => {
      const subDomainTemplate = new SubDomainTemplate({
        helpers: { DateHelper: () => {} },
        options: { options: {} },
      });
      subDomainTemplate.add([
        () => ({ name: 'day', level: 10 }),
        () => ({ name: 'day2', level: 10 }),
        () => ({ name: 'year', level: 100 }),
      ]);

      options = new Options();
      options.calendar = { subDomainTemplate };
    });

    it('returns true when there is not errors', () => {
      options.init({ domain: 'year', subDomain: 'day' });
      expect(options.validate()).toBe(true);
    });

    it('throws an error when the domain option is not valid', () => {
      expect(() => {
        options.init({ domain: 'test', subDomain: 'day' });
        options.validate();
      }).toThrow();
    });

    it('throws an error when the subDomain option is not valid', () => {
      expect(() => {
        options.init({ domain: 'day', subDomain: 'test' });
        options.validate();
      }).toThrow();
    });

    it('throws an error when the domain/subDomain couple is not valid', () => {
      expect(() => {
        options.init({ domain: 'day', subDomain: 'day2' });
        options.validate();
      }).toThrow();
      expect(() => {
        options.init({ domain: 'day', subDomain: 'year' });
        options.validate();
      }).toThrow();
    });
  });
});
