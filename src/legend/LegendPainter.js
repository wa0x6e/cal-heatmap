import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';

import { formatStringWithObject } from '../function';
import { TOP, RIGHT, BOTTOM, LEFT } from '../constant';

const DEFAULT_CLASSNAME = '.graph-legend';

export default class LegendPainter {
  constructor(calendar) {
    this.calendar = calendar;

    this.dimensions = {
      width: 0,
      height: 0,
    };
    this.shown = calendar.options.options.displayLegend;
  }

  #legendCellLayout(selection) {
    const { legendCellSize, legendCellPadding } = this.calendar.options.options;
    selection
      .attr('width', legendCellSize)
      .attr('height', legendCellSize)
      .attr('x', (d, i) => i * (legendCellSize + legendCellPadding));
  }

  #getX(width) {
    const { options } = this.calendar.options;

    switch (options.legendHorizontalPosition) {
      case 'right':
        if (
          options.legendVerticalPosition === 'center' ||
          options.legendVerticalPosition === 'middle'
        ) {
          return width + options.legendMargin[LEFT];
        }
        return width - this.getWidth() - options.legendMargin[RIGHT];
      case 'middle':
      case 'center':
        return Math.round(width / 2 - this.getWidth() / 2);
      default:
        return options.legendMargin[BOTTOM];
    }
  }

  #getY() {
    const { options } = this.calendar.options;

    if (options.legendVerticalPosition === 'bottom') {
      return (
        this.calendar.calendarPainter.domainPainter.dimensions.height +
        options.legendMargin[TOP]
      );
    }
    return options.legendMargin[TOP];
  }

  #computeDimensions() {
    const { options } = this.calendar.options;

    this.dimensions = {
      width:
        options.legendCellSize * (options.legend.length + 1) +
        options.legendCellPadding * options.legend.length,
      height: options.legendCellSize,
    };
  }

  destroy(root) {
    if (!this.shown) {
      return false;
    }

    this.shown = false;
    root.select(DEFAULT_CLASSNAME).remove();

    return true;
  }

  paint(root) {
    const { calendar } = this;
    const { options } = calendar.options;
    const width =
      calendar.calendarPainter.getWidth() -
      options.domainGutter -
      options.cellPadding;
    let legend = calendar.calendarPainter.root;
    let legendItem;
    this.shown = true;

    this.#computeDimensions();

    const legendItems = options.legend.slice(0);
    legendItems.push(legendItems[legendItems.length - 1] + 1);

    const legendElement = root.select(DEFAULT_CLASSNAME);
    if (!legendElement.empty()) {
      legend = legendElement;
      legendItem = legend.select('g').selectAll('rect').data(legendItems);
    } else {
      // Creating the new legend DOM if it doesn't already exist
      legend =
        options.legendVerticalPosition === 'top'
          ? legend.insert('svg', '.graph')
          : legend.append('svg');

      legend.attr('x', this.#getX(width)).attr('y', this.#getY());

      legendItem = legend
        .attr('class', 'graph-legend')
        .attr('height', this.getHeight())
        .attr('width', this.getWidth())
        .append('g')
        .selectAll()
        .data(legendItems);
    }

    legendItem
      .enter()
      .append('rect')
      .call((s) => this.#legendCellLayout(s))
      .attr('class', (d) => this.calendar.colorizer.getClassName(d))
      .call((selection) => {
        selection.attr('fill', this.calendar.colorizer.getCustomColor('base'));
      })
      .append('title');

    legendItem.exit().transition().duration(options.animationDuration).remove();

    legendItem
      .transition()
      .delay((d, i) => (options.animationDuration * i) / 10)
      .call((s) => this.#legendCellLayout(s))
      .call((element) => {
        element.attr('fill', (d, i) => {
          if (this.calendar.colorizer.scale === null) {
            return '';
          }

          if (i === 0) {
            return this.calendar.colorizer.scale(d - 1);
          }
          return this.calendar.colorizer.scale(options.legend[i - 1]);
        });

        element.attr('class', (d) => this.calendar.colorizer.getClassName(d));
      });

    legendItem
      .select('title')
      .text((d, i) => this.#getLegendTitle(d, i, legendItems));

    legend
      .transition()
      .duration(options.animationDuration)
      .attr('x', this.#getX(width))
      .attr('y', this.#getY())
      .attr('width', this.getWidth())
      .attr('height', this.getHeight());

    legend
      .select('g')
      .transition()
      .duration(options.animationDuration)
      .attr('transform', () => {
        if (options.legendOrientation === 'vertical') {
          return `rotate(90 ${options.legendCellSize / 2} ${
            options.legendCellSize / 2
          })`;
        }
        return '';
      });

    return true;
  }

  #getLegendTitle(d, i, legendItems) {
    const { options } = this.calendar.options;

    if (i === 0) {
      return formatStringWithObject(options.legendTitleFormat.lower, {
        min: options.legend[i],
        name: options.itemName[1],
      });
    }
    if (i === legendItems.length - 1) {
      return formatStringWithObject(options.legendTitleFormat.upper, {
        max: options.legend[i - 1],
        name: options.itemName[1],
      });
    }
    return formatStringWithObject(options.legendTitleFormat.inner, {
      down: options.legend[i - 1],
      up: options.legend[i],
      name: options.itemName[1],
    });
  }

  /**
   * Return the dimension of the legend
   *
   * Takes into account rotation
   *
   * @param  string axis Width or height
   * @return int height or width in pixels
   */
  #getDimensions(axis) {
    const isHorizontal =
      this.calendar.options.options.legendOrientation === 'horizontal';

    switch (axis) {
      case 'height':
        return this.dimensions[isHorizontal ? 'height' : 'width'];
      case 'width':
        return this.dimensions[isHorizontal ? 'width' : 'height'];
      default:
        throw new Error('Invalid axis');
    }
  }

  getWidth() {
    return this.#getDimensions('width');
  }

  getHeight() {
    return this.#getDimensions('height');
  }
}
