import { createPopper } from '@popperjs/core';
import type { VirtualElement } from '@popperjs/core';

import type CalHeatmap from '../CalHeatmap';

const BASE_CLASSNAME = 'ch-tooltip';

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

export default class Tooltip {
  calendar: CalHeatmap;

  root: HTMLElement | null;

  virtualElement: VirtualElement;

  popperInstance: any;

  popperOptions: any;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.root = null;
    this.virtualElement = {
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
    this.popperInstance = null;
  }

  init(): void {
    const { tooltip } = this.calendar.options.options;

    if (!tooltip) {
      return;
    }

    this.popperOptions =
      typeof tooltip === 'object' ? tooltip : DEFAULT_POPPER_OPTIONS;

    this.root = document.getElementById(BASE_CLASSNAME);

    if (!this.root) {
      const tooltipElem = document.createElement('div');
      tooltipElem.setAttribute('id', BASE_CLASSNAME);
      tooltipElem.setAttribute('role', 'tooltip');
      tooltipElem.innerHTML =
        `<div id="${BASE_CLASSNAME}-arrow" data-popper-arrow="true"></div>` +
        `<span id="${BASE_CLASSNAME}-body"></span>`;

      this.root = document.body.appendChild(tooltipElem);
    }

    this.popperInstance = createPopper(
      this.virtualElement,
      this.root,
      this.popperOptions,
    );

    this.calendar.eventEmitter.on('mouseover', (e: PointerEvent) => {
      this.#show(e.target);
    });

    this.calendar.eventEmitter.on('mouseout', () => {
      this.#hide();
    });
  }

  #show(e: any): void {
    const title = e.getAttribute('aria-labelledby');

    if (!title) {
      return;
    }

    this.virtualElement.getBoundingClientRect = () => e.getBoundingClientRect();
    document.getElementById(`${BASE_CLASSNAME}-body`)!.innerHTML = title;

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
