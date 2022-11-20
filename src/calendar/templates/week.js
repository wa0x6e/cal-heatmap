const weekTemplate = (DateHelper, { domain, domainDynamicDimension }) => {
  function getTotalColNumber(d) {
    switch (domain) {
      case 'year':
        return domainDynamicDimension
          ? DateHelper.date(d).endOf('year').weeksInYear()
          : 53;
      case 'month':
        return domainDynamicDimension
          ? DateHelper.date(d).endOf('month').week()
          : 5;
      default:
        return;
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
    position: {
      x(d) {
        switch (domain) {
          case 'year':
            return DateHelper.date(d).week() - 1;
          case 'month':
            return Math.floor(DateHelper.getMonthWeekNumber(d));
          default:
        }
      },
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
