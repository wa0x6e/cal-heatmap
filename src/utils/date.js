import DateHelper from './DateHelper';

/**
 * Returns wether or not dateA is less than or equal to dateB. This function is subdomain aware.
 * Performs automatic conversion of values.
 * @param dateA may be a number or a Date
 * @param dateB may be a number or a Date
 * @returns {boolean}
 */
export function dateFromPreviousInterval(dateA, dateB, domain) {
  return DateHelper.moment(dateA).isBefore(DateHelper.moment(dateB), domain);
}

/**
 * Return whether 2 dates belongs to the same domain
 *
 * @param  Date dateA First date to compare
 * @param  Date dateB Secon date to compare
 * @return bool true if the 2 dates belongs to the same domain
 */
export function datesFromSameInterval(dateA, dateB, domain) {
  return DateHelper.moment(dateA).isSame(DateHelper.moment(dateB), domain);
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
