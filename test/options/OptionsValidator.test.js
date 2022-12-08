import validate from '../../src/options/OptionsValidator';
import SubDomainTemplate from '../../src/calendar/SubDomainTemplate';

describe('OptionsValidator', () => {
  const validSubDomainTemplate = new SubDomainTemplate();
  validSubDomainTemplate.settings = {
    day: { level: 10 },
    month: { level: 100 },
  };

  it('throws when the subDomain level is not lower than domain', () => {
    const subDomainTemplate = new SubDomainTemplate();
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'day' },
        subDomain: { type: 'month' },
      });
    }).toThrow();

    subDomainTemplate.settings = {
      day: { level: 100 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'day' },
        subDomain: { type: 'month' },
      });
    }).toThrow();
  });
  it('returns true when all domain/subDomain are valid', () => {
    expect(
      validate(validSubDomainTemplate, {
        domain: { type: 'month' },
        subDomain: { type: 'day' },
      }),
    ).toBe(true);
  });
  it('throws when domain type does not exists', () => {
    const subDomainTemplate = new SubDomainTemplate();
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'test' },
        subDomain: { type: 'month' },
      });
    }).toThrow();
  });
  it('throws when subDomain type does not exists', () => {
    const subDomainTemplate = new SubDomainTemplate();
    subDomainTemplate.settings = {
      day: { level: 10 },
      month: { level: 100 },
    };

    expect(() => {
      validate(subDomainTemplate, {
        domain: { type: 'month' },
        subDomain: { type: 'test' },
      });
    }).toThrow();
  });

  it('only accepts dataType from the whitelist', () => {
    expect(() => {
      validate(validSubDomainTemplate, { dataType: 'hello' });
    }).toThrow();

    expect(
      validate(validSubDomainTemplate, {
        domain: { type: 'month' },
        subDomain: { type: 'day' },
        dataType: 'json',
      }),
    ).toBe(true);
  });
});
