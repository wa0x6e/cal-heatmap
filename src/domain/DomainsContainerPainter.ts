import DomainPainter from './DomainPainter';
import DomainLabelPainter from './DomainLabelPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';
import { ScrollDirection } from '../constant';

import type CalHeatmap from '../CalHeatmap';
import type { Dimensions } from '../index';

class DomainsContainerPainter {
  calendar: CalHeatmap;

  domainPainter: DomainPainter;

  domainLabelPainter: DomainLabelPainter;

  subDomainPainter: SubDomainPainter;

  dimensions: Dimensions;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;

    this.domainPainter = new DomainPainter(calendar);
    this.subDomainPainter = new SubDomainPainter(calendar);
    this.domainLabelPainter = new DomainLabelPainter(calendar);
    this.dimensions = {
      width: 0,
      height: 0,
    };
  }

  paint(
    scrollDirection: ScrollDirection,
    calendarNode: any,
  ): Promise<unknown>[] {
    const result = this.domainPainter.paint(scrollDirection, calendarNode);
    this.subDomainPainter.paint(this.domainPainter.root);
    this.domainLabelPainter.paint(this.domainPainter.root);

    this.#recomputeDimensions();

    return result;
  }

  width(): Dimensions['width'] {
    return this.dimensions.width;
  }

  height(): Dimensions['height'] {
    return this.dimensions.height;
  }

  #recomputeDimensions(): void {
    const {
      verticalOrientation,
      domain: { gutter },
    } = this.calendar.options.options;
    const { dimensions: domainsDimensions } = this.domainPainter;

    this.dimensions = {
      width: domainsDimensions.width - (verticalOrientation ? 0 : gutter),
      height: domainsDimensions.height - (!verticalOrientation ? 0 : gutter),
    };
  }
}

export default DomainsContainerPainter;
