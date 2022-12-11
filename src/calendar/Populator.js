import { scale } from '@observablehq/plot';

export default class Populator {
  constructor(calendar) {
    this.calendar = calendar;
  }

  populate() {
    const { calendar } = this;
    const { options } = calendar.options;
    let colorScale = null;
    try {
      colorScale = scale(options.legend);
    } catch (error) {
      // Do nothing
    }

    calendar.calendarPainter.root
      .selectAll('.graph-domain')
      .selectAll('svg')
      .selectAll('g')
      .data((d) => calendar.domainCollection.get(d) || [])
      .transition()
      .duration(options.animationDuration)
      .call((element) => {
        element
          .select('rect')
          .style('fill', (d) => colorScale?.apply(d.v))
          .attr('title', (d) => {
            const { title } = options.subDomain;

            return title ? title(new Date(d.t), d.v) : null;
          });
      })
      .call((element) => {
        element
          .select('text')
          .text((d, i, nodes) => calendar.helpers.DateHelper.format(
            d.t,
            options.subDomain.label,
            d.v,
            nodes[i],
          ));
      });

    this.calendar.eventEmitter.emit('fill');
  }
}
