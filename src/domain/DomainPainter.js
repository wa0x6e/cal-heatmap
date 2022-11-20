import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';

import { NAVIGATE_LEFT, TOP, RIGHT, BOTTOM, LEFT } from '../constant';

export default class DomainPainter {
  constructor(calendar) {
    this.calendar = calendar;

    // Dimensions of the internal area containing all the domains
    // Excluding all surrounding margins
    this.dimensions = {
      width: 0,
      height: 0,
    };

    this.root = null;
  }

  paint(navigationDir, calendarNode) {
    this.root = this.#assignData(calendarNode);

    const domainNode = this.#paintEnteringDomain(navigationDir);
    this.#paintTransitioningDomain(navigationDir);
    this.#paintExitingDomain(navigationDir);

    return domainNode;
  }

  #paintEnteringDomain(navigationDir) {
    const { options } = this.calendar.options;

    const svg = this.root
      .enter()
      .append('svg')
      .attr('x', (d) => {
        if (options.verticalOrientation) {
          return 0;
        }

        if (navigationDir === false) {
          const domains = this.calendar.getDomainKeys();

          return domains.indexOf(d) * this.getWidth(d, true);
        }

        return navigationDir === NAVIGATE_LEFT
          ? -this.getWidth(d, true)
          : this.dimensions.width;
      })
      .attr('y', (d) => {
        if (options.verticalOrientation) {
          return this.dimensions.height;
        }

        return 0;
      })
      .attr('width', (d) => {
        this.#updateDimensions('width', this.getWidth(d, true));
      })
      .attr('height', (d) => {
        this.#updateDimensions('height', this.getHeight(d, true));
      })
      .attr('class', (d) => this.#getClassName(d));

    svg
      .transition()
      .duration(options.animationDuration)
      .attr('x', (d) => {
        if (options.verticalOrientation) {
          return 0;
        }
        const domains = this.calendar.getDomainKeys();

        return domains.indexOf(d) * this.getWidth(d, true);
      })
      .attr('y', (d) => {
        if (options.verticalOrientation) {
          const domains = this.calendar.getDomainKeys();

          return domains.indexOf(d) * this.getHeight(d, true);
        }
        return 0;
      });

    svg
      .append('rect')
      .attr(
        'width',
        (d) =>
          this.getWidth(d, true) - options.domainGutter - options.cellPadding,
      )
      .attr(
        'height',
        (d) =>
          this.getHeight(d, true) - options.domainGutter - options.cellPadding,
      )
      .attr('class', 'domain-background');

    return svg;
  }

  #paintExitingDomain(navigationDir) {
    const { options } = this.calendar.options;

    // At the time of exit, domainsWidth and domainsHeight already automatically shifted
    this.root
      .exit()
      .transition()
      .duration(options.animationDuration)
      .attr('x', (d) => {
        if (options.verticalOrientation) {
          return 0;
        }
        console.log(
          navigationDir === NAVIGATE_LEFT
            ? this.dimensions.width
            : -this.getWidth(d, true),
        );

        return navigationDir === NAVIGATE_LEFT
          ? this.dimensions.width
          : -this.getWidth(d, true);
      })
      .attr('y', (d) => {
        if (options.verticalOrientation) {
          return navigationDir === NAVIGATE_LEFT
            ? this.dimensions.height
            : -this.getHeight(d, true);
        }
        return 0;
      })
      .attr('width', (d) => {
        this.#updateDimensions('width', -this.getWidth(d, true));
      })
      .attr('height', (d) => {
        this.#updateDimensions('height', -this.getHeight(d, true));
      })
      .remove();
  }

  #paintTransitioningDomain() {
    const { options } = this.calendar.options;

    // if (navigationDir !== false) {
    this.root
      .transition()
      .duration(options.animationDuration)
      .attr('x', (d) => {
        if (options.verticalOrientation) {
          return 0;
        }
        const domains = this.calendar.getDomainKeys();

        return domains.indexOf(d) * this.getWidth(d, true);
      })
      .attr('y', (d) => {
        if (options.verticalOrientation) {
          const domains = this.calendar.getDomainKeys();

          return domains.indexOf(d) * this.getHeight(d, true);
        }
        return 0;
      });
    // }
  }

  #updateDimensions(axis, value) {
    const { options } = this.calendar.options;

    if (axis === 'width') {
      if (options.verticalOrientation) {
        this.dimensions.width = Math.abs(value);
      } else {
        this.dimensions.width += value;
      }
    } else if (axis === 'height') {
      if (options.verticalOrientation) {
        this.dimensions.height += value;
      } else {
        this.dimensions.height = Math.abs(value);
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

  #assignData(calendarNode) {
    return calendarNode
      .select('.graph')
      .selectAll('.graph-domain')
      .data(
        () => this.calendar.getDomainKeys(),
        (d) => d,
      );
  }

  // Return the width of the domain block, without the domain gutter
  // @param int d Domain start timestamp
  getWidth(d, outer = false) {
    const { options } = this.calendar.options;
    const columnsCount = this.calendar.subDomainTemplate
      .at(options.subDomain)
      .columnsCount(d);

    let width = (options.cellSize + options.cellPadding) * columnsCount;

    if (outer) {
      width +=
        options.domainHorizontalLabelWidth +
        options.domainGutter +
        options.domainMargin[RIGHT] +
        options.domainMargin[LEFT];
    }

    return width;
  }

  // Return the height of the domain block, without the domain gutter
  getHeight(d, outer = false) {
    const { options } = this.calendar.options;
    const rowsCount = this.calendar.subDomainTemplate
      .at(options.subDomain)
      .rowsCount(d);

    let height = (options.cellSize + options.cellPadding) * rowsCount;

    if (outer) {
      height +=
        options.domainGutter +
        options.domainVerticalLabelHeight +
        options.domainMargin[TOP] +
        options.domainMargin[BOTTOM];
    }
    return height;
  }
}
