import DateHelper from './DateHelper';

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
    case 'x_minute':
    case 'minute':
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
        dateHelper.getWeekNumber(dateA) === dateHelper.getWeekNumber(dateB)
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
