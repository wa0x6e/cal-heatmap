const dayTemplate = (
  DateHelper,
  { domain, domainDynamicDimension, verticalOrientation },
) => {
  const ROWS_COUNT = 7;

  return {
    name: 'day',
    level: 30,
    rowsCount() {
      if (domain === 'week') {
        return 1;
      }
      return ROWS_COUNT;
    },
    columnsCount(d) {
      switch (domain) {
        case 'month':
          return Math.ceil(
            domainDynamicDimension && !verticalOrientation ?
              DateHelper.date(d).daysInMonth() / ROWS_COUNT :
              31 / ROWS_COUNT,
          );
        case 'year':
          return Math.ceil(
            domainDynamicDimension ?
              DateHelper.date(d).endOf('year').dayOfYear() / ROWS_COUNT :
              54,
          );
        case 'week':
        default:
          return ROWS_COUNT;
      }
    },
    mapping: (startDate, endDate, defaultValues) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals('day', startDate, DateHelper.date(endDate)).map(
        (d) => {
          const date = DateHelper.date(d);
          const endWeekNumber = DateHelper.date(d).endOf('year').week();
          let x = 0;

          switch (domain) {
            case 'month':
              x = DateHelper.getMonthWeekNumber(d) - 1;
              break;
            case 'year':
              if (endWeekNumber === 1 && date.week() === endWeekNumber) {
                x = DateHelper.date(d).subtract(1, 'week').week() + 1;
              }

              x = date.week() - 1;
              break;
            case 'week':
              x = date.weekday();
              break;
            default:
          }

          return {
            t: d,
            x,
            y: domain === 'week' ? 0 : date.weekday(),
            ...defaultValues,
          };
        },
      ),
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
