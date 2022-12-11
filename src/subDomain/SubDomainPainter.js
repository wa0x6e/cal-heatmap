import { TOP, LEFT } from '../constant';

const BASE_CLASSNAME = 'graph-subdomain-group';

export default class subDomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.root = null;
  }

  paint(root) {
    this.root = root || this.root;

    const subDomainSvgGroup = this.root
      .selectAll(`.${BASE_CLASSNAME}`)
      .data(
        (d) => [d],
        (d) => d,
      )
      .join(
        (enter) => enter
          .append('svg')
          .call((selection) => this.#setPositions(selection))
          .attr('class', BASE_CLASSNAME),

        (update) => update.call((selection) => this.#setPositions(selection)),
      );

    const {
      tooltip,
      subDomain: { radius, width, height },
    } = this.calendar.options.options;
    const { eventEmitter } = this.calendar;

    subDomainSvgGroup
      .selectAll('g')
      .data((d) => this.calendar.domainCollection.get(d))
      .join(
        (enter) => enter
          .append('g')
          .call((selection) => selection
            .insert('rect')
            .attr('class', (d) =>
            // eslint-disable-next-line implicit-arrow-linebreak
              this.#classname(d.t, 'graph-rect', 'hover_cursor'))
            .attr('width', width)
            .attr('height', height)
            .attr('x', (d) => this.#getX(d))
            .attr('y', (d) => this.#getY(d))
            .on('click', (ev, d) =>
            // eslint-disable-next-line implicit-arrow-linebreak
              eventEmitter.emit('click', ev, new Date(d.t), d.v))
            .on('mouseover', (ev, d) => {
              if (tooltip) {
                this.calendar.calendarPainter.tooltip.show(ev.target);
              }
              return eventEmitter.emit('mouseover', ev, new Date(d.t), d.v);
            })
            .on('mouseout', (ev, d) => {
              if (tooltip) {
                this.calendar.calendarPainter.tooltip.hide();
              }

              return eventEmitter.emit('mouseout', ev, new Date(d.t), d.v);
            })
            .attr('rx', radius > 0 ? radius : null)
            .attr('ry', radius > 0 ? radius : null))
          .call((selection) => this.#appendText(selection)),
        (update) => update
          .selectAll('rect')
          .attr('class', (d) =>
          // eslint-disable-next-line implicit-arrow-linebreak
            this.#classname(d.t, 'graph-rect', 'hover_cursor'))
          .attr('width', width)
          .attr('height', height)
          .attr('x', (d) => this.#getX(d))
          .attr('y', (d) => this.#getY(d))
          .attr('rx', radius)
          .attr('ry', radius),
      );
  }

  /**
   * Set the subDomain group X and Y position
   * @param {d3-selection} selection A d3-selection object
   */
  #setPositions(selection) {
    const { options } = this.calendar.options;
    const { padding } = options.domain;
    const { position } = options.label.position;

    selection
      .attr('x', () => {
        let pos = padding[LEFT];
        if (position === 'left') {
          pos += options.x.domainHorizontalLabelWidth;
        }
        return pos;
      })
      .attr('y', () => {
        let pos = padding[TOP];
        if (position === 'top') {
          pos += options.x.domainVerticalLabelHeight;
        }
        return pos;
      });
  }

  /**
   * Return a classname if the specified date should be highlighted
   *
   * @param  {number} timestamp Unix timestamp of the current subDomain
   * @return {String} the highlight class
   */
  #classname(timestamp, ...otherClasses) {
    const { date, subDomain } = this.calendar.options.options;
    const { DateHelper } = this.calendar.helpers;
    let classname = '';

    if (date.highlight.length > 0) {
      date.highlight.forEach((d) => {
        if (DateHelper.datesFromSameInterval(subDomain.type, +d, timestamp)) {
          classname = DateHelper.datesFromSameInterval(subDomain.type, +d) ?
            'highlight-now' :
            'highlight';
        }
      });
    }

    return [classname, ...otherClasses].join(' ').trim();
  }

  #appendText(elem) {
    const { options } = this.calendar.options;
    const fmt = options.subDomain.label;
    const dateFmt = this.calendar.helpers.DateHelper;

    if (!fmt) {
      return null;
    }

    return elem
      .append('text')
      .attr('class', (d) => this.#classname(d.t, 'subdomain-text'))
      .attr('x', (d) => this.#getX(d) + options.subDomain.width / 2)
      .attr('y', (d) => this.#getY(d) + options.subDomain.height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d, i, nodes) => dateFmt.format(d.t, fmt, d.v, nodes[i]));
  }

  #getCoordinates(axis, d) {
    const { subDomain } = this.calendar.options.options;
    return (
      d[axis] *
      (subDomain[axis === 'x' ? 'width' : 'height'] + subDomain.gutter)
    );
  }

  #getX(d) {
    return this.#getCoordinates('x', d);
  }

  #getY(d) {
    return this.#getCoordinates('y', d);
  }
}
