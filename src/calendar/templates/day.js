const dayTemplate = (
  dateHelper,
  { domain, domainDynamicDimension, verticalOrientation },
) => {
  const ROWS_COUNT = 7;

  function getTotalColNumber(d) {
    switch (domain) {
      case 'month':
        return Math.ceil(
          domainDynamicDimension && !verticalOrientation
            ? dateHelper.moment(d).daysInMonth() / ROWS_COUNT
            : 31 / ROWS_COUNT,
        );
      case 'year':
        return Math.ceil(
          domainDynamicDimension
            ? dateHelper.moment(d).endOf('year').dayOfYear() / ROWS_COUNT
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
        const weekDay = dateHelper.moment(d).isoWeekday() - 1;

        switch (domain) {
          case 'week':
            return Math.floor(weekDay / ROWS_COUNT);
          case 'month':
            return dateHelper.getMonthWeekNumber(d);
          case 'year':
            return dateHelper.moment(d).isoWeek() - 1;
          default:
        }
      },
      y(d) {
        return Math.floor(dateHelper.moment(d).isoWeekday() % ROWS_COUNT);
      },
    },
    format: {
      date: '%A %B %-e, %Y',
      legend: '%e %b',
      connector: 'on',
    },
    extractUnit(d) {
      return dateHelper.moment(d).startOf('day').valueOf();
    },
  };
};

export default dayTemplate;
