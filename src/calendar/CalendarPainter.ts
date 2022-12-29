import { select } from 'd3-selection';

import DomainPainter from '../domain/DomainPainter';
import DomainLabelPainter from '../domain/DomainLabelPainter';
import DomainSubLabelPainter from '../domain/DomainSubLabelPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';

import type CalHeatmap from '../CalHeatmap';
import { ScrollDirection } from '../constant';

export default class CalendarPainter {
  calendar: CalHeatmap;

  dimensions: {
    width: number;
    height: number;
  };

  root: any;

  domainPainter: DomainPainter;

  domainLabelPainter: DomainLabelPainter;

  subDomainPainter: SubDomainPainter;

  domainSubLabelPainter: DomainSubLabelPainter;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.dimensions = {
      width: 0,
      height: 0,
    };
    this.root = null;
    this.domainPainter = new DomainPainter(calendar);
    this.subDomainPainter = new SubDomainPainter(calendar);
    this.domainLabelPainter = new DomainLabelPainter(calendar);
    this.domainSubLabelPainter = new DomainSubLabelPainter(
      calendar,
    );
  }

  setup(): boolean {
    const { itemSelector } = this.calendar.options.options;

    if (!this.root) {
      this.root = select(itemSelector)
        .append('svg')
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
    this.domainSubLabelPainter.paint(this.root);
    this.root
      .select('.graph')
      .transition()
      .duration(this.calendar.options.options.animationDuration)
      .attr('x', this.domainSubLabelPainter.dimensions.width);

    let transitions = this.domainPainter.paint(navigationDir, this.root);
    this.subDomainPainter.paint(this.domainPainter.root);
    this.domainLabelPainter.paint(this.domainPainter.root);

    transitions = transitions.concat(
      this.calendar.pluginManager.paintAll(),
    );

    this.#resize();

    return Promise.allSettled(transitions);
  }

  #getHeight(): number {
    const { options } = this.calendar.options;

    return (
      this.domainPainter.dimensions.height -
      (!options.verticalOrientation ? 0 : options.domain.gutter)
    );
  }

  #getWidth(): number {
    const { options } = this.calendar.options;

    const domainsWidth =
      this.domainPainter.dimensions.width -
      (options.verticalOrientation ? 0 : options.domain.gutter);

    return domainsWidth + this.domainSubLabelPainter.dimensions.width;
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

    result = result.concat(
      this.calendar.pluginManager.destroyAll(),
    );

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
