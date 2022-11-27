import {
  SCROLL_FORWARD, TOP, RIGHT, BOTTOM, LEFT, X, Y,
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
    const { verticalOrientation } = this.calendar.options.options;

    this.scrollDirection = scrollDirection;
    const dimensions = {
      width: 0,
      height: 0,
    };
    let exitingTotal = 0;
    const scrollFactor = scrollDirection === SCROLL_FORWARD ? -1 : 1;

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

    collection.keys.forEach((domainKey) => {
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
      });
    });

    return dimensions;
  }

  /**
   * Return the full width of the domain block
   * @param int d Domain start timestamp
   * @return int The full width of the domain, including all margins.
   * Used to compute the x position of the domains on the x axis
   */
  #getWidth(d) {
    const { options } = this.calendar.options;
    const columnsCount = this.calendar.subDomainTemplate
      .at(options.subDomain)
      .columnsCount(d);

    const subDomainWidth =
      (options.cellSize[X] + options.cellPadding) * columnsCount -
      options.cellPadding;

    return (
      options.domainMargin[LEFT] +
      options.domainHorizontalLabelWidth +
      options.domainGutter +
      subDomainWidth +
      options.domainMargin[RIGHT]
    );
  }

  /**
   * Return the full height of the domain block
   * @param int d Domain start timestamp
   * @return int The full height of the domain, including all margins.
   * Used to compute the y position of the domains on the y axis
   */
  #getHeight(d) {
    const { options } = this.calendar.options;
    const rowsCount = this.calendar.subDomainTemplate
      .at(options.subDomain)
      .rowsCount(d);

    const subDomainHeight =
      (options.cellSize[Y] + options.cellPadding) * rowsCount -
      options.cellPadding;

    return (
      options.domainMargin[TOP] +
      subDomainHeight +
      options.domainGutter +
      options.domainVerticalLabelHeight +
      options.domainMargin[BOTTOM]
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
