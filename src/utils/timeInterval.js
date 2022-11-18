import Moment from 'moment-timezone';
import MomentRange from 'moment-range';

const moment = MomentRange.extendMoment(Moment);
const tz = moment.tz.defaultZone;

export function getTimeInterval(interval, date, asMoment = false) {
  const newDate = moment.tz(date, tz).startOf(interval);

  if (asMoment) {
    return newDate;
  }

  return newDate.valueOf();
}

// @TODO Handle week start day
// see: https://github.com/rotaready/moment-range/pull/183
function generate(interval, date, range) {
  let dateRange;

  const start = getTimeInterval(interval, date);

  if (typeof range === 'number') {
    dateRange = moment.rangeFromInterval(interval, range - 1, start);
  } else {
    dateRange = moment.range(start, moment.tz(range, tz).endOf(interval));
  }

  return Array.from(dateRange.by(interval)).map((d) => {
    return moment.tz(d, tz).valueOf();
  });
}

/**
 * Return an array of time interval
 *
 * @param  int|Date date A random date included in the wanted domain
 * @param  int|Date range Number of dates to get, or a stop date
 * @return Array of dates
 */
export function generateTimeInterval(interval, date, range) {
  return generate(interval, date, range);
}
