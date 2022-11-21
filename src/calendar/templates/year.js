const yearTemplate = (DateHelper) => ({
  name: 'year',
  level: 60,
  row() {
    return 1;
  },
  column() {
    return 1;
  },
  mapping: (startTimestamp, endTimestamp, defaultValues) =>
    DateHelper.generateTimeInterval(
      'year',
      startTimestamp,
      DateHelper.date(endTimestamp),
    ).map((d, index) => ({
      t: d,
      x: index,
      y: 0,
      ...defaultValues,
    })),

  format: {
    date: 'Y',
    legend: 'Y',
    connector: 'in',
  },
  extractUnit(d) {
    return DateHelper.date(d).startOf('year').valueOf();
  },
});

export default yearTemplate;
