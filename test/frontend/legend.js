import Legend from '../../src/plugins/Legend';

/* eslint-disable arrow-body-style */
const data = {
  title: 'Plugins: Legend',
  tests: [
    {
      title: 'renders the legend after the calendar',
      setup: (cal, d3) => {
        d3.select('body').append('div').attr('id', 'legend');
        return cal.paint({ ...window.defaultOptions }, [[Legend]]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('#cal-heatmap .graph-legend').nodes().length;
          },
          expected: () => 1,
        },
      ],
    },
    {
      title: 'renders the legend in the given itemSelector',
      setup: (cal, d3) => {
        d3.select('body').append('div').attr('id', 'legend');
        return cal.paint({ ...window.defaultOptions }, [
          [Legend, { itemSelector: '#legend' }],
        ]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('#cal-heatmap .graph-legend').nodes().length;
          },
          expected: () => 0,
        },
        {
          current: (d3) => {
            return d3.select('#legend svg').nodes().length;
          },
          expected: () => 1,
        },
      ],
    },
    {
      title: 'does not render the legend',
      setup: (cal, d3) => {
        d3.select('body').append('div').attr('id', 'legend');
        return cal.paint({ ...window.defaultOptions }, [
          [Legend, { enabled: false }],
        ]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-legend').nodes().length;
          },
          expected: () => 0,
        },
      ],
    },
    {
      title: 'adds a title to the legend',
      setup: (cal, d3) => {
        d3.select('body').append('div').attr('id', 'legend');
        return cal.paint({ ...window.defaultOptions }, [
          [Legend, { label: 'Test' }],
        ]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-legend svg > text').html();
          },
          expected: () => 'Test',
        },
      ],
    },
    {
      title: 'paints the subDomain with the colors',
      setup: (cal, d3) => {
        d3.select('body').append('div').attr('id', 'legend');
        return cal.paint(
          {
            ...window.defaultOptions,
            range: 1,
            scale: {
              as: 'color',
              range: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
            },
          },
          [[Legend, { itemSelector: '#legend' }]],
        );
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('#legend rect').nodes().length;
          },
          expected: () => 5,
        },
        {
          current: (d3) => {
            return d3.select('#legend rect:nth-child(1)').attr('fill');
          },
          expected: () => '#ffffcc',
        },
        {
          current: (d3) => {
            return d3.select('#legend rect:nth-child(5)').attr('fill');
          },
          expected: () => '#253494',
        },
      ],
    },
    {
      title: 'is destroyed alongside the calendar',
      setup: (cal, d3) => {
        d3.select('body').append('div').attr('id', 'legend');
        return cal.paint({ ...window.defaultOptions }, [[Legend]]);
      },
      execute: (cal) => {
        cal.destroy();
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.selectAll('.graph-legend').nodes().length;
          },
          expected: () => 1,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.graph-legend').nodes().length;
          },
          expected: () => 0,
        },
      ],
    },
  ],
};

export default data;
