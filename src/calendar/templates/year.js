const yearTemplate = ({ DateHelper }) => ({
  name: 'year',
  level: 60,
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 1;
  },
  mapping: (startTimestamp, endTimestamp, defaultValues) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    DateHelper.intervals(
      'year',
      startTimestamp,
      DateHelper.date(endTimestamp),
    ).map((ts, index) => ({
      t: ts,
      x: index,
      y: 0,
      ...defaultValues,
    })),

  format: {
    domainLabel: 'Y',
  },
  extractUnit(ts) {
    return DateHelper.date(ts).startOf('year').valueOf();
  },
});

export default yearTemplate;
