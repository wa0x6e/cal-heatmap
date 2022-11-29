import { castArray } from 'lodash-es';

export default class DomainCollection {
  constructor(dateHelper, interval, start, range) {
    this.collection = new Map();

    if (interval && start && range) {
      this.collection = new Map(
        dateHelper.intervals(interval, start, range).map((d) => castArray(d)),
      );
    }

    this.min = null;
    this.max = null;
    this.keys = [];
    this.dateHelper = dateHelper;
    this.yankedDomains = [];

    if (this.collection.size > 0) {
      this.#refreshKeys();
    }
  }

  has(key) {
    return this.collection.has(key);
  }

  get(key) {
    return this.collection.get(key);
  }

  forEach(callback) {
    return this.collection.forEach(callback);
  }

  at(index) {
    return this.keys[index];
  }

  keyIndex(d) {
    return this.keys.indexOf(d);
  }

  clamp(minDate, maxDate) {
    if (minDate && this.min < minDate) {
      this.keys
        .filter((key) => key < minDate)
        .forEach((d) => this.collection.delete(d));
    }

    if (maxDate && this.max > maxDate) {
      this.keys
        .filter((key) => key > maxDate)
        .forEach((d) => this.collection.delete(d));
    }

    this.#refreshKeys();

    return this;
  }

  merge(newCollection, limit, createValueCallback) {
    this.yankedDomains = [];

    newCollection.keys.forEach((domain, index) => {
      if (this.has(domain)) {
        return;
      }

      if (this.collection.size >= limit) {
        let keyToRemove = this.max;

        if (domain > this.max) {
          keyToRemove = this.min;
        }

        if (this.collection.delete(keyToRemove)) {
          this.yankedDomains.push(keyToRemove);
        }
      }
      this.collection.set(domain, createValueCallback(domain, index));
      this.#refreshKeys();
    });
    this.yankedDomains = this.yankedDomains.sort((a, b) => a - b);
  }

  slice(limit, fromBeginning = true) {
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

  #refreshKeys() {
    this.keys = Array.from(this.collection.keys())
      .map((d) => parseInt(d, 10))
      .sort((a, b) => a - b);

    const { keys } = this;
    // eslint-disable-next-line prefer-destructuring
    this.min = keys[0];
    this.max = keys[keys.length - 1];

    return this.keys;
  }
}
