import { formatDate } from '../function';

export default class LabelPainter {
  constructor(calendar) {
    this.calendar = calendar;
  }

  paint(root) {
    const { options } = this.calendar.options;

    if (options.domainLabelFormat !== '') {
      root
        .append('text')
        .attr('class', 'graph-label')
        .attr('y', d => {
          let y = options.domainMargin[0];
          switch (options.label.position) {
            case 'top':
              y += options.domainVerticalLabelHeight / 2;
              break;
            case 'bottom':
              y +=
                this.calendar.calendarPainter.domainPainter.domainHeight(d) +
                options.domainVerticalLabelHeight / 2;
          }

          return (
            y +
            options.label.offset.y *
              ((options.label.rotate === 'right' &&
                options.label.position === 'right') ||
              (options.label.rotate === 'left' &&
                options.label.position === 'left')
                ? -1
                : 1)
          );
        })
        .attr('x', d => {
          let x = options.domainMargin[3];
          switch (options.label.position) {
            case 'right':
              x += this.calendar.calendarPainter.domainPainter.domainWidth(d);
              break;
            case 'bottom':
            case 'top':
              x +=
                this.calendar.calendarPainter.domainPainter.domainWidth(d) / 2;
          }

          if (options.label.align === 'right') {
            return (
              x +
              options.domainHorizontalLabelWidth -
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
          options.verticalDomainLabel ? 'middle' : 'top'
        )
        .text(d => formatDate(new Date(d), options.domainLabelFormat))
        .call(s => this.domainRotate(s));
    }
  }

  domainRotate(selection) {
    const { options } = this.calendar.options;

    switch (options.label.rotate) {
      case 'right':
        selection.attr('transform', d => {
          let s = 'rotate(90), ';
          switch (options.label.position) {
            case 'right':
              s += `translate(-${this.calendar.calendarPainter.domainPainter.domainWidth(
                d
              )} , -${this.calendar.calendarPainter.domainPainter.domainWidth(
                d
              )})`;
              break;
            case 'left':
              s += `translate(0, -${options.domainHorizontalLabelWidth})`;
              break;
          }

          return s;
        });
        break;
      case 'left':
        selection.attr('transform', d => {
          let s = 'rotate(270), ';
          switch (options.label.position) {
            case 'right':
              s += `translate(-${
                this.calendar.calendarPainter.domainPainter.domainWidth(d) +
                options.domainHorizontalLabelWidth
              } , ${this.calendar.calendarPainter.domainPainter.domainWidth(
                d
              )})`;
              break;
            case 'left':
              s += `translate(-${options.domainHorizontalLabelWidth} , ${options.domainHorizontalLabelWidth})`;
              break;
          }

          return s;
        });
        break;
    }
  }
}
