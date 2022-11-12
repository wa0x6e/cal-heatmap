import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';

import DomainPosition from '../DomainPosition';

import { NAVIGATE_LEFT } from '../constant';
import { getWeekNumber } from '../date';

export default class DomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.domainPosition = new DomainPosition();
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
        this.domainWidth(d, true);
      })
      .attr('height', d => this.domainHeight(d, true))
      .attr('x', d => {
        if (options.verticalOrientation) {
          this.calendar.calendarPainter.width = Math.max(
            this.calendar.calendarPainter.width,
            this.domainWidth(d, true)
          );
          return 0;
        }
        return this.domainPosition.getDomainPosition(
          enteringDomainDim,
          exitingDomainDim,
          navigationDir,
          d,
          this.calendar.calendarPainter.graphDimensions,
          'width',
          this.domainWidth(d, true)
        );
      })
      .attr('y', d => {
        if (options.verticalOrientation) {
          return this.domainPosition.getDomainPosition(
            enteringDomainDim,
            exitingDomainDim,
            navigationDir,
            d,
            this.calendar.calendarPainter.graphDimensions,
            'height',
            this.domainHeight(d, true)
          );
        }
        this.calendar.calendarPainter.graphDimensions.height = Math.max(
          this.calendar.calendarPainter.graphDimensions.height,
          this.domainHeight(d, true)
        );
        return 0;
      })
      .attr('class', d => this.getClassName(d));
    this.lastInsertedSvg = svg;

    svg
      .append('rect')
      .attr(
        'width',
        d =>
          this.domainWidth(d, true) - options.domainGutter - options.cellPadding
      )
      .attr(
        'height',
        d =>
          this.domainHeight(d, true) -
          options.domainGutter -
          options.cellPadding
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

    const tempWidth = this.calendar.calendarPainter.graphDimensions.width;
    const tempHeight = this.calendar.calendarPainter.graphDimensions.height;

    if (options.verticalOrientation) {
      this.calendar.calendarPainter.graphDimensions.height +=
        enteringDomainDim - exitingDomainDim;
    } else {
      this.calendar.calendarPainter.graphDimensions.width +=
        enteringDomainDim - exitingDomainDim;
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
          return Math.min(
            this.calendar.calendarPainter.graphDimensions.width,
            tempWidth
          );
        }

        return -this.domainWidth(d, true);
      })
      .attr('y', d => {
        if (options.verticalOrientation) {
          if (navigationDir === NAVIGATE_LEFT) {
            return Math.min(
              this.calendar.calendarPainter.graphDimensions.height,
              tempHeight
            );
          }

          return -this.domainHeight(d, true);
        }
        return 0;
      })
      .remove();

    return svg;
  }

  getClassName(d) {
    let classname = 'graph-domain';
    const date = new Date(d);
    switch (this.calendar.options.options.domain) {
      case 'hour':
        classname += ` h_${date.getHours()}`;

      case 'day':
        classname += ` d_${date.getDate()} dy_${date.getDay()}`;

      case 'week':
        classname += ` w_${getWeekNumber(date)}`;

      case 'month':
        classname += ` m_${date.getMonth() + 1}`;

      case 'year':
        classname += ` y_${date.getFullYear()}`;
    }
    return classname;
  }

  // Return the width of the domain block, without the domain gutter
  // @param int d Domain start timestamp
  domainWidth(d, outer = false) {
    const { options } = this.calendar.options;

    let width =
      options.cellSize *
        this.calendar.domainSkeleton.at(options.subDomain).column(d) +
      options.cellPadding *
        this.calendar.domainSkeleton.at(options.subDomain).column(d);

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
  domainHeight(d, outer = false) {
    const { options } = this.calendar.options;

    let height =
      options.cellSize *
        this.calendar.domainSkeleton.at(options.subDomain).row(d) +
      options.cellPadding *
        this.calendar.domainSkeleton.at(options.subDomain).row(d);

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
