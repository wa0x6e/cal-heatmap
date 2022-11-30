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
      .join(
        (enter) => enter
          .append('text')
          .attr('class', DEFAULT_CLASSNAME)
          .attr('x', (d) => this.#getX(d))
          .attr('y', (d) => this.#getY(d))
          .attr('text-anchor', options.label.textAlign)
          .attr('dominant-baseline', () => this.#textVerticalAlign())
          .text((d) =>
          // eslint-disable-next-line implicit-arrow-linebreak
            this.calendar.helpers.DateHelper.format(
              d,
              options.domainLabelFormat,
            ))
          .call((s) => this.#domainRotate(s)),
        (update) => {
          update
            .attr('x', (d) => this.#getX(d))
            .attr('y', (d) => this.#getY(d))
            .attr('text-anchor', options.label.textAlign)
            .attr('dominant-baseline', () => this.#textVerticalAlign())
            .text((d) =>
              // eslint-disable-next-line implicit-arrow-linebreak
              this.calendar.helpers.DateHelper.format(
                d,
                options.domainLabelFormat,
              ))
            .call((s) => this.#domainRotate(s));
        },
      );
  }

  #textVerticalAlign() {
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

  #getX(d) {
    const { options } = this.calendar.options;

    let x = options.domainMargin[LEFT];

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

  #getY(d) {
    const { options } = this.calendar.options;

    let y = options.domainMargin[TOP] + options.x.domainVerticalLabelHeight / 2;

    if (options.label.position === 'bottom') {
      y += this.#getDomainInsideHeight(d);
    }

    return y + options.label.offset.y;
  }

  #getDomainInsideWidth(d) {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d).width -
      options.x.domainHorizontalLabelWidth -
      options.domainGutter -
      options.domainMargin[RIGHT] -
      options.domainMargin[LEFT]
    );
  }

  #getDomainInsideHeight(d) {
    const { options } = this.calendar.options;
    return (
      this.calendar.calendarPainter.domainPainter.coordinates.at(d).height -
      options.x.domainVerticalLabelHeight -
      options.domainGutter -
      options.domainMargin[TOP] -
      options.domainMargin[BOTTOM]
    );
  }

  #domainRotate(selection) {
    const { options } = this.calendar.options;
    const labelWidth = options.x.domainHorizontalLabelWidth;

    switch (options.label.rotate) {
      // Rotating the text clockwise
      case 'right':
        selection.attr('transform', (d) => {
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
        selection.attr('transform', (d) => {
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
