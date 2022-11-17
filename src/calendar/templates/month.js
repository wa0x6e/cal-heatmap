const monthTemplate = (dateHelper) => ({
  name: 'month',
  level: 50,
  maxItemNumber: 12,
  defaultColumnNumber: 12,
  defaultRowNumber: 1,
  row() {
    return 1;
  },
  column() {
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
    date: '%B %Y',
    legend: '%B',
    connector: 'in',
  },
  extractUnit(d) {
    return dateHelper.moment(d).startOf('month').valueOf();
  },
});

export default monthTemplate;
