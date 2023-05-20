import { createPopper } from '@popperjs/core';

import type dayjs from 'dayjs';
import type { VirtualElement, StrictModifiers } from '@popperjs/core';
import type CalHeatmap from '../CalHeatmap';
import type { IPlugin, PluginOptions, Timestamp } from '../index';

const DEFAULT_SELECTOR = '#ch-tooltip';

interface PopperOptions {
  placement: any;
  modifiers: any[];
  strategy: any;
  onFirstUpdate?: any;
}

interface TooltipOptions extends PluginOptions, PopperOptions {
  enabled: boolean;
  text: (timestamp: Timestamp, value: number, dayjsDate: dayjs.Dayjs) => string;
}

const defaultOptions: Partial<TooltipOptions> = {
  enabled: true,

  // Expecting a function, which will return the tooltip content
  text: (_timestamp, value, dayjsDate): string =>
    // eslint-disable-next-line implicit-arrow-linebreak
    `${value} - ${dayjsDate.format('LLLL')}`,
};

const DEFAULT_POPPER_OPTIONS = {
  placement: 'top',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
  ],
};

const virtualElement: VirtualElement = {
  getBoundingClientRect(x = 0, y = 0): DOMRect {
    return {
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
      x,
      y,
      toJSON: () => {},
    };
  },
};

export default class Tooltip implements IPlugin {
  name = 'Tooltip';

  calendar: CalHeatmap;

  root: HTMLElement | null;

  popperInstance: any;

  popperOptions: any;

  options: Partial<TooltipOptions>;

  listenerAttached: boolean;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.root = null;
    this.popperInstance = null;
    this.options = defaultOptions;
    this.listenerAttached = false;
  }

  setup(pluginOptions?: Partial<TooltipOptions>): void {
    this.options = { ...defaultOptions, ...pluginOptions };
    const event = this.calendar.eventEmitter;

    if (!this.options.enabled) {
      if (this.listenerAttached) {
        event.off('mouseover', this.mouseOverCallback, this);
        event.off('mouseout', this.mouseOutCallback, this);

        this.listenerAttached = false;
      }

      this.destroy();
      return;
    }

    this.popperOptions = { ...DEFAULT_POPPER_OPTIONS, ...this.options };

    this.root = document.getElementById(DEFAULT_SELECTOR.slice(1));

    if (!this.root) {
      const tooltipElem = document.createElement('div');
      tooltipElem.setAttribute('id', DEFAULT_SELECTOR.slice(1));
      tooltipElem.setAttribute('role', 'tooltip');
      tooltipElem.innerHTML =
        `<div id="${DEFAULT_SELECTOR.slice(
          1,
        )}-arrow" data-popper-arrow="true"></div>` +
        `<span id="${DEFAULT_SELECTOR.slice(1)}-body"></span>`;

      this.root = document.body.appendChild(tooltipElem);
    }

    this.root.setAttribute('data-theme', this.calendar.options.options.theme);

    this.popperInstance = createPopper<StrictModifiers>(
      virtualElement,
      this.root,
      this.popperOptions,
    );

    if (!this.listenerAttached) {
      event.on('mouseover', this.mouseOverCallback, this);
      event.on('mouseout', this.mouseOutCallback, this);
      this.listenerAttached = true;
    }
  }

  mouseOverCallback(e: PointerEvent, timestamp: Timestamp, value: number) {
    this.#show(e.target, timestamp, value);
  }

  mouseOutCallback() {
    this.#hide();
  }

  // eslint-disable-next-line class-methods-use-this
  paint(): Promise<unknown> {
    return Promise.resolve();
  }

  destroy(): Promise<unknown> {
    if (this.root) {
      this.root.remove();
    }

    return Promise.resolve();
  }

  #show(e: any, timestamp: Timestamp, value: number): void {
    const formatter = this.options.text;
    const title = formatter ?
      formatter(timestamp, value, this.calendar.dateHelper.date(timestamp)) :
      null;

    if (!title) {
      return;
    }

    virtualElement.getBoundingClientRect = () => e.getBoundingClientRect();
    document.getElementById(`${DEFAULT_SELECTOR.slice(1)}-body`)!.innerHTML =
      title;

    this.popperInstance.setOptions(() => ({
      ...this.popperOptions,
      modifiers: [
        ...this.popperOptions.modifiers,
        { name: 'eventListeners', enabled: true },
      ],
    }));

    this.popperInstance.update();

    this.root!.setAttribute('data-show', '1');
  }

  #hide(): void {
    this.root!.removeAttribute('data-show');

    this.popperInstance.setOptions(() => ({
      ...this.popperOptions,
      modifiers: [
        ...this.popperOptions.modifiers,
        { name: 'eventListeners', enabled: false },
      ],
    }));
  }
}
