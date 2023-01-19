import locale_fr from 'dayjs/locale/fr';

window.dayjs_locale_fr = locale_fr;

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
          date: { start: new Date('2020-07-15T02:06'), timezone: 'utc' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select(d3.select('.subdomain-text').nodes()[0]).html();
          },
          expected: () => new Date('2020-07-01T00:00Z').toISOString(),
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
          date: {
            start: new Date('2020-01-15T02:06'),
            locale: 'fr',
            timezone: 'utc',
          },
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
          date: { start: new Date('2020-01-15T02:06'), timezone: 'utc' },
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
          date: {
            start: new Date('2020-01-15T02:06'),
            locale: 'fr',
            timezone: 'utc',
          },
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
            start: new Date('2020-01-15T02:06'),
            highlight: [new Date('2020-01-15'), new Date('2020-01-25')],
            timezone: 'utc',
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
