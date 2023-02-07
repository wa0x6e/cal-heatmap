/* eslint-disable arrow-body-style */
const data = {
  title: 'Method: fill',
  tests: [
    {
      title: 'fills the calendar with the provided data',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          date: { start: new Date('2020-01-01'), timezone: 'utc' },
          data: { x: 'date', y: 'value' },
          subDomain: { label: (t, v) => v, type: 'day' },
        });
      },
      execute: (cal) => {
        return cal.fill([
          { date: '2020-01-01', value: 1 },
          { date: '2020-01-10', value: 10 },
        ]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(1) text')
              .html();
          },
          expected: () => 1,
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(10) text')
              .html();
          },
          expected: () => 10,
        },
      ],
    },
  ],
};

export default data;
