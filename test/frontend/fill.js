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
    {
      title: 'paints the data with the expected opacity',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          date: { start: new Date('2020-01-01'), timezone: 'utc' },
          data: { x: 'ts', y: 'value' },
          subDomain: { label: (t, v) => v, type: 'day' },
          scale: {
            opacity: {
              baseColor: 'rgb(0, 0, 255)',
              domain: [100, 200],
            },
          },
        });
      },
      execute: (cal) => {
        return cal.fill([
          { ts: '2020-01-01', value: 100 },
          { ts: '2020-01-05', value: 150 },
          { ts: '2020-01-10', value: 200 },
          { ts: '2020-01-11', value: 10000 },
          { ts: '2020-01-12', value: -10000 },
        ]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(1) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(0, 0, 255); fill-opacity: 0;',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(5) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(0, 0, 255); fill-opacity: 0.5;',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(10) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(0, 0, 255); fill-opacity: 1;',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(11) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(0, 0, 255); fill-opacity: 1;',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(12) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(0, 0, 255); fill-opacity: 0;',
        },
      ],
    },
    {
      title: 'paints the data with the expected color',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          date: { start: new Date('2020-01-01'), timezone: 'utc' },
          data: { x: 'ts', y: 'value' },
          subDomain: { label: (t, v) => v, type: 'day' },
          scale: {
            color: {
              range: ['rgb(0, 0, 255)', 'rgb(255, 0, 0)'],
              domain: [100, 200],
            },
          },
        });
      },
      execute: (cal) => {
        return cal.fill([
          { ts: '2020-01-01', value: 100 },
          { ts: '2020-01-10', value: 200 },
          { ts: '2020-01-20', value: 20000 },
          { ts: '2020-01-21', value: -20000 },
        ]);
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(1) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(0, 0, 255);',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(10) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(255, 0, 0);',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(20) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(255, 0, 0);',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap')
              .select('g:nth-child(21) rect')
              .attr('style');
          },
          expected: () => 'fill: rgb(0, 0, 255);',
        },
      ],
    },
  ],
};

export default data;
