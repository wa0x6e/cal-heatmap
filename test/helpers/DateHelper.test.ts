// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import locale_fr from 'dayjs/locale/fr';

import DateHelper from '../../src/helpers/DateHelper';
import weekData from '../fixtures/weekNumberDates';
import dates from '../fixtures/dates';
import Options from '../../src/options/Options';
import type { DomainType } from '../../src/types';

const date = new Date('2020-01-02T04:24:25.256+00:00');
const DEFAULT_LOCALE = 'en';

describe('DateHelper', () => {
  let options: Options;
  let dateHelper: DateHelper;

  const loadBrowserLocaleMock = jest
    .spyOn(DateHelper.prototype, 'loadBrowserLocale')
    .mockImplementation(() => Promise.resolve(locale_fr));

  beforeEach(async () => {
    options = new Options();
    dateHelper = new DateHelper();
    await dateHelper.setup(options);
  });

  describe('setup()', () => {
    describe('when using the default locale', () => {
      it('instantiate dayjs with the default locale', async () => {
        options.init({ date: { locale: 'en' } });
        await dateHelper.setup(options);
        expect(dateHelper.date().locale()).toEqual('en');
        expect(loadBrowserLocaleMock).not.toHaveBeenCalled();
        expect(dateHelper.locale).toBe('en');
      });
    });

    describe('when using no locale value', () => {
      it('instantiate dayjs with default EN locale', () => {
        expect(loadBrowserLocaleMock).not.toHaveBeenCalled();
        expect(dateHelper.date().locale()).toEqual('en');
        expect(dateHelper.locale).toBe('en');
      });
    });

    describe('when using locale FR', () => {
      describe('on browser env', () => {
        it('instantiate dayjs with the FR locale', async () => {
          options.init({ date: { locale: 'fr' } });
          await dateHelper.setup(options);
          expect(loadBrowserLocaleMock).toHaveBeenCalledTimes(1);
          expect(dateHelper.date().locale()).toEqual('fr');
          expect(dateHelper.locale).toHaveProperty('name');
        });
      });
    });
  });

  describe('dayjs()', () => {
    describe('is locale aware', () => {
      it('returns monday as first week day on FR locale', async () => {
        options.init({ date: { locale: 'fr', timezone: 'utc' } });
        await dateHelper.setup(options);
        expect(dateHelper.date().startOf('week').format('dddd')).toEqual(
          'lundi',
        );
      });

      it('returns sunday as first week day on EN locale', async () => {
        options.init({ date: { locale: 'en', timezone: 'utc' } });
        await dateHelper.setup(options);
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
          it(`assigns ${monthDate} to the week ${index + 1}`, async () => {
            options.init({ date: { locale, timezone: 'utc' } });
            await dateHelper.setup(options);
            expect(dateHelper.getMonthWeekNumber(+monthDate)).toEqual(
              index + 1,
            );
          });
        });
      });
    }
  });

  describe('getWeeksCountInMonth()', () => {
    const weeksCount = [
      [new Date('2020-01-15'), 5],
      [new Date('2020-02-15'), 4],
      [new Date('2020-03-15'), 4],
      [new Date('2020-04-15'), 5],
      [new Date('2020-05-15'), 4],
      [new Date('2020-06-15'), 4],
      [new Date('2020-07-15'), 5],
      [new Date('2020-08-15'), 4],
      [new Date('2020-09-15'), 4],
    ];

    it('returns the number of weeks', async () => {
      options.init({ domain: { type: 'month' } });
      await dateHelper.setup(options);

      return weeksCount.forEach((data) => {
        expect(dateHelper.getWeeksCountInMonth(+data[0])).toBe(data[1]);
      });
    });
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

    it('returns the value given by the dayjs format', () => {
      expect(dateHelper.format(+date, 'YYYY', 'hello')).toEqual('2020');
    });
  });

  describe('intervals', () => {
    const expectations: any = dates;

    const testRun = (interval: DomainType, locale: string) => {
      const toDates = (a: number[]) => a.map((k: number) => new Date(k));

      describe(`With dayjs [${locale}] locale`, () => {
        beforeEach(async () => {
          options.init({ date: { locale, timezone: 'utc' } });
          await dateHelper.setup(options);
        });

        let intervalKey = interval as string;
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
              '3 intervals in the future',
            () => {
              it(`returns [${interval}](3)`, () => {
                const intervals = dateHelper.intervals(
                  interval,
                  date,
                  expectations[intervalKey][3],
                );

                expect(toDates(intervals)).toEqual(
                  expectations[intervalKey].slice(0, 3),
                );
              });
            },
          );
        });
      });
    };

    Object.keys(expectations).forEach((key) => {
      const [interval, locale] = key.split('_');

      testRun(interval as DomainType, locale || DEFAULT_LOCALE);
    });
  });
});
