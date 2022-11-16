import timeInterval from '../../src/utils/timeInterval';

describe('timeInterval()', () => {
  const date = new Date('2020-01-02T04:24:25.256Z');

  const expectations = {
    min: [
      new Date('2020-01-02T04:24:00.000Z'),
      new Date('2020-01-02T04:25:00.000Z'),
      new Date('2020-01-02T04:26:00.000Z'),
    ],
    // day: [
    //   new Date('2020-01-02T04:00:00.000Z'),
    //   new Date('2020-01-02T05:00:00.000Z'),
    //   new Date('2020-01-02T06:00:00.000Z'),
    // ],
    // hour: [
    //   new Date('2020-01-02T00:00:00.000Z'),
    //   new Date('2020-01-03T00:00:00.000Z'),
    //   new Date('2020-01-04T00:00:00.000Z'),
    // ],
    // week_monday: [
    //   new Date('2019-12-30T00:00:00.000Z'),
    //   new Date('2020-01-06T00:00:00.000Z'),
    //   new Date('2020-01-13T00:00:00.000Z'),
    // ],
    // week: [
    //   new Date('2019-12-29T00:00:00.000Z'),
    //   new Date('2020-01-05T00:00:00.000Z'),
    //   new Date('2020-01-12T00:00:00.000Z'),
    // ],
    // month: [
    //   new Date('2020-01-01T00:00:00.000Z'),
    //   new Date('2020-02-01T00:00:00.000Z'),
    //   new Date('2020-03-01T00:00:00.000Z'),
    // ],
    // year: [
    //   new Date('2020-01-01T00:00:00.000Z'),
    //   new Date('2021-01-01T00:00:00.000Z'),
    //   new Date('2022-01-01T00:00:00.000Z'),
    // ],
  };

  const testRun = (interval, weekStartOnMonday) => {
    describe(`on ${interval} interval`, () => {
      describe('when date args is a Date', () => {
        it(`returns an array of ${interval} intervals`, () => {
          const intervals = timeInterval(interval, date, 1, weekStartOnMonday);
          expect(intervals).toEqual([expectations[interval][0]]);
        });
      });

      describe('when date args is a number', () => {
        it(`returns an array of ${interval} intervals`, () => {
          const intervals = timeInterval(interval, +date, 1, weekStartOnMonday);
          expect(intervals).toEqual([expectations[interval][0]]);
        });
      });

      describe('when range args is a number', () => {
        it(`xxx returns an array of ${interval} intervals`, () => {
          const intervals = timeInterval(interval, date, 3, weekStartOnMonday);
          expect(intervals).toEqual(expectations[interval]);
        });
      });

      describe('when range args is a date', () => {
        it(`xxx returns an array of ${interval} intervals`, () => {
          const intervals = timeInterval(
            interval,
            date,
            expectations[interval][2],
            weekStartOnMonday,
          );
          expect(intervals).toEqual(expectations[interval]);
        });
      });
    });
  };

  Object.keys(expectations).forEach((key) => {
    const [interval, weekStart] = key.split('_');

    testRun(interval, weekStart === 'monday');
  });

  it('throws an error on invalid time interval', () => {
    expect(() => {
      timeInterval('test', 1, 1);
    }).toThrow();
  });
});
