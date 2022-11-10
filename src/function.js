import { merge } from 'lodash-es';

export function mergeRecursive(obj1, obj2) {
  'use strict';

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
  'use strict';

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
