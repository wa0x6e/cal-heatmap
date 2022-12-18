import { select } from 'd3-selection';
// @ts-ignore
import { legend } from '@observablehq/plot';

import type CalHeatmap from '../CalHeatmap';

const DEFAULT_CLASSNAME = '.graph-legend';

export default class LegendPainter {
  calendar: CalHeatmap;

  root: any;

  shown: boolean;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.root = null;
    this.shown = false;
  }

  paint(): boolean {
    const legendOptions = this.calendar.options.options.legend;
    const scaleOptions = this.calendar.options.options.scale;
    const { show, itemSelector } = legendOptions;

    if (!show || (itemSelector && select(itemSelector).empty())) {
      this.destroy();
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

    const node = legend({
      [scaleOptions.as]: scaleOptions,
      ...legendOptions,
    });

    this.root.selectAll('*').remove();
    this.root.append(() => node);

    return true;
  }

  destroy(): void {
    if (this.root === null) {
      return;
    }

    this.root.remove();
    this.root = null;
  }
}
