import { getHighlightClassName } from '../function';

import {
  TOP, LEFT, X, Y,
} from '../constant';

export default class subDomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.root = null;
  }

  paint(root) {
    const { options } = this.calendar.options;
    this.root = root || this.root;

    const subDomainSvgGroup = this.root
      .append('svg')
      .attr('x', () => {
        let pos = options.domainMargin[LEFT];
        if (options.label.position === 'left') {
          pos += options.domainHorizontalLabelWidth;
        }
        return pos;
      })
      .attr('y', () => {
        let pos = options.domainMargin[TOP];
        if (options.label.position === 'top') {
          pos += options.domainVerticalLabelHeight;
        }
        return pos;
      })
      .attr('class', 'graph-subdomain-group');

    const rect = subDomainSvgGroup
      .selectAll('g')
      .data((d) => this.calendar.domainCollection.get(d))
      .enter()
      .append('g');

    rect
      .append('rect')
      .attr('class', (d) => this.#getClassName(d))
      .attr('width', options.cellSize[X])
      .attr('height', options.cellSize[Y])
      .attr('x', (d) => this.#getX(d))
      .attr('y', (d) => this.#getY(d))
      .on('click', (ev, d) => this.calendar.onClick(ev, new Date(d.t), d.v))
      .on('mouseover', (ev, d) => {
        if (options.tooltip) {
          this.calendar.calendarPainter.tooltip.show(ev.target, d);
        }
        return this.calendar.onMouseOver(ev, new Date(d.t), d.v);
      })
      .on('mouseout', (ev, d) => {
        if (options.tooltip) {
          this.calendar.calendarPainter.tooltip.hide();
        }

        return this.calendar.onMouseOut(ev, new Date(d.t), d.v);
      })
      .call((selection) => {
        if (options.cellRadius > 0) {
          selection
            .attr('rx', options.cellRadius)
            .attr('ry', options.cellRadius);
        }

        selection.attr('fill', this.calendar.colorizer.getCustomColor('base'));
      });

    if (!options.tooltip) {
      this.#appendTitle(rect);
    }

    if (options.subDomainTextFormat !== null) {
      this.#appendText(rect);
    }
  }

  #getClassName(d) {
    const { options } = this.calendar.options;

    return `graph-rect${getHighlightClassName(this.calendar, d.t, options)}${
      options.onClick !== null ? ' hover_cursor' : ''
    }`;
  }

  #appendText(elem) {
    const { options } = this.calendar.options;

    elem
      .append('text')
      .attr(
        'class',
        (d) => 'subdomain-text' +
          `${getHighlightClassName(this.calendar, d.t, options)}`,
      )
      .attr('x', (d) => this.#getX(d) + options.cellSize[X] / 2)
      .attr('y', (d) => this.#getY(d) + options.cellSize[Y] / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => this.calendar.helpers.DateHelper.format(
        d.t,
        options.subDomainTextFormat,
      ));
  }

  #appendTitle(elem) {
    const { options } = this.calendar.options;

    elem
      .append('title')
      .text((d) => this.calendar.helpers.DateHelper.format(
        d.t,
        options.subDomainDateFormat,
      ));
  }

  #getCoordinates(axis, d) {
    const { cellSize, cellPadding } = this.calendar.options.options;
    return d[axis] * (cellSize[axis === 'x' ? X : Y] + cellPadding);
  }

  #getX(d) {
    return this.#getCoordinates('x', d);
  }

  #getY(d) {
    return this.#getCoordinates('y', d);
  }
}
