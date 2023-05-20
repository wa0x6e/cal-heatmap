import { select, create } from 'd3-selection';
import { normalizedScale, applyScaleStyle } from '../scale';
import { DEFAULT_SELECTOR as MAIN_SELECTOR } from '../calendar/CalendarPainter';
import {
  // force line break from prettier
  DEFAULT_SELECTOR as SUBDOMAIN_SELECTOR,
} from '../subDomain/SubDomainPainter';

import type CalHeatmap from '../CalHeatmap';
import type { IPlugin, PluginOptions } from '../index';
import {
  OPTIONS_DEFAULT_SUBDOMAIN_WIDTH,
  OPTIONS_DEFAULT_SUBDOMAIN_HEIGHT,
  OPTIONS_DEFAULT_SUBDOMAIN_GUTTER,
  OPTIONS_DEFAULT_SUBDOMAIN_RADIUS,
} from '../constant';

interface LegendOptions extends PluginOptions {
  enabled: boolean;
  itemSelector: string | null;
  width: number;
  height: number;
  radius: number;
  gutter: number;
  includeBlank: boolean;
}

const DEFAULT_SELECTOR = '.ch-plugin-legend-lite';

const defaultOptions: LegendOptions = {
  enabled: true, // Whether to display the legend
  itemSelector: null,
  width: OPTIONS_DEFAULT_SUBDOMAIN_WIDTH,
  height: OPTIONS_DEFAULT_SUBDOMAIN_HEIGHT,
  gutter: OPTIONS_DEFAULT_SUBDOMAIN_GUTTER,
  radius: OPTIONS_DEFAULT_SUBDOMAIN_RADIUS,
  includeBlank: false,
};

export default class LegendLite implements IPlugin {
  name = 'LegendLite';

  calendar: CalHeatmap;

  root: any;

  shown: boolean;

  options: LegendOptions;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.root = null;
    this.shown = false;
    this.options = defaultOptions;
  }

  setup(pluginOptions?: Partial<LegendOptions>): void {
    this.options = { ...this.options, ...pluginOptions };
  }

  paint(): Promise<unknown> {
    const { enabled, itemSelector } = this.options;

    if (!enabled || (itemSelector && select(itemSelector).empty())) {
      return this.destroy();
    }

    this.shown = true;

    this.root = select(
      itemSelector || this.calendar.options.options.itemSelector,
    );

    if (this.root.select(DEFAULT_SELECTOR).empty()) {
      this.root = this.root
        .append('div')
        .attr('class', DEFAULT_SELECTOR.slice(1));
    } else {
      this.root = this.root.select(DEFAULT_SELECTOR);
    }

    const node = this.#buildLegend();

    this.root.selectAll('*').remove();
    this.root.append(() => node.node());

    return Promise.resolve();
  }

  destroy(): Promise<unknown> {
    if (this.root !== null) {
      this.root.remove();
      this.root = null;
    }

    return Promise.resolve();
  }

  #buildLegend() {
    const node = create('svg');
    const scale = normalizedScale(this.calendar.options.options.scale);
    const {
      width, height, gutter, includeBlank,
    } = this.options;

    const localRange = [...scale.range];
    if (includeBlank) {
      localRange.unshift(null);
    }

    node
      .attr('class', MAIN_SELECTOR.slice(1))
      .attr(
        'width',
        localRange.length * width + (localRange.length - 1) * gutter,
      )
      .attr('height', height);

    node
      .selectAll('rect')
      .data(localRange)
      .join(
        (enter: any) => enter.append('rect').call((sc: any) =>
        // eslint-disable-next-line implicit-arrow-linebreak
          this.#nodeAttrs(sc, scale)),
        (update: any) => update
          .selectAll('rect')
          .call((sc: any) => this.#nodeAttrs(sc, scale)),
      );

    return node;
  }

  #nodeAttrs(selection: any, scale: any) {
    const {
      width, height, radius, gutter,
    } = this.options;

    return selection
      .attr('width', width)
      .attr('height', height)
      .attr('class', `${SUBDOMAIN_SELECTOR.slice(1)}-bg`)
      .attr('rx', radius)
      .attr('ry', radius)
      .attr('x', (_d: any, i: number) => i * (width + gutter))
      .attr('y', 0)
      .call((element: any) => {
        applyScaleStyle(element, scale, this.calendar.options.options.scale!);
      });
  }
}
