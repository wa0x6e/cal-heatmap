/* eslint-disable arrow-body-style */
const data = {
  title: 'Dimensions() methods',
  tests: [
    {
      title: 'returns the dimensions',
      setup: (cal) => {
        return cal.paint({ ...window.defaultOptions, range: 1 });
      },
      execute: (cal) => {
        return cal.dimensions();
      },
      expectations: [
        {
          current: (d3) => {
            return +d3.select('.ch-container').attr('width');
          },
          expected: (executeReturn) => executeReturn.width,
        },
        {
          current: (d3) => {
            return +d3.select('.ch-container').attr('height');
          },
          expected: (executeReturn) => executeReturn.height,
        },
      ],
    },
  ],
};

export default data;
