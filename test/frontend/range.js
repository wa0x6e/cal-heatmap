/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: range',
  tests: [
    {
      title: 'renders the default number of domains',
      setup: (cal) => {
        return cal.paint();
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .selectAll('.ch-domain')
              .size();
          },
          expected: () => 12,
        },
      ],
    },
    {
      title: 'renders the given number of domains',
      setup: (cal) => {
        return cal.paint({ ...window.defaultOptions, range: 5 });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .selectAll('.ch-domain')
              .size();
          },
          expected: () => 5,
        },
      ],
    },
  ],
};

export default data;
