import validate from '../../src/options/OptionsValidator';
import TemplateCollection from '../../src/calendar/TemplateCollection';
import Options from '../../src/options/Options';

describe('OptionsValidator', () => {
  const helpers = { DateHelper: {} };
  const options = new Options();

  beforeEach(() => {
    options.init({
      domain: { type: 'month' },
      subDomain: { type: 'day' },
      data: { type: 'json' },
    });
  });

  const validSubDomainTemplate = new TemplateCollection(helpers, options);
  validSubDomainTemplate.settings = {
    day: { level: 10 },
    month: { level: 100 },
  };

  it('throws when the subDomain level is not lower than domain', () => {
    const subDomainTemplate = new TemplateCollection(helpers, options);
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
      data: { type: 'json' },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'day' },
        subDomain: { type: 'month' },
        data: { type: 'json' },
      });
    }).toThrow();

    subDomainTemplate.settings = {
      day: { level: 100 },
      month: { level: 100 },
      data: { type: 'json' },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'day' },
        subDomain: { type: 'month' },
        data: { type: 'json' },
      });
    }).toThrow();
  });
  it('returns true when all domain/subDomain are valid', () => {
    expect(validate(validSubDomainTemplate, options.options)).toBe(true);
  });
  it('throws when domain type does not exists', () => {
    const subDomainTemplate = new TemplateCollection(helpers, options);
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
      data: { type: 'json' },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'test' },
        subDomain: { type: 'month' },
        data: { type: 'json' },
      });
    }).toThrow();
  });
  it('throws when subDomain type does not exists', () => {
    const subDomainTemplate = new TemplateCollection(helpers, options);
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
      data: { type: 'json' },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'month' },
        subDomain: { type: 'test' },
        data: { type: 'json' },
      });
    }).toThrow();
  });

  it('only accepts dataType from the whitelist', () => {
    expect(() => {
      validate(validSubDomainTemplate, {
        ...options.options,
        data: { type: 'hello' },
      });
    }).toThrow();

    expect(
      validate(validSubDomainTemplate, {
        domain: { type: 'month' },
        subDomain: { type: 'day' },
        data: { type: 'json' },
      }),
    ).toBe(true);
  });
});
