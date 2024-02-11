import validate from '../../src/options/OptionsValidator';
import TemplateCollection from '../../src/TemplateCollection';
import Options from '../../src/options/Options';

import type { TemplateResult } from '../../src/types';
import DateHelper from '../../src/helpers/DateHelper';

describe('OptionsValidator', () => {
  const dateHelper = new DateHelper();
  const options = new Options();

  beforeEach(() => {
    options.init({
      domain: { type: 'month' },
      subDomain: { type: 'day' },
      data: { type: 'json' },
    });
  });

  const validSubDomainTemplate = new TemplateCollection(dateHelper, options);
  validSubDomainTemplate.settings = new Map([
    ['day', { allowedDomainType: ['month'] } as TemplateResult],
    ['x_day', { allowedDomainType: ['month'] } as TemplateResult],
    ['month', { allowedDomainType: ['month'] } as TemplateResult],
  ]);

  it('returns true when all domain/subDomain are valid', () => {
    expect(validate(validSubDomainTemplate, options.options)).toBe(true);
  });

  it('throws when domain type does not exists', () => {
    expect(() => {
      validate(validSubDomainTemplate, {
        // @ts-ignore
        domain: { type: 'test' },
        subDomain: { type: 'month' },
        data: { type: 'json' },
      });
    }).toThrow();
  });

  it('throws when subDomain type does not exists', () => {
    expect(() => {
      validate(validSubDomainTemplate, {
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
        // @ts-ignore
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

  it('only accepts valid Domain/SubDomain couple', () => {
    validSubDomainTemplate.init();

    expect(() => {
      validate(validSubDomainTemplate, {
        domain: { type: 'month' },
        subDomain: { type: 'year' },
        data: { type: 'json' },
      });
    }).toThrow();

    expect(() => {
      validate(validSubDomainTemplate, {
        domain: { type: 'hour' },
        subDomain: { type: 'year' },
        data: { type: 'json' },
      });
    }).toThrow();

    expect(() => {
      validate(validSubDomainTemplate, {
        domain: { type: 'year' },
        subDomain: { type: 'minute' },
        data: { type: 'json' },
      });
    }).toThrow();

    expect(
      validate(validSubDomainTemplate, {
        domain: { type: 'year' },
        subDomain: { type: 'month' },
        data: { type: 'json' },
      }),
    ).toBe(true);
  });
});
