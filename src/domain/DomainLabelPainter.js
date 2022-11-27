import {
  TOP, RIGHT, BOTTOM, LEFT,
} from '../constant';

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
      .append('text')
      .attr('class', 'graph-label')
      .attr('y', (d) => {
        let y =
          options.domainMargin[TOP] + options.domainVerticalLabelHeight / 2;

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
            options.domainHorizontalLabelWidth -
            options.label.offset.x * (options.label.rotate === 'right' ? -1 : 1)
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
        (options.verticalDomainLabel ? 'middle' : 'top'))
      .text((d) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        this.calendar.helpers.DateHelper.format(d, options.domainLabelFormat))
      .call((s) => this.#domainRotate(s));
  }

  #getDomainInsideWidth(d) {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d).width -
      options.domainHorizontalLabelWidth +
      options.domainGutter +
      options.domainMargin[RIGHT] +
      options.domainMargin[LEFT]
    );
  }

  #getDomainInsideHeight(d) {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d).height -
      options.domainVerticalLabelHeight +
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
              s += `translate(0, -${options.domainHorizontalLabelWidth})`;
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
                width + options.domainHorizontalLabelWidth
              } , ${width})`;
              break;
            case 'left':
              s += `translate(-${
                options.domainHorizontalLabelWidth
              }, ${options`${options.domainHorizontalLabelWidth})`}`;
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
