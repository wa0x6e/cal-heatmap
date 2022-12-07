import { select } from 'd3-selection';
import { legend } from '@observablehq/plot';

const DEFAULT_CLASSNAME = '.graph-legend';

export default class LegendPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.root = null;
  }

  paint() {
    const legendOptions = this.calendar.options.options.legend;
    const { show, itemSelector } = legendOptions;

    if (!show || (itemSelector && select(itemSelector).empty())) {
      this.#destroy();
      return false;
    }

    this.shown = true;

    this.root = select(
      itemSelector || this.calendar.options.options.itemSelector,
    );

    if (this.root.select(DEFAULT_CLASSNAME).empty()) {
      this.root = this.root
        .append('svg')
        .attr('class', DEFAULT_CLASSNAME.slice(1));
    } else {
      this.root = this.root.select(DEFAULT_CLASSNAME);
    }

    const node = legend(legendOptions);

    this.root.selectAll('*').remove();
    this.root.append(() => node);

    return true;
  }

  #destroy() {
    if (this.root === null) {
      return;
    }

    this.root.remove();
    this.root = null;
  }
}
