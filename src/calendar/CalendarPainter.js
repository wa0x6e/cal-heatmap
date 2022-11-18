import { select } from 'd3-selection';

import { TOP, RIGHT, BOTTOM, LEFT } from '../constant';

import DomainPainter from '../domain/DomainPainter';
import DomainLabelPainter from '../domain/DomainLabelPainter';
import DomainSecondaryLabelPainter from '../domain/DomainSecondaryLabelPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';
import Tooltip from '../tooltip/Tooltip';
import LegendPainter from '../legend/LegendPainter';

export default class CalendarPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.graphDimensions = {
      width: 0,
      height: 0,
    };
    this.root = null;
    this.tooltip = new Tooltip(calendar);
    this.domainPainter = new DomainPainter(calendar);
    this.subDomainPainter = new SubDomainPainter(calendar);
    this.domainLabelPainter = new DomainLabelPainter(calendar);
    this.domainSecondaryLabelPainter = new DomainSecondaryLabelPainter(
      calendar,
    );
    this.legendPainter = new LegendPainter(calendar);

    // Record the address of the last inserted domain when browsing
    this.lastInsertedSvg = null;
  }

  setup() {
    const { itemSelector } = this.calendar.options.options;

    this.root = select(itemSelector)
      .append('svg')
      .attr('class', 'cal-heatmap-container');

    this.tooltip.init(this.root);

    this.root.attr('x', 0).attr('y', 0).append('svg').attr('class', 'graph');

    this.#attachNavigationEvents();

    return true;
  }

  #attachNavigationEvents() {
    const { options } = this.calendar;

    if (options.nextSelector !== false) {
      select(options.nextSelector).on(
        `click.${options.itemNamespace}`,
        (ev) => {
          ev.preventDefault();
          return this.calendar.next(1);
        },
      );
    }

    if (options.previousSelector !== false) {
      select(options.previousSelector).on(
        `click.${options.itemNamespace}`,
        (ev) => {
          ev.preventDefault();
          return this.calendar.previous(1);
        },
      );
    }
  }

  paint(navigationDir = false) {
    const domainSvg = this.domainPainter.paint(navigationDir, this.root);
    this.subDomainPainter.paint(domainSvg);
    this.domainLabelPainter.paint(domainSvg);
    this.domainSecondaryLabelPainter.paint(domainSvg);
    this.legendPainter.paint();

    this.resize();

    return true;
  }

  getHeight() {
    const { options } = this.calendar.options;

    const legendHeight = options.displayLegend
      ? this.legendPainter.getHeight() +
        options.legendMargin[TOP] +
        options.legendMargin[BOTTOM]
      : 0;

    if (
      options.legendVerticalPosition === 'middle' ||
      options.legendVerticalPosition === 'center'
    ) {
      return Math.max(this.domainPainter.dimensions.height, legendHeight);
    }
    return this.domainPainter.dimensions.height + legendHeight;
  }

  getWidth() {
    const { options } = this.calendar.options;

    const legendWidth = options.displayLegend
      ? this.legendPainter.getWidth() +
        options.legendMargin[RIGHT] +
        options.legendMargin[LEFT]
      : 0;
    const domainsWidth =
      this.domainPainter.dimensions.width -
      options.domainMargin[RIGHT] -
      options.domainGutter * 2;

    if (
      options.legendVerticalPosition === 'middle' ||
      options.legendVerticalPosition === 'center'
    ) {
      return domainsWidth + legendWidth;
    }
    return Math.max(domainsWidth, legendWidth);
  }

  resize() {
    const { options } = this.calendar.options;

    this.root
      .transition()
      .duration(options.animationDuration)
      .attr('width', this.getWidth())
      .attr('height', this.getHeight());

    this.calendar.onResize(this.getHeight(), this.getWidth());

    // this.root
    //   .select('.graph')
    //   .transition()
    //   .duration(options.animationDuration)
    //   .attr('y', () => {
    //     if (options.legendVerticalPosition === 'top') {
    //       return legendHeight;
    //     }
    //     return 0;
    //   })
    //   .attr('x', () => {
    //     let xPosition = 0;
    //     if (
    //       options.dayLabel &&
    //       options.domain === 'month' &&
    //       options.subDomain === 'day'
    //     ) {
    //       xPosition = options.cellSize + options.cellPadding;
    //     }
    //     if (
    //       (options.legendVerticalPosition === 'middle' ||
    //         options.legendVerticalPosition === 'center') &&
    //       options.legendHorizontalPosition === 'left'
    //     ) {
    //       return legendWidth + xPosition;
    //     }
    //     return xPosition;
    //   });
  }

  destroy(callback) {
    this.root
      .transition()
      .duration(this.calendar.options.options.animationDuration)
      .attr('width', 0)
      .attr('height', 0)
      .remove()
      .each(() => {
        if (typeof callback === 'function') {
          callback();
        } else if (typeof callback !== 'undefined') {
          console.log('Provided callback for destroy() is not a function.');
        }
      });

    callback();
  }

  /**
   * Highlight a set of dates
   *
   * @param  {[type]} dates [description]
   * @return {[type]}       [description]
   */
  highlight() {
    this.subDomainPainter.paint();
  }

  removeLegend() {
    return this.legendPainter.destroy() && this.resize();
  }

  showLegend() {
    return this.legendPainter.paint() && this.resize();
  }
}
