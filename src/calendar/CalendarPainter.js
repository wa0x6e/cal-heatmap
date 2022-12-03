import { select } from 'd3-selection';

import DomainPainter from '../domain/DomainPainter';
import DomainLabelPainter from '../domain/DomainLabelPainter';
import DomainSecondaryLabelPainter from '../domain/DomainSecondaryLabelPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';
import Tooltip from '../tooltip/Tooltip';
import LegendPainter from '../legend/LegendPainter';

export default class CalendarPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.dimensions = {
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

    return true;
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

    this.calendar.eventEmitter.emit('paint');
    return true;
  }

  getHeight() {
    return this.domainPainter.dimensions.height;
  }

  getWidth() {
    const { options } = this.calendar.options;

    const domainsWidth =
      this.domainPainter.dimensions.width - options.domainGutter;

    return domainsWidth + this.domainSecondaryLabelPainter.dimensions.width;
  }

  resize() {
    const { options } = this.calendar.options;
    const newWidth = this.getWidth();
    const newHeight = this.getHeight();

    this.root
      .transition()
      .duration(options.animationDuration)
      .attr('width', newWidth)
      .attr('height', newHeight);

    if (
      newWidth !== this.dimensions.width ||
      newHeight !== this.dimensions.height
    ) {
      this.calendar.eventEmitter.emit('resize', [
        newWidth,
        newHeight,
        this.dimensions.width,
        this.dimensions.height,
      ]);
    }

    this.dimensions = {
      width: newWidth,
      height: newHeight,
    };
  }

  destroy(callback) {
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
