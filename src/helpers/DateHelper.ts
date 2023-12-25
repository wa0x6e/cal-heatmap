import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekday from 'dayjs/plugin/weekday';
import minMax from 'dayjs/plugin/minMax';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';

import type { ManipulateType, PluginFunc, Ls } from 'dayjs';
import type { OptionsType } from '../options/Options';
import type { Timestamp, DomainType } from '../index';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isoWeek);
dayjs.extend(isLeapYear);
dayjs.extend(dayOfYear);
dayjs.extend(weekday);
dayjs.extend(minMax);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);

const DEFAULT_LOCALE = 'en';

export default class DateHelper {
  locale: OptionsType['date']['locale'];

  timezone: string;

  constructor() {
    this.locale = DEFAULT_LOCALE;
    this.timezone = dayjs.tz.guess();
    if (typeof window === 'object') {
      (window as any).dayjs ||= dayjs;
    }
  }

  async setup({ options }: { options: OptionsType }) {
    this.timezone = options.date.timezone || dayjs.tz.guess();
    const userLocale = options.date.locale;

    if (typeof userLocale === 'string' && userLocale !== DEFAULT_LOCALE) {
      let locale;
      if (typeof window === 'object') {
        locale =
          (window as any)[`dayjs_locale_${userLocale}`] ||
          (await this.loadBrowserLocale(userLocale));
      } else {
        locale = await this.loadNodeLocale(userLocale);
      }
      dayjs.locale(userLocale);
      this.locale = locale;
    }

    if (typeof userLocale === 'object') {
      if (userLocale.hasOwnProperty('name')) {
        dayjs.locale(userLocale.name, userLocale);
        this.locale = userLocale;
      } else {
        this.locale = dayjs.updateLocale(DEFAULT_LOCALE, userLocale);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  extend(dayjsPlugin: PluginFunc): dayjs.Dayjs {
    return dayjs.extend(dayjsPlugin);
  }

  /**
   * Return the week number, relative to its month
   *
   * @param  {number|Date} d Date or timestamp in milliseconds
   * @returns {number} The week number, relative to the month [0-5]
   */
  getMonthWeekNumber(d: Timestamp | dayjs.Dayjs): number {
    const dayjsDate = this.date(d);
    const date = dayjsDate.startOf('day');
    const endOfWeek = dayjsDate.startOf('month').endOf('week');

    if (date <= endOfWeek) {
      return 1;
    }
    return Math.ceil(date.diff(endOfWeek, 'weeks', true)) + 1;
  }

  /**
   * Return the number of weeks in the given month
   *
   * As there is no fixed standard to specify which month a partial week should
   * belongs to, the ISO week date standard is used, where:
   * - the first week of the month should have at least 4 days
   *
   *  @see https://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param  {Timestamp | dayjs.Dayjs} d Datejs object or timestamp
   * @return {number}         The number of weeks
   */
  getWeeksCountInMonth(d: Timestamp | dayjs.Dayjs): number {
    const pivotDate = this.date(d);

    return (
      this.getLastWeekOfMonth(pivotDate).diff(
        this.getFirstWeekOfMonth(pivotDate),
        'week',
      ) + 1
    );
  }

  /**
   * Return the start of the first week of the month
   *
   * @see getWeeksCountInMonth() about standard warning
   * @return {dayjs.Dayjs} A dayjs object representing the start of the
   * first week
   */
  getFirstWeekOfMonth(d: Timestamp | dayjs.Dayjs): dayjs.Dayjs {
    const startOfMonth = this.date(d).startOf('month');
    let startOfFirstWeek = startOfMonth.startOf('week');
    if (startOfMonth.weekday() > 4) {
      startOfFirstWeek = startOfFirstWeek.add(1, 'week');
    }

    return startOfFirstWeek;
  }

  /**
   * Return the end of the last week of the month
   *
   * @see getWeeksCountInMonth() about standard warning
   * @return {dayjs.Dayjs} A dayjs object representing the end of the last week
   */
  getLastWeekOfMonth(d: Timestamp | dayjs.Dayjs): dayjs.Dayjs {
    const endOfMonth = this.date(d).endOf('month');
    let endOfLastWeek = endOfMonth.endOf('week');
    if (endOfMonth.weekday() < 4) {
      endOfLastWeek = endOfLastWeek.subtract(1, 'week');
    }

    return endOfLastWeek;
  }

  date(d: Timestamp | Date | dayjs.Dayjs | string = new Date()): dayjs.Dayjs {
    if (dayjs.isDayjs(d)) {
      return d;
    }

    return dayjs(d)
      .tz(this.timezone)
      .utcOffset(0)
      .locale(this.locale as (typeof Ls)[0] | string);
  }

  format(
    timestamp: Timestamp,
    formatter: null | string | Function,
    ...args: any
  ): string | null {
    if (typeof formatter === 'function') {
      return formatter(timestamp, ...args);
    }

    if (typeof formatter === 'string') {
      return this.date(timestamp).format(formatter);
    }

    return null;
  }

  /**
   * Return an array of time interval
   *
   * @param  {number|Date} date A random date included in the wanted interval
   * @param  {number|Date} range Length of the wanted interval, or a stop date.
   * @param  {boolean} range Whether the end date should be excluded
   *                         from the result
   * @returns {Array<number>} Array of unix timestamp, in milliseconds
   */
  intervals(
    interval: DomainType,
    date: Timestamp | Date | dayjs.Dayjs,
    range: number | Date | dayjs.Dayjs,
    excludeEnd: boolean = true,
  ): Timestamp[] {
    let start = this.date(date);
    let end: dayjs.Dayjs;
    if (typeof range === 'number') {
      end = start.add(range, interval as ManipulateType);
    } else if (dayjs.isDayjs(range)) {
      end = range;
    } else {
      end = this.date(range);
    }

    start = start.startOf(interval as ManipulateType);

    end = end.startOf(interval as ManipulateType);
    let pivot = dayjs.min(start, end)!;
    end = dayjs.max(start, end)!;
    const result: Timestamp[] = [];

    if (!excludeEnd) {
      end = end.add(1, 'second');
    }

    do {
      result.push(+pivot);
      pivot = pivot.add(1, interval as ManipulateType);
    } while (pivot < end);

    return result;
  }

  // this function will work cross-browser for loading scripts asynchronously
  // eslint-disable-next-line class-methods-use-this
  loadBrowserLocale(userLocale: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://cdn.jsdelivr.net/npm/dayjs@1/locale/${userLocale}.js`;
      s.onerror = (err) => {
        reject(err);
      };
      s.onload = () => {
        resolve((window as any)[`dayjs_locale_${userLocale}`]);
      };
      document.head.appendChild(s);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  loadNodeLocale(userLocale: string): Promise<any> {
    return import(`dayjs/locale/${userLocale}.js`);
  }
}
