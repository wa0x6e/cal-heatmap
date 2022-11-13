import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';

import DomainPosition from '../DomainPosition';

import { NAVIGATE_LEFT } from '../constant';
import { getWeekNumber } from '../date';

export default class DomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.domainPosition = new DomainPosition();

    // Dimensions of the internal area containing all the domains
    // Excluding all surrounding margins
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(navigationDir, root) {
    const { options } = this.calendar.options;

    // Painting all the domains
    const domainSvg = root
      .select('.graph')
      .selectAll('.graph-domain')
      .data(
        () => {
          const data = this.calendar.getDomainKeys();
          return navigationDir === NAVIGATE_LEFT ? data.reverse() : data;
        },
        d => d
      );
    const enteringDomainDim = 0;
    const exitingDomainDim = 0;

    const svg = domainSvg
      .enter()
      .append('svg')
      .attr('width', d => {
        const width = this.getWidth(d, true);
        if (options.verticalOrientation) {
          this.dimensions.width = width;
        } else {
          this.dimensions.width += width;
        }
        return width;
      })
      .attr('height', d => {
        const height = this.getHeight(d, true);

        if (options.verticalOrientation) {
          this.dimensions.height += height;
        } else {
          this.dimensions.height = height;
        }

        return height;
      })
      .attr('x', d => {
        if (options.verticalOrientation) {
          return 0;
        }

        const domains = this.calendar.getDomainKeys();
        return domains.indexOf(d) * this.getWidth(d, true);
      })
      .attr('y', d => {
        if (options.verticalOrientation) {
          return this.domainPosition.getDomainPosition(
            enteringDomainDim,
            exitingDomainDim,
            navigationDir,
            d,
            this.dimensions,
            'height',
            this.getHeight(d, true)
          );
        }

        return 0;
      })
      .attr('class', d => this.#getClassName(d));
    this.lastInsertedSvg = svg;

    svg
      .append('rect')
      .attr(
        'width',
        d => this.getWidth(d, true) - options.domainGutter - options.cellPadding
      )
      .attr(
        'height',
        d =>
          this.getHeight(d, true) - options.domainGutter - options.cellPadding
      )
      .attr('class', 'domain-background');

    if (navigationDir !== false) {
      domainSvg
        .transition()
        .duration(options.animationDuration)
        .attr('x', d =>
          options.verticalOrientation ? 0 : this.domainPosition.getPosition(d)
        )
        .attr('y', d =>
          options.verticalOrientation ? this.domainPosition.getPosition(d) : 0
        );
    }

    // At the time of exit, domainsWidth and domainsHeight already automatically shifted
    domainSvg
      .exit()
      .transition()
      .duration(options.animationDuration)
      .attr('x', d => {
        if (options.verticalOrientation) {
          return 0;
        }

        if (navigationDir === NAVIGATE_LEFT) {
          return this.dimensions.width;
        }

        return -this.getWidth(d, true);
      })
      .attr('y', d => {
        if (options.verticalOrientation) {
          if (navigationDir === NAVIGATE_LEFT) {
            return this.dimensions.height;
          }

          return -this.getHeight(d, true);
        }
        return 0;
      })
      .remove();

    return svg;
  }

  #getClassName(d) {
    let classname = 'graph-domain';
    const date = new Date(d);
    switch (this.calendar.options.options.domain) {
      case 'hour':
        classname += ` h_${date.getHours()}`;
        break;
      case 'day':
        classname += ` d_${date.getDate()} dy_${date.getDay()}`;
        break;
      case 'week':
        classname += ` w_${getWeekNumber(date)}`;
        break;
      case 'month':
        classname += ` m_${date.getMonth() + 1}`;
        break;
      case 'year':
        classname += ` y_${date.getFullYear()}`;
        break;
      default:
    }
    return classname;
  }

  // Return the width of the domain block, without the domain gutter
  // @param int d Domain start timestamp
  getWidth(d, outer = false) {
    const { options } = this.calendar.options;
    const columnsCount = this.calendar.domainSkeleton
      .at(options.subDomain)
      .column(d);

    let width = (options.cellSize + options.cellPadding) * columnsCount;

    if (outer) {
      width +=
        options.domainHorizontalLabelWidth +
        options.domainGutter +
        options.domainMargin[1] +
        options.domainMargin[3];
    }

    return width;
  }

  // Return the height of the domain block, without the domain gutter
  getHeight(d, outer = false) {
    const { options } = this.calendar.options;
    const rowsCount = this.calendar.domainSkeleton.at(options.subDomain).row(d);

    let height = (options.cellSize + options.cellPadding) * rowsCount;

    if (outer) {
      height +=
        options.domainGutter +
        options.domainVerticalLabelHeight +
        options.domainMargin[0] +
        options.domainMargin[2];
    }
    return height;
  }
}
