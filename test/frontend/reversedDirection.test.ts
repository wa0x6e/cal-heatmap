import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('on non reversed direction', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');

    cal.paint({
      range: 12,
      date: {
        start: new Date(2020, 0, 1, 0, 0, 0),
      },
    });
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('sort the domain by ascending order', () => {
    const selection = select('#cal-heatmap').selectAll('.graph-domain');
    const monthNumbers = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const elem of selection) {
      monthNumbers.push(
        +select(elem).attr('class').replace('graph-domain h_', ''),
      );
    }

    expect(monthNumbers).toEqual(
      Array.from(monthNumbers).sort((a, b) => a - b),
    );
  });
});

describe('on reversed direction', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');

    cal.paint({
      range: 12,
      reversedDirection: true,
      date: {
        start: new Date(2020, 0, 1, 0, 0, 0),
      },
    });
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('sort the domain by descending order', () => {
    const selection = select('#cal-heatmap').selectAll('.graph-domain');
    const monthNumbers = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const elem of selection) {
      monthNumbers.push(
        +select(elem).attr('class').replace('graph-domain h_', ''),
      );
    }

    expect(monthNumbers).toEqual(
      Array.from(monthNumbers).sort((a, b) => b - a),
    );
  });
});
