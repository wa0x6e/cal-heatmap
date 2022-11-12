import { merge } from 'lodash-es';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { dateIsEqual, isNow } from './date';

export function mergeRecursive(obj1, obj2) {
  return merge(obj1, obj2);
}

/**
 * Check if 2 arrays are equals
 *
 * @link http://stackoverflow.com/a/14853974/805649
 * @param  array array the array to compare to
 * @return bool true of the 2 arrays are equals
 */
export function arrayEquals(arrayA, arrayB) {
  // if the other array is a falsy value, return
  if (!arrayB || !arrayA) {
    return false;
  }

  // compare lengths - can save a lot of time
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (let i = 0; i < arrayA.length; i++) {
    // Check if we have nested arrays
    if (arrayA[i] instanceof Array && arrayB[i] instanceof Array) {
      // recurse into the nested arrays
      if (!arrayEquals(arrayA[i], arrayB[i])) {
        return false;
      }
    } else if (arrayA[i] !== arrayB[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

export function formatNumber() {
  return format(',d');
}

export function formatDate(d, formatter = 'title') {
  if (typeof formatter === 'function') {
    return formatter(d);
  }
  const f = timeFormat(formatter);
  return f(d);
}

/**
 * Expand a number of an array of numbers to an usable 4 values array
 *
 * @param  {integer|array} value
 * @return {array}        array
 */
export function expandMarginSetting(value) {
  if (typeof value === 'number') {
    value = [value];
  }

  if (!Array.isArray(value)) {
    console.log('Margin only takes an integer or an array of integers');
    value = [0];
  }

  switch (value.length) {
    case 1:
      return [value[0], value[0], value[0], value[0]];
    case 2:
      return [value[0], value[1], value[0], value[1]];
    case 3:
      return [value[0], value[1], value[2], value[1]];
    case 4:
      return value;
    default:
      return value.slice(0, 4);
  }
}

/**
 * Convert a string to an array like [singular-form, plural-form]
 *
 * @param  {string|array} value Date to convert
 * @return {array}       An array like [singular-form, plural-form]
 */
export function expandItemName(value) {
  if (typeof value === 'string') {
    return [value, value + (value !== '' ? 's' : '')];
  }

  if (Array.isArray(value)) {
    if (value.length === 1) {
      return [value[0], `${value[0]}s`];
    }
    if (value.length > 2) {
      return value.slice(0, 2);
    }

    return value;
  }

  return ['item', 'items'];
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
  d = new Date(d);

  if (options.highlight.length > 0) {
    for (const i in options.highlight) {
      if (dateIsEqual(options.highlight[i], d, options.subDomain)) {
        return isNow(options.highlight[i]) ? ' highlight-now' : ' highlight';
      }
    }
  }
  return '';
}
