const monthTemplate = (dateHelper) => ({
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
      return dateHelper.moment(d).month();
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
    return dateHelper.moment(d).startOf('month').valueOf();
  },
});

export default monthTemplate;
