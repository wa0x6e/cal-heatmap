const minuteTemplate = (dateHelper) => ({
  name: 'minute',
  level: 10,
  maxItemNumber: 60,
  defaultRowNumber: 10,
  defaultColumnNumber: 6,
  row(d) {
    return 10;
  },
  column(d) {
    return 6;
  },
  position: {
    x(d) {
      return Math.floor(dateHelper.moment(d).minute() / 10);
    },
    y(d) {
      return dateHelper.moment(d).minute() % 10;
    },
  },
  format: {
    date: '%H:%M, %A %B %-e, %Y',
    legend: '',
    connector: 'at',
  },
  extractUnit(d) {
    return dateHelper.moment(d).startOf('minute').valueOf();
  },
});

export default minuteTemplate;
