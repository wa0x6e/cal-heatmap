const monthTemplate = (DateHelper) => ({
  name: 'month',
  level: 50,
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 12;
  },
  position: {
    x(d) {
      return DateHelper.date(d).month();
    },
    y() {
      return 0;
    },
  },
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
