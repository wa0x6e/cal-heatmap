import Moment from 'moment-timezone';
import MomentRange from 'moment-range';

const moment = MomentRange.extendMoment(Moment);
const tz = moment.tz.defaultZone;

export default class DateHelper {
  /**
   * Return the day of the year for the date
   * @param  Date
   * @return  int Day of the year [1,366]
   */
  static getDayOfYear(d) {
    return moment.tz(d, tz).dayOfYear();
  }

  /**
   * Return the week number of the year
   * Monday as the first day of the week
   * @return int  Week number [0-53]
   */
  static getWeekNumber(d) {
    return moment.tz(d, tz).isoWeek();
  }

  /**
   * Return the week number, relative to its month
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Week number, relative to the month [0-5]
   */
  static getMonthWeekNumber(d) {
    const monthFirstWeekNumber = this.getWeekNumber(
      moment.tz(d.tz).startOf('month'),
    );

    return this.getWeekNumber(d) - monthFirstWeekNumber - 1;
  }

  /**
   * Return the number of days in the specified date's month
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Number of days in the date's month
   */
  static getDayCountInMonth(d) {
    return moment.tz(d, tz).daysInMonth();
  }

  /**
   * Return the number of days in the date's year
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Number of days in the date's year
   */
  static getDayCountInYear(d) {
    return moment.tz(d, tz).endOf('year').dayOfYear();
  }

  /**
   * Get the weekday from a date
   *
   * Return the week day number (0-6) of a date,
   * depending on whether the week start on monday or sunday
   *
   * @param  Date d
   * @return int The week day number (0-6)
   */
  static getWeekDay(d) {
    return moment.tz(d, tz).isoWeekday();
  }
}
