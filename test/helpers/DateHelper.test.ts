import moment from 'moment-timezone';

import DateHelper from '../../src/helpers/DateHelper';
import weekData from '../fixtures/weekNumberDates';
import dates from '../fixtures/dates';
import Options from '../../src/options/Options';

const date = new Date('2020-01-02T04:24:25.256+00:00');
const DEFAULT_LOCALE = 'en';

describe('DateHelper', () => {
  let options: Options;
  let dateHelper: DateHelper;

  beforeEach(() => {
    options = new Options();
    dateHelper = new DateHelper();
    dateHelper.setup(options);
    dateHelper.setMoment(moment);
    dateHelper.date = (
      d: number | Date | string = new Date(),
    ) => moment.tz(d, 'utc');
  });

  describe('setup()', () => {
    ['en', 'fr'].forEach((locale) => {
      describe(`when passing locale ${locale}`, () => {
        it(`instantiate moment with the ${locale} locale`, () => {
          options.init({ date: { locale } });
          dateHelper.setup(options);
          expect(dateHelper.momentInstance.locale()).toEqual(locale);
        });
      });

      describe('when passing no locale value', () => {
        it('instantiate moment with default EN locale', () => {
          expect(dateHelper.momentInstance.locale()).toEqual('en');
        });
      });
    });
  });

  describe('moment()', () => {
    describe('is locale aware', () => {
      it('returns monday as first week day on FR locale', () => {
        options.init({ date: { locale: 'fr' } });
        dateHelper.setup(options);
        expect(dateHelper.date().startOf('week').format('dddd')).toEqual(
          'lundi',
        );
      });

      it('returns sunday as first week day on EN locale', () => {
        options.init({ date: { locale: 'en' } });
        dateHelper.setup(options);
        expect(dateHelper.date().startOf('week').format('dddd')).toEqual(
          'Sunday',
        );
      });
    });
  });

  describe('getMonthWeekNumber()', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [locale, value] of Object.entries(weekData)) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      value.forEach((key, index) => {
        key.forEach((monthDate) => {
          it(`assigns ${monthDate} to the week ${index + 1}`, () => {
            options.init({ date: { locale } });
            dateHelper.setup(options);
            expect(dateHelper.getMonthWeekNumber(monthDate)).toEqual(index + 1);
          });
        });
      });
    }
  });

  describe('format()', () => {
    it('returns the value returned by the given function', () => {
      expect(
        dateHelper.format(
          +date,
          (d: number, v: number) => `${new Date(d)}-${v}`,
          'hello',
        ),
      ).toEqual(`${date}-hello`);
    });

    it('returns the value given by the moment format', () => {
      expect(dateHelper.format(+date, 'YYYY', 'hello')).toEqual('2020');
    });
  });

  describe('intervals', () => {
    const expectations: any = dates;

    const testRun = (interval: string, locale: string) => {
      const toDates = (a: number[]) => a.map((k: number) => new Date(k));

      describe(`With moment [${locale}] locale`, () => {
        beforeEach(() => {
          options.init({ date: { locale } });
          dateHelper.setup(options);
        });

        let intervalKey = interval;
        if (locale !== DEFAULT_LOCALE) {
          intervalKey = `${interval}_${locale}`;
        }

        describe(`on ${interval} interval`, () => {
          describe('when date args is a Date object', () => {
            it(`returns [date start of ${interval}]`, () => {
              const intervals = dateHelper.intervals(interval, date, 1);
              expect(new Date(intervals[0])).toEqual(
                expectations[intervalKey][0],
              );
            });
          });

          describe('when date args is a number', () => {
            it(`returns [date first ${interval}]`, () => {
              const intervals = dateHelper.intervals(interval, +date, 1);
              expect(new Date(intervals[0])).toEqual(
                expectations[intervalKey][0],
              );
            });
          });

          describe('when range args is a 1', () => {
            it('returns [start of current interval]', () => {
              const intervals = dateHelper.intervals(interval, date, 1);
              expect(toDates(intervals)).toEqual([
                expectations[intervalKey][0],
              ]);
            });
          });

          describe('when range args is -1', () => {
            it('returns [start of previous interval]', () => {
              const intervals = dateHelper.intervals(
                interval,
                expectations[intervalKey][1],
                -1,
              );
              expect(toDates(intervals)).toEqual([
                expectations[intervalKey][0],
              ]);
            });
          });

          describe('when range args is a positive number > 1', () => {
            it(`returns [${interval}](x range)`, () => {
              //
              const intervals = dateHelper.intervals(interval, date, 4);
              expect(toDates(intervals)).toEqual(expectations[intervalKey]);
              expect(intervals.length).toEqual(4);
            });
          });

          describe('when range args is a negative number < -1', () => {
            it(`returns [${interval}](x range)`, () => {
              //
              const intervals = dateHelper.intervals(
                interval,
                expectations[intervalKey][3],
                -3,
              );
              expect(toDates(intervals)).toEqual(
                expectations[intervalKey].slice(0, 3),
              );
              expect(intervals.length).toEqual(3);
            });
          });

          describe(
            'when range args is a future date, ' +
              //
              '1 interval in the future',
            () => {
              it(`returns [${interval}]`, () => {
                const intervals = dateHelper.intervals(
                  interval,
                  date,
                  expectations[intervalKey][0],
                );
                expect(toDates(intervals)).toEqual([
                  expectations[intervalKey][0],
                ]);
              });
            },
          );

          describe(
            'when range args is a future date, ' +
              //
              '4 intervals in the future',
            () => {
              it(`returns [${interval}](3)`, () => {
                const intervals = dateHelper.intervals(
                  interval,
                  date,
                  expectations[intervalKey][3],
                );

                expect(toDates(intervals)).toEqual(expectations[intervalKey]);
              });
            },
          );
        });
      });
    };

    Object.keys(expectations).forEach((key) => {
      const [interval, locale] = key.split('_');

      testRun(interval, locale || DEFAULT_LOCALE);
    });
  });
});
