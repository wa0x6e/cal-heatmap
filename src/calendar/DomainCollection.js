export default class DomainCollection {
  constructor(args) {
    this.collection = new Map(args);
    this.min = null;
    this.max = null;
    this.keys = [];

    if (args) {
      this.#resetKeys();
    }
  }

  has(key) {
    return this.collection.has(key);
  }

  get(key) {
    return this.collection.get(key);
  }

  set(key, value) {
    this.collection.set(key, value);
    this.#resetKeys();

    return this.has(key);
  }

  delete(key) {
    const r = this.collection.delete(key);
    this.#resetKeys();

    return r;
  }

  forEach(callback) {
    return this.collection.forEach((element) => callback(element));
  }

  keyIndex(d) {
    return this.keys.indexOf(d);
  }

  pop() {
    const r = this.collection.delete(this.max);
    this.#resetKeys();

    return r;
  }

  shift() {
    const r = this.collection.delete(this.min);
    this.#resetKeys();

    return r;
  }

  trim(count, fromBeginning) {
    if (this.keys.length > count) {
      return fromBeginning ? this.shift() : this.pop();
    }

    return false;
  }

  #resetKeys() {
    this.keys = Array.from(this.collection.keys()).sort();

    const { keys } = this;
    // eslint-disable-next-line prefer-destructuring
    this.min = keys[0];
    this.max = keys[keys.length - 1];
  }
}
