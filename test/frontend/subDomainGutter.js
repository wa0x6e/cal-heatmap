/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: subDomain.gutter',
  tests: [
    {
      title: 'does not apply a gutter',
      setup: (cal) => {
        return cal.paint({ range: 1, subDomain: { gutter: 0 } });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(1) .ch-subdomain-bg',
              )
              .attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(1) .ch-subdomain-bg',
              )
              .attr('y');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(2) .ch-subdomain-bg',
              )
              .attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(2) .ch-subdomain-bg',
              )
              .attr('y');
          },
          expected: () => '10',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(11) .ch-subdomain-bg',
              )
              .attr('x');
          },
          expected: () => '10',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(11) .ch-subdomain-bg',
              )
              .attr('y');
          },
          expected: () => '0',
        },
      ],
    },
    {
      title: 'applies a gutter',
      setup: (cal) => {
        return cal.paint({ range: 1, subDomain: { gutter: 10 } });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(1) .ch-subdomain-bg',
              )
              .attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(1) .ch-subdomain-bg',
              )
              .attr('y');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(2) .ch-subdomain-bg',
              )
              .attr('x');
          },
          expected: () => '0',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(2) .ch-subdomain-bg',
              )
              .attr('y');
          },
          expected: () => '20',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(11) .ch-subdomain-bg',
              )
              .attr('x');
          },
          expected: () => '20',
        },
        {
          current: (d3) => {
            return d3
              .select(
                '.ch-subdomain-container  g:nth-child(11) .ch-subdomain-bg',
              )
              .attr('y');
          },
          expected: () => '0',
        },
      ],
    },
  ],
};

export default data;
