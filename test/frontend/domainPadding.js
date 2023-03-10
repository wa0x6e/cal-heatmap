/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: domain.padding',
  tests: [
    {
      title: 'adds padding to the top',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { padding: [10, 0, 0, 0] },
          subDomain: { gutter: 0, width: 10, height: 10 },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('y');
          },
          expected: () => '10',
        },
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('width');
          },
          expected: () => '60',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('height');
          },
          expected: () => '135',
        },
      ],
    },
    {
      title: 'adds padding to the right',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { padding: [0, 10, 0, 0] },
          subDomain: { gutter: 0, width: 10, height: 10 },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('y');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('width');
          },
          expected: () => '70',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('height');
          },
          expected: () => '125',
        },
      ],
    },
    {
      title: 'adds padding to the bottom',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { padding: [0, 0, 10, 0] },
          subDomain: { gutter: 0, width: 10, height: 10 },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('y');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('width');
          },
          expected: () => '60',
        },
        {
          current: (d3) => {
            return d3.select('.graph-label').attr('y');
          },
          expected: () => '112.5',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('height');
          },
          expected: () => '135',
        },
      ],
    },
    {
      title: 'adds padding to the left',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { padding: [0, 0, 0, 10] },
          subDomain: { gutter: 0, width: 10, height: 10 },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('y');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3.select('.graph-subdomain-group').attr('x');
          },
          expected: () => '10',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('width');
          },
          expected: () => '70',
        },
        {
          current: (d3) => {
            return d3.select('.graph-domain-bg').attr('height');
          },
          expected: () => '125',
        },
      ],
    },
  ],
};

export default data;
