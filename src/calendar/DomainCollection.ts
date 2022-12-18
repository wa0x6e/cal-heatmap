import { castArray } from 'lodash-es';

import { FillStrategy } from '../constant';

export default class DomainCollection {
  collection: Map<
  number,
  { t: number; x?: number; y?: number; v?: null | number }[]
  >;

  min?: number;

  max?: number;

  keys: number[];

  yankedDomains: number[];

  constructor(
    { DateHelper }: { DateHelper: any },
    interval?: string,
    start?: Date | number,
    range?: Date | number,
  ) {
    this.collection = new Map();

    if (interval && start && range) {
      this.collection = new Map(
        DateHelper.intervals(interval, start, range).map((d: number) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          castArray(d)),
      );
    }

    this.min = undefined;
    this.max = undefined;
    this.keys = [];
    this.yankedDomains = [];

    if (this.collection.size > 0) {
      this.#refreshKeys();
    }
  }

  has(key: number) {
    return this.collection.has(key);
  }

  get(key: number) {
    return this.collection.get(key);
  }

  forEach(callback: any) {
    return this.collection.forEach(callback);
  }

  at(index: number) {
    return this.keys[index];
  }

  keyIndex(d: number) {
    return this.keys.indexOf(d);
  }

  clamp(minDate: number, maxDate?: number) {
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
  ) {
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

  slice(limit: number = 0, fromBeginning: boolean = true) {
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
    data: any,
    strategy: FillStrategy,
    startDate: Date | number,
    endDate: Date | number,
    domainKeyExtractor: Function,
    subDomainKeyExtractor: Function,
  ) {
    if (strategy === FillStrategy.RESET_ALL_ON_UPDATE) {
      this.#resetAllValues();
    }

    Object.keys(data).forEach((date: any) => {
      if (Number.isNaN(date)) {
        return;
      }

      const timestamp = date * 1000;

      const domainKey = domainKeyExtractor(timestamp);

      // Skip if data is not relevant to current domain
      if (
        !this.has(domainKey) ||
        !(domainKey >= +startDate && domainKey < +endDate)
      ) {
        return;
      }

      const existingSubDomainsData = this.get(domainKey);

      if (typeof existingSubDomainsData === 'undefined') {
        return;
      }

      const subDomainIndex = existingSubDomainsData
        .map((d: any) => d.t)
        .indexOf(subDomainKeyExtractor(timestamp));

      if (strategy === FillStrategy.RESET_SINGLE_ON_UPDATE) {
        existingSubDomainsData[subDomainIndex].v = data[date];
      } else if (typeof existingSubDomainsData[subDomainIndex].v === 'number') {
        existingSubDomainsData[subDomainIndex].v += data[date];
      } else {
        existingSubDomainsData[subDomainIndex].v = data[date];
      }
    });
  }

  #resetAllValues(): void {
    this.keys.forEach((domainKey) => {
      this.get(domainKey)!.forEach((_: any, index: number) => {
        this.collection.get(domainKey)![index].v = null;
      });
    });
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
