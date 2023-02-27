import type CalHeatmap from '../CalHeatmap';
import type { Dimensions } from '../index';

const BASE_CLASSNAME = 'sublabel';
const SEP = '||';

export default class DomainSubLabel {
  calendar: CalHeatmap;

  dimensions: Dimensions;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(root: any): Promise<unknown> {
    const {
      domain: { subLabel },
      subDomain,
    } = this.calendar.options.options;

    if (!subLabel) {
      this.dimensions = {
        width: 0,
        height: 0,
      };
      root.select(`.${BASE_CLASSNAME}`).remove();

      return Promise.resolve();
    }

    const { radius, text } = subLabel;
    let {
      width, height, gutter, textAlign,
    } = subLabel;
    if (!width) {
      width = subDomain.width;
    }
    if (!height) {
      height = subDomain.height;
    }
    if (!gutter) {
      gutter = subDomain.gutter;
    }
    if (!textAlign) {
      textAlign = 'start';
    }

    const labels = text().map((t: string, i: number) => `${i}${SEP}${t}`);

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
      .join(
        (enter: any) => enter
          .append('g')
          .call((selection: any) => selection
            .append('rect')
            .attr('class', `${BASE_CLASSNAME}-rect`)
            .attr('style', 'fill: transparent;')
            .attr('x', 0)
            .call((s: any) =>
            // eslint-disable-next-line implicit-arrow-linebreak
              this.#setRectAttr(s, width!, height!, gutter!, radius)))
          .call((selection: any) => selection
            .append('text')
            .attr('class', `${BASE_CLASSNAME}-text`)
            .attr('dominant-baseline', 'central')
            .attr('text-anchor', 'middle')
            .call((s: any) =>
            // eslint-disable-next-line implicit-arrow-linebreak
              this.#setTextAttr(s, width!, height!, gutter!, textAlign!))),
        (update: any) => update
          .call((selection: any) => selection.selectAll('rect').call((s: any) =>
          // eslint-disable-next-line implicit-arrow-linebreak
            this.#setRectAttr(s, width!, height!, gutter!, radius)))
          .call((selection: any) => selection.selectAll('text').call((s: any) =>
          // eslint-disable-next-line implicit-arrow-linebreak
            this.#setTextAttr(s, width!, height!, gutter!, textAlign!))),
      );

    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  #setRectAttr(
    selection: any,
    width: number,
    height: number,
    gutter: number,
    radius?: number,
  ) {
    selection
      .attr('width', width)
      .attr('height', height)
      .attr('rx', radius && radius > 0 ? radius : null)
      .attr('ry', radius && radius > 0 ? radius : null)
      .attr('y', (data: string) => {
        const i = +data.split(SEP)[0];
        return i * (height! + gutter);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  #setTextAttr(
    selection: any,
    width: number,
    height: number,
    gutter: number,
    textAlign: string,
  ): void {
    selection
      .attr('text-anchor', textAlign)
      .attr('x', this.#getX(textAlign, width!))
      .attr('y', (data: string) => {
        const i = +data.split(SEP)[0];
        return i * (height! + gutter) + height! / 2;
      })
      .text((data: string) => data.split(SEP)[1]);
  }

  // eslint-disable-next-line class-methods-use-this
  #getX(textAlign: string, width: number) {
    switch (textAlign) {
      case 'start':
        return 0;
      case 'middle':
        return width / 2;
      case 'end':
        return width;
      default:
        return 0;
    }
  }
}
