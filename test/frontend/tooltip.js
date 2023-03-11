/* eslint-disable arrow-body-style */

import Tooltip from '../../src/plugins/Tooltip';

const data = {
  title: 'Plugin: Tooltip',
  tests: [
    {
      title: 'disables the tooltip',
      setup: (cal) => {
        return cal.paint(window.defaultOptions, [
          [Tooltip, { enabled: false }],
        ]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('#ch-tooltip').node();
          },
          expected: () => null,
        },
      ],
    },
    {
      title: 'enables the tooltip',
      setup: (cal) => {
        return cal.paint(window.defaultOptions, [[Tooltip, { enabled: true }]]);
      },
      execute: (cal, d3) => {
        return cal.eventEmitter.emit(
          'mouseover',
          {
            target: d3.select('.ch-subdomain-bg').node(),
          },
          1,
          1,
        );
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('#ch-tooltip').node();
          },
          expected: () => null,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('#ch-tooltip').attr('data-show');
          },
          expected: () => '1',
        },
        {
          current: (d3) => {
            return d3.select('#ch-tooltip-body').html();
          },
          notExpected: () => '',
        },
      ],
    },
    {
      title: 'destroys the plugin alongside the calendar',
      setup: (cal) => {
        return cal.paint(window.defaultOptions, [
          [Tooltip, { enabled: true }],
        ]);
      },
      execute: (cal) => {
        return cal.destroy();
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('#ch-tooltip').node();
          },
          expected: () => null,
        },
      ],
    },
    {
      title: 'formats the text with the user given function',
      setup: (cal) => {
        return cal.paint(
          { ...window.defaultOptions, date: { start: new Date('2000-01-05') } },
          [
            [
              Tooltip,
              {
                enabled: true,
                text: (d, v) => `${new Date(d).getFullYear()}-${v}`,
              },
            ],
          ],
        );
      },
      execute: (cal, d3) => {
        return cal.eventEmitter.emit(
          'mouseover',
          {
            target: d3.select('.ch-subdomain-bg').node(),
          },
          +new Date('2000-01-05'),
          10,
        );
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('#ch-tooltip-body').html();
          },
          expected: () => '2000-10',
        },
      ],
    },
    {
      title: 'honors the locale',
    },
    {
      title: 'honors the timezone',
    },
  ],
};

export default data;
