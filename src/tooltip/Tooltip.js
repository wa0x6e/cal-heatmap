import { select } from 'd3-selection';
import { createPopper } from '@popperjs/core';

import { getSubDomainTitle } from '../subDomain';

export default class Tooltip {
  constructor(calendar) {
    this.calendar = calendar;
    this.root = null;
    this.virtualElement = {
      getBoundingClientRect: null,
    };
    this.popperInstance = null;
    this.popperOptions = {
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
  }

  init() {
    this.root = select('body')
      .append('div')
      .attr('id', 'ch-tooltip')
      .attr('role', 'tooltip');
    this.root
      .append('div')
      .attr('id', 'ch-tooltip-arrow')
      .attr('data-popper-arrow', true);
    this.root.append('span').attr('id', 'ch-tooltip-body');

    this.popperInstance = createPopper(
      this.virtualElement,
      this.root.node(),
      this.popperOptions,
    );
  }

  show(e, d) {
    this.#update(e, d);

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

  #update(e, d) {
    const { options } = this.calendar.options;

    this.virtualElement.getBoundingClientRect = () => e.getBoundingClientRect();

    if (options.onTooltip) {
      this.#setTitle(options.onTooltip(new Date(d.t), d.v));
    } else {
      this.#setTitle(getSubDomainTitle(d, options));
    }
  }

  #setTitle(title) {
    this.root.select('#ch-tooltip-body').html(title);
  }
}
