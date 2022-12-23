import { castArray, isFunction, isString } from 'lodash-es';
import type { SubDomainOptions } from './Options';

export default {
  range: (value: number): number => Math.max(+value, 1),
  'date.highlight': (args: Date[] | Date): Date[] => castArray(args),
  'subDomain.label': (
    value: SubDomainOptions['label'],
  ): string | Function | null =>
    // eslint-disable-next-line
    ((isString(value) && value !== '') || isFunction(value) ? value : null),
};
