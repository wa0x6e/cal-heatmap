/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: domain.label.text',
  tests: [
    {
      title: 'does not render a label when formatter is null',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { label: { text: null } },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain-text').nodes().length;
          },
          expected: () => 0,
        },
      ],
    },
    {
      title: 'does not render a label when formatter is an empty string',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { label: { text: '' } },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain-text').nodes().length;
          },
          expected: () => 0,
        },
      ],
    },
    {
      title: 'renders the default label when formatter is undefined',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month', label: undefined },
          subDomain: { type: 'week' },
          date: { start: new Date('2020-01-15') },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain-text').html();
          },
          expected: () => 'January',
        },
      ],
    },
    {
      title: 'renders the return value of the given function',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: {
            type: 'month',
            label: { text: (ts) => `${new Date(ts).getMonth()};` },
          },
          subDomain: { type: 'week' },
          date: { start: new Date('2020-01-15') },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain-text').html();
          },
          expected: () => '0;',
        },
      ],
    },
    {
      title: 'renders the format output of the given string format',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month', label: { text: 'MMM' } },
          subDomain: { type: 'week' },
          date: { start: new Date('2020-01-15') },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain-text').html();
          },
          expected: () => 'Jan',
        },
      ],
    },
  ],
};

export default data;
