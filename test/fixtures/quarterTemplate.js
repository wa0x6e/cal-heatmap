const quarterTemplate = (helpers) => ({
  name: 'quarter',
  level: 50,
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 4;
  },
  mapping: (startDate, endDate, defaultValues) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    helpers.DateHelper.intervals(
      'quarter',
      startDate,
      helpers.DateHelper.date(endDate),
    ).map((d, index) => ({
      t: d,
      x: index,
      y: 0,
      ...defaultValues,
    })),

  format: {
    date: 'Q',
    legend: 'Q',
  },
  extractUnit(d) {
    return helpers.DateHelper.date(d).startOf('quarter').valueOf();
  },
});

export default quarterTemplate;
