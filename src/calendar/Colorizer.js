import { interpolateHcl } from 'd3-interpolate';
import { scaleLinear, scaleThreshold } from 'd3-scale';

export default class Colorizer {
  constructor(calendar) {
    this.calendar = calendar;
    this.scale = null;
  }

  build() {
    const { legendColors } = this.calendar.options.options;

    if (legendColors === null) {
      this.scale = null;
      return false;
    }

    let colorRange = [];

    if (Array.isArray(legendColors)) {
      colorRange = legendColors;
    } else if (
      legendColors.hasOwnProperty('min') &&
      legendColors.hasOwnProperty('max')
    ) {
      colorRange = [legendColors.min, legendColors.max];
    } else {
      return false;
    }

    const legend = this.calendar.options.options.legend.slice(0);

    if (legend[0] > 0) {
      legend.unshift(0);
    } else if (legend[0] <= 0) {
      // Let's guess the leftmost value, it we have to add one
      legend.unshift(
        legend[0] - (legend[legend.length - 1] - legend[0]) / legend.length,
      );
    }

    const colorScale = scaleLinear()
      .range(colorRange)
      .interpolate(interpolateHcl)
      .domain([Math.min(...legend), Math.max(...legend)]);

    const colors = legend.map((element) => colorScale(element));
    this.scale = scaleThreshold()
      .domain(this.calendar.options.options.legend)
      .range(colors);

    return true;
  }

  getCustomColor(colorKey) {
    const { legendColors } = this.calendar.options.options;

    if (this.scale !== null && legendColors?.hasOwnProperty(colorKey)) {
      return legendColors[colorKey];
    }

    return null;
  }

  /**
   * Return the classname of the cell for the specified value
   *
   * @param integer n Value associated to a date
   * @return string Classname according to the legend
   */
  getClassName(n) {
    if (n === null || Number.isNaN(n)) {
      return '';
    }

    const { legend } = this.calendar.options.options;
    let index = [legend.length + 1];

    for (let i = 0, total = legend.length - 1; i <= total; i += 1) {
      if (legend[0] > 0 && n < 0) {
        index = ['1', 'i'];
        break;
      }

      if (n <= legend[i]) {
        index = [i + 1];
        break;
      }
    }

    if (n === 0) {
      index.push(0);
    }

    index.unshift('');
    return (
      index.join(' r') + (this.scale === null ? index.join(' q') : '')
    ).trim();
  }
}
