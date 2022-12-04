import { select } from 'd3-selection';
import { createPopper } from '@popperjs/core';

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
  constructor(calendar) {
    this.calendar = calendar;
    this.root = null;
    this.virtualElement = {
      getBoundingClientRect: null,
    };
    this.popperInstance = null;
  }

  init() {
    this.popperOptions =
      typeof this.calendar.options.options.tooltip === 'object' ?
        this.calendar.options.options.tooltip :
        DEFAULT_POPPER_OPTIONS;

    this.root = select(`#${BASE_CLASSNAME}`);

    if (this.root.empty()) {
      this.root = select('body')
        .append('div')
        .attr('id', BASE_CLASSNAME)
        .attr('role', 'tooltip');
      this.root
        .append('div')
        .attr('id', `${BASE_CLASSNAME}-arrow`)
        .attr('data-popper-arrow', true);
      this.root.append('span').attr('id', `${BASE_CLASSNAME}-body`);
    }

    this.popperInstance = createPopper(
      this.virtualElement,
      this.root.node(),
      this.popperOptions,
    );
  }

  show(e) {
    const title = e.getAttribute('title');

    if (!title) {
      return;
    }

    this.virtualElement.getBoundingClientRect = () => e.getBoundingClientRect();
    this.root.select(`#${BASE_CLASSNAME}-body`).html(title);

    this.popperInstance.setOptions(() => ({
      ...this.popperOptions,
      modifiers: [
        ...this.popperOptions.modifiers,
        { name: 'eventListeners', enabled: true },
      ],
    }));

    this.popperInstance.update();

    this.root.attr('data-show', true);
  }

  hide() {
    this.root.attr('data-show', null);

    this.popperInstance.setOptions(() => ({
      ...this.popperOptions,
      modifiers: [
        ...this.popperOptions.modifiers,
        { name: 'eventListeners', enabled: false },
      ],
    }));
  }
}
