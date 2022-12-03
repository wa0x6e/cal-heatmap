import { select } from 'd3-selection';
import { legend } from '@observablehq/plot';

const DEFAULT_CLASSNAME = '.graph-legend';

export default class LegendPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.root = null;
  }

  paint() {
    const { show, itemSelector, scaleOptions } =
      this.calendar.options.options.legend;
    if (!show || (itemSelector && select(itemSelector).empty())) {
      return false;
    }

    this.shown = true;

    if (itemSelector) {
      this.root = select(itemSelector);
    } else {
      this.root = select(this.calendar.options.options.itemSelector);
    }

    if (this.root.select(DEFAULT_CLASSNAME).empty()) {
      this.root = this.root
        .append('svg')
        .attr('class', DEFAULT_CLASSNAME.slice(1));
    } else {
      this.root = this.root.select(DEFAULT_CLASSNAME);
    }

    const node = legend(scaleOptions);

    this.root.selectAll('*').remove();
    this.root.append(() => node);

    return true;
  }

  destroy() {
    if (this.root === null) {
      return false;
    }

    this.root.remove();
    this.root = null;

    return true;
  }
}
