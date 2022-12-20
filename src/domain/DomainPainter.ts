// // eslint-disable-next-line no-unused-vars
// import { select, selectAll } from 'd3-selection';
// // eslint-disable-next-line no-unused-vars
// import { transition } from 'd3-transition';

import DomainCoordinates from './DomainCoordinates';

import type CalHeatmap from '../CalHeatmap';
import type { ScrollDirection } from '../constant';

const DEFAULT_CLASSNAME = 'graph-domain';

export default class DomainPainter {
  calendar: CalHeatmap;

  coordinates: DomainCoordinates;

  root: any;

  dimensions: {
    width: number;
    height: number;
  };

  constructor(calendar: CalHeatmap) {
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

  paint(scrollDirection: ScrollDirection, calendarNode: any): Promise<void>[] {
    const { animationDuration } = this.calendar.options.options;
    const t = calendarNode.transition().duration(animationDuration);
    const coor = this.coordinates;

    this.dimensions = coor.update(
      this.calendar.domainCollection,
      scrollDirection,
    );

    const promises: Promise<void>[] = [];

    this.root = calendarNode
      .select('.graph')
      .selectAll(`.${DEFAULT_CLASSNAME}`)
      .data(this.calendar.domainCollection.keys, (d: number) => d)
      .join(
        (enter: any) => enter
          .append('svg')
          .attr('x', (d: any) => coor.at(d)!.pre_x)
          .attr('y', (d: any) => coor.at(d)!.pre_y)
          .attr('width', (d: any) => coor.at(d)!.inner_width)
          .attr('height', (d: any) => coor.at(d)!.inner_height)
          .attr('class', (d: any) => this.#getClassName(d))
          .call((enterSelection: any) => enterSelection
            .append('rect')
            .attr('width', (d: any) => coor.at(d)!.inner_width)
            .attr('height', (d: any) => coor.at(d)!.inner_height)
            .attr('class', 'domain-background'))
          .call((enterSelection: any) => promises.push(
            enterSelection
              .transition(t)
              .attr('x', (d: any) => coor.at(d)!.x)
              .attr('y', (d: any) => coor.at(d)!.y)
              .end(),
          )),
        (update: any) => update
          .call((updateSelection: any) => promises.push(
            updateSelection
              .transition(t)
              .attr('x', (d: any) => coor.at(d)!.x)
              .attr('y', (d: any) => coor.at(d)!.y)
              .attr('width', (d: any) => coor.at(d)!.inner_width)
              .attr('height', (d: any) => coor.at(d)!.inner_height)
              .end(),
          ))
          .call((updateSelection: any) => promises.push(
            updateSelection
              .selectAll('.domain-background')
              .transition(t)
              .attr('width', (d: any) => coor.at(d)!.inner_width)
              .attr('height', (d: any) => coor.at(d)!.inner_height)
              .end(),
          )),
        (exit: any) => exit.call((exitSelection: any) => promises.push(
          exitSelection
            .transition(t)
            .attr('x', (d: any) => coor.at(d)!.x)
            .attr('y', (d: any) => coor.at(d)!.y)
            .remove()
            .end(),
        )),
      );

    return promises;
  }

  #getClassName(d: number): string {
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
