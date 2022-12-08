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
    const { width, height, gutter } = options.subDomain;

    if (
      options.dayLabel === true &&
      options.domain.type === 'month' &&
      options.subDomain.type === 'day'
    ) {
      const dayNames = this.calendar.helpers.DateHelper.momentInstance
        .weekdays()
        .map((d) => d[0]);

      this.dimensions = {
        width: width + gutter,
        height: height + dayNames.length * height * dayNames.length - 1,
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
        .attr('width', width)
        .attr('height', height)
        .attr('x', 0)
        .attr('y', (data, i) => i * height + i * gutter);

      dayLabelSvg
        .append('text')
        .attr('class', `${BASE_CLASSNAME}-text`)
        .attr('dominant-baseline', 'central')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', (data, i) => i * height + i * gutter + height / 2)
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
