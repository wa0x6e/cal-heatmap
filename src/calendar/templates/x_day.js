const dayTemplate = ({ DateHelper }, { domain, verticalOrientation }) => {
  const COLUMNS_COUNT = 7;
  const domainType = domain.type;
  const { dynamicDimension } = domain;

  return {
    name: 'x_day',
    level: 30,
    rowsCount(d) {
      switch (domainType) {
        case 'month':
          return Math.ceil(
            dynamicDimension && !verticalOrientation ?
              DateHelper.getMonthWeekNumber(DateHelper.date(d).endOf('month')) :
              6, // In rare case, when the first week contains less than 3 days
          );
        case 'year':
          return Math.ceil(
            dynamicDimension ?
              DateHelper.date(d).endOf('year').dayOfYear() / COLUMNS_COUNT :
              54,
          );
        case 'week':
        default:
          return COLUMNS_COUNT;
      }
    },
    columnsCount() {
      if (domainType === 'week') {
        return 1;
      }
      return COLUMNS_COUNT;
    },
    mapping: (startDate, endDate, defaultValues) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals('day', startDate, DateHelper.date(endDate)).map(
        (d) => {
          const date = DateHelper.date(d);
          const endWeekNumber = DateHelper.date(d).endOf('year').week();
          let x = 0;

          switch (domainType) {
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
            x: domainType === 'week' ? 0 : date.weekday(),
            ...defaultValues,
          };
        },
      ),
    format: {
      date: 'dddd MMMM D, Y',
      legend: 'Do MMM',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('day').valueOf();
    },
  };
};

export default dayTemplate;
