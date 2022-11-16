import { timeFormat } from 'd3-time-format';

/**
 * Return the day of the year for the date
 * @param  Date
 * @return  int Day of the year [1,366]
 */
export function getDayOfYear() {
  return timeFormat('%j');
}

/**
 * Return the week number of the year
 * Monday as the first day of the week
 * @return int  Week number [0-53]
 */
export function getWeekNumber(d) {
  const f = timeFormat('%U');
  return f(d);
}

/**
 * Return the week number, relative to its month
 *
 * @param  int|Date d Date or timestamp in milliseconds
 * @return int Week number, relative to the month [0-5]
 */
export function getMonthWeekNumber(d) {
  if (typeof d === 'number') {
    d = new Date(d);
  }

  const monthFirstWeekNumber = getWeekNumber(
    new Date(d.getFullYear(), d.getMonth()),
  );
  return getWeekNumber(d) - monthFirstWeekNumber - 1;
}

/**
 * Return the number of days in the date's month
 *
 * @param  int|Date d Date or timestamp in milliseconds
 * @return int Number of days in the date's month
 */
export function getDayCountInMonth(d) {
  return getEndOfMonth(d).getDate();
}

/**
 * Return the number of days in the date's year
 *
 * @param  int|Date d Date or timestamp in milliseconds
 * @return int Number of days in the date's year
 */
export function getDayCountInYear(d) {
  if (typeof d === 'number') {
    d = new Date(d);
  }
  return new Date(d.getFullYear(), 1, 29).getMonth() === 1 ? 366 : 365;
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
export function getWeekDay(d) {
  return d.getDay() === 0 ? 6 : d.getDay() - 1;
}

/**
 * Get the last day of the month
 * @param  Date|int  d  Date or timestamp in milliseconds
 * @return Date      Last day of the month
 */
function getEndOfMonth(d) {
  if (typeof d === 'number') {
    d = new Date(d);
  }
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Returns wether or not dateA is less than or equal to dateB. This function is subdomain aware.
 * Performs automatic conversion of values.
 * @param dateA may be a number or a Date
 * @param dateB may be a number or a Date
 * @returns {boolean}
 */
export function dateIsLessThan(dateA, dateB, options) {
  if (!(dateA instanceof Date)) {
    dateA = new Date(dateA);
  }

  if (!(dateB instanceof Date)) {
    dateB = new Date(dateB);
  }

  function normalizedMillis(date, subdomain) {
    switch (subdomain) {
      case 'x_min':
      case 'min':
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
        ).getTime();
      case 'x_hour':
      case 'hour':
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
        ).getTime();
      case 'x_day':
      case 'day':
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        ).getTime();
      case 'x_week':
      case 'week':
      case 'x_month':
      case 'month':
        return new Date(date.getFullYear(), date.getMonth()).getTime();
      default:
        return date.getTime();
    }
  }

  return (
    normalizedMillis(dateA, options.subDomain) <
    normalizedMillis(dateB, options.subDomain)
  );
}

/**
 * Return whether 2 dates are equals
 * This function is subdomain-aware,
 * and dates comparison are dependent of the subdomain
 *
 * @param  Date dateA First date to compare
 * @param  Date dateB Secon date to compare
 * @return bool true if the 2 dates are equals
 */
export function dateIsEqual(dateA, dateB, subDomain) {
  if (!(dateA instanceof Date)) {
    dateA = new Date(dateA);
  }

  if (!(dateB instanceof Date)) {
    dateB = new Date(dateB);
  }

  switch (subDomain) {
    case 'x_min':
    case 'min':
      return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate() &&
        dateA.getHours() === dateB.getHours() &&
        dateA.getMinutes() === dateB.getMinutes()
      );
    case 'x_hour':
    case 'hour':
      return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate() &&
        dateA.getHours() === dateB.getHours()
      );
    case 'x_day':
    case 'day':
      return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
      );
    case 'x_week':
    case 'week':
      return (
        dateA.getFullYear() === dateB.getFullYear() &&
        getWeekNumber(dateA) === getWeekNumber(dateB)
      );
    case 'x_month':
    case 'month':
      return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth()
      );
    default:
      return false;
  }
}

/**
 *
 * @param  Date date
 * @param  int count
 * @param  string step
 * @return Date
 */
export function jumpDate(date, count, step) {
  const d = new Date(date);
  switch (step) {
    case 'hour':
      d.setHours(d.getHours() + count);
      break;
    case 'day':
      d.setHours(d.getHours() + count * 24);
      break;
    case 'week':
      d.setHours(d.getHours() + count * 24 * 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() + count);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + count);
      break;
    default:
      throw new Error('Invalid step');
  }

  return new Date(d);
}

/**
 * Convert a keyword or an array of keyword/date to an array of date objects
 *
 * @param  {string|array|Date} value Data to convert
 * @return {array}       An array of Dates
 */
export function expandDateSetting(value) {
  let settings = value;
  if (!Array.isArray(settings)) {
    settings = [settings];
  }

  return settings
    .map((data) => {
      if (data === 'now') {
        return new Date();
      }
      if (data instanceof Date) {
        return data;
      }
      return false;
    })
    .filter((d) => d !== false);
}
