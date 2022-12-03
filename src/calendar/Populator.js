// eslint-disable-next-line no-unused-vars
import { selectAll } from 'd3-selection';

import { getHighlightClassName } from '../function';

export default class Populator {
  constructor(calendar) {
    this.calendar = calendar;
  }

  #getClassName(d) {
    const { calendar } = this;
    const { options } = calendar.options;

    const htmlClass = getHighlightClassName(calendar, d.t, options)
      .trim()
      .split(' ');

    htmlClass.push('graph-rect');
    htmlClass.push('hover_cursor');

    return htmlClass.join(' ').trim();
  }

  populate() {
    const { calendar } = this;
    const { options } = calendar.options;
    const { scale } = this.calendar.colorizer;
    const svg = calendar.calendarPainter.root.selectAll('.graph-domain');

    const rect = svg
      .selectAll('svg')
      .selectAll('g')
      .data((d) => calendar.domainCollection.get(d) || []);

    rect
      .transition()
      .duration(options.animationDuration)
      .select('rect')
      .attr('class', (d) => this.#getClassName(d))
      .call((e) => e.style('fill', (d) => scale && scale(d.v)))
      .attr('title', (d) => {
        const { subDomainTitleFn } = options.formatter;

        return subDomainTitleFn ? subDomainTitleFn(new Date(d.t), d.v) : null;
      });

    /**
     * Change the subDomainLabel class if necessary
     * Also change the text, e.g when text is representing the value
     * instead of the date
     */
    rect
      .transition()
      .duration(options.animationDuration)
      .select('text')
      .attr(
        'class',
        (d) => `subdomain-text${getHighlightClassName(calendar, d.t, options)}`,
      )
      .call((element) => {
        element.text((d, i, nodes) => calendar.helpers.DateHelper.format(
          d.t,
          options.formatter.subDomainLabel,
          d.v,
          nodes[i],
        ));
      });

    this.calendar.eventEmitter.emit('fill');
  }
}
