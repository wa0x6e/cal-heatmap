import Moment from 'moment-timezone';
import MomentRange from 'moment-range';

export default class DateHelper {
  constructor(locale, timezone) {
    this.momentInstance = MomentRange.extendMoment(Moment);

    this.locale = locale || 'en';
    this.timezone = timezone || this.momentInstance.tz.guess();

    this.momentInstance.locale(this.locale);
  }

  /**
   * Return the week number, relative to its month
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Week number, relative to the month [0-5]
   */
  getMonthWeekNumber(d) {
    const monthFirstWeekNumber = this.date(d).startOf('month').isoWeek();

    return this.date(d).isoWeek() - monthFirstWeekNumber;
  }

  date(d = new Date()) {
    return this.momentInstance.tz(d, this.timezone);
  }

  format(d, formatter) {
    if (typeof formatter === 'function') {
      return formatter(new Date(d));
    }

    return this.date(d).format(formatter);
  }

  getTimeInterval(interval, date, asMoment = false) {
    const newDate = this.date(date).startOf(interval);

    if (asMoment) {
      return newDate;
    }

    return newDate.valueOf();
  }

  /**
   * Return an array of time interval
   *
   * @param  int|Date date A random date included in the wanted domain
   * @param  int|Date range Number of dates to get, or a stop date
   * @return Array of dates
   */
  generateTimeInterval(interval, date, range) {
    return this.#generateInterval(interval, date, range);
  }

  /**
   * Returns wether or not dateA is less than or equal to dateB. This function is subdomain aware.
   * Performs automatic conversion of values.
   * @param dateA may be a number or a Date
   * @param dateB may be a number or a Date
   * @returns {boolean}
   */
  dateFromPreviousInterval(interval, dateA, dateB) {
    return this.date(dateA).isBefore(this.date(dateB), interval);
  }

  /**
   * Return whether 2 dates belongs to the same domain
   *
   * @param  Date dateA First date to compare
   * @param  Date dateB Secon date to compare
   * @return bool true if the 2 dates belongs to the same domain
   */
  datesFromSameInterval(interval, dateA, dateB) {
    return this.date(dateA).isSame(this.date(dateB), interval);
  }

  // @TODO Handle week start day
  // see: https://github.com/rotaready/moment-range/pull/183
  #generateInterval(interval, date, range) {
    let dateRange;

    const start = this.getTimeInterval(interval, date, true);

    if (typeof range === 'number') {
      dateRange = this.momentInstance.rangeFromInterval(
        interval,
        range - 1,
        start,
      );
    } else {
      dateRange = this.momentInstance.range(
        start,
        this.date(range).endOf(interval),
      );
    }

    return Array.from(dateRange.by(interval)).map((d) => d.valueOf());
  }
}
