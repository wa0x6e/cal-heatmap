import isFunction from 'lodash-es/isFunction';
import { hcl } from 'd3-color';
import { normalizedScale, applyScaleStyle } from '../scale';

import type CalHeatmap from '../CalHeatmap';
import type { SubDomain, Timestamp } from '../index';

export default class Populator {
  calendar: CalHeatmap;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
  }

  populate(): void {
    const { calendar } = this;
    const { scale, subDomain } = calendar.options.options;
    const colorScale = normalizedScale(scale);

    calendar.calendarPainter
      .root!.selectAll('.ch-domain')
      .selectAll('svg')
      .selectAll('g')
      .data((d: Timestamp) => calendar.domainCollection.get(d) || [])
      .call((element: any) => {
        applyScaleStyle(element.select('rect'), colorScale, scale!, 'v');
      })
      .call((element: any) => {
        element
          .select('text')
          .attr('style', (d: SubDomain) => {
            const defaultColor =
              hcl(colorScale?.apply(d.v)).l > 60 ? '#000' : '#fff';
            let color = subDomain.color || (d.v ? defaultColor : null);

            if (isFunction(color)) {
              color = color(d.t, d.v, colorScale?.apply(d.v));
            }

            if (!color) {
              return null;
            }

            return `fill: ${color};`;
          })
          .text((d: SubDomain, i: number, nodes: any[]) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            calendar.dateHelper.format(d.t, subDomain.label, d.v, nodes[i]));
      })
      .call(() => {
        calendar.eventEmitter.emit('fill');
      });
  }
}
