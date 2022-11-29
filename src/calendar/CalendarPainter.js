import { select } from 'd3-selection';

import {
  TOP, RIGHT, BOTTOM, LEFT,
} from '../constant';

import DomainPainter from '../domain/DomainPainter';
import DomainLabelPainter from '../domain/DomainLabelPainter';
import DomainSecondaryLabelPainter from '../domain/DomainSecondaryLabelPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';
import Tooltip from '../tooltip/Tooltip';
import LegendPainter from '../legend/LegendPainter';

const EVENT_NAMESPACE = 'cal-heatmap';

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

    if (!this.root) {
      this.root = select(itemSelector)
        .append('svg')
        .attr('class', 'cal-heatmap-container');
      this.root.attr('x', 0).attr('y', 0).append('svg').attr('class', 'graph');
      this.tooltip.init();
    }

    this.#attachNavigationEvents();

    return true;
  }

  #attachNavigationEvents() {
    const { nextSelector, previousSelector } = this.calendar.options.options;

    if (nextSelector) {
      select(nextSelector).on(`click.${EVENT_NAMESPACE}`, (ev) => {
        ev.preventDefault();
        return this.calendar.next(1);
      });
    }

    if (previousSelector) {
      select(previousSelector).on(`click.${EVENT_NAMESPACE}`, (ev) => {
        ev.preventDefault();
        return this.calendar.previous(1);
      });
    }
  }

  #removeNavigationEvents() {
    const { nextSelector, previousSelector } = this.calendar.options.options;

    if (nextSelector !== false) {
      select(nextSelector).on(`.${EVENT_NAMESPACE}`, null);
    }

    if (previousSelector !== false) {
      select(previousSelector).on(`.${EVENT_NAMESPACE}`, null);
    }
  }

  paint(navigationDir = false) {
    this.domainSecondaryLabelPainter.paint(this.root);
    this.root
      .select('.graph')
      .transition()
      .duration(this.calendar.options.options.animationDuration)
      .attr('x', this.domainSecondaryLabelPainter.dimensions.width);

    const domainSvg = this.domainPainter.paint(navigationDir, this.root);
    this.subDomainPainter.paint(domainSvg);
    this.domainLabelPainter.paint(domainSvg);

    this.legendPainter.paint();

    this.resize();

    return true;
  }

  getHeight() {
    const { options } = this.calendar.options;

    const legendHeight = options.displayLegend ?
      this.legendPainter.getHeight() +
        options.legendMargin[TOP] +
        options.legendMargin[BOTTOM] :
      0;

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

    const legendWidth = options.displayLegend ?
      this.legendPainter.getWidth() +
        options.legendMargin[RIGHT] +
        options.legendMargin[LEFT] :
      0;
    const domainsWidth =
      this.domainPainter.dimensions.width - options.domainGutter;

    if (
      options.legendVerticalPosition === 'middle' ||
      options.legendVerticalPosition === 'center'
    ) {
      return domainsWidth + legendWidth;
    }
    return (
      Math.max(domainsWidth, legendWidth) +
      this.domainSecondaryLabelPainter.dimensions.width
    );
  }

  resize() {
    const { options } = this.calendar.options;

    this.root
      .transition()
      .duration(options.animationDuration)
      .attr('width', this.getWidth())
      .attr('height', this.getHeight());

    this.calendar.eventEmitter.emit('onResize', [
      this.getHeight(),
      this.getWidth(),
    ]);
  }

  destroy(callback) {
    this.#removeNavigationEvents();

    this.root
      .transition()
      .duration(this.calendar.options.options.animationDuration)
      .attr('width', 0)
      .attr('height', 0)
      .remove()
      .call(() => {
        if (typeof callback === 'function') {
          callback();
        }
      });
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
