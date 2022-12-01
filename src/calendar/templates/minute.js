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
    mapping: (startDate, endDate, defaultValues = {}) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals('minute', startDate, DateHelper.date(endDate)).map(
        (d) => {
          const minute = DateHelper.date(d).minute();

          return {
            t: d,
            x: Math.floor(minute / COLUMNS_COUNT),
            y: minute % COLUMNS_COUNT,
            ...defaultValues,
          };
        },
      ),
    format: {
      date: 'LT, dddd MMMM D, Y',
      legend: '',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('minute').valueOf();
    },
  };
};

export default minuteTemplate;
