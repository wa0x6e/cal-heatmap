import {
  SCROLL_FORWARD, TOP, RIGHT, BOTTOM, LEFT,
} from '../constant';

export default class DomainCoordinates {
  constructor(calendar, domainPainter) {
    this.calendar = calendar;
    this.domainPainter = domainPainter;
    this.collection = new Map();
    this.scrollDirection = null;
  }

  at(domainKey) {
    return this.collection.get(domainKey);
  }

  update(collection, scrollDirection) {
    const { verticalOrientation, domain } = this.calendar.options.options;

    this.scrollDirection = scrollDirection;
    const dimensions = {
      width: 0,
      height: 0,
    };
    let exitingTotal = 0;
    let scrollFactor = scrollDirection === SCROLL_FORWARD ? -1 : 1;
    const { keys } = collection;
    if (this.calendar.options.options.reversedDirection) {
      keys.reverse();
      scrollFactor *= -1;
    }

    collection.yankedDomains.forEach((domainKey) => {
      exitingTotal +=
        this.collection.get(domainKey)[
          verticalOrientation ? 'height' : 'width'
        ];
    });
    collection.yankedDomains.forEach((domainKey) => {
      const coor = this.collection.get(domainKey);
      this.collection.set(domainKey, {
        ...coor,
        x: verticalOrientation ? coor.x : coor.x + exitingTotal * scrollFactor,
        y: verticalOrientation ? coor.y + exitingTotal * scrollFactor : coor.y,
      });
    });

    keys.forEach((domainKey) => {
      const w = this.#getWidth(domainKey);
      const h = this.#getHeight(domainKey);
      if (verticalOrientation) {
        dimensions.height += h;
        dimensions.width = Math.max(w, dimensions.width);
      } else {
        dimensions.width += w;
        dimensions.height = Math.max(h, dimensions.height);
      }

      const x = dimensions.width - w;
      const y = dimensions.height - h;

      this.collection.set(domainKey, {
        ...this.collection.get(domainKey),
        x: verticalOrientation ? 0 : x,
        y: verticalOrientation ? y : 0,
        pre_x: verticalOrientation ? x : x - exitingTotal * scrollFactor,
        pre_y: verticalOrientation ? y - exitingTotal * scrollFactor : y,
        width: w,
        height: h,
        inner_width: w - (verticalOrientation ? 0 : domain.gutter),
        inner_height: h - (!verticalOrientation ? 0 : domain.gutter),
      });
    });

    return dimensions;
  }

  /**
   * Return the full width of the domain block
   * @param {number} d Domain start timestamp
   * @return {number} The full width of the domain,
   * including all padding and gutter
   * Used to compute the x position of the domains on the x axis
   */
  #getWidth(d) {
    const {
      domain, subDomain, x, verticalOrientation,
    } =
      this.calendar.options.options;
    const columnsCount = this.calendar.subDomainTemplate
      .at(subDomain.type)
      .columnsCount(d);

    const subDomainWidth =
      (subDomain.width + subDomain.gutter) * columnsCount - subDomain.gutter;

    return (
      domain.padding[LEFT] +
      x.domainHorizontalLabelWidth +
      (verticalOrientation ? 0 : domain.gutter) +
      subDomainWidth +
      domain.padding[RIGHT]
    );
  }

  /**
   * Return the full height of the domain block
   * @param {number} d Domain start timestamp
   * @return {number} The full height of the domain,
   * including all paddings and gutter.
   * Used to compute the y position of the domains on the y axis
   */
  #getHeight(d) {
    const {
      domain, subDomain, x, verticalOrientation,
    } =
      this.calendar.options.options;
    const rowsCount = this.calendar.subDomainTemplate
      .at(subDomain.type)
      .rowsCount(d);

    const subDomainHeight =
      (subDomain.height + subDomain.gutter) * rowsCount - subDomain.gutter;

    return (
      domain.padding[TOP] +
      subDomainHeight +
      (verticalOrientation ? domain.gutter : 0) +
      x.domainVerticalLabelHeight +
      domain.padding[BOTTOM]
    );
  }

  #applyScrollingAxis(axis, callback) {
    const { verticalOrientation } = this.calendar.options.options;

    if (
      (verticalOrientation && axis === 'x') ||
      (!verticalOrientation && axis === 'y')
    ) {
      return 0;
    }

    return callback();
  }
}
