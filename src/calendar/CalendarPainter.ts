import { select } from 'd3-selection';

import DomainsContainerPainter from '../domain/DomainsContainerPainter';
import PluginPainter from '../plugins/PluginPainter';

import type CalHeatmap from '../CalHeatmap';
import { ScrollDirection } from '../constant';
import type { Dimensions } from '../index';

export const DEFAULT_SELECTOR = '.ch-container';

export default class CalendarPainter {
  calendar: CalHeatmap;

  dimensions: Dimensions;

  root: any;

  domainsContainerPainter: DomainsContainerPainter;

  pluginPainter: PluginPainter;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.dimensions = {
      width: 0,
      height: 0,
    };
    this.root = null;
    this.domainsContainerPainter = new DomainsContainerPainter(calendar);
    this.pluginPainter = new PluginPainter(calendar);
  }

  setup(): boolean {
    const { itemSelector, theme } = this.calendar.options.options;

    if (!this.root) {
      this.root = select(itemSelector)
        .append('svg')
        .attr('data-theme', theme)
        .attr('class', DEFAULT_SELECTOR.slice(1));
      this.domainsContainerPainter.setup();
    }

    this.calendar.pluginManager.setupAll();

    return true;
  }

  paint(navigationDir: ScrollDirection = ScrollDirection.SCROLL_NONE) {
    const transitions = this.domainsContainerPainter
      .paint(navigationDir)
      .concat(this.pluginPainter.paint())
      .concat(this.domainsContainerPainter.updatePosition());

    this.#resize();

    return Promise.allSettled(transitions);
  }

  #getHeight(): Dimensions['height'] {
    return (
      this.domainsContainerPainter.height() + this.pluginPainter.insideHeight()
    );
  }

  #getWidth(): Dimensions['width'] {
    return (
      this.domainsContainerPainter.width() + this.pluginPainter.insideWidth()
    );
  }

  #resize(): void {
    const { options } = this.calendar.options;

    const newWidth = this.#getWidth();
    const newHeight = this.#getHeight();

    this.root
      .transition()
      .duration(options.animationDuration)
      .attr('width', newWidth)
      .attr('height', newHeight);

    if (
      newWidth !== this.dimensions.width ||
      newHeight !== this.dimensions.height
    ) {
      this.calendar.eventEmitter.emit(
        'resize',
        newWidth,
        newHeight,
        this.dimensions.width,
        this.dimensions.height,
      );
    }

    this.dimensions = {
      width: newWidth,
      height: newHeight,
    };
  }

  destroy(): Promise<unknown> {
    const result: Promise<unknown>[] = this.calendar.pluginManager
      .destroyAll()
      .concat(this.domainsContainerPainter.destroy());

    if (!this.root) {
      return Promise.allSettled(result);
    }

    result.push(
      this.root
        .transition()
        .duration(this.calendar.options.options.animationDuration)
        .attr('width', 0)
        .attr('height', 0)
        .remove()
        .end(),
    );

    return Promise.allSettled(result);
  }
}
