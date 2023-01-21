import castArray from 'lodash-es/castArray';

import {
  group, sum, count, min, max, median,
} from 'd3-array';

import type { SubDomain } from '../index';
import type {
  DataOptions,
  DataGroupType,
  DataRecord,
} from '../options/Options';
import { DomainType, Timestamp } from '../index';

export const DOMAIN_FORMAT: Record<DomainType, string> = {
  year: 'YYYY',
  month: 'MMMM',
  week: 'wo [week] YYYY',
  x_day: 'Do MMM',
  day: 'Do MMM',
  hour: 'HH:00',
};

export default class DomainCollection {
  collection: Map<Timestamp, SubDomain[]>;

  dateHelper: any;

  min: Timestamp;

  max: Timestamp;

  keys: Timestamp[];

  yankedDomains: Timestamp[];

  constructor(
    dateHelper: any,
    interval?: string,
    start?: Date | Timestamp,
    range?: Date | Timestamp,
    excludeEnd: boolean = false,
  ) {
    this.collection = new Map();
    this.dateHelper = dateHelper;

    if (interval && start && range) {
      this.collection = new Map(
        this.dateHelper
          .intervals(interval, start, range, excludeEnd)
          .map((d: Timestamp) => castArray(d)),
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

  has(key: Timestamp): boolean {
    return this.collection.has(key);
  }

  get(key: Timestamp) {
    return this.collection.get(key);
  }

  forEach(callback: any) {
    return this.collection.forEach(callback);
  }

  at(index: number): Timestamp {
    return this.keys[index];
  }

  clamp(minDate?: Timestamp, maxDate?: Timestamp): DomainCollection {
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
    data: DataRecord[],
    {
      x,
      y,
      groupY,
    }: {
      x: DataOptions['x'];
      y: DataOptions['y'];
      groupY: DataOptions['groupY'];
    },
    startDate: Date | Timestamp,
    endDate: Date | Timestamp,
    domainKeyExtractor: Function,
    subDomainKeyExtractor: Function,
  ): void {
    const cleanedData: Map<Timestamp, Map<Timestamp, DataRecord[]>> = group(
      data,
      (d): Timestamp => this.#extractTimestamp(d, x, domainKeyExtractor),
      (d): Timestamp => this.#extractTimestamp(d, x, subDomainKeyExtractor),
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
  #extractValues(data: DataRecord[], y: string | Function): number[] {
    return data.map((d): number => (typeof y === 'function' ? y(d) : d[y]));
  }

  // eslint-disable-next-line class-methods-use-this
  #groupValues(
    values: number[],
    groupFn: DataGroupType | ((values: number[]) => number),
  ): number | null {
    if (typeof groupFn === 'string') {
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
    } else if (typeof groupFn === 'function') {
      return groupFn(values);
    }

    return null;
  }

  #extractTimestamp(
    datum: DataRecord,
    x: string | Function,
    extractorFn: Function,
  ): Timestamp {
    let timestamp: string | Timestamp =
      typeof x === 'function' ? x(datum) : datum[x];

    if (typeof timestamp === 'string') {
      const date = this.dateHelper.date(timestamp);
      if (date.isValid()) {
        timestamp = +date;
      } else {
        return 0;
      }
    }

    return extractorFn(timestamp);
  }

  #refreshKeys(): Timestamp[] {
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
