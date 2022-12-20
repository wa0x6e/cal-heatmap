import TemplateCollection from '../../src/calendar/TemplateCollection';
import DateHelper from '../../src/helpers/DateHelper';
import Options from '../../src/options/Options';
import type { TemplateResult } from '../../src/index';

describe('TemplateCollection', () => {
  let t: TemplateCollection;
  const template = { name: 'test_day' };
  const options = new Options();
  const helpers = { DateHelper: new DateHelper() };

  beforeEach(() => {
    t = new TemplateCollection(helpers, options);
    t.settings.set('test_day', template as TemplateResult);
  });

  it('returns the settings from the specified domain', () => {
    expect(t.get('test_day')).toEqual(template);
    expect(t.get('nonexisting')).toEqual(undefined);
  });

  it('returns true if the specified domain exist', () => {
    expect(t.has('test_day')).toBe(true);
  });

  it('returns false if the specified domain does not exist', () => {
    expect(t.has('nonexisting')).toBe(false);
  });

  it('can init with the default templates', () => {
    expect(t.has('day')).toBe(false);
    t.init();
    expect(t.has('day')).toBe(true);
  });

  it('can add a single template', () => {
    const name = 'test_year';

    expect(t.has(name)).toBe(false);
    t.add(() => ({ name } as TemplateResult));
    expect(t.has(name)).toBe(true);
  });

  it('can add an array of templates', () => {
    const name = 'test_year';
    const nameB = 'test_year2';

    expect(Array.from(t.settings.entries())).toEqual([
      ['test_day', template],
    ]);
    t.add([
      () => ({ name } as TemplateResult),
      () => ({ name: nameB } as TemplateResult),
    ]);

    expect(Array.from(t.settings.entries())).toEqual([
      ['test_day', template],
      ['test_year', { name }],
      ['test_year2', { name: nameB }],
    ]);
  });

  it('keeps the existing templates', () => {
    const name = 'test_year';
    const nameB = 'test_year2';

    t.init();

    const count = t.settings.size;
    t.add([
      () => ({ name } as TemplateResult),
      () => ({ name: nameB } as TemplateResult),
    ]);

    expect(t.settings.size).toBe(count + 2);
  });
});
