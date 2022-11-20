const minuteTemplate = (DateHelper) => {
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
        return Math.floor(DateHelper.date(d).minute() / COLUMNS_COUNT);
      },
      y(d) {
        return DateHelper.date(d).minute() % COLUMNS_COUNT;
      },
    },
    format: {
      date: 'LT, dddd MMMM D, Y',
      legend: '',
      connector: 'at',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('minute').valueOf();
    },
  };
};

export default minuteTemplate;
