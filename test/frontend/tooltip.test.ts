import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import Tooltip from '../../src/plugins/Tooltip';
import CalHeatmap from '../../src/CalHeatmap';

describe('Tooltip', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('enables the tooltip', () => {
    expect(select('#ch-tooltip').node()).toBeNull();

    cal.on('fill', () => {
      cal.eventEmitter.emit(
        'mouseover',
        {
          target: select('.graph-rect').node(),
        },
        1,
        1,
      );

      expect(select('#ch-tooltip').attr('data-show')).toBe('1');
      expect(select('#ch-tooltip-body').html()).not.toBeNull();
    });

    cal.paint({}, [[Tooltip, { enable: true }]]);
    expect(select('#ch-tooltip').node()).not.toBeNull();
  });

  it('disables the tooltip', () => {
    expect(select('#ch-tooltip').node()).toBeNull();

    cal.paint({}, [[Tooltip, { enable: false }]]);

    expect(select('#ch-tooltip').node()).toBeNull();
  });

  it('formats the title with the user function', () => {
    const date = new Date(2000, 0, 5);
    const data: any[] = [];
    data.push({
      time: +date,
      value: 10,
    });

    cal.on('fill', () => {
      cal.eventEmitter.emit(
        'mouseover',
        {
          target: select('.graph-rect').node(),
        },
        +date,
        10,
      );

      expect(select('#ch-tooltip-body').html()).toBe('2000-10');
      expect(select('#ch-tooltip').attr('data-show')).toBe('1');
    });

    cal.paint(
      {
        range: 1,
        date: { start: date },
        data: { source: data, x: 'time', y: 'value' },
        domain: { type: 'year' },
        subDomain: {
          type: 'month',
        },
      },
      [
        [
          Tooltip,
          {
            show: true,
            text: (d: number, value: number) =>
              // eslint-disable-next-line implicit-arrow-linebreak
              `${new Date(d).getFullYear()}-${value}`,
          },
        ],
      ],
    );
  });

  it('formats the title with the default function', () => {
    const date = new Date(2000, 0, 5);
    const data: any[] = [];
    data.push({
      time: +date,
      value: 10,
    });

    cal.on('fill', () => {
      cal.eventEmitter.emit(
        'mouseover',
        {
          target: select('.graph-rect').node(),
        },
        +date,
        10,
      );

      expect(select('#ch-tooltip-body').html()).toBe(
        `10 - ${new Date(date).toISOString()}`,
      );

      expect(select('#ch-tooltip').attr('data-show')).toBe('1');
    });

    cal.paint(
      {
        range: 1,
        date: { start: date },
        data: { source: data, x: 'time', y: 'value' },
        domain: { type: 'year' },
        subDomain: {
          type: 'month',
        },
      },
      [[Tooltip, { enable: true }]],
    );
  });

  it('destroys the tooltip along the calendar', async () => {
    cal.paint({}, [[Tooltip, { enable: true }]]);
    expect(select('#ch-tooltip').node()).not.toBeNull();
    await cal.destroy();
    expect(select('#ch-tooltip').node()).toBeNull();
  });
});
