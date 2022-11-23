import DateHelper from '../../src/helpers/DateHelper';
import weekData from '../data/weekNumberDates';
import dates from '../data/dates';

const date = new Date('2020-01-02T04:24:25.256+04:00');
const DEFAULT_LOCALE = 'en';

describe('DateHelper', () => {
  describe('new()', () => {
    ['en', 'fr'].forEach((locale) => {
      describe(`when passing locale ${locale}`, () => {
        it(`instantiate moment with the ${locale} locale`, () => {
          const h = new DateHelper(locale);
          expect(h.momentInstance.locale()).toEqual(locale);
        });
      });

      describe('when passing no locale value', () => {
        it('instantiate moment with default EN locale', () => {
          const h = new DateHelper();
          expect(h.momentInstance.locale()).toEqual('en');
        });
      });
    });

    ['Asia/Taipei', 'America/Toronto'].forEach((zone) => {
      describe(`when passing timezone ${zone}`, () => {
        it(`instantiate moment with the ${zone} timezone`, () => {
          const h = new DateHelper('en', zone);
          expect(h.date().tz()).toEqual(zone);
        });
      });
    });
  });

  describe('moment()', () => {
    describe('is locale aware', () => {
      it('returns monday as first week day on FR locale', () => {
        const h = new DateHelper('fr');
        expect(h.date().startOf('week').format('dddd')).toEqual('lundi');
      });

      it('returns sunday as first week day on EN locale', () => {
        const h = new DateHelper('en');
        expect(h.date().startOf('week').format('dddd')).toEqual('Sunday');
      });
    });
  });

  describe('getMonthWeekNumber()', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [locale, value] of Object.entries(weekData)) {
      value.forEach((key, index) => {
        key.forEach((monthDate) => {
          it(`assigns ${monthDate} to the week ${index + 1}`, () => {
            const h = new DateHelper(locale);
            expect(h.getMonthWeekNumber(monthDate)).toEqual(index + 1);
          });
        });
      });
    }
  });
});

describe('intervals', () => {
  const expectations = dates;

  const testRun = (interval, locale) => {
    const toUnix = (a) => a.map((k) => +k);

    describe(`With moment [${locale}] locale`, () => {
      let helper = null;

      beforeEach(() => {
        helper = new DateHelper(locale);
      });

      let intervalKey = interval;
      if (locale !== DEFAULT_LOCALE) {
        intervalKey = `${interval}_${locale}`;
      }

      describe(`on ${interval} interval`, () => {
        describe('when date args is a Date object', () => {
          it(`returns [date first ${interval}]`, () => {
            const intervals = helper.intervals(interval, date, 1);
            expect(intervals[0]).toEqual(+expectations[intervalKey][0]);
          });
        });

        describe('when date args is a number', () => {
          it(`returns [date first ${interval}]`, () => {
            const intervals = helper.intervals(interval, +date, 1);
            expect(intervals[0]).toEqual(+expectations[intervalKey][0]);
          });
        });

        describe('when range args is a 1', () => {
          it('returns [start of current interval]', () => {
            const intervals = helper.intervals(interval, date, 1);
            expect(intervals).toEqual([+expectations[intervalKey][0]]);
          });
        });

        describe('when range args is -1', () => {
          it('returns [start of previous interval]', () => {
            const intervals = helper.intervals(
              interval,
              expectations[intervalKey][1],
              -1,
            );
            expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
          });
        });

        describe('when range args is a positive number > 1', () => {
          it(`returns [${interval}](x range)`, () => {
            //
            const intervals = helper.intervals(interval, date, 4);
            expect(intervals).toEqual(toUnix(expectations[intervalKey]));
            expect(intervals.length).toEqual(4);
          });
        });

        describe('when range args is a negative number < -1', () => {
          it(`returns [${interval}](x range)`, () => {
            //
            const intervals = helper.intervals(
              interval,
              expectations[intervalKey][3],
              -3,
            );
            expect(intervals).toEqual(
              toUnix(expectations[intervalKey].slice(0, 3)),
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
              const intervals = helper.intervals(
                interval,
                date,
                expectations[intervalKey][0],
              );
              expect(intervals).toEqual([+expectations[intervalKey][0]]);
            });
          },
        );

        describe(
          'when range args is a future date, ' +
            //
            '4 intervals in the future',
          () => {
            it(`returns [${interval}](3)`, () => {
              const intervals = helper.intervals(
                interval,
                date,
                expectations[intervalKey][3],
              );

              expect(intervals).toEqual(toUnix(expectations[intervalKey]));
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
