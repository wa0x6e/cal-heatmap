import { castArray, isFunction, isString } from 'lodash-es';

export default {
  range: (value) => Math.max(+value, 1),
  'date.highlight': (args) => castArray(args),
  'formatter.subDomainLabel': (value) =>
    // eslint-disable-next-line
    ((isString(value) && value !== '') || isFunction(value) ? value : null),
};
