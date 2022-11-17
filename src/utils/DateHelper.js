import Moment from 'moment-timezone';
import MomentRange from 'moment-range';

const moment = MomentRange.extendMoment(Moment);
const tz = moment.tz.defaultZone;

export default class DateHelper {
  /**
   * Return the week number, relative to its month
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Week number, relative to the month [0-5]
   */
  static getMonthWeekNumber(d) {
    const monthFirstWeekNumber = this.moment(
      this.moment(d).startOf('month'),
    ).isoWeek();

    return this.moment(d).isoWeek() - monthFirstWeekNumber;
  }

  static moment(d = new Date()) {
    return moment.tz(d, tz);
  }
}
