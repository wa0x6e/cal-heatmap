/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: verticalOrientation',
  tests: [
    {
      title: 'renders the domain on the same row',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year', gutter: 0 },
          subDomain: { type: 'month', gutter: 0 },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(1)')
              .attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(1)')
              .attr('y');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(2)')
              .attr('x');
          },
          expected: () => '120',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(2)')
              .attr('y');
          },
          expected: () => '0',
        },
      ],
    },
    {
      title: 'renders the domain on the same column',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year', gutter: 0 },
          subDomain: { type: 'month', gutter: 0 },
          verticalOrientation: true,
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(1)')
              .attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(1)')
              .attr('y');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(2)')
              .attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select('#cal-heatmap .ch-domain:nth-child(2)')
              .attr('y');
          },
          expected: () => '35',
        },
      ],
    },
  ],
};

export default data;
