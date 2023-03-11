/* eslint-disable arrow-body-style */
const data = {
  title: 'Destroy() methods',
  tests: [
    {
      title: 'destroys the calendar',
      setup: (cal) => {
        return cal.paint({ ...window.defaultOptions, range: 1 });
      },
      execute: (cal) => {
        return cal.destroy();
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .selectAll('.ch-domain')
              .size();
          },
          expected: () => 1,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('#cal-heatmap').html();
          },
          expected: () => '',
        },
      ],
    },
  ],
};

export default data;
