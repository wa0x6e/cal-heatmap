import {
  TOP, RIGHT, BOTTOM, LEFT,
} from '../constant';

const DEFAULT_CLASSNAME = 'graph-label';

export default class DomainLabelPainter {
  constructor(calendar) {
    this.calendar = calendar;
  }

  paint(root) {
    const { options } = this.calendar.options;

    if (options.domainLabelFormat === '') {
      return;
    }

    root
      .selectAll(`.${DEFAULT_CLASSNAME}`)
      .data(
        (d) => [d],
        (d) => d,
      )
      .join((enter) => enter
        .append('text')
        .attr('class', DEFAULT_CLASSNAME)
        .attr('y', (d) => {
          let y =
              options.domainMargin[TOP] +
              options.x.domainVerticalLabelHeight / 2;

          if (options.label.position !== 'top') {
            y += this.#getDomainInsideHeight(d);
          }

          return (
            y +
              options.label.offset.y *
                ((options.label.rotate === 'right' &&
                  options.label.position === 'right') ||
                (options.label.rotate === 'left' &&
                  options.label.position === 'left') ?
                  -1 :
                  1)
          );
        })
        .attr('x', (d) => {
          let x = options.domainMargin[LEFT];

          switch (options.label.position) {
            case 'right':
              x += this.#getDomainInsideWidth(d);
              break;
            case 'bottom':
            case 'top':
              x += this.#getDomainInsideWidth(d) / 2;
              break;
            default:
          }

          if (options.label.align === 'right') {
            return (
              x +
                options.x.domainHorizontalLabelWidth -
                options.label.offset.x *
                  (options.label.rotate === 'right' ? -1 : 1)
            );
          }
          return x + options.label.offset.x;
        })
        .attr('text-anchor', () => {
          switch (options.label.align) {
            case 'start':
            case 'left':
              return 'start';
            case 'end':
            case 'right':
              return 'end';
            default:
              return 'middle';
          }
        })
        .attr('dominant-baseline', () =>
        // eslint-disable-next-line implicit-arrow-linebreak
          (options.x.verticalDomainLabel ? 'middle' : 'top'))
        .text((d) =>
        // eslint-disable-next-line implicit-arrow-linebreak
          this.calendar.helpers.DateHelper.format(
            d,
            options.domainLabelFormat,
          ))
        .call((s) => this.#domainRotate(s)));
  }

  #getDomainInsideWidth(d) {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d).width -
      options.x.domainHorizontalLabelWidth +
      options.domainGutter +
      options.domainMargin[RIGHT] +
      options.domainMargin[LEFT]
    );
  }

  #getDomainInsideHeight(d) {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d).height -
      options.x.domainVerticalLabelHeight +
      options.domainGutter +
      options.domainMargin[TOP] +
      options.domainMargin[BOTTOM]
    );
  }

  #domainRotate(selection) {
    const { options } = this.calendar.options;

    switch (options.label.rotate) {
      case 'right':
        selection.attr('transform', (d) => {
          let s = 'rotate(90), ';
          const width = this.#getDomainInsideWidth(d);
          switch (options.label.position) {
            case 'right':
              s += `translate(-${width} , -${width})`;
              break;
            case 'left':
              s += `translate(0, -${options.x.domainHorizontalLabelWidth})`;
              break;
            default:
          }

          return s;
        });
        break;
      case 'left':
        selection.attr('transform', (d) => {
          let s = 'rotate(270), ';
          const width = this.#getDomainInsideWidth(d);
          switch (options.label.position) {
            case 'right':
              s += `translate(-${
                width + options.x.domainHorizontalLabelWidth
              } , ${width})`;
              break;
            case 'left':
              s +=
                `translate(-${options.x.domainHorizontalLabelWidth}, ` +
                `${options.x.domainHorizontalLabelWidth})`;
              break;
            default:
          }

          return s;
        });
        break;
      default:
    }
  }
}
