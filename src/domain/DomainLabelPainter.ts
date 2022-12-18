import { Position } from '../constant';

import type CalHeatmap from '../CalHeatmap';

const DEFAULT_CLASSNAME = 'graph-label';

export default class DomainLabelPainter {
  calendar: CalHeatmap;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
  }

  paint(root: any): void {
    const { options } = this.calendar.options;
    let format = options.domain.label;
    if (format === null || format === '') {
      return;
    }

    if (typeof format === 'undefined') {
      format = this.calendar.templateCollection.at(options.domain.type).format
        .domainLabel;
    }

    root
      .selectAll(`.${DEFAULT_CLASSNAME}`)
      .data(
        (d: any) => [d],
        (d: any) => d,
      )
      .join(
        (enter: any) => enter
          .append('text')
          .attr('class', DEFAULT_CLASSNAME)
          .attr('x', (d: any) => this.#getX(d))
          .attr('y', (d: any) => this.#getY(d))
          .attr('text-anchor', options.label.textAlign)
          .attr('dominant-baseline', () => this.#textVerticalAlign())
          .text((d: any, i: number, nodes: any[]) =>
          // eslint-disable-next-line implicit-arrow-linebreak
            this.calendar.helpers.DateHelper.format(d, format, nodes[i]))
          .call((s: any) => this.#domainRotate(s)),
        (update: any) => {
          update
            .attr('x', (d: any) => this.#getX(d))
            .attr('y', (d: any) => this.#getY(d))
            .attr('text-anchor', options.label.textAlign)
            .attr('dominant-baseline', () => this.#textVerticalAlign())
            .text((d: any, i: number, nodes: any[]) =>
              // eslint-disable-next-line implicit-arrow-linebreak
              this.calendar.helpers.DateHelper.format(d, format, nodes[i]))
            .call((s: any) => this.#domainRotate(s));
        },
      );
  }

  #textVerticalAlign(): string {
    const { options } = this.calendar.options;

    if (
      options.label.position === 'top' ||
      options.label.position === 'bottom'
    ) {
      return 'middle';
    }

    if (
      (options.label.rotate === 'left' && options.label.position === 'left') ||
      (options.label.rotate === 'right' && options.label.position === 'right')
    ) {
      return 'bottom';
    }

    return 'hanging';
  }

  #getX(d: any): number {
    const { options } = this.calendar.options;

    let x = options.domain.padding[Position.LEFT];

    if (options.label.position === 'right') {
      x += this.#getDomainInsideWidth(d);
    }

    if (options.label.textAlign === 'middle') {
      if (['top', 'bottom'].includes(options.label.position)) {
        x += this.#getDomainInsideWidth(d) / 2;
      } else {
        x += options.x.domainHorizontalLabelWidth / 2;
      }
    }

    if (options.label.textAlign === 'end') {
      if (['top', 'bottom'].includes(options.label.position)) {
        x += this.#getDomainInsideWidth(d);
      } else {
        x += options.x.domainHorizontalLabelWidth;
      }
    }

    return x + options.label.offset.x;
  }

  #getY(d: any): number {
    const { options } = this.calendar.options;

    let y =
      options.domain.padding[Position.TOP] +
      options.x.domainVerticalLabelHeight / 2;

    if (options.label.position === 'bottom') {
      y += this.#getDomainInsideHeight(d);
    }

    return y + options.label.offset.y;
  }

  #getDomainInsideWidth(d: number): number {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d)!
        .inner_width -
      options.x.domainHorizontalLabelWidth -
      options.domain.padding[Position.RIGHT] -
      options.domain.padding[Position.LEFT]
    );
  }

  #getDomainInsideHeight(d: number): number {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d)!
        .inner_height -
      options.x.domainVerticalLabelHeight -
      options.domain.padding[Position.TOP] -
      options.domain.padding[Position.BOTTOM]
    );
  }

  #domainRotate(selection: any) {
    const { options } = this.calendar.options;
    const labelWidth = options.x.domainHorizontalLabelWidth;

    switch (options.label.rotate) {
      // Rotating the text clockwise
      case 'right':
        selection.attr('transform', (d: any) => {
          const domainWidth = this.#getDomainInsideWidth(d);
          const domainHeight = this.#getDomainInsideHeight(d);
          const s = [
            `rotate(90, ${
              options.label.position === 'right' ? domainWidth : labelWidth
            }, 0)`,
          ];

          switch (options.label.position) {
            case 'right':
              if (options.label.textAlign === 'middle') {
                s.push(`translate(${domainHeight / 2 - labelWidth / 2})`);
              } else if (options.label.textAlign === 'end') {
                s.push(`translate(${domainHeight - labelWidth})`);
              }
              break;
            case 'left':
              if (options.label.textAlign === 'start') {
                s.push(`translate(${labelWidth})`);
              } else if (options.label.textAlign === 'middle') {
                s.push(`translate(${labelWidth / 2 + domainHeight / 2})`);
              } else if (options.label.textAlign === 'end') {
                s.push(`translate(${domainHeight})`);
              }
              break;
            default:
          }

          return s.join(',');
        });
        break;
      // Rotating the text anticlockwise
      case 'left':
        selection.attr('transform', (d: any) => {
          const domainWidth = this.#getDomainInsideWidth(d);
          const domainHeight = this.#getDomainInsideHeight(d);
          const s = [
            `rotate(270, ${
              options.label.position === 'right' ? domainWidth : labelWidth
            }, 0)`,
          ];

          switch (options.label.position) {
            case 'right':
              if (options.label.textAlign === 'start') {
                s.push(`translate(-${domainHeight})`);
              } else if (options.label.textAlign === 'middle') {
                s.push(`translate(-${domainHeight / 2 + labelWidth / 2})`);
              } else if (options.label.textAlign === 'end') {
                s.push(`translate(-${labelWidth})`);
              }
              break;
            case 'left':
              if (options.label.textAlign === 'start') {
                s.push(`translate(${labelWidth - domainHeight})`);
              } else if (options.label.textAlign === 'middle') {
                s.push(`translate(${labelWidth / 2 - domainHeight / 2})`);
              }
              break;
            default:
          }

          return s.join(',');
        });
        break;
      default:
    }
  }
}
