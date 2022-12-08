const yearTemplate = ({ DateHelper }) => ({
  name: 'year',
  level: 60,
  row() {
    return 1;
  },
  column() {
    return 1;
  },
  mapping: (startDate, endDate, defaultValues) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    DateHelper.intervals('year', startDate, DateHelper.date(endDate)).map(
      (d, index) => ({
        t: d,
        x: index,
        y: 0,
        ...defaultValues,
      }),
    ),

  format: {
    date: 'Y',
    legend: 'Y',
  },
  extractUnit(d) {
    return DateHelper.date(d).startOf('year').valueOf();
  },
});

export default yearTemplate;
