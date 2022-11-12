import { getHighlightClassName, formatDate } from '../function';

export default class subDomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
  }

  paint(root) {
    const { options } = this.calendar.options;

    const subDomainSvgGroup = root
      .append('svg')
      .attr('x', () => {
        if (options.label.position === 'left') {
          return options.domainHorizontalLabelWidth + options.domainMargin[3];
        }
        return options.domainMargin[3];
      })
      .attr('y', () => {
        if (options.label.position === 'top') {
          return options.domainVerticalLabelHeight + options.domainMargin[0];
        }

        return options.domainMargin[0];
      })
      .attr('class', 'graph-subdomain-group');

    const rect = subDomainSvgGroup
      .selectAll('g')
      .data(d => this.calendar.domainCollection.get(d))
      .enter()
      .append('g');

    rect
      .append('rect')
      .attr(
        'class',
        d =>
          `graph-rect${getHighlightClassName(d.t, options)}${
            options.onClick !== null ? ' hover_cursor' : ''
          }`
      )
      .attr('width', options.cellSize)
      .attr('height', options.cellSize)
      .attr('x', d => this.positionSubDomainX(d.t))
      .attr('y', d => this.positionSubDomainY(d.t))
      .on('click', (ev, d) => {
        if (options.onClick !== null) {
          return this.onClick(new Date(d.t), d.v);
        }
      })
      .on('mouseover', d => {
        if (options.onMouseOver !== null) {
          return this.onMouseOver(new Date(d.t), d.v);
        }
      })
      .on('mouseout', d => {
        if (options.onMouseOut !== null) {
          return this.onMouseOut(new Date(d.t), d.v);
        }
      });
    // .call(selection => {
    //   if (options.cellRadius > 0) {
    //     selection
    //       .attr('rx', options.cellRadius)
    //       .attr('ry', options.cellRadius);
    //   }

    //   if (
    //     this.calendar.legendScale !== null &&
    //     options.legendColors !== null &&
    //     options.legendColors.hasOwnProperty('base')
    //   ) {
    //     selection.attr('fill', options.legendColors.base);
    //   }

    //   if (options.tooltip) {
    //     selection.on('mouseover', function (ev, d) {
    //       const domainNode = this.parentNode.parentNode;

    //       const showTooltip = function (title) {
    //         this.tooltip.html(title).attr('style', 'display: block;');

    //         let tooltipPositionX =
    //           this.positionSubDomainX(d.t) -
    //           this.tooltip.node().offsetWidth / 2 +
    //           options.cellSize / 2;
    //         let tooltipPositionY =
    //           this.positionSubDomainY(d.t) -
    //           this.tooltip.node().offsetHeight -
    //           options.cellSize / 2;

    //         // Offset by the domain position
    //         tooltipPositionX += parseInt(domainNode.getAttribute('x'), 10);
    //         tooltipPositionY += parseInt(domainNode.getAttribute('y'), 10);

    //         // Offset by the calendar position (when legend is left/top)
    //         tooltipPositionX += parseInt(
    //           this.root.select('.graph').attr('x'),
    //           10
    //         );
    //         tooltipPositionY += parseInt(
    //           this.root.select('.graph').attr('y'),
    //           10
    //         );

    //         // Offset by the inside domain position (when label is left/top)
    //         tooltipPositionX += parseInt(
    //           domainNode.parentNode.getAttribute('x'),
    //           10
    //         );
    //         tooltipPositionY += parseInt(
    //           domainNode.parentNode.getAttribute('y'),
    //           10
    //         );

    //         this.tooltip.attr(
    //           'style',
    //           'display: block; ' +
    //             `left: ${tooltipPositionX}px; ` +
    //             `top: ${tooltipPositionY}px;`
    //         );
    //       };

    //       if (options.onTooltip) {
    //         showTooltip(this.calendar.options.onTooltip(new Date(d.t), d.v));
    //       } else {
    //         showTooltip(getSubDomainTitle(d, this.calendar.options));
    //       }
    //     });

    //     selection.on('mouseout', () => {
    //       this.tooltip.attr('style', 'display:none').html('');
    //     });
    //   }
    // });

    if (!options.tooltip) {
      rect
        .append('title')
        .text(d => formatDate(new Date(d.t), options.subDomainDateFormat));
    }

    if (options.subDomainTextFormat !== null) {
      rect
        .append('text')
        .attr(
          'class',
          d => `subdomain-text${getHighlightClassName(d.t, options)}`
        )
        .attr('x', d => this.positionSubDomainX(d.t) + options.cellSize / 2)
        .attr('y', d => this.positionSubDomainY(d.t) + options.cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(d => formatDate(new Date(d.t), options.subDomainTextFormat));
    }
  }

  positionSubDomainX(d) {
    const { options } = this.calendar.options;

    const index = this.calendar.domainSkeleton
      .at(options.subDomain)
      .position.x(new Date(d));
    return index * options.cellSize + index * options.cellPadding;
  }

  positionSubDomainY(d) {
    const { options } = this.calendar.options;

    const index = this.calendar.domainSkeleton
      .at(options.subDomain)
      .position.y(new Date(d));
    return index * options.cellSize + index * options.cellPadding;
  }
}
