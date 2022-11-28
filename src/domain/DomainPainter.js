// eslint-disable-next-line no-unused-vars
import { select, selectAll } from 'd3-selection';
// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition';

import DomainCoordinates from './DomainCoordinates';

const DEFAULT_CLASSNAME = 'graph-domain';

export default class DomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.coordinates = new DomainCoordinates(calendar, this);

    // Dimensions of the internal area containing all the domains
    // Excluding all surrounding margins
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(scrollDirection, calendarNode) {
    const { domainGutter, animationDuration } = this.calendar.options.options;
    const t = calendarNode.transition().duration(animationDuration);
    const coor = this.coordinates;

    this.dimensions = coor.update(
      this.calendar.domainCollection,
      scrollDirection,
    );

    return calendarNode
      .select('.graph')
      .selectAll(`.${DEFAULT_CLASSNAME}`)
      .data(this.calendar.domainCollection.keys, (d) => d)
      .join(
        (enter) => enter
          .append('svg')
          .attr('x', (d) => coor.at(d).pre_x)
          .attr('y', (d) => coor.at(d).pre_y)
          .attr('width', (d) => coor.at(d).width)
          .attr('height', (d) => coor.at(d).height)
          .attr('class', (d) => this.#getClassName(d))
          .call((enterSelection) => enterSelection
            .append('rect')
            .attr('width', (d) => coor.at(d).width - domainGutter)
            .attr('height', (d) => coor.at(d).height - domainGutter)
            .attr('class', 'domain-background'))
          .call((enterSelection) => enterSelection
            .transition(t)
            .attr('x', (d) => coor.at(d).x)
            .attr('y', (d) => coor.at(d).y)),
        (update) => update.call((updateSelection) => updateSelection
          .transition(t)
          .attr('x', (d) => coor.at(d).x)
          .attr('y', (d) => coor.at(d).y)),
        (exit) => exit.call((exitSelection) => exitSelection
          .transition(t)
          .attr('x', (d) => coor.at(d).x)
          .attr('y', (d) => coor.at(d).y)
          .remove()),
      );
  }

  #getClassName(d) {
    let classname = DEFAULT_CLASSNAME;
    const helper = this.calendar.helpers.DateHelper.date(d);

    switch (this.calendar.options.options.domain) {
      case 'hour':
        classname += ` h_${helper.hour()}`;
        break;
      case 'day':
        classname += ` d_${helper.date()} dy_${helper.isoWeekday()}`;
        break;
      case 'week':
        classname += ` w_${helper.week()}`;
        break;
      case 'month':
        classname += ` m_${helper.month() + 1}`;
        break;
      case 'year':
        classname += ` y_${helper.year()}`;
        break;
      default:
    }
    return classname;
  }
}
