/* eslint-disable arrow-body-style */
const data = {
  title: 'Method: fill',
  tests: [
    {
      title: 'fills the calendar with the provided data, with timestamp date',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          date: { start: new Date('2020-01-01'), timezone: 'utc' },
          data: { x: 'ts', y: 'value' },
          subDomain: { label: (t, v) => v, type: 'day' },
        });
      },
      execute: (cal) => {
        return cal.fill([
          { ts: 1577836800000, value: 1 },
          { ts: 1578614400000, value: 10 },
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
          expected: () => '1',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(10) text')
              .html();
          },
          expected: () => '10',
        },
      ],
    },
    {
      title: 'fills the calendar with the provided data, with string date',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          date: { start: new Date('2020-01-01'), timezone: 'utc' },
          data: { x: 'ts', y: 'value' },
          subDomain: { label: (t, v) => v, type: 'day' },
        });
      },
      execute: (cal) => {
        return cal.fill([
          { ts: '2020-01-01', value: 1 },
          { ts: '2020-01-10', value: 10 },
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
          expected: () => '1',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(10) text')
              .html();
          },
          expected: () => '10',
        },
      ],
    },
  ],
};

export default data;
