import { castArray, isFunction, isString } from 'lodash-es';
import type { DomainOptions } from './Options';

export default {
  range: (value: number): number => Math.max(+value, 1),
  'date.highlight': (args: Date[] | Date) => castArray(args),
  'subDomain.label': (value: DomainOptions['label']) =>
    // eslint-disable-next-line
    ((isString(value) && value !== '') || isFunction(value) ? value : null),
};
