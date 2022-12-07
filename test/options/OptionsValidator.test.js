import validate from '../../src/options/OptionsValidator';
import SubDomainTemplate from '../../src/calendar/SubDomainTemplate';

describe('OptionsValidator', () => {
  it('throws when the subDomain level is not lower than domain', () => {
    const subDomainTemplate = new SubDomainTemplate();
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, { domain: 'day', subDomain: 'month' });
    }).toThrow();

    subDomainTemplate.settings = {
      day: { level: 100 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, { domain: 'day', subDomain: 'month' });
    }).toThrow();
  });
  it('returns true when all domain/subDomain are valid', () => {
    const subDomainTemplate = new SubDomainTemplate();
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
    };

    expect(
      validate(subDomainTemplate, { domain: 'month', subDomain: 'day' }),
    ).toBe(true);
  });
  it('throws when domain type does not exists', () => {
    const subDomainTemplate = new SubDomainTemplate();
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, { domain: 'test', subDomain: 'month' });
    }).toThrow();
  });
  it('throws when subDomain type does not exists', () => {
    const subDomainTemplate = new SubDomainTemplate();
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, { domain: 'month', subDomain: 'test' });
    }).toThrow();
  });

  it('only accepts dataType from the whitelist', () => {
    const subDomainTemplate = { has: () => true, at: () => 10 };

    expect(() => {
      validate(subDomainTemplate, { dataType: 'hello' });
    }).toThrow();

    expect(validate(subDomainTemplate, { dataType: 'json' })).toBe(true);
  });
});
