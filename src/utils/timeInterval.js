import {
  timeYear,
  timeMonth,
  timeMonday,
  timeSunday,
  timeDay,
  timeHour,
  timeMinute,
} from 'd3-time';

function generate(interval, date, range) {
  let start = date;
  if (typeof date === 'number') {
    start = new Date(date);
  }

  let stop = range;
  if (!(range instanceof Date)) {
    stop = interval.offset(start, range);
  }

  return interval.range(
    interval.floor(Math.min(start, stop)),
    interval.ceil(Math.max(start, stop)),
  );
}

/**
 * Return an array of time interval
 *
 * @param  int|Date date A random date included in the wanted domain
 * @param  int|Date range Number of dates to get, or a stop date
 * @return Array of dates
 */
export default function generateTimeInterval(
  domain,
  date,
  range,
  weekStartOnMonday,
) {
  switch (domain) {
    case 'min':
      return generate(timeMinute, date, range);
    case 'hour':
      return generate(timeHour, date, range);
    case 'day':
      return generate(timeDay, date, range);
    case 'week':
      return generate(weekStartOnMonday ? timeMonday : timeSunday, date, range);
    case 'month':
      return generate(timeMonth, date, range);
    case 'year':
      return generate(timeYear, date, range);
    default:
      throw new Error('Invalid domain');
  }
}
