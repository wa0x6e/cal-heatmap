// eslint-disable-next-line no-unused-vars
import { select, selectAll } from 'd3-selection';
// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition';

import {
  SCROLL_BACKWARD, TOP, RIGHT, BOTTOM, LEFT, X, Y,
} from '../constant';

export default class DomainPainter {
  constructor(calendar) {
    this.calendar = calendar;

    // Dimensions of the internal area containing all the domains
    // Excluding all surrounding margins
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(scrollDirection, calendarNode) {
    const { options } = this.calendar.options;
    const scrollBackward = scrollDirection === SCROLL_BACKWARD;
    const t = calendarNode.transition().duration(options.animationDuration);

    return calendarNode
      .select('.graph')
      .selectAll('.graph-domain')
      .data(
        () => this.calendar.getDomainKeys(),
        (d) => d,
      )
      .join(
        (enter) => enter
          .append('svg')
          .attr('x', (d) => this.#getOuterX(d, scrollBackward))
          .attr('y', (d) => this.#getOuterY(d, scrollBackward))
          .attr('width', (d) => this.#updateWidth(this.getWidth(d)))
          .attr('height', (d) => this.#updateHeight(this.getHeight(d)))
          .attr('class', (d) => this.#getClassName(d))
          .call((enterSelection) => enterSelection
            .append('rect')
            .attr('width', (d) => this.getWidth(d) - options.domainGutter)
            .attr('height', (d) => this.getHeight(d) - options.domainGutter)
            .attr('class', 'domain-background'))
          .call((enterSelection) => enterSelection
            .transition(t)
            .attr('x', (d) => this.#getX(d))
            .attr('y', (d) => this.#getY(d))),
        (update) => update.call((updateSelection) => updateSelection
          .transition(t)
          .attr('x', (d) => this.#getX(d))
          .attr('y', (d) => this.#getY(d))),
        (exit) => exit.call((exitSelection) => exitSelection
          .transition(t)
          .attr('width', (d) => {
            this.#updateWidth(-this.getWidth(d));
          })
          .attr('height', (d) => {
            this.#updateHeight(-this.getHeight(d));
          })
          .attr('x', (d) => this.#getOuterX(d, !scrollBackward))
          .attr('y', (d) => this.#getOuterY(d, !scrollBackward))
          .remove()),
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

  #getOuterX(d, start) {
    return this.#applyScrollingAxis('x', () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      (start ? -this.getWidth(d) : this.dimensions.width));
  }

  #getOuterY(d, start) {
    return this.#applyScrollingAxis('y', () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      (start ? -this.getHeight(d) : this.dimensions.height));
  }

  #getX(d) {
    return this.#applyScrollingAxis(
      'x',
      () => this.calendar.getDomainKeys().indexOf(d) * this.getWidth(d),
    );
  }

  #getY(d) {
    return this.#applyScrollingAxis(
      'y',
      () => this.calendar.getDomainKeys().indexOf(d) * this.getHeight(d),
    );
  }

  #updateHeight(value) {
    return this.#updateDimensions('height', value);
  }

  #updateWidth(value) {
    return this.#updateDimensions('width', value);
  }

  #updateDimensions(axis, value) {
    const { options } = this.calendar.options;

    if (axis === 'width') {
      if (options.verticalOrientation) {
        this.dimensions[axis] = Math.abs(value);
      } else {
        this.dimensions[axis] += value;
      }
    } else if (axis === 'height') {
      if (options.verticalOrientation) {
        this.dimensions[axis] += value;
      } else {
        this.dimensions[axis] = Math.abs(value);
      }
    }

    return value;
  }

  #getClassName(d) {
    let classname = 'graph-domain';
    const helper = this.calendar.helpers.DateHelper.date(d);

    switch (this.calendar.options.options.domain) {
      case 'hour':
        classname += ` h_${helper.hour()}`;
        break;
      case 'day':
        classname += ` d_${helper.date()} dy_${helper.isoWeekday()}`;
        break;
      case 'week':
        classname += ` w_${helper.week()}`;
        break;
      case 'month':
        classname += ` m_${helper.month() + 1}`;
        break;
      case 'year':
        classname += ` y_${helper.year()}`;
        break;
      default:
    }
    return classname;
  }

  /**
   * Return the full width of the domain block
   * @param int d Domain start timestamp
   * @return int The full width of the domain, including all margins.
   * Used to compute the x position of the domains on the x axis
   */
  getWidth(d) {
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
  getHeight(d) {
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
}
