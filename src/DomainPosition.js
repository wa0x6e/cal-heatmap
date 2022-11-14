import { NAVIGATE_LEFT, NAVIGATE_RIGHT } from './constant';

/**
 * Compute the position of a domain on the scrolling axis,
 * relative to the calendar
 *
 * Scrolling axis will depend on the calendar orientation
 */
export default class DomainPosition {
  constructor() {
    // { key: timestamp, value: scrollingAxis position }
    this.positions = new Map();
  }

  getPosition(d) {
    return this.positions.get(d);
  }

  getPositionFromIndex(i) {
    return this.positions.get(this.getKeys()[i]);
  }

  getLast() {
    const domains = this.getKeys();
    return this.positions.get(domains[domains.length - 1]);
  }

  setPosition(d, position) {
    this.positions.set(d, position);
  }

  /**
   * Shifiting all domains to the left, by the specified value
   *
   * @param  {[type]} exitingDomainDim [description]
   * @return {[type]}                  [description]
   */
  shiftRightBy(exitingDomainDim) {
    this.positions.forEach((value, key) => {
      this.set(key, value - exitingDomainDim);
    });

    this.positions.delete(this.getKeys()[0]);
  }

  /**
   * Shifting all the domains to the right, by the specified value
   * @param  {[type]} enteringDomainDim [description]
   * @return {[type]}                   [description]
   */
  shiftLeftBy(enteringDomainDim) {
    this.positions.forEach((value, key) => {
      this.set(key, value + enteringDomainDim);
    });

    const domains = this.getKeys();

    this.positions.delete(domains[domains.length - 1]);
  }

  getKeys() {
    return Array.from(this.positions.keys()).sort();
  }

  getDomainPosition(
    enteringDomainDim,
    exitingDomainDim,
    navigationDir,
    domainIndex,
    graphDim,
    axis,
    domainDim,
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
      default:
        return false;
    }
  }
}
