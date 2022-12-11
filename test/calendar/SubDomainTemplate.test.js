import SubDomainTemplate from '../../src/calendar/SubDomainTemplate';
import DateHelper from '../../src/helpers/DateHelper';

describe('SubDomainTemplate', () => {
  let t = null;
  const template = { name: 'test_day' };
  const calendarDummy = {
    options: { options: { domain: '', domainDynamicDimension: false } },
    helpers: { DateHelper: new DateHelper() },
  };

  beforeEach(() => {
    t = new SubDomainTemplate(calendarDummy);
    t.settings = {
      test_day: template,
    };
  });

  it('returns the settings from the specified domain', () => {
    expect(t.at('test_day')).toEqual(template);
    expect(t.at('nonexisting')).toEqual(undefined);
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
    t.add(() => ({ name }));
    expect(t.has(name)).toBe(true);
  });

  it('can add an array of templates', () => {
    const name = 'test_year';
    const nameB = 'test_year2';

    expect(t.settings).toEqual({
      test_day: template,
    });
    t.add([() => ({ name }), () => ({ name: nameB })]);

    expect(t.settings).toEqual({
      test_day: template,
      test_year: { name },
      test_year2: { name: nameB },
    });
  });

  it('keeps the existing templates', () => {
    const name = 'test_year';
    const nameB = 'test_year2';

    t.init();

    const count = Object.keys(t.settings).length;
    t.add([() => ({ name }), () => ({ name: nameB })]);

    expect(Object.keys(t.settings).length).toBe(count + 2);
  });

  it('lazy load the helpers', () => {
    const dummy = {
      helpers: {
        DateHelper: {
          value: () => '1',
        },
      },
      options: {
        options: {},
      },
    };
    const y = new SubDomainTemplate(dummy);

    y.add([
      (helpers) => ({
        name: 'A',
        value: () => helpers.DateHelper.value(),
      }),
    ]);

    expect(y.at('A').value()).toBe('1');

    dummy.helpers.DateHelper = {
      value: () => '2',
    };

    expect(y.at('A').value()).toBe('2');
  });
});
