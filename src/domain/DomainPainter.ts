import DomainCoordinates from './DomainCoordinates';

import type CalHeatmap from '../CalHeatmap';
import type { ScrollDirection } from '../constant';
import type { Dimensions, Timestamp } from '../index';

const DEFAULT_SELECTOR = '.ch-domain';

export default class DomainPainter {
  calendar: CalHeatmap;

  coordinates: DomainCoordinates;

  root: any;

  dimensions: Dimensions;

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

  paint(scrollDirection: ScrollDirection, rootNode: any): Promise<unknown>[] {
    const { animationDuration } = this.calendar.options.options;
    const t = rootNode.transition().duration(animationDuration);
    const coor = this.coordinates;

    this.dimensions = coor.update(
      this.calendar.domainCollection,
      scrollDirection,
    );

    const promises: Promise<unknown>[] = [];

    this.root = rootNode
      .selectAll(DEFAULT_SELECTOR)
      .data(this.calendar.domainCollection.keys, (d: Timestamp) => d)
      .join(
        (enter: any) => enter
          .append('svg')
          .attr('x', (d: Timestamp) => coor.get(d)!.pre_x)
          .attr('y', (d: Timestamp) => coor.get(d)!.pre_y)
          .attr('width', (d: Timestamp) => coor.get(d)!.inner_width)
          .attr('height', (d: Timestamp) => coor.get(d)!.inner_height)
          .attr('class', (d: Timestamp) => this.#getClassName(d))
          .call((enterSelection: any) => enterSelection
            .append('rect')
            .attr('width', (d: Timestamp) => coor.get(d)!.inner_width)
            .attr('height', (d: Timestamp) => coor.get(d)!.inner_height)
            .attr('class', `${DEFAULT_SELECTOR.slice(1)}-bg`))
          .call((enterSelection: any) => promises.push(
            enterSelection
              .transition(t)
              .attr('x', (d: Timestamp) => coor.get(d)!.x)
              .attr('y', (d: Timestamp) => coor.get(d)!.y)
              .end(),
          )),
        (update: any) => update
          .call((updateSelection: any) => promises.push(
            updateSelection
              .transition(t)
              .attr('x', (d: Timestamp) => coor.get(d)!.x)
              .attr('y', (d: Timestamp) => coor.get(d)!.y)
              .attr('width', (d: Timestamp) => coor.get(d)!.inner_width)
              .attr('height', (d: Timestamp) => coor.get(d)!.inner_height)
              .end(),
          ))
          .call((updateSelection: any) => promises.push(
            updateSelection
              .selectAll(`${DEFAULT_SELECTOR}-bg`)
              .transition(t)
              .attr('width', (d: Timestamp) => coor.get(d)!.inner_width)
              .attr('height', (d: Timestamp) => coor.get(d)!.inner_height)
              .end(),
          )),
        (exit: any) => exit.call((exitSelection: any) => promises.push(
          exitSelection
            .transition(t)
            .attr('x', (d: Timestamp) => coor.get(d)!.x)
            .attr('y', (d: Timestamp) => coor.get(d)!.y)
            .remove()
            .end(),
        )),
      );

    return promises;
  }

  #getClassName(d: Timestamp): string {
    let classname = DEFAULT_SELECTOR.slice(1);
    const helper = this.calendar.dateHelper.date(d);

    switch (this.calendar.options.options.domain.type) {
      case 'hour':
        classname += ` h_${helper.hour()}`;
        break;
      case 'day':
        classname += ` d_${helper.date()} dy_${helper.format('d') + 1}`;
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
