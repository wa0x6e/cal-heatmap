'use strict';

import { interpolateHcl } from 'd3-interpolate';
import { scaleLinear, scaleThreshold } from 'd3-scale';

export default class Legend {
  constructor(calendar) {
    this.calendar = calendar;
    this.computeDim();

    if (calendar.options.legendColors !== null) {
      this.buildColors();
    }
  }

  computeDim() {
    const options = this.calendar.options; // Shorter accessor for variable name mangling when minifying
    this.dim = {
      width:
        options.legendCellSize * (options.legend.length + 1) +
        options.legendCellPadding * options.legend.length,
      height: options.legendCellSize,
    };
  }

  remove() {
    this.calendar.root.select('.graph-legend').remove();
    this.calendar.resize();
  }

  redraw(width) {
    if (!this.calendar.options.displayLegend) {
      return false;
    }

    const parent = this;
    const calendar = this.calendar;
    let legend = calendar.root;
    let legendItem;
    const options = calendar.options; // Shorter accessor for variable name mangling when minifying

    this.computeDim();

    const _legend = options.legend.slice(0);
    _legend.push(_legend[_legend.length - 1] + 1);

    const legendElement = calendar.root.select('.graph-legend');
    if (!legendElement.empty()) {
      legend = legendElement;
      legendItem = legend.select('g').selectAll('rect').data(_legend);
    } else {
      // Creating the new legend DOM if it doesn't already exist
      legend =
        options.legendVerticalPosition === 'top'
          ? legend.insert('svg', '.graph')
          : legend.append('svg');

      legend.attr('x', getLegendXPosition()).attr('y', getLegendYPosition());

      legendItem = legend
        .attr('class', 'graph-legend')
        .attr('height', parent.getDim('height'))
        .attr('width', parent.getDim('width'))
        .append('g')
        .selectAll()
        .data(_legend);
    }

    legendItem
      .enter()
      .append('rect')
      .call(legendCellLayout)
      .attr('class', function (d) {
        return calendar.Legend.getClass(d, calendar.legendScale === null);
      })
      .attr('fill-opacity', 0)
      .call(function (selection) {
        if (
          calendar.legendScale !== null &&
          options.legendColors !== null &&
          options.legendColors.hasOwnProperty('base')
        ) {
          selection.attr('fill', options.legendColors.base);
        }
      })
      .append('title');

    legendItem
      .exit()
      .transition()
      .duration(options.animationDuration)
      .attr('fill-opacity', 0)
      .remove();

    legendItem
      .transition()
      .delay(function (d, i) {
        return (options.animationDuration * i) / 10;
      })
      .call(legendCellLayout)
      .attr('fill-opacity', 1)
      .call(function (element) {
        element.attr('fill', function (d, i) {
          if (calendar.legendScale === null) {
            return '';
          }

          if (i === 0) {
            return calendar.legendScale(d - 1);
          }
          return calendar.legendScale(options.legend[i - 1]);
        });

        element.attr('class', function (d) {
          return calendar.Legend.getClass(d, calendar.legendScale === null);
        });
      });

    function legendCellLayout(selection) {
      selection
        .attr('width', options.legendCellSize)
        .attr('height', options.legendCellSize)
        .attr('x', function (d, i) {
          return i * (options.legendCellSize + options.legendCellPadding);
        });
    }

    legendItem.select('title').text(function (d, i) {
      if (i === 0) {
        return calendar.formatStringWithObject(
          options.legendTitleFormat.lower,
          {
            min: options.legend[i],
            name: options.itemName[1],
          }
        );
      } else if (i === _legend.length - 1) {
        return calendar.formatStringWithObject(
          options.legendTitleFormat.upper,
          {
            max: options.legend[i - 1],
            name: options.itemName[1],
          }
        );
      } else {
        return calendar.formatStringWithObject(
          options.legendTitleFormat.inner,
          {
            down: options.legend[i - 1],
            up: options.legend[i],
            name: options.itemName[1],
          }
        );
      }
    });

    legend
      .transition()
      .duration(options.animationDuration)
      .attr('x', getLegendXPosition())
      .attr('y', getLegendYPosition())
      .attr('width', parent.getDim('width'))
      .attr('height', parent.getDim('height'));

    legend
      .select('g')
      .transition()
      .duration(options.animationDuration)
      .attr('transform', function () {
        if (options.legendOrientation === 'vertical') {
          return (
            'rotate(90 ' +
            options.legendCellSize / 2 +
            ' ' +
            options.legendCellSize / 2 +
            ')'
          );
        }
        return '';
      });

    function getLegendXPosition() {
      switch (options.legendHorizontalPosition) {
        case 'right':
          if (
            options.legendVerticalPosition === 'center' ||
            options.legendVerticalPosition === 'middle'
          ) {
            return width + options.legendMargin[3];
          }
          return width - parent.getDim('width') - options.legendMargin[1];
        case 'middle':
        case 'center':
          return Math.round(width / 2 - parent.getDim('width') / 2);
        default:
          return options.legendMargin[3];
      }
    }

    function getLegendYPosition() {
      if (options.legendVerticalPosition === 'bottom') {
        return (
          calendar.graphDim.height +
          options.legendMargin[0] -
          options.domainGutter -
          options.cellPadding
        );
      }
      return options.legendMargin[0];
    }

    calendar.resize();
  }

  /**
   * Return the dimension of the legend
   *
   * Takes into account rotation
   *
   * @param  string axis Width or height
   * @return int height or width in pixels
   */
  getDim(axis) {
    const isHorizontal =
      this.calendar.options.legendOrientation === 'horizontal';

    switch (axis) {
      case 'width':
        return this.dim[isHorizontal ? 'width' : 'height'];
      case 'height':
        return this.dim[isHorizontal ? 'height' : 'width'];
    }
  }

  buildColors() {
    const options = this.calendar.options; // Shorter accessor for variable name mangling when minifying

    if (options.legendColors === null) {
      this.calendar.legendScale = null;
      return false;
    }

    let _colorRange = [];

    if (Array.isArray(options.legendColors)) {
      _colorRange = options.legendColors;
    } else if (
      options.legendColors.hasOwnProperty('min') &&
      options.legendColors.hasOwnProperty('max')
    ) {
      _colorRange = [options.legendColors.min, options.legendColors.max];
    } else {
      options.legendColors = null;
      return false;
    }

    const _legend = options.legend.slice(0);

    if (_legend[0] > 0) {
      _legend.unshift(0);
    } else if (_legend[0] <= 0) {
      // Let's guess the leftmost value, it we have to add one
      _legend.unshift(
        _legend[0] - (_legend[_legend.length - 1] - _legend[0]) / _legend.length
      );
    }

    const colorScale = scaleLinear()
      .range(_colorRange)
      .interpolate(interpolateHcl)
      .domain([Math.min(..._legend), Math.max(..._legend)]);
    const legendColors = _legend.map(function (element) {
      return colorScale(element);
    });
    this.calendar.legendScale = scaleThreshold()
      .domain(options.legend)
      .range(legendColors);

    return true;
  }

  /**
   * Return the classname on the legend for the specified value
   *
   * @param integer n Value associated to a date
   * @param bool withCssClass Whether to display the css class used to style the cell.
   *                          Disabling will allow styling directly via html fill attribute
   *
   * @return string Classname according to the legend
   */
  getClass(n, withCssClass) {
    if (n === null || isNaN(n)) {
      return '';
    }

    let index = [this.calendar.options.legend.length + 1];

    for (
      let i = 0, total = this.calendar.options.legend.length - 1;
      i <= total;
      i++
    ) {
      if (this.calendar.options.legend[0] > 0 && n < 0) {
        index = ['1', 'i'];
        break;
      }

      if (n <= this.calendar.options.legend[i]) {
        index = [i + 1];
        break;
      }
    }

    if (n === 0) {
      index.push(0);
    }

    index.unshift('');
    return (index.join(' r') + (withCssClass ? index.join(' q') : '')).trim();
  }
}
