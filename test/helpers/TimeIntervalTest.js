import DateHelper from '../../src/helpers/DateHelper';
import dates from '../data/dates';

const date = new Date('2020-01-02T04:24:25.256+04:00');
const DEFAULT_LOCALE = 'en';

export default function TimeIntervalTest() {
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

      describe('#generateTimeInterval', () => {
        describe(`on ${interval} interval`, () => {
          describe('when date args is a Date object', () => {
            it(`returns an array of ${interval}, starting with passed date start`, () => {
              const intervals = helper.generateTimeInterval(interval, date, 1);
              expect(intervals[0]).toEqual(+expectations[intervalKey][0]);
            });
          });

          describe('when date args is a number', () => {
            it(`returns an array of ${interval}, starting with passed date start`, () => {
              const intervals = helper.generateTimeInterval(interval, +date, 1);
              expect(intervals[0]).toEqual(+expectations[intervalKey][0]);
            });
          });

          describe('when range args is a 1', () => {
            it(`returns an array of 1 ${interval}, start of current interval`, () => {
              const intervals = helper.generateTimeInterval(interval, date, 1);
              expect(intervals).toEqual([+expectations[intervalKey][0]]);
            });
          });

          describe('when range args is -1', () => {
            it(`returns an array of 1 ${interval}, start of previous interval`, () => {
              const intervals = helper.generateTimeInterval(
                interval,
                expectations[intervalKey][1],
                -1,
              );
              expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
            });
          });

          describe('when range args is a positive number > 1', () => {
            it(`returns an array of ${interval} intervals, size of range`, () => {
              const intervals = helper.generateTimeInterval(interval, date, 4);
              expect(intervals).toEqual(toUnix(expectations[intervalKey]));
              expect(intervals.length).toEqual(4);
            });
          });

          describe('when range args is a negative number < -1', () => {
            it(`returns an array of ${interval} intervals, size of range`, () => {
              const intervals = helper.generateTimeInterval(
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

          describe('when range args is a future date, 1 interval in the future', () => {
            it(`returns an array of 1 ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(
                interval,
                date,
                expectations[intervalKey][0],
              );
              expect(intervals).toEqual([+expectations[intervalKey][0]]);
            });
          });

          describe('when range args is a future date, 4 intervals in the future', () => {
            it(`returns an array of 3 ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(
                interval,
                date,
                expectations[intervalKey][3],
              );

              expect(intervals).toEqual(toUnix(expectations[intervalKey]));
            });
          });
        });
      });
    });
  };

  Object.keys(expectations).forEach((key) => {
    const [interval, locale] = key.split('_');

    testRun(interval, locale || DEFAULT_LOCALE);
  });

  describe('datesFromSameInterval()', () => {
    xit('it returns true when the dates are from the same interval', () => {});
    xit('it returns false when the dates are not from the same interval', () => {});
  });

  describe('dateFromPreviousInterval()', () => {
    xit('it returns true when the date is from a previous interval', () => {});
    xit('it returns false when the dates are from the same interval', () => {});
    xit('it returns false when the dates si from the next interval', () => {});
  });
}
