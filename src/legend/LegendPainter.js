// eslint-disable-next-line no-unused-vars
import { select, selectAll } from 'd3-selection';
// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition';

import { formatStringWithObject } from '../function';
import {
  TOP, RIGHT, BOTTOM, LEFT,
} from '../constant';

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
    const { legendVerticalPosition, legendMargin } =
      this.calendar.options.options;
    let pos = legendMargin[TOP];

    if (legendVerticalPosition === 'bottom') {
      pos += this.calendar.calendarPainter.domainPainter.dimensions.height;
    }
    return pos;
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

  destroy() {
    if (!this.shown) {
      return false;
    }

    this.shown = false;
    this.calendar.calendarPainter.root.select(DEFAULT_CLASSNAME).remove();

    return true;
  }

  paint() {
    const { options } = this.calendar.options;
    const width =
      this.calendar.calendarPainter.getWidth() -
      options.domainGutter -
      options.cellPadding;

    this.shown = true;

    this.#computeDimensions();

    let legendNode =
      this.calendar.calendarPainter.root.select(DEFAULT_CLASSNAME);
    if (legendNode.empty()) {
      legendNode = this.calendar.calendarPainter.root
        .append('svg')
        .attr('class', DEFAULT_CLASSNAME.slice(1));
    }

    legendNode
      .attr('x', this.#getX(width))
      .attr('y', this.#getY())
      .attr('width', this.getWidth())
      .attr('height', this.getHeight())
      .transition()
      .duration(options.animationDuration)
      .attr('x', this.#getX(width))
      .attr('y', this.#getY())
      .attr('width', this.getWidth())
      .attr('height', this.getHeight());

    legendNode
      .select('g')
      .transition()
      .duration(options.animationDuration)
      .attr('transform', () => {
        if (options.legendOrientation === 'vertical') {
          return `rotate(90 ${options.legendCellSize / 2} ${
            options.legendCellSize / 2
          })`;
        }
        return null;
      });

    this.#populate(legendNode);

    return true;
  }

  #populate(legendNode) {
    const { options } = this.calendar.options;

    const items = options.legend.slice(0);
    items.push(items[items.length - 1] + 1);

    const legendItemsNode = legendNode.append('g').selectAll().data(items);

    legendItemsNode
      .enter()
      .append('rect')
      .attr('width', options.legendCellSize)
      .attr('height', options.legendCellSize)
      .attr(
        'x',
        (d, i) => i * (options.legendCellSize + options.legendCellPadding),
      )
      .attr('class', (d) => this.calendar.colorizer.getClassName(d))
      .attr('fill', (d, i) => {
        if (this.calendar.colorizer.scale === null) {
          return this.calendar.colorizer.getCustomColor('base');
        }

        if (i === 0) {
          return this.calendar.colorizer.scale(d - 1);
        }
        return this.calendar.colorizer.scale(options.legend[i - 1]);
      })
      .append('title')
      .text((d, i) => this.#getLegendTitle(d, i, items));

    legendItemsNode
      .exit()
      .transition()
      .duration(options.animationDuration)
      .remove();

    legendItemsNode
      .transition()
      .attr('fill', (d, i) => {
        if (this.calendar.colorizer.scale === null) {
          return null;
        }

        if (i === 0) {
          return this.calendar.colorizer.scale(d - 1);
        }
        return this.calendar.colorizer.scale(options.legend[i - 1]);
      })
      .attr('class', (d) => this.calendar.colorizer.getClassName(d));
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
