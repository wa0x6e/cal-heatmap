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

    const colorScale: any = this.initColorScale();

    calendar.calendarPainter.root
      .selectAll('.graph-domain')
      .selectAll('svg')
      .selectAll('g')
      .data((d: any) => calendar.domainCollection.get(d) || [])
      .call((element: any) => {
        const styles: { fill?: Function; 'fill-opacity'?: Function } = {};
        if (options.scale!.hasOwnProperty('opacity')) {
          styles.fill = () => options.scale!.opacity!.baseColor || 'red';
          styles['fill-opacity'] = (d: any) => colorScale?.apply(d.v);
        } else {
          styles.fill = (d: any) => colorScale?.apply(d.v);
        }

        Object.entries(styles).forEach(([prop, val]) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          element.select('rect').style(prop, (d: any) => val(d)));
      })
      .call((element: any) => {
        element
          .select('text')
          .attr('style', (d: any) => {
            const defaultColor =
              hcl(colorScale?.apply(d.v)).l > 60 ? '#000' : '#fff';
            let color = options.subDomain.color || (d.v ? defaultColor : null);

            if (isFunction(color)) {
              color = color(d.t, d.v, colorScale?.apply(d.v));
            }

            if (!color) {
              return null;
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

  initColorScale(): any {
    try {
      return scale(this.calendar.options.options.scale);
    } catch (error) {
      return null;
    }
  }
}
