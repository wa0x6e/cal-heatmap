import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekday from 'dayjs/plugin/weekday';
import minMax from 'dayjs/plugin/minMax';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import type { ManipulateType, PluginFunc } from 'dayjs';
import type { OptionsType } from '../options/Options';
import type { Timestamp } from '../index';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(dayOfYear);
dayjs.extend(weekday);
dayjs.extend(minMax);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_LOCALE = 'en';

export default class DateHelper {
  locale: any;

  timezone: string;

  constructor() {
    this.locale = DEFAULT_LOCALE;
    this.timezone = dayjs.tz.guess();
  }

  async setup({ options }: { options: OptionsType }) {
    this.locale = options.date.locale;
    this.timezone = options.date.timezone || dayjs.tz.guess();

    if (this.locale !== DEFAULT_LOCALE) {
      (window as any).dayjs ||= dayjs;
      const locale = await this.loadLocale();
      this.locale = locale;
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
    const date = this.date(d).startOf('day');
    const endOfWeek = this.date(d).startOf('month').endOf('week');

    if (date <= endOfWeek) {
      return 1;
    }
    return Math.ceil(date.diff(endOfWeek, 'weeks', true)) + 1;
  }

  date(d: Timestamp | Date | dayjs.Dayjs | string = new Date()): dayjs.Dayjs {
    return dayjs(d).tz(this.timezone).utcOffset(0).locale(this.locale);
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
   *                             Stop date is always excluded
   * @returns {Array<number>} Array of unix timestamp, in milliseconds
   */
  intervals(
    interval: string,
    date: Timestamp | Date,
    range: number | Date | dayjs.Dayjs,
  ): Timestamp[] {
    let end: dayjs.Dayjs;
    if (typeof range === 'number') {
      end = this.date(date).add(range, interval as ManipulateType);
    } else {
      end = this.date(range);
    }

    const start = this.date(date).startOf(interval as ManipulateType);

    end = end.startOf(interval as ManipulateType);
    let pivot = dayjs.min(start, end);
    end = dayjs.max(start, end);
    const result: Timestamp[] = [];

    do {
      result.push(+pivot);
      pivot = pivot.add(1, interval as ManipulateType);
    } while (pivot < end);

    return result;
  }

  // this function will work cross-browser for loading scripts asynchronously
  loadLocale(): Promise<any> {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://cdn.jsdelivr.net/npm/dayjs@1/locale/${this.locale}.js`;
      s.onerror = (err) => {
        reject(err);
      };
      s.onload = () => {
        resolve((window as any)[`dayjs_locale_${this.locale}`]);
      };
      document.head.appendChild(s);
    });
  }
}
