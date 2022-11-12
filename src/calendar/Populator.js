import { selectAll } from 'd3-selection';

import { getSubDomainTitle, formatSubDomainText } from '../subDomain';

export default class Populator {
  constructor(calendar) {
    this.calendar = calendar;
  }

  /**
   * Colorize the cell via a style attribute if enabled
   */
  addStyle(element) {
    if (this.calendar.calendarPainter.legend.legendColor.scale === null) {
      return false;
    }

    element.attr('fill', d => {
      if (
        d.v === null &&
        options.hasOwnProperty('considerMissingDataAsZero') &&
        !options.considerMissingDataAsZero
      ) {
        if (options.legendColors.hasOwnProperty('base')) {
          return options.legendColors.base;
        }
      }

      if (
        options.legendColors !== null &&
        options.legendColors.hasOwnProperty('empty') &&
        (d.v === 0 ||
          (d.v === null &&
            options.hasOwnProperty('considerMissingDataAsZero') &&
            options.considerMissingDataAsZero))
      ) {
        return options.legendColors.empty;
      }

      if (
        d.v < 0 &&
        options.legend[0] > 0 &&
        options.legendColors !== null &&
        options.legendColors.hasOwnProperty('overflow')
      ) {
        return options.legendColors.overflow;
      }

      return this.calendar.calendarPainter.legend.legendColor.scale(
        Math.min(d.v, options.legend[options.legend.length - 1])
      );
    });
  }

  getClass(d) {
    const htmlClass = getHighlightClassName(d.t, parent.options)
      .trim()
      .split(' ');
    const pastDate = dateIsLessThan(d.t, new Date(), parent.options);

    if (
      this.calendar.calendarPainter.legend.legendColor.scale === null ||
      (d.v === null &&
        options.hasOwnProperty('considerMissingDataAsZero') &&
        !options.considerMissingDataAsZero &&
        !options.legendColors.hasOwnProperty('base'))
    ) {
      htmlClass.push('graph-rect');
    }

    if (d.v !== null) {
      htmlClass.push(
        parent.Legend.getClass(
          d.v,
          this.calendar.calendarPainter.legend.legendColor.scale === null
        )
      );
    } else if (options.considerMissingDataAsZero && pastDate) {
      htmlClass.push(
        parent.Legend.getClass(
          0,
          this.calendar.calendarPainter.legend.legendColor.scale === null
        )
      );
    }

    if (options.onClick !== null) {
      htmlClass.push('hover_cursor');
    }

    return htmlClass.join(' ');
  }

  populate() {
    const parent = this;
    const { options } = parent;
    const svg = this.calendar.calendarPainter.root.selectAll('.graph-domain');

    const rect = svg
      .selectAll('svg')
      .selectAll('g')
      .data(d => parent.domainCollection.get(d) || []);

    rect
      .transition()
      .duration(options.animationDuration)
      .select('rect')
      .attr('class', d => this.getClass(d))
      .call(this.addStyle);

    rect
      .transition()
      .duration(options.animationDuration)
      .select('title')
      .text(d =>
        getSubDomainTitle(
          d,
          options,
          parent.domainSkeleton.at(options.subDomain).format.connector
        )
      );

    /**
     * Change the subDomainText class if necessary
     * Also change the text, e.g when text is representing the value
     * instead of the date
     */
    rect
      .transition()
      .duration(options.animationDuration)
      .select('text')
      .attr(
        'class',
        d => `subdomain-text${getHighlightClassName(d.t, parent.options)}`
      )
      .call(() => formatSubDomainText(options.subDomainTextFormat));
  }
}
