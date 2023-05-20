import { Position } from '../constant';
import {
  isHorizontal,
  isVertical,
  horizontalPadding,
  verticalPadding,
} from '../helpers/PositionHelper';

import type CalHeatmap from '../CalHeatmap';
import type { IPlugin, PluginOptions } from '../index';
import type { TextAlign, Padding } from '../options/Options';

type ComputedOptions = {
  radius: number;
  width: number;
  height: number;
  gutter: number;
  textAlign: TextAlign;
};

interface CalendarLabelOptions extends PluginOptions, Partial<ComputedOptions> {
  enabled: boolean;
  text: () => string[];
  padding: Padding;
}

const DEFAULT_SELECTOR = '.ch-plugin-calendar-label';

const defaultOptions: CalendarLabelOptions = {
  enabled: true,

  dimensions: {
    width: 0,
    height: 0,
  },

  position: 'left',

  text: () => [],

  padding: [0, 0, 0, 0],
};

export default class CalendarLabel implements IPlugin {
  name = 'CalendarLabel';

  calendar: CalHeatmap;

  root: any;

  shown: boolean;

  options: CalendarLabelOptions;

  computedOptions: ComputedOptions;

  constructor(calendar: CalHeatmap) {
    const subDomain = calendar?.options?.options?.subDomain;

    this.calendar = calendar;
    this.root = null;
    this.shown = false;
    this.options = defaultOptions;
    this.computedOptions = {
      radius: subDomain?.radius,
      width: subDomain?.width,
      height: subDomain?.height,
      gutter: subDomain?.gutter,
      textAlign: 'start',
    };
  }

  setup(pluginOptions?: Partial<CalendarLabelOptions>): void {
    this.options = { ...defaultOptions, ...pluginOptions };
  }

  paint(): Promise<unknown> {
    const { enabled } = this.options;

    if (!enabled) {
      return this.destroy();
    }

    this.shown = true;

    const calendarRoot = this.calendar.calendarPainter.root;

    if (!this.root) {
      this.root = calendarRoot
        .append('svg')
        .attr('class', DEFAULT_SELECTOR.slice(1))
        .attr('data-key', this.options.key)
        .attr('x', 0)
        .attr('y', 0);
    }

    this.build();

    return Promise.resolve();
  }

  destroy(): Promise<unknown> {
    if (this.root !== null) {
      this.root.remove();
      this.root = null;
    }

    return Promise.resolve();
  }

  build() {
    this.#buildComputedOptions();
    this.#computeDimensions();

    this.root
      .selectAll('g')
      .data(this.options.text)
      .join((enter: any) => enter
        .append('g')
        .call((selection: any) => selection
          .append('rect')
          .attr('class', `${DEFAULT_SELECTOR.slice(1)}-bg`)
          .attr('style', 'fill: transparent')
          .call((s: any) => this.#setRectAttr(s)))
        .call((selection: any) => selection
          .append('text')
          .attr('class', `${DEFAULT_SELECTOR.slice(1)}-text`)
          .attr('dominant-baseline', 'central')
          .attr('text-anchor', 'middle')
          .attr('style', 'fill: currentColor; font-size: 10px')
          .call((s: any) => this.#setTextAttr(s))));

    return Promise.resolve();
  }

  #buildComputedOptions() {
    Object.keys(this.computedOptions).forEach((key: string) => {
      if (typeof this.options[key as keyof ComputedOptions] !== 'undefined') {
        // @ts-ignore
        this.computedOptions[key] = this.options[key];
      }
    });
  }

  /**
   * Compute the total dimension of the current plugin
   */
  #computeDimensions(): void {
    const { width, height, gutter } = this.computedOptions;
    const { text, padding, position } = this.options;
    const labelsCount = text().length;

    this.options.dimensions = {
      width: width + horizontalPadding(padding),
      height: height + verticalPadding(padding),
    };

    if (isVertical(position!)) {
      this.options.dimensions.width += (width + gutter) * (labelsCount - 1);
    } else {
      this.options.dimensions.height += (height + gutter) * (labelsCount - 1);
    }
  }

  #setRectAttr(selection: any) {
    const { width, height, radius } = this.computedOptions;

    selection
      .attr('width', width)
      .attr('height', height)
      .attr('rx', radius && radius > 0 ? radius : null)
      .attr('ry', radius && radius > 0 ? radius : null)
      .attr('x', (_d: string, i: number) => this.#getX(i))
      .attr('y', (_d: string, i: number) => this.#getY(i));
  }

  #setTextAttr(selection: any): void {
    const { height, textAlign } = this.computedOptions;

    selection
      .attr('text-anchor', textAlign)
      .attr(
        'x',
        (_d: string, i: number) => this.#getTextXOffset() + this.#getX(i),
      )
      .attr('y', (_d: string, i: number) => this.#getY(i) + height! / 2)
      .text((data: string) => data);
  }

  #getTextXOffset() {
    const { width, textAlign } = this.computedOptions;

    switch (textAlign) {
      case 'start':
        return 0;
      case 'middle':
        return width / 2;
      case 'end':
        return width;
      default:
        return 0;
    }
  }

  #getX(index: number) {
    const { position, padding } = this.options;
    const { width, gutter } = this.computedOptions;

    if (isHorizontal(position!)) {
      return padding[Position.LEFT];
    }

    return padding[Position.LEFT] + (width + gutter) * index;
  }

  #getY(index: number) {
    const { position, padding } = this.options;
    const { height, gutter } = this.computedOptions;

    if (isVertical(position!)) {
      return padding[Position.TOP];
    }

    return padding[Position.TOP] + (height + gutter) * index;
  }
}
