import { scaleThreshold } from 'd3-scale';

export default class Colorizer {
  constructor(calendar) {
    this.calendar = calendar;
    this.scale = null;
  }

  build() {
    const { steps, colors, scale } = this.calendar.options.options.legend;

    this.scale = scale || scaleThreshold(steps, colors);

    return true;
  }
}
