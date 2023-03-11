/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: data',
  tests: [
    {
      title: 'populates from a JSON object directly',
      setup: (cal) => {
        const dd = [];
        const date = new Date('2000-01-01');
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
            label: (d, v) => `${v}`,
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1) g text').html();
          },
          expected: () => '10',
        },
      ],
    },
    {
      title: 'populates from a CSV url',
    },
    {
      title: 'populates from a TSV url',
    },
    {
      title: 'populates from a JSON url',
    },
    {
      title: 'populates from a TEXT url',
    },
    {
      title: 'can extract the date field to use',
    },
    {
      title: 'can extract the value field to use',
    },
    {
      title: 'can groups the values',
    },
  ],
};

export default data;
