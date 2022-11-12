import { interpolateHcl } from 'd3-interpolate';
import { scaleLinear, scaleThreshold } from 'd3-scale';

export default class LegendColor {
  constructor(calendar) {
    this.calendar = calendar;
  }

  build() {
    const { options } = this.calendar.options;

    if (options.legendColors === null) {
      this.scale = null;
      return false;
    }

    let colorRange = [];

    if (Array.isArray(options.legendColors)) {
      colorRange = options.legendColors;
    } else if (
      options.legendColors.hasOwnProperty('min') &&
      options.legendColors.hasOwnProperty('max')
    ) {
      colorRange = [options.legendColors.min, options.legendColors.max];
    } else {
      options.legendColors = null;
      return false;
    }

    const legend = options.legend.slice(0);

    if (legend[0] > 0) {
      legend.unshift(0);
    } else if (legend[0] <= 0) {
      // Let's guess the leftmost value, it we have to add one
      legend.unshift(
        legend[0] - (legend[legend.length - 1] - legend[0]) / legend.length
      );
    }

    const colorScale = scaleLinear()
      .range(colorRange)
      .interpolate(interpolateHcl)
      .domain([Math.min(...legend), Math.max(...legend)]);
    const legendColors = legend.map(element => colorScale(element));
    this.scale = scaleThreshold().domain(options.legend).range(legendColors);

    return true;
  }
}
