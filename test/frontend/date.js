/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: date',
  tests: [
    {
      title: 'starts the calendar with the given date',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: { start: new Date(2020, 6, 15, 2, 6) },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select(d3.select('.subdomain-text').nodes()[0]).html();
          },
          expected: () => new Date(2020, 6, 1, 0, 0).toISOString(),
        },
      ],
    },
    {
      title: 'sets the calendar locale',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: { start: new Date(2020, 0, 15, 2, 6), locale: 'fr' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-label').html();
          },
          expected: () => 'janvier',
        },
      ],
    },
    {
      title: 'starts the week on sunday',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: { start: new Date(2020, 0, 15, 2, 6) },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.graph-subdomain-group g:nth-child(5) rect')
              .attr('y');
          },
          expected: () => '0',
        },
      ],
    },
    {
      title: 'starts the week on monday',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: { start: new Date(2020, 0, 15, 2, 6), locale: 'fr' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.graph-subdomain-group g:nth-child(6) rect')
              .attr('y');
          },
          expected: () => '0',
        },
      ],
    },
    {
      title: 'highlight the given dates',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: {
            start: new Date(2020, 0, 15, 2, 6),
            highlight: [new Date(2020, 0, 15), new Date(2020, 0, 25)],
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.graph-subdomain-group g:nth-child(15) rect')
              .attr('class');
          },
          expectedContain: () => 'highlight',
        },
        {
          current: (d3) => {
            return d3
              .select('.graph-subdomain-group g:nth-child(25) rect')
              .attr('class');
          },
          expectedContain: () => 'highlight',
        },
      ],
    },
  ],
};

export default data;
