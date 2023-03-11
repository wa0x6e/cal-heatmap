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
          date: { start: new Date('2020-01-01') },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1) .ch-domain-text').html();
          },
          expected: () => 'January',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2) .ch-domain-text').html();
          },
          expected: () => 'February',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(12) .ch-domain-text').html();
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
          date: { start: new Date('2020-01-01') },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1) .ch-domain-text').html();
          },
          expected: () => 'December',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2) .ch-domain-text').html();
          },
          expected: () => 'November',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(12) .ch-domain-text').html();
          },
          expected: () => 'January',
        },
      ],
    },
  ],
};

export default data;
