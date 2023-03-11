/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: itemSelector',
  tests: [
    {
      title: 'renders the calendar inside the default itemSelector',
      setup: (cal) => {
        return cal.paint(window.defaultOptions);
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('#cal-heatmap .ch-container').node();
          },
          notExpected: () => '',
        },
      ],
    },
    {
      title: 'renders nothing when the default selector is not present',
      setup: (cal, d3) => {
        d3.select('#cal-heatmap').remove();
        return cal.paint(window.defaultOptions);
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-container').nodes().length;
          },
          expected: () => 0,
        },
      ],
    },
    {
      title: 'renders nothing when the itemSelector is not valid',
      setup: (cal) => {
        return cal.paint({
          ...window.defaultOptions,
          itemSelector: '.not-existing',
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-container').nodes().length;
          },
          expected: () => 0,
        },
      ],
    },
    {
      title: 'renders the calendar inside the empty given itemSelector',
      setup: (cal, d3) => {
        d3.select('body').append('div').attr('class', 'test-selector');
      },
      execute: (cal) => {
        return cal.paint({
          ...window.defaultOptions,
          itemSelector: '.test-selector',
        });
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-container').nodes().length;
          },
          expected: () => 0,
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-container').html();
          },
          notExpected: () => '',
        },
      ],
    },
    {
      title: 'renders the calendar inside the not empty given itemSelector',
      setup: (cal, d3) => {
        d3.select('body')
          .append('div')
          .attr('class', 'test-selector')
          .append('span')
          .html('some content');

        return Promise.resolve();
      },
      execute: (cal) => {
        return cal.paint({
          ...window.defaultOptions,
          itemSelector: '.test-selector',
        });
      },
      preExpectations: [
        {
          current: (d3) => {
            return d3.selectAll('.ch-container').nodes().length;
          },
          expected: () => 0,
        },
        {
          current: (d3) => {
            return d3.select('.test-selector').html();
          },
          expected: () => '<span>some content</span>',
        },
      ],
      expectations: [
        {
          current: (d3) => {
            return d3.selectAll('.test-selector .ch-container').nodes()
              .length;
          },
          expected: () => 1,
        },
        {
          current: (d3) => {
            return d3.select('.test-selector > span').html();
          },
          expected: () => 'some content',
        },
      ],
    },
  ],
};

export default data;
