import { NAVIGATE_LEFT, NAVIGATE_RIGHT } from './constant';

/**
 * Compute the position of a domain, relative to the calendar
 */
export default class DomainPosition {
  constructor() {
    this.positions = new Map();
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
    mypos.forEach((value, key) => {
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
    return Array.from(this.positions.keys()).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );
  }

  getDomainPosition(
    enteringDomainDim,
    exitingDomainDim,
    navigationDir,
    domainIndex,
    graphDim,
    axis,
    domainDim
  ) {
    let tmp = 0;
    switch (navigationDir) {
      case false:
        tmp = graphDim[axis];

        graphDim[axis] += domainDim;
        this.setPosition(domainIndex, tmp);
        return tmp;

      case NAVIGATE_RIGHT:
        this.setPosition(domainIndex, graphDim[axis]);

        enteringDomainDim = domainDim;
        exitingDomainDim = this.getPositionFromIndex(1);

        this.shiftRightBy(exitingDomainDim);
        return graphDim[axis];

      case NAVIGATE_LEFT:
        tmp = -domainDim;

        enteringDomainDim = -tmp;
        exitingDomainDim = graphDim[axis] - getLast();

        this.setPosition(domainIndex, tmp);
        this.shiftLeftBy(enteringDomainDim);
        return tmp;
    }
  }
}
