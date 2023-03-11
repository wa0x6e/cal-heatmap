/* eslint-disable arrow-body-style */
const data = {
  title: 'Navigation() methods',
  tests: [
    {
      title: 'scrolls back by one steps',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.previous();
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2019',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
      ],
    },
    {
      title: 'scrolls back by n steps',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.previous(5);
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2015',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2016',
        },
      ],
    },
    {
      title: 'scrolls forward by one steps',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.next();
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2022',
        },
      ],
    },
    {
      title: 'scrolls forward by n steps',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.next(5);
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2025',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2026',
        },
      ],
    },
    {
      title: 'can not scroll past the minDate',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: {
            start: new Date('2020-01-15'),
            min: new Date('2015-01-15'),
            timezone: 'utc',
          },
        });
      },
      execute: (cal) => {
        return cal.previous(10);
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2015',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2016',
        },
      ],
    },
    {
      title: 'can not scroll past the maxDate',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: {
            start: new Date('2020-01-15'),
            max: new Date('2025-01-15'),
            timezone: 'utc',
          },
        });
      },
      execute: (cal) => {
        return cal.next(10);
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2024',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2025',
        },
      ],
    },
    {
      title: 'jumpsTo a past date',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.jumpTo(new Date('2015-07-03'));
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2015',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2016',
        },
      ],
    },
    {
      title: 'jumpsTo a future date',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.jumpTo(new Date('2025-07-03'));
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2024',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2025',
        },
      ],
    },
    {
      title: 'jumpsTo a future date with reset',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.jumpTo(new Date('2025-07-03'), true);
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2025',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2026',
        },
      ],
    },
    {
      title: 'jumpsTo a date inside the current calendar range',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'year' },
          subDomain: { type: 'month' },
          date: { start: new Date('2020-01-15'), timezone: 'utc' },
        });
      },
      execute: (cal) => {
        return cal.jumpTo(new Date('2020-07-03'));
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
        {
          current: (d3) => {
            return d3.selectAll('.ch-domain').nodes().length;
          },
          expected: () => 2,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('class');
          },
          expected: () => 'ch-domain y_2020',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('class');
          },
          expected: () => 'ch-domain y_2021',
        },
      ],
    },
  ],
};

export default data;
