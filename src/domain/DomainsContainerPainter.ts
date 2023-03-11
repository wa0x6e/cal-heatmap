import { select } from 'd3-selection';
import DomainPainter from './DomainPainter';
import DomainLabelPainter from './DomainLabelPainter';
import SubDomainPainter from '../subDomain/SubDomainPainter';
import { ScrollDirection } from '../constant';

import type CalHeatmap from '../CalHeatmap';
import type { Dimensions } from '../index';

const BASE_SELECTOR = '.ch-domain-container';
const TRANSITION_CLASSNAME = 'in-transition';

class DomainsContainerPainter {
  calendar: CalHeatmap;

  domainPainter: DomainPainter;

  domainLabelPainter: DomainLabelPainter;

  subDomainPainter: SubDomainPainter;

  dimensions: Dimensions;

  root: any;

  transitionsQueueCount: number;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;

    this.domainPainter = new DomainPainter(calendar);
    this.subDomainPainter = new SubDomainPainter(calendar);
    this.domainLabelPainter = new DomainLabelPainter(calendar);
    this.dimensions = {
      width: 0,
      height: 0,
    };
    this.transitionsQueueCount = 0;
  }

  setup() {
    this.root = this.calendar.calendarPainter.root
      .attr('x', 0)
      .attr('y', 0)
      .append('svg')
      .attr('class', BASE_SELECTOR.slice(1))
      .append('svg')
      .attr('class', `${BASE_SELECTOR.slice(1)}-animation-wrapper`);
  }

  paint(scrollDirection: ScrollDirection): Promise<unknown>[] {
    this.#startAnimation();

    const result = this.domainPainter.paint(scrollDirection, this.root);
    this.subDomainPainter.paint(this.domainPainter.root);
    this.domainLabelPainter.paint(this.domainPainter.root);

    this.#recomputeDimensions();

    Promise.allSettled(result).then(() => {
      this.#endAnimation();
    });

    return result;
  }

  updatePosition() {
    if (!this.root?.node()) {
      return Promise.resolve();
    }

    const { animationDuration } = this.calendar.options.options;
    const topHeight = this.calendar.pluginManager.getHeightFromPosition('top');
    const leftWidth = this.calendar.pluginManager.getWidthFromPosition('left');

    return [
      select(this.root.node().parentNode)
        .transition()
        .duration(animationDuration)
        .call((selection: any) => {
          selection.attr('x', leftWidth).attr('y', topHeight);
        })
        .end(),
    ];
  }

  width(): Dimensions['width'] {
    return this.dimensions.width;
  }

  height(): Dimensions['height'] {
    return this.dimensions.height;
  }

  destroy(): Promise<unknown> {
    this.#startAnimation();

    return Promise.resolve();
  }

  #startAnimation() {
    if (this.root?.node()) {
      this.transitionsQueueCount += 1;
      select(this.root.node().parentNode).classed(TRANSITION_CLASSNAME, true);
    }
  }

  #endAnimation() {
    if (this.root?.node()) {
      this.transitionsQueueCount -= 1;

      if (this.transitionsQueueCount === 0) {
        select(this.root.node().parentNode).classed(
          TRANSITION_CLASSNAME,
          false,
        );
      }
    }
  }

  #recomputeDimensions(): void {
    const {
      animationDuration,
      verticalOrientation,
      domain: { gutter },
    } = this.calendar.options.options;
    const { dimensions: domainsDimensions } = this.domainPainter;

    this.dimensions = {
      width: domainsDimensions.width - (verticalOrientation ? 0 : gutter),
      height: domainsDimensions.height - (!verticalOrientation ? 0 : gutter),
    };

    this.root
      .transition()
      .duration(animationDuration)
      .attr('width', this.dimensions.width)
      .attr('height', this.dimensions.height);
  }
}

export default DomainsContainerPainter;
