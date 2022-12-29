import type CalHeatmap from '../CalHeatmap';

const BASE_CLASSNAME = 'sublabel';

export default class DomainSubLabel {
  calendar: CalHeatmap;

  dimensions: {
    width: number;
    height: number;
  };

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(root: any): Promise<unknown> {
    const { domain: { subLabel }, subDomain } = this.calendar.options.options;

    if (!subLabel) {
      this.dimensions = {
        width: 0,
        height: 0,
      };
      root.select(`.${BASE_CLASSNAME}`).remove();

      return Promise.resolve();
    }

    const { gutter } = subDomain;
    const { radius, text } = subLabel;
    let { width, height } = subLabel;
    if (!width) {
      width = subDomain.width;
    }
    if (!height) {
      height = subDomain.height;
    }

    const labels = text(this.calendar.dateHelper.momentInstance);

    this.dimensions = {
      width: width + gutter,
      height: height + labels.length * height * labels.length - 1,
    };

    let dayLabelSvgGroup = root.select(`.${BASE_CLASSNAME}`);
    if (dayLabelSvgGroup.empty()) {
      dayLabelSvgGroup = root
        .append('svg')
        .attr('class', BASE_CLASSNAME)
        .attr('x', 0)
        .attr('y', 0);
    }

    dayLabelSvgGroup
      .selectAll('g')
      .data(labels)
      .enter()
      .append('g')
      .call((selection: any) => selection
        .append('rect')
        .attr('class', `${BASE_CLASSNAME}-rect`)
        .attr('style', 'fill: transparent;')
        .attr('width', width)
        .attr('height', height)
        .attr('rx', radius && radius > 0 ? radius : null)
        .attr('ry', radius && radius > 0 ? radius : null)
        .attr('x', 0)
        .attr('y', (data: any, i: number) => i * (height! + gutter)))
      .call((selection: any) => selection
        .append('text')
        .attr('class', `${BASE_CLASSNAME}-text`)
        .attr('dominant-baseline', 'central')
        .attr('text-anchor', 'middle')
        .attr('x', width! / 2)
        .attr(
          'y',
          (data: any, i: number) => i * (height! + gutter) + height! / 2,
        )
        .text((data: any) => data));

    return Promise.resolve();
  }
}
