/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: subDomain.radius',
  tests: [
    {
      title: 'does not apply any radius',
      setup: (cal) => {
        return cal.paint(window.defaultOptions);
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('.ch-subdomain-bg:nth-child(1)')
              .attr('rx');
          },
          expected: () => null,
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('.ch-subdomain-bg:nth-child(1)')
              .attr('ry');
          },
          expected: () => null,
        },
      ],
    },
    {
      title: 'apply the given radius',
      setup: (cal) => {
        return cal.paint({
          ...window.defaultOptions,
          subDomain: { type: 'month', radius: 10 },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('.ch-subdomain-bg:nth-child(1)')
              .attr('rx');
          },
          expected: () => '10',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('.ch-subdomain-bg:nth-child(1)')
              .attr('ry');
          },
          expected: () => '10',
        },
      ],
    },
  ],
};

export default data;
