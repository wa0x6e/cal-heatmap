/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: subDomain.color',
  tests: [
    {
      title: 'apply the given color code',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: 'D',
            color: '#f0f0f0',
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(1) text')
              .attr('style');
          },
          expected: () => 'fill: #f0f0f0;',
        },
      ],
    },
    {
      title: 'apply the return value of the given function',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: 'D',
            color: () => 'red',
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(1) text')
              .attr('style');
          },
          expected: () => 'fill: red;',
        },
      ],
    },
  ],
};

export default data;
