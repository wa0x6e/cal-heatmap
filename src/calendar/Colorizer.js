import { interpolateHcl } from 'd3-interpolate';
import { scaleLinear, scaleThreshold } from 'd3-scale';

export default class Colorizer {
  constructor(calendar) {
    this.calendar = calendar;
    this.scale = null;
  }

  build() {
    const { colors } = this.calendar.options.options.legend;

    if (colors === null) {
      this.scale = null;
      return false;
    }

    let colorRange = [];

    if (Array.isArray(colors)) {
      colorRange = colors;
    } else if (colors.hasOwnProperty('min') && colors.hasOwnProperty('max')) {
      colorRange = [colors.min, colors.max];
    } else {
      return false;
    }

    const legend = this.calendar.options.options.legend.steps.slice(0);

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

    const colorsRange = legend.map((element) => colorScale(element));
    this.scale = scaleThreshold()
      .domain(this.calendar.options.options.legend.steps)
      .range(colorsRange);

    return true;
  }

  getCustomColor(colorKey) {
    const { colors } = this.calendar.options.options.legend;

    if (this.scale !== null && colors?.hasOwnProperty(colorKey)) {
      return colors[colorKey];
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

    const { steps } = this.calendar.options.options.legend;
    let index = [steps.length + 1];

    for (let i = 0, total = steps.length - 1; i <= total; i += 1) {
      if (steps[0] > 0 && n < 0) {
        index = ['1', 'i'];
        break;
      }

      if (n <= steps[i]) {
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
