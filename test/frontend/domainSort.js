/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: domain.sort',
  tests: [
    {
      title: 'renders the domain on ascending order',
      setup: (cal) => {
        return cal.paint({
          range: 12,
          domain: { type: 'month' },
          subDomain: { type: 'day' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-domain:nth-child(1) .graph-label').html();
          },
          expected: () => 'January',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain:nth-child(2) .graph-label').html();
          },
          expected: () => 'February',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain:nth-child(12) .graph-label').html();
          },
          expected: () => 'December',
        },
      ],
    },
    {
      title: 'renders the domain on descending order',
      setup: (cal) => {
        return cal.paint({
          range: 12,
          domain: { type: 'month', sort: 'desc' },
          subDomain: { type: 'day' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-domain:nth-child(1) .graph-label').html();
          },
          expected: () => 'December',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain:nth-child(2) .graph-label').html();
          },
          expected: () => 'November',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain:nth-child(12) .graph-label').html();
          },
          expected: () => 'January',
        },
      ],
    },
  ],
};

export default data;
