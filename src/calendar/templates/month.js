const monthTemplate = (DateHelper) => ({
  name: 'month',
  level: 50,
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 12;
  },
  mapping: (startDate, endDate, defaultValues) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    DateHelper.intervals('month', startDate, DateHelper.date(endDate)).map(
      (d) => ({
        t: d,
        x: DateHelper.date(d).month(),
        y: 0,
        ...defaultValues,
      }),
    ),

  format: {
    date: 'MMMM Y',
    legend: 'MMMM',
    connector: 'in',
  },
  extractUnit(d) {
    return DateHelper.date(d).startOf('month').valueOf();
  },
});

export default monthTemplate;
