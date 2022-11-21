const dayTemplate = (
  DateHelper,
  { domain, domainDynamicDimension, verticalOrientation },
) => {
  const COLUMNS_COUNT = 7;

  return {
    name: 'x_day',
    level: 30,
    rowsCount() {
      switch (domain) {
        case 'month':
          return Math.ceil(
            domainDynamicDimension && !verticalOrientation
              ? DateHelper.date(d).daysInMonth() / COLUMNS_COUNT
              : 31 / COLUMNS_COUNT,
          );
        case 'year':
          return Math.ceil(
            domainDynamicDimension
              ? DateHelper.date(d).endOf('year').dayOfYear() / COLUMNS_COUNT
              : 54,
          );
        case 'week':
        default:
          return COLUMNS_COUNT;
      }
    },
    columnsCount(d) {
      if (domain === 'week') {
        return 1;
      }
      return COLUMNS_COUNT;
    },
    mapping: (startTimestamp, endTimestamp, defaultValues) =>
      DateHelper.generateTimeInterval(
        'day',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((d) => {
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
          y: x,
          x: domain === 'week' ? 0 : date.weekday(),
          ...defaultValues,
        };
      }),
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
