/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: subDomain.label.text',
  tests: [
    {
      title: 'does not show the label when the whole label options is null',
      setup: (cal) => {
        return cal.paint({ subDomain: { label: null } });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .selectAll('.ch-subdomain-text').nodes().length;
          },
          expected: () => 0,
        },
      ],
    },
    {
      title: 'shows the label',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'year' },
          subDomain: { type: 'month', label: '-' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .selectAll('.ch-subdomain-text').nodes().length;
          },
          expected: () => 12,
        },
      ],
    },
    {
      title: 'formats the label from a string',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          date: { start: new Date('2020-01-01'), timezone: 'utc' },
          domain: { type: 'year' },
          subDomain: { type: 'month', label: 'MMMM YYYY' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(1) text')
              .html();
          },
          expected: () => 'January 2020',
        },
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(12) text')
              .html();
          },
          expected: () => 'December 2020',
        },
      ],
    },
    {
      title: 'formats the label from a function',
      setup: (cal) => {
        const date = new Date('2020-01-01');
        const dd = [];
        dd.push({
          time: +date,
          value: 10,
        });
        return cal.paint({
          range: 1,
          date: { start: date },
          data: { source: dd, x: 'time', y: 'value' },
          domain: { type: 'year' },
          subDomain: {
            type: 'month',
            label: (d, v) => `${new Date(d).getMonth()}-${v}`,
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(1) text')
              .html();
          },
          expected: () => '0-10',
        },
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(12) text')
              .html();
          },
          expected: () => '11-null',
        },
      ],
    },
  ],
};

export default data;
