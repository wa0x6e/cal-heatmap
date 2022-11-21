import DateHelper from '../../src/helpers/DateHelper';
import TimeIntervalTest from './TimeIntervalTest';

import weekData from '../data/weekNumberDates';

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
    xit('returns a moment date in the correct timezone', () => {});

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

  describe('format()', () => {
    describe('when passing a string format', () => {
      xit('returns a formatted date', () => {});
    });

    describe('when passing a function', () => {
      xit('returns the result of the function', () => {});
      xit('passes the date args to the function', () => {});
    });
  });

  describe('getMonthWeekNumber()', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [locale, value] of Object.entries(weekData)) {
      value.forEach((dates, index) => {
        dates.forEach((date) => {
          it(`assigns ${date} to the week ${index + 1}`, () => {
            const h = new DateHelper(locale);
            expect(h.getMonthWeekNumber(date)).toEqual(index + 1);
          });
        });
      });
    }
  });
});

TimeIntervalTest();
