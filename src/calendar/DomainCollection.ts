import { castArray, isString, isFunction } from 'lodash-es';
import {
  group, sum, count, min, max, median,
} from 'd3-array';

import type { SubDomain } from '../index';
import type { DataOptions } from '../options/Options';
import type { Helpers } from '../helpers/HelperFactory';

export default class DomainCollection {
  collection: Map<number, SubDomain[]>;

  helpers: any;

  min: number;

  max: number;

  keys: number[];

  yankedDomains: number[];

  constructor(
    helpers: Helpers,
    interval?: string,
    start?: Date | number,
    range?: Date | number,
  ) {
    this.collection = new Map();
    this.helpers = helpers;

    if (interval && start && range) {
      this.collection = new Map(
        this.helpers.DateHelper.intervals(interval, start, range).map(
          (d: number) => castArray(d),
        ),
      );
    }

    this.min = 0;
    this.max = 0;
    this.keys = [];
    this.yankedDomains = [];

    if (this.collection.size > 0) {
      this.#refreshKeys();
    }
  }

  has(key: number): boolean {
    return this.collection.has(key);
  }

  get(key: number) {
    return this.collection.get(key);
  }

  forEach(callback: any) {
    return this.collection.forEach(callback);
  }

  at(index: number): number {
    return this.keys[index];
  }

  clamp(minDate?: number, maxDate?: number): DomainCollection {
    if (minDate && this.min! < minDate) {
      this.keys
        .filter((key) => key < minDate)
        .forEach((d) => this.collection.delete(d));
    }

    if (maxDate && this.max! > maxDate) {
      this.keys
        .filter((key) => key > maxDate)
        .forEach((d) => this.collection.delete(d));
    }

    this.#refreshKeys();

    return this;
  }

  merge(
    newCollection: DomainCollection,
    limit: number,
    createValueCallback: Function,
  ): void {
    this.yankedDomains = [];

    newCollection.keys.forEach((domainKey, index) => {
      if (this.has(domainKey)) {
        return;
      }

      if (this.collection.size >= limit) {
        let keyToRemove = this.max;

        if (domainKey > this.max!) {
          keyToRemove = this.min;
        }

        if (keyToRemove && this.collection.delete(keyToRemove)) {
          this.yankedDomains.push(keyToRemove);
        }
      }
      this.collection.set(domainKey, createValueCallback(domainKey, index));
      this.#refreshKeys();
    });
    this.yankedDomains = this.yankedDomains.sort((a, b) => a - b);
  }

  slice(limit: number = 0, fromBeginning: boolean = true): DomainCollection {
    if (this.keys.length > limit) {
      const keysToDelete = fromBeginning ?
        this.keys.slice(0, -limit) :
        this.keys.slice(limit);

      keysToDelete.forEach((key) => {
        this.collection.delete(key);
      });

      this.#refreshKeys();
    }

    return this;
  }

  fill(
    data: any[],
    {
      x,
      y,
      groupY,
    }: {
      x: DataOptions['x'];
      y: DataOptions['y'];
      groupY: DataOptions['groupY'];
    },
    startDate: Date | number,
    endDate: Date | number,
    domainKeyExtractor: Function,
    subDomainKeyExtractor: Function,
  ): void {
    const cleanedData: Map<number, Map<number, any[]>> = group(
      data,
      (d): number => this.#extractTimestamp(d, x, domainKeyExtractor),
      (d): number => this.#extractTimestamp(d, x, subDomainKeyExtractor),
    );

    this.keys.forEach((domainKey) => {
      this.get(domainKey)!.forEach((subDomain: SubDomain, index: number) => {
        let value: number | null = null;

        if (
          cleanedData.has(domainKey) &&
          cleanedData.get(domainKey)!.has(subDomain.t)
        ) {
          value = this.#groupValues(
            this.#extractValues(
              cleanedData.get(domainKey)!.get(subDomain.t)!,
              y,
            ),
            groupY,
          );
        }

        this.get(domainKey)![index].v = value;
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  #extractValues(data: any[], y: string | Function): number[] {
    return data.map((d): number => (typeof y === 'function' ? y(d) : d[y]));
  }

  // eslint-disable-next-line class-methods-use-this
  #groupValues(
    values: number[],
    groupFn: string | ((values: number[]) => number),
  ): number | null {
    if (isString(groupFn)) {
      switch (groupFn) {
        case 'sum':
          return sum(values);
        case 'count':
          return count(values);
        case 'min':
          return min(values) || null;
        case 'max':
          return max(values) || null;
        case 'median':
          return median(values) || null;
        default:
          return null;
      }
    } else if (isFunction(groupFn)) {
      return groupFn(values);
    }

    return null;
  }

  #extractTimestamp(
    datum: any,
    x: string | Function,
    extractorFn: Function,
  ): number {
    const { DateHelper } = this.helpers;

    let timestamp: string | number =
      typeof x === 'function' ? x(datum) : datum[x];

    if (isString(timestamp)) {
      if (DateHelper.date(timestamp).isValid()) {
        timestamp = DateHelper.date(timestamp).valueOf();
      } else {
        return 0;
      }
    }

    return extractorFn(timestamp);
  }

  #refreshKeys(): number[] {
    this.keys = Array.from(this.collection.keys())
      .map((d: any) => parseInt(d, 10))
      .sort((a, b) => a - b);

    const { keys } = this;
    // eslint-disable-next-line prefer-destructuring
    this.min = keys[0];
    this.max = keys[keys.length - 1];

    return this.keys;
  }
}
