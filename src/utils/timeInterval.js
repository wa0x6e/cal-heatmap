import Moment from 'moment-timezone';
import MomentRange from 'moment-range';

// @TODO Handle week start day
// see: https://github.com/rotaready/moment-range/pull/183
function generate(interval, date, range) {
  const moment = MomentRange.extendMoment(Moment);
  const tz = moment.tz.defaultZone;
  let dateRange;

  let start = moment.tz(date, tz);
  start = start.startOf(interval);

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
export default function generateTimeInterval(domain, date, range) {
  return generate(domain, date, range);
}
