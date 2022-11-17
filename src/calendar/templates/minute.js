const minuteTemplate = (dateHelper) => {
  const COLUMNS_COUNT = 10;
  const ROWS_COUNT = 6;

  return {
    name: 'minute',
    level: 10,
    rowsCount() {
      return COLUMNS_COUNT;
    },
    columnsCount() {
      return ROWS_COUNT;
    },
    position: {
      x(d) {
        return Math.floor(dateHelper.moment(d).minute() / COLUMNS_COUNT);
      },
      y(d) {
        return dateHelper.moment(d).minute() % COLUMNS_COUNT;
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
  };
};

export default minuteTemplate;
