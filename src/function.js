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
