import DateHelper from '../../src/helpers/DateHelper';

const date = new Date('2020-01-02T04:24:25.256+04:00');
const DEFAULT_LOCALE = 'en';

export default function TimeIntervalTest() {
  const expectations = {
    minute: [
      new Date('2020-01-02T04:24:00.000+04:00'),
      new Date('2020-01-02T04:25:00.000+04:00'),
      new Date('2020-01-02T04:26:00.000+04:00'),
    ],
    hour: [
      new Date('2020-01-02T04:00:00.000+04:00'),
      new Date('2020-01-02T05:00:00.000+04:00'),
      new Date('2020-01-02T06:00:00.000+04:00'),
    ],
    day: [
      new Date('2020-01-02T00:00:00.000+04:00'),
      new Date('2020-01-03T00:00:00.000+04:00'),
      new Date('2020-01-04T00:00:00.000+04:00'),
    ],
    week_fr: [
      new Date('2019-12-30T00:00:00.000+04:00'),
      new Date('2020-01-06T00:00:00.000+04:00'),
      new Date('2020-01-13T00:00:00.000+04:00'),
    ],
    week: [
      new Date('2019-12-29T00:00:00.000+04:00'),
      new Date('2020-01-05T00:00:00.000+04:00'),
      new Date('2020-01-12T00:00:00.000+04:00'),
    ],
    month: [
      new Date('2020-01-01T00:00:00.000+04:00'),
      new Date('2020-02-01T00:00:00.000+04:00'),
      new Date('2020-03-01T00:00:00.000+04:00'),
    ],
    year: [
      new Date('2020-01-01T00:00:00.000+04:00'),
      new Date('2021-01-01T00:00:00.000+04:00'),
      new Date('2022-01-01T00:00:00.000+04:00'),
    ],
  };

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
          describe('when date args is a Date', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(interval, date, 1);
              expect(intervals).toEqual([+expectations[intervalKey][0]]);
            });
          });

          describe('when date args is a number', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(interval, +date, 1);
              expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
            });
          });

          describe('when range args is a number (1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(interval, date, 1);
              expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
            });
          });

          describe('when range args is a number (>1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(interval, date, 3);
              expect(intervals).toEqual(toUnix(expectations[intervalKey]));
            });
          });

          describe('when range args is a date (domain +1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(
                interval,
                date,
                expectations[intervalKey][0],
              );
              expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
            });
          });

          describe('when range args is a date (domain >1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = helper.generateTimeInterval(
                interval,
                date,
                expectations[intervalKey][2],
              );

              expect(intervals).toEqual(toUnix(expectations[intervalKey]));
            });
          });
        });
      });

      describe('#getTimeInterval', () => {
        describe(`on ${interval} interval`, () => {
          it(`returns an the timestamp of the start of ${interval} intervals`, () => {
            const result = helper.getTimeInterval(interval, date);
            expect(result).toEqual(+expectations[intervalKey][0]);
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
