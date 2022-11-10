'use strict';

/**
 * Compute the position of a domain, relative to the calendar
 */
export default class DomainPosition {
  constructor() {
    this.positions = new Map();

    return this;
  }

  getPosition(d) {
    return this.positions.get(d);
  }

  getPositionFromIndex(i) {
    const domains = this.getKeys();
    return this.positions.get(domains[i]);
  }

  getLast() {
    const domains = this.getKeys();
    return this.positions.get(domains[domains.length - 1]);
  }

  setPosition(d, dim) {
    this.positions.set(d, dim);
  }

  shiftRightBy(exitingDomainDim) {
    const mypos = this.positions;
    const mythis = this;
    mypos.forEach(function (value, key) {
      mythis.positions.set(key, value - exitingDomainDim);
    });

    const domains = this.getKeys();
    this.positions.delete(domains[0]);
  }

  shiftLeftBy(enteringDomainDim) {
    const mypos = this.positions;
    const mythis = this;
    mypos.forEach((value, key) => {
      mythis.positions.set(key, value + enteringDomainDim);
    });

    const domains = this.getKeys();

    this.positions.delete(domains[domains.length - 1]);
  }

  getKeys() {
    return Array.from(this.positions.keys()).sort((a, b) => {
      return parseInt(a, 10) - parseInt(b, 10);
    });
  }
}
