// @ts-ignore
import { scale } from '@observablehq/plot';
import isFunction from 'lodash-es/isFunction';
import { hcl } from 'd3-color';

import type CalHeatmap from '../CalHeatmap';

export default class Populator {
  calendar: CalHeatmap;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
  }

  populate(): void {
    const { calendar } = this;
    const { options } = calendar.options;

    let colorScale: any = null;
    try {
      const scaleOptions = options.scale;
      colorScale = scale({ [scaleOptions.as]: scaleOptions });
    } catch (error) {
      // Do nothing
    }

    calendar.calendarPainter.root
      .selectAll('.graph-domain')
      .selectAll('svg')
      .selectAll('g')
      .data((d: any) => calendar.domainCollection.get(d) || [])
      .call((element: any) => {
        element
          .select('rect')
          .style('fill', (d: any) => colorScale?.apply(d.v));
      })
      .call((element: any) => {
        element
          .select('text')
          .attr('style', (d: any) => {
            let color =
              options.subDomain.color ||
              (hcl(colorScale?.apply(d.v)).l > 60 ? 'black' : 'white');

            if (isFunction(color)) {
              color = color(d.t, d.v, colorScale?.apply(d.v));
            }

            return `fill: ${color};`;
          })
          .text((d: any, i: number, nodes: any) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            calendar.dateHelper.format(
              d.t,
              options.subDomain.label,
              d.v,
              nodes[i],
            ));
      })
      .call(() => {
        calendar.eventEmitter.emit('fill');
      });
  }
}
