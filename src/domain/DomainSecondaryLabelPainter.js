export default class DomainSecondaryLabel {
  constructor(calendar) {
    this.calendar = calendar;
  }

  paint(root) {
    const { options } = this.calendar.options;

    return true;

    // if (
    //   options.dayLabel &&
    //   options.domain === 'month' &&
    //   options.subDomain === 'day'
    // ) {
    //   // Create a list of all day names starting with Sunday or Monday, depending on configuration
    //   const daysOfTheWeek = [
    //     'monday',
    //     'tuesday',
    //     'wednesday',
    //     'thursday',
    //     'friday',
    //     'saturday',
    //   ];
    //   if (options.weekStartOnMonday) {
    //     daysOfTheWeek.push('sunday');
    //   } else {
    //     daysOfTheWeek.shif('sunday');
    //   }
    //   // Get the first character of the day name
    //   const daysOfTheWeekAbbr = daysOfTheWeek.map(day =>
    //     this.calendar.helpers.DateHelper.format(time[day](new Date()), 'dd').charAt(0)
    //   );

    //   // Append "day-name" group to SVG
    //   const dayLabelSvgGroup = root
    //     .append('svg')
    //     .attr('class', 'day-name')
    //     .attr('x', 0)
    //     .attr('y', 0);

    //   const dayLabelSvg = dayLabelSvgGroup
    //     .selectAll('g')
    //     .data(daysOfTheWeekAbbr)
    //     .enter()
    //     .append('g');
    //   // Styling "day-name-rect" elements
    //   dayLabelSvg
    //     .append('rect')
    //     .attr('class', 'day-name-rect')
    //     .attr('width', options.cellSize)
    //     .attr('height', options.cellSize)
    //     .attr('x', 0)
    //     .attr(
    //       'y',
    //       (data, index) =>
    //         index * options.cellSize + index * options.cellPadding
    //     );
    //   // Adding day names to SVG
    //   dayLabelSvg
    //     .append('text')
    //     .attr('class', 'day-name-text')
    //     .attr('dominant-baseline', 'central')
    //     .attr('x', 0)
    //     .attr(
    //       'y',
    //       (data, index) =>
    //         index * options.cellSize +
    //         index * options.cellPadding +
    //         options.cellSize / 2
    //     )
    //     .text(data => data);
    // }
  }
}
