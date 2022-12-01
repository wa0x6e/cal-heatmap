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
    this.shown = calendar.options.options.legend.show;
  }

  #getX(width) {
    const { horizontalPosition, verticalPosition, margin } =
      this.calendar.options.options.legend;

    switch (horizontalPosition) {
      case 'right':
        if (verticalPosition === 'center' || verticalPosition === 'middle') {
          return width + margin[LEFT];
        }
        return width - this.getWidth() - margin[RIGHT];
      case 'middle':
      case 'center':
        return Math.round(width / 2 - this.getWidth() / 2);
      default:
        return margin[BOTTOM];
    }
  }

  #getY() {
    const { margin, verticalPosition } = this.calendar.options.options.legend;
    let pos = margin[TOP];

    if (verticalPosition === 'bottom') {
      pos += this.calendar.calendarPainter.domainPainter.dimensions.height;
    }
    return pos;
  }

  #computeDimensions() {
    const { cellSize, cellPadding, steps } =
      this.calendar.options.options.legend;

    this.dimensions = {
      width: cellSize * (steps.length + 1) + cellPadding * steps.length,
      height: cellSize,
    };
  }

  destroy() {
    if (!this.shown) {
      return false;
    }

    this.shown = false;
    this.calendar.calendarPainter.root
      .select(DEFAULT_CLASSNAME)
      .transition()
      .duration(this.calendar.options.options.animationDuration)
      .attr('height', 0)
      .remove();

    return true;
  }

  paint() {
    const { options } = this.calendar.options;
    if (!options.legend.show) {
      return false;
    }

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
      .attr('height', this.getHeight())
      .attr('transform', () => {
        if (options.legend.verticalOrientation) {
          return `rotate(90 ${options.legend.cellSize / 2} ${
            options.legend.cellSize / 2
          })`;
        }
        return null;
      });

    this.#populate(legendNode);

    return true;
  }

  #populate(legendNode) {
    const { steps, cellSize, cellPadding } =
      this.calendar.options.options.legend;
    const { colorizer } = this.calendar;

    const items = steps.slice(0);
    items.push(items[items.length - 1] + 1);

    legendNode
      .selectAll('rect')
      .data(items, (d) => d)
      .join(
        (enter) => enter
          .append('rect')
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('x', (d, i) => i * (cellSize + cellPadding))
          .attr('class', (d) => colorizer.getClassName(d))
          .attr('fill', (d, i) => {
            if (colorizer.scale === null) {
              return colorizer.getCustomColor('base');
            }

            if (i === 0) {
              return colorizer.scale(d - 1);
            }
            return colorizer.scale(steps[i - 1]);
          })
          .append('title')
          .text((d, i) => this.#getLegendTitle(d, i, items)),
        (update) => update
          .attr('x', (d, i) => i * (cellSize + cellPadding))
          .attr('class', (d) => colorizer.getClassName(d))
          .attr('fill', (d, i) => {
            if (colorizer.scale === null) {
              return colorizer.getCustomColor('base');
            }

            if (i === 0) {
              return colorizer.scale(d - 1);
            }
            return colorizer.scale(steps[i - 1]);
          })
          .append('title')
          .text((d, i) => this.#getLegendTitle(d, i, items)),
      );
  }

  #getLegendTitle(d, i, legendItems) {
    const { options } = this.calendar.options;
    const { steps } = options.legend;

    if (i === 0) {
      return formatStringWithObject(options.legendTitleFormat.lower, {
        min: steps[i],
        name: options.itemName[1],
      });
    }
    if (i === legendItems.length - 1) {
      return formatStringWithObject(options.legendTitleFormat.upper, {
        max: steps[i - 1],
        name: options.itemName[1],
      });
    }
    return formatStringWithObject(options.legendTitleFormat.inner, {
      down: steps[i - 1],
      up: steps[i],
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
      !this.calendar.options.options.legend.verticalOrientation;

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
