import { timeFormat } from 'd3-time-format';

import { dateIsEqual } from './date';

export function formatDate(d, formatter = 'title') {
  if (typeof formatter === 'function') {
    return formatter(d);
  }
  const f = timeFormat(formatter);
  return f(d);
}

/**
 * Sprintf like function.
 * Replaces placeholders {0} in string with values from provided object.
 *
 * @param string formatted String containing placeholders.
 * @param object args Object with properties to replace placeholders in string.
 *
 * @return String
 */
export function formatStringWithObject(formatted, args) {
  for (const prop in args) {
    if (args.hasOwnProperty(prop)) {
      const regexp = new RegExp(`\\{${prop}\\}`, 'gi');
      formatted = formatted.replace(regexp, args[prop]);
    }
  }
  return formatted;
}

/**
 * Return a classname if the specified date should be highlighted
 *
 * @param  timestamp date Date of the current subDomain
 * @return String the highlight class
 */
export function getHighlightClassName(d, options) {
  const date = new Date(d);

  if (options.highlight.length > 0) {
    options.highlight.forEach((i) => {
      if (dateIsEqual(options.highlight[i], date, options.subDomain)) {
        return dateIsEqual(options.highlight[i])
          ? ' highlight-now'
          : ' highlight';
      }
    });
  }

  return '';
}

/**
 * Expand a number of an array of numbers to an usable 4 values array
 *
 * @param  {integer|array} value
 * @return {array}        array
 */
export function expandMarginSetting(settings) {
  let value = settings;
  if (typeof value === 'number') {
    value = [value];
  }

  if (!Array.isArray(value) || !value.every((d) => typeof d === 'number')) {
    console.log('Margin only accepts an integer or an array of integers');
    value = [0];
  }

  switch (value.length) {
    case 1:
      return [value[0], value[0], value[0], value[0]];
    case 2:
      return [value[0], value[1], value[0], value[1]];
    case 3:
      return [value[0], value[1], value[2], value[1]];
    default:
      return value.slice(0, 4);
  }
}
