import { select } from 'd3-selection';

import { getSubDomainTitle } from '../subDomain';

export default class Tooltip {
  constructor(calendar) {
    this.calendar = calendar;
    this.node = null;
  }

  init() {
    const { itemSelector } = this.calendar.options.options;

    this.node = select(itemSelector)
      .attr('style', () => {
        const current = select(itemSelector).attr('style');
        return `${current ?? ''}position:relative;`;
      })
      .append('div')
      .attr('class', 'ch-tooltip');
  }

  update(element) {
    const { options } = this.calendar.options;

    element.on('mouseover', (ev, d) => {
      if (options.onTooltip) {
        this.#setTitle(options.onTooltip(new Date(d.t), d.v));
      } else {
        this.#setTitle(getSubDomainTitle(d, options));
      }

      this.#show(ev.target);
    });

    element.on('mouseout', () => this.#hide());
  }

  #getCoordinates(axis, cell) {
    const { options } = this.calendar.options;
    const domainNode = cell.parentNode.parentNode;

    let coordinate =
      cell.getAttribute(axis) -
      (axis === 'x'
        ? this.node.node().offsetWidth / 2 - options.cellSize / 2
        : this.node.node().offsetHeight + options.cellSize);
    // Offset by the domain position
    coordinate += parseInt(domainNode.getAttribute(axis), 10);

    // Offset by the calendar position (when legend is left/top)
    coordinate += parseInt(
      this.calendar.calendarPainter.root.select('.graph').attr(axis) || 0,
      10,
    );

    // Offset by the inside domain position (when label is left/top)
    coordinate += parseInt(domainNode.parentNode.getAttribute(axis), 10);

    return coordinate;
  }

  #getX(cell) {
    return this.#getCoordinates('x', cell);
  }

  #getY(cell) {
    return this.#getCoordinates('y', cell);
  }

  #setTitle(title) {
    this.node.html(title);
  }

  #show(cell) {
    // Force display:block, because `offsetHeight` returns 0 on hidden element
    this.node.attr('style', 'display: block;');
    this.node.attr(
      'style',
      'display: block;' +
        `left: ${this.#getX(cell)}px; ` +
        `top: ${this.#getY(cell)}px;`,
    );
  }

  #hide() {
    this.node.attr('style', 'display:none').html('');
  }
}
