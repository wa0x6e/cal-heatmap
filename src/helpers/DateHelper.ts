import { isString, isFunction } from 'lodash-es';
import Moment from 'moment-timezone';
import MomentRange from 'moment-range';

export default class DateHelper {
  locale: string;

  timezone: string;

  momentInstance: any;

  constructor(locale?: string, timezone?: string) {
    // @ts-ignore
    this.momentInstance = MomentRange.extendMoment(Moment);

    this.locale = locale || 'en';
    this.timezone = timezone || this.momentInstance.tz.guess();

    this.momentInstance.locale(this.locale);
  }

  /**
   * Return the week number, relative to its month
   *
   * @param  {number|Date} d Date or timestamp in milliseconds
   * @returns {number} Thw week number, relative to the month [0-5]
   */
  getMonthWeekNumber(d: number | Date): number {
    const date = this.date(d).startOf('day');
    const endOfWeek = this.date(d).startOf('month').endOf('week');

    if (date <= endOfWeek) {
      return 1;
    }
    return Math.ceil(date.diff(endOfWeek, 'weeks', true)) + 1;
  }

  date(d: number | Date = new Date()) {
    return this.momentInstance.tz(d, this.timezone);
  }

  format(
    timestamp: number,
    formatter: null | string | Function,
    ...args: any
  ): string | null {
    if (isFunction(formatter)) {
      return formatter(timestamp, ...args);
    }

    if (isString(formatter)) {
      return this.date(timestamp).format(formatter);
    }

    return null;
  }

  /**
   * Return an array of time interval
   *
   * @param  {number|Date} date A random date included in the wanted interval
   * @param  {number|Date} range Length of the wanted interval, or a stop date
   * @returns {Array<number>} Array of unix timestamp, in milliseconds
   */
  intervals(
    interval: string,
    date: number | Date,
    range: number | Date,
  ): number[] {
    return this.#generateInterval(interval, date, range);
  }

  /**
   * Returns whether dateA is less than or equal to dateB.
   * This function is subdomain aware.
   * Performs automatic conversion of values.
   * @param dateA may be a number or a Date
   * @param dateB may be a number or a Date
   * @returns {boolean}
   */
  dateFromPreviousInterval(
    interval: string,
    dateA: number | Date,
    dateB: number | Date,
  ): boolean {
    return this.date(dateA).isBefore(this.date(dateB), interval);
  }

  /**
   * Return whether 2 dates belongs to the same time interval
   *
   * @param  Date dateA First date to compare
   * @param  Date dateB Second date to compare
   * @returns {boolean} true if the 2 dates belongs to the same time interval
   */
  datesFromSameInterval(
    interval: string,
    dateA: number | Date,
    dateB: number | Date,
  ): boolean {
    return this.date(dateA).isSame(this.date(dateB), interval);
  }

  #generateInterval(
    interval: string,
    date: number | Date,
    range: number | Date,
  ): number[] {
    let dateRange;

    const start = this.date(date);

    if (typeof range === 'number') {
      dateRange = this.momentInstance.rangeFromInterval(
        interval,
        range >= 0 ? range - 1 : range,
        start,
      );
    } else {
      dateRange = this.momentInstance.range(start, this.date(range));
    }

    dateRange = dateRange.snapTo(interval);

    return Array.from(
      dateRange.by(interval, {
        excludeEnd: typeof range === 'number' && range < 0,
      }),
    ).map((d: any) => d.valueOf());
  }
}
