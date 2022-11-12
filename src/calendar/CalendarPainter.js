import { select } from 'd3-selection';
import { formatDate } from '../function';
import DomainPainter from '../domain/DomainPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';
import LabelPainter from '../label/LabelPainter';
import Legend from '../legend/Legend';

export default class CalendarPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.graphDimensions = {
      width: 0,
      height: 0,
    };
    this.root = null;
    this.tooltip = null;
    this.domainPainter = new DomainPainter(calendar);
    this.subDomainPainter = new SubDomainPainter(calendar);
    this.labelPainter = new LabelPainter(calendar);
    this.legend = new Legend(calendar);

    // Record the address of the last inserted domain when browsing
    this.lastInsertedSvg = null;
  }

  setup() {
    const { itemSelector } = this.calendar.options.options;

    this.root = select(itemSelector)
      .append('svg')
      .attr('class', 'cal-heatmap-container');

    this.tooltip = select(itemSelector)
      .attr('style', () => {
        const current = select(itemSelector).attr('style');
        return `${current !== null ? current : ''}position:relative;`;
      })
      .append('div')
      .attr('class', 'ch-tooltip');

    this.root.attr('x', 0).attr('y', 0).append('svg').attr('class', 'graph');

    this.attachNavigationEvents();

    return true;
  }

  attachNavigationEvents() {
    const { options } = this.calendar;

    if (options.nextSelector !== false) {
      select(options.nextSelector).on(`click.${options.itemNamespace}`, ev => {
        ev.preventDefault();
        return this.calendar.next(1);
      });
    }

    if (options.previousSelector !== false) {
      select(options.previousSelector).on(
        `click.${options.itemNamespace}`,
        ev => {
          ev.preventDefault();
          return this.calendar.previous(1);
        }
      );
    }
  }

  paint(navigationDir = false) {
    const { options } = this.calendar;

    const domainSvg = this.domainPainter.paint(navigationDir, this.root);
    this.subDomainPainter.paint(domainSvg);
    this.labelPainter.paint(domainSvg);
    this.legend.paint(this.root);

    this.resize();

    return true;

    // =========================================================================//
    // DAY LABEl                              //
    // =========================================================================//
    if (
      options.dayLabel &&
      options.domain === 'month' &&
      options.subDomain === 'day'
    ) {
      // Create a list of all day names starting with Sunday or Monday, depending on configuration
      const daysOfTheWeek = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      if (options.weekStartOnMonday) {
        daysOfTheWeek.push('sunday');
      } else {
        daysOfTheWeek.shif('sunday');
      }
      // Get the first character of the day name
      const daysOfTheWeekAbbr = daysOfTheWeek.map(day =>
        formatDate(time[day](new Date()), '%a').charAt(0)
      );
      // Append "day-name" group to SVG
      const dayLabelSvgGroup = this.root
        .append('svg')
        .attr('class', 'day-name')
        .attr('x', 0)
        .attr('y', 0);

      const dayLabelSvg = dayLabelSvgGroup
        .selectAll('g')
        .data(daysOfTheWeekAbbr)
        .enter()
        .append('g');
      // Styling "day-name-rect" elements
      dayLabelSvg
        .append('rect')
        .attr('class', 'day-name-rect')
        .attr('width', options.cellSize)
        .attr('height', options.cellSize)
        .attr('x', 0)
        .attr(
          'y',
          (data, index) =>
            index * options.cellSize + index * options.cellPadding
        );
      // Adding day names to SVG
      dayLabelSvg
        .append('text')
        .attr('class', 'day-name-text')
        .attr('dominant-baseline', 'central')
        .attr('x', 0)
        .attr(
          'y',
          (data, index) =>
            index * options.cellSize +
            index * options.cellPadding +
            options.cellSize / 2
        )
        .text(data => data);
    }
  }

  getHeight() {
    const { options } = this.calendar.options;

    const legendHeight = options.displayLegend
      ? this.legend.getHeight() +
        options.legendMargin[0] +
        options.legendMargin[2]
      : 0;

    if (
      options.legendVerticalPosition === 'middle' ||
      options.legendVerticalPosition === 'center'
    ) {
      return Math.max(this.graphDimensions.height, legendHeight);
    }
    return this.graphDimensions.height + legendHeight;
  }

  getWidth() {
    const { options } = this.calendar.options;

    const legendWidth = options.displayLegend
      ? this.legend.getWidth() +
        options.legendMargin[1] +
        options.legendMargin[3]
      : 0;

    if (
      options.legendVerticalPosition === 'middle' ||
      options.legendVerticalPosition === 'center'
    ) {
      return this.graphDimensions.width + legendWidth;
    }
    return Math.max(this.graphDimensions.width, legendWidth);
  }

  resize() {
    const { options } = this.calendar.options;

    this.root
      .transition()
      .duration(options.animationDuration)
      .attr('width', this.getWidth())
      .attr('height', this.getHeight());

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
      .duration(this.calendar.options.animationDuration)
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

  highlight(args) {
    if (
      (this.calendar.options.highlight = expandDateSetting(args)).length > 0
    ) {
      this.fill();
      return true;
    }
    return false;
  }

  removeLegend() {
    return this.legend.destroy() && this.resize();
  }

  showLegend() {
    return this.legend.paint() && this.resize();
  }
}
