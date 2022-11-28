import { X, Y } from '../constant';

const BASE_CLASSNAME = 'weekday-label';

export default class DomainSecondaryLabel {
  constructor(calendar) {
    this.calendar = calendar;
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(root) {
    const { options } = this.calendar.options;

    if (
      options.dayLabel === true &&
      options.domain === 'month' &&
      options.subDomain === 'day'
    ) {
      const dayNames = this.calendar.helpers.DateHelper.momentInstance
        .weekdays()
        .map((d) => d[0]);

      this.dimensions = {
        width: options.cellSize[X] + options.cellPadding,
        height:
          options.cellSize[Y] +
          dayNames.length * options.cellSize[Y] * dayNames.length -
          1,
      };

      let dayLabelSvgGroup = root.select(`.${BASE_CLASSNAME}`);
      if (dayLabelSvgGroup.empty()) {
        dayLabelSvgGroup = root
          .append('svg')
          .attr('class', BASE_CLASSNAME)
          .attr('x', 0)
          .attr('y', 0);
      }

      const dayLabelSvg = dayLabelSvgGroup
        .selectAll('g')
        .data(dayNames)
        .enter()
        .append('g');

      dayLabelSvg
        .append('rect')
        .attr('class', `${BASE_CLASSNAME}-rect`)
        .attr('width', options.cellSize[X])
        .attr('height', options.cellSize[Y])
        .attr('x', 0)
        .attr(
          'y',
          (data, i) => i * options.cellSize[Y] + i * options.cellPadding,
        );

      dayLabelSvg
        .append('text')
        .attr('class', `${BASE_CLASSNAME}-text`)
        .attr('dominant-baseline', 'central')
        .attr('text-anchor', 'middle')
        .attr('x', options.cellSize[X] / 2)
        .attr(
          'y',
          (data, i) => i * options.cellSize[Y] +
            i * options.cellPadding +
            options.cellSize[Y] / 2,
        )
        .text((data) => data);
    } else {
      this.dimensions = {
        width: 0,
        height: 0,
      };
      root.select(`.${BASE_CLASSNAME}`).remove();
    }
  }
}
