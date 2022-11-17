import { getHighlightClassName, formatDate } from '../function';

export default class subDomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
  }

  paint(root) {
    const { options } = this.calendar.options;

    const subDomainSvgGroup = root
      .append('svg')
      .attr('x', () => {
        if (options.label.position === 'left') {
          return options.domainHorizontalLabelWidth + options.domainMargin[3];
        }
        return options.domainMargin[3];
      })
      .attr('y', () => {
        if (options.label.position === 'top') {
          return options.domainVerticalLabelHeight + options.domainMargin[0];
        }

        return options.domainMargin[0];
      })
      .attr('class', 'graph-subdomain-group');

    const rect = subDomainSvgGroup
      .selectAll('g')
      .data((d) => this.calendar.domainCollection.get(d))
      .enter()
      .append('g');

    rect
      .append('rect')
      .attr(
        'class',
        (d) =>
          `graph-rect${getHighlightClassName(d.t, options)}${
            options.onClick !== null ? ' hover_cursor' : ''
          }`,
      )
      .attr('width', options.cellSize)
      .attr('height', options.cellSize)
      .attr('x', (d) => this.#getX(d.t))
      .attr('y', (d) => this.#getY(d.t))
      .on('click', (ev, d) => this.calendar.onClick(ev, new Date(d.t), d.v))
      .on('mouseover', (ev, d) =>
        this.calendar.onMouseOver(ev, new Date(d.t), d.v),
      )
      .on('mouseout', (ev, d) =>
        this.calendar.onMouseOut(ev, new Date(d.t), d.v),
      )
      .call((selection) => {
        if (options.cellRadius > 0) {
          selection
            .attr('rx', options.cellRadius)
            .attr('ry', options.cellRadius);
        }

        selection.attr('fill', this.calendar.colorizer.getCustomColor('base'));

        if (options.tooltip) {
          this.calendar.calendarPainter.tooltip.update(selection);
        }
      });

    if (!options.tooltip) {
      this.#appendTitle(rect);
    }

    if (options.subDomainTextFormat !== null) {
      this.#appendText(rect);
    }
  }

  #appendText(elem) {
    const { options } = this.calendar.options;

    elem
      .append('text')
      .attr(
        'class',
        (d) => `subdomain-text${getHighlightClassName(d.t, options)}`,
      )
      .attr('x', (d) => this.#getX(d.t) + options.cellSize / 2)
      .attr('y', (d) => this.#getY(d.t) + options.cellSize / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => formatDate(d.t, options.subDomainTextFormat));
  }

  #appendTitle(elem) {
    const { options } = this.calendar.options;

    elem
      .append('title')
      .text((d) => formatDate(d.t, options.subDomainDateFormat));
  }

  #getCoordinates(axis, d) {
    const { options } = this.calendar.options;

    const index = this.calendar.subDomainTemplate
      .at(options.subDomain)
      .position[axis](d);

    return index * (options.cellSize + options.cellPadding);
  }

  #getX(d) {
    return this.#getCoordinates('x', d);
  }

  #getY(d) {
    return this.#getCoordinates('y', d);
  }
}
