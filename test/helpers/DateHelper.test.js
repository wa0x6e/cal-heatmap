import DateHelper from '../../src/helpers/DateHelper';
import TimeIntervalTest from './TimeIntervalTest';

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
});

TimeIntervalTest();
