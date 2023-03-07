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

const DEFAULT_CLASSNAME = '.ch-calendar-label';

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
    const { subDomain } = calendar.options.options;

    this.calendar = calendar;
    this.root = null;
    this.shown = false;
    this.options = defaultOptions;
    this.computedOptions = {
      radius: subDomain.radius,
      width: subDomain.width,
      height: subDomain.height,
      gutter: subDomain.gutter,
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

    if (calendarRoot.select(DEFAULT_CLASSNAME).empty()) {
      this.root = calendarRoot
        .append('svg')
        .attr('class', DEFAULT_CLASSNAME.slice(1));
    } else {
      this.root = calendarRoot.select(DEFAULT_CLASSNAME.slice(1));
    }

    this.build();

    this.#positionInnerCalendar();

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
    this.#positionRoot();

    this.root
      .selectAll('g')
      .data(this.options.text)
      .join(
        (enter: any) => enter
          .append('g')
          .call((selection: any) => selection
            .append('rect')
            .attr('class', `${DEFAULT_CLASSNAME.slice(1)}-rect`)
            .attr('style', 'fill: transparent')
            .call((s: any) => this.#setRectAttr(s)))
          .call((selection: any) => selection
            .append('text')
            .attr('class', `${DEFAULT_CLASSNAME.slice(1)}-text`)
            .attr('dominant-baseline', 'central')
            .attr('text-anchor', 'middle')
            .attr('style', 'fill: currentColor; font-size: 10px')
            .call((s: any) => this.#setTextAttr(s))),
        (update: any) => update
          .call((selection: any) => selection.selectAll('rect').call((s: any) =>
          // eslint-disable-next-line implicit-arrow-linebreak
            this.#setRectAttr(s)))
          .call((selection: any) => selection.selectAll('text').call((s: any) =>
          // eslint-disable-next-line implicit-arrow-linebreak
            this.#setTextAttr(s))),
      );

    return Promise.resolve();
  }

  #positionInnerCalendar() {
    const { position, dimensions } = this.options;

    this.calendar.calendarPainter.root
      .select('.graph')
      .transition()
      .duration(this.calendar.options.options.animationDuration)
      .call((selection: any) => {
        if (position === 'left') {
          selection.attr('x', dimensions!.width);
        } else if (position === 'top') {
          selection.attr('y', dimensions!.height);
        }
      });
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

  /**
   * Position the current plugin relative to the calendar
   */
  #positionRoot() {
    const {
      domain: {
        padding,
        label: { position: domainLabelPosition },
      },
      x: { domainVerticalLabelHeight },
    } = this.calendar.options.options;
    const { position } = this.options;
    const { width: domainsTotalWidth, height: domainsTotalHeight } =
      this.calendar.calendarPainter.domainsDimensions;

    this.root
      .attr('x', position === 'right' ? domainsTotalWidth : 0)
      .attr('y', () => {
        const y = padding[Position.TOP];
        if (domainLabelPosition === 'top' && isHorizontal(position!)) {
          return y + domainVerticalLabelHeight;
        }

        if (position === 'bottom') {
          return y + domainsTotalHeight;
        }

        return y;
      });
  }

  #setRectAttr(selection: any) {
    const { width, height, radius } = this.computedOptions;

    selection
      .attr('width', width)
      .attr('height', height)
      .attr('rx', radius && radius > 0 ? radius : null)
      .attr('ry', radius && radius > 0 ? radius : null)
      .attr('x', (d: string, i: number) => this.#getX(i))
      .attr('y', (d: string, i: number) => this.#getY(i));
  }

  #setTextAttr(selection: any): void {
    const { height, textAlign } = this.computedOptions;

    selection
      .attr('text-anchor', textAlign)
      .attr(
        'x',
        (d: string, i: number) => this.#getTextXOffset() + this.#getX(i),
      )
      .attr('y', (d: string, i: number) => this.#getY(i) + height! / 2)
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
