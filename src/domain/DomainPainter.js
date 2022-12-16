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
    this.root = null;

    // Dimensions of the internal area containing all the domains
    // Excluding all surrounding margins
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(scrollDirection, calendarNode) {
    const { animationDuration } = this.calendar.options.options;
    const t = calendarNode.transition().duration(animationDuration);
    const coor = this.coordinates;

    this.dimensions = coor.update(
      this.calendar.domainCollection,
      scrollDirection,
    );

    const promises = [];

    this.root = calendarNode
      .select('.graph')
      .selectAll(`.${DEFAULT_CLASSNAME}`)
      .data(this.calendar.domainCollection.keys, (d) => d)
      .join(
        (enter) => enter
          .append('svg')
          .attr('x', (d) => coor.at(d).pre_x)
          .attr('y', (d) => coor.at(d).pre_y)
          .attr('width', (d) => coor.at(d).inner_width)
          .attr('height', (d) => coor.at(d).inner_height)
          .attr('class', (d) => this.#getClassName(d))
          .call((enterSelection) => enterSelection
            .append('rect')
            .attr('width', (d) => coor.at(d).inner_width)
            .attr('height', (d) => coor.at(d).inner_height)
            .attr('class', 'domain-background'))
          .call((enterSelection) => promises.push(
            enterSelection
              .transition(t)
              .attr('x', (d) => coor.at(d).x)
              .attr('y', (d) => coor.at(d).y)
              .end(),
          )),
        (update) => update
          .call((updateSelection) => promises.push(
            updateSelection
              .transition(t)
              .attr('x', (d) => coor.at(d).x)
              .attr('y', (d) => coor.at(d).y)
              .attr('width', (d) => coor.at(d).inner_width)
              .attr('height', (d) => coor.at(d).inner_height)
              .end(),
          ))
          .call((updateSelection) => promises.push(
            updateSelection
              .selectAll('.domain-background')
              .transition(t)
              .attr('width', (d) => coor.at(d).inner_width)
              .attr('height', (d) => coor.at(d).inner_height)
              .end(),
          )),
        (exit) => exit.call((exitSelection) => promises.push(
          exitSelection
            .transition(t)
            .attr('x', (d) => coor.at(d).x)
            .attr('y', (d) => coor.at(d).y)
            .remove()
            .end(),
        )),
      );

    return promises;
  }

  #getClassName(d) {
    let classname = DEFAULT_CLASSNAME;
    const helper = this.calendar.helpers.DateHelper.date(d);

    switch (this.calendar.options.options.domain.type) {
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
