/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: domain.dynamicDimension',
  tests: [
    {
      title: 'renders domains with same size when disabled',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'month', dynamicDimension: false },
          subDomain: { type: 'day', gutter: 0, width: 10 },
          date: { start: new Date('2021-01-15') },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('width');
          },
          expected: () => '60',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('width');
          },
          expected: () => '60',
        },
      ],
    },
    {
      title: 'renders domains with different size when enabled',
      setup: (cal) => {
        return cal.paint({
          range: 2,
          domain: { type: 'month', dynamicDimension: true },
          subDomain: { type: 'day', gutter: 0, width: 10 },
          date: { start: new Date('2021-01-15') },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(1)').attr('width');
          },
          expected: () => '60',
        },
        {
          current: (d3) => {
            return d3.select('.ch-domain:nth-child(2)').attr('width');
          },
          expected: () => '50',
        },
      ],
    },
  ],
};

export default data;
