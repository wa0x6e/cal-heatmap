const yearTemplate = (domainTemplate, dateHelper, options) => ({
  name: 'year',
  level: 60,
  row() {
    return options.rowLimit || 1;
  },
  column() {
    return options.colLimit || 1;
  },
  position: {
    x() {
      return 1;
    },
    y() {
      return 1;
    },
  },
  format: {
    date: '%Y',
    legend: '%Y',
    connector: 'in',
  },
  extractUnit(d) {
    return dateHelper.moment(d).startOf('year').valueOf();
  },
});

export default yearTemplate;
