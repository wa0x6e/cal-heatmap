import {
  timeMonday,
  timeSunday,
  timeYears,
  timeHour,
  timeDay,
  timeMonths,
  timeMinute,
} from 'd3-time';

export function generateWeekDomain(d, range, weekStartOnMonday) {
  let interval = timeSunday;
  if (weekStartOnMonday) {
    interval = timeMonday;
  }

  let stop = range;
  if (!(range instanceof Date)) {
    stop = interval.offset(d, range);
  }

  return interval.range(interval.floor(d), interval.ceil(stop));
}

/**
 * Return all the minutes between 2 dates
 *
 * @param  Date  d  date  A date
 * @param  int|date  range  Number of minutes in the range, or a stop date
 * @return array  An array of minutes
 */
export function generateMinuteDomain(d, range) {
  let stop = range;
  if (!(range instanceof Date)) {
    stop = timeMinute.offset(d, range);
  }

  return timeMinute.range(timeMinute.floor(d), timeMinute.ceil(stop));
}

/**
 * Return all the hours between 2 dates
 *
 * @param  Date  d  A date
 * @param  int|date  range  Number of hours in the range, or a stop date
 * @return array  An array of hours
 */
export function generateHourDomain(d, range, DTSDomain) {
  let stop = range;
  if (!(range instanceof Date)) {
    stop = timeHour.offset(d, range);
  }

  return timeHour.range(timeHour.floor(d), timeHour.ceil(stop));
}

/**
 * Return all the days between 2 dates
 *
 * @param  Date    d    A date
 * @param  int|date  range  Number of days in the range, or a stop date
 * @return array  An array of weeks
 */
export function generateDayDomain(d, range) {
  let stop = range;
  if (!(range instanceof Date)) {
    stop = timeDay.offset(d, range);
  }

  return timeDay.range(timeDay.floor(d), timeDay.ceil(stop));
}

/**
 * Return all the months between 2 dates
 *
 * @param  Date    d    A date
 * @param  int|date  range  Number of months in the range, or a stop date
 * @return array  An array of months
 */
export function generateMonthDomain(d, range) {
  let stop = range;
  if (!(range instanceof Date)) {
    stop = timeMonths.offset(d, range);
  }

  return timeMonths.range(timeMonths.floor(d), timeMonths.ceil(stop));
}

/**
 * Return all the years between 2 dates
 *
 * @param  Date  d  date  A date
 * @param  int|date  range  Number of minutes in the range, or a stop date
 * @return array  An array of hours
 */
export function generateYearDomain(d, range) {
  let stop = range;
  if (!(range instanceof Date)) {
    stop = timeYears.offset(d, range);
  }

  return timeYears.range(timeYears.floor(d), timeYears.ceil(stop));
}

/**
 * Get an array of domain start dates
 *
 * @param  int|Date date A random date included in the wanted domain
 * @param  int|Date range Number of dates to get, or a stop date
 * @return Array of dates
 */
export function generateDomain(domain, date, weekStartOnMonday, range = 1) {
  let start = date;
  if (typeof date === 'number') {
    start = new Date(date);
  }

  switch (domain) {
    case 'hour':
      return generateHourDomain(start, range);
    case 'day':
      return generateDayDomain(start, range);
    case 'week':
      return generateWeekDomain(start, range, weekStartOnMonday);
    case 'month':
      return generateMonthDomain(start, range);
    case 'year':
      return generateYearDomain(start, range);
    default:
      return [];
  }
}
