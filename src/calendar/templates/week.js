const weekTemplate = (DateHelper, { domain, domainDynamicDimension }) => {
  function getTotalColNumber(d) {
    switch (domain) {
      case 'year':
        return domainDynamicDimension ?
          DateHelper.date(d).endOf('year').weeksInYear() :
          53;
      case 'month':
        return domainDynamicDimension ?
          DateHelper.date(d).endOf('month').week() :
          5;
      default:
        return 1;
    }
  }

  return {
    name: 'week',
    level: 40,
    rowsCount() {
      return 1;
    },
    columnsCount(d) {
      return getTotalColNumber(d);
    },
    mapping: (startDate, endDate, defaultValues) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals('week', startDate, DateHelper.date(endDate)).map(
        (d) => {
          let x = 0;
          switch (domain) {
            case 'year':
              x = DateHelper.date(d).week() - 1;
              break;
            case 'month':
              x = Math.floor(DateHelper.getMonthWeekNumber(d));
              break;
            default:
          }

          return {
            t: d,
            x,
            y: 0,
            ...defaultValues,
          };
        },
      ),
    position: {
      x() {},
      y() {
        return 0;
      },
    },
    format: {
      date: 'wo [week] Y',
      legend: 'wo [week] Y',
      connector: 'at',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('week').valueOf();
    },
  };
};

export default weekTemplate;
