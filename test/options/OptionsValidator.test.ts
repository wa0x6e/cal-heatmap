import validate from '../../src/options/OptionsValidator';
import TemplateCollection from '../../src/calendar/TemplateCollection';
import Options from '../../src/options/Options';

import type { TemplateResult } from '../../src/index';
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
    ['day', { level: 10 } as TemplateResult],
    ['x_day', { level: 10 } as TemplateResult],
    ['month', { level: 100 } as TemplateResult],
  ]);

  it('throws when the subDomain level is not lower than domain', () => {
    expect(() => {
      validate(validSubDomainTemplate, {
        domain: { type: 'day' },
        subDomain: { type: 'month' },
        data: { type: 'json' },
      });
    }).toThrow();

    expect(() => {
      validate(validSubDomainTemplate, {
        domain: { type: 'day' },
        subDomain: { type: 'x_day' },
        data: { type: 'json' },
      });
    }).toThrow();
  });

  it('returns true when all domain/subDomain are valid', () => {
    expect(validate(validSubDomainTemplate, options.options)).toBe(true);
  });

  it('throws when domain type does not exists', () => {
    expect(() => {
      validate(validSubDomainTemplate, {
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
});
