const dayTemplate = (
  DateHelper,
  { domain, domainDynamicDimension, verticalOrientation },
) => {
  const ROWS_COUNT = 7;

  function getTotalColNumber(d) {
    switch (domain) {
      case 'month':
        return Math.ceil(
          domainDynamicDimension && !verticalOrientation
            ? DateHelper.date(d).daysInMonth() / ROWS_COUNT
            : 31 / ROWS_COUNT,
        );
      case 'year':
        return Math.ceil(
          domainDynamicDimension
            ? DateHelper.date(d).endOf('year').dayOfYear() / ROWS_COUNT
            : 366 / ROWS_COUNT,
        );
      case 'week':
      default:
        return 1;
    }
  }

  return {
    name: 'day',
    level: 30,
    rowsCount() {
      return ROWS_COUNT;
    },
    columnsCount(d) {
      return getTotalColNumber(d);
    },
    position: {
      x(d) {
        const weekDay = DateHelper.date(d).isoWeekday() - 1;

        switch (domain) {
          case 'week':
            return Math.floor(weekDay / ROWS_COUNT);
          case 'month':
            return DateHelper.getMonthWeekNumber(d);
          case 'year':
            return DateHelper.date(d).week() - 1;
          default:
        }
      },
      y(d) {
        return Math.floor(DateHelper.date(d).isoWeekday() % ROWS_COUNT);
      },
    },
    format: {
      date: 'dddd MMMM D, Y',
      legend: 'Do MMM',
      connector: 'on',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('day').valueOf();
    },
  };
};

export default dayTemplate;
