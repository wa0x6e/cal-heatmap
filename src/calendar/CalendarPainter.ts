import { select } from 'd3-selection';

import DomainPainter from '../domain/DomainPainter';
import DomainLabelPainter from '../domain/DomainLabelPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';
import PluginPainter from '../plugins/PluginPainter';

import type CalHeatmap from '../CalHeatmap';
import { ScrollDirection } from '../constant';
import type { Dimensions } from '../index';

export default class CalendarPainter {
  calendar: CalHeatmap;

  dimensions: Dimensions;

  domainsDimensions: Dimensions;

  root: any;

  domainPainter: DomainPainter;

  domainLabelPainter: DomainLabelPainter;

  subDomainPainter: SubDomainPainter;

  pluginPainter: PluginPainter;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.dimensions = {
      width: 0,
      height: 0,
    };
    this.domainsDimensions = {
      width: 0,
      height: 0,
    };
    this.root = null;
    this.domainPainter = new DomainPainter(calendar);
    this.subDomainPainter = new SubDomainPainter(calendar);
    this.domainLabelPainter = new DomainLabelPainter(calendar);
    this.pluginPainter = new PluginPainter(calendar);
  }

  setup(): boolean {
    const { itemSelector, theme } = this.calendar.options.options;

    if (!this.root) {
      this.root = select(itemSelector)
        .append('svg')
        .attr('data-theme', theme)
        .attr('class', 'cal-heatmap-container');
      this.root
        .attr('x', 0)
        .attr('y', 0)
        .append('svg')
        .attr('class', 'graph')
        .attr('style', 'fill: transparent;');
    }

    this.calendar.pluginManager.setupAll();

    return true;
  }

  paint(navigationDir: ScrollDirection = ScrollDirection.SCROLL_NONE) {
    this.root.select('.graph').classed('transition', true);

    let transitions = this.domainPainter.paint(navigationDir, this.root);
    this.subDomainPainter.paint(this.domainPainter.root);
    this.domainLabelPainter.paint(this.domainPainter.root);

    this.#computeDomainsDimensions();

    transitions = transitions.concat(this.pluginPainter.paint());

    this.#resize();

    Promise.allSettled(transitions).then(() => {
      this.root.select('.graph').classed('transition', false);
    });

    return Promise.allSettled(transitions);
  }

  #getHeight(): number {
    return this.domainsDimensions.height + this.pluginPainter.insideHeight();
  }

  #getWidth(): number {
    return this.domainsDimensions.width + this.pluginPainter.insideWidth();
  }

  #computeDomainsDimensions() {
    const { options } = this.calendar.options;

    this.domainsDimensions = {
      width:
        this.domainPainter.dimensions.width -
        (options.verticalOrientation ? 0 : options.domain.gutter),
      height:
        this.domainPainter.dimensions.height -
        (!options.verticalOrientation ? 0 : options.domain.gutter),
    };
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
    let result: Promise<unknown>[] = [];

    result = result.concat(this.calendar.pluginManager.destroyAll());

    if (!this.root) {
      return Promise.allSettled(result);
    }

    result.push(
      this.root
        .classed('transition', true)
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
