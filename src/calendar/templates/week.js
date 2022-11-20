const weekTemplate = (DateHelper, { domain, domainDynamicDimension }) => {
  function getTotalColNumber(d) {
    switch (domain) {
      case 'year':
        return domainDynamicDimension
          ? DateHelper.date(d).endOf('year').isoWeeksInYear()
          : 52;
      case 'month':
        return domainDynamicDimension
          ? DateHelper.date(d).endOf('month').isoWeek()
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
            return DateHelper.date(d).isoWeek() - 1;
          case 'month':
            return Math.floor(dateHelper.getMonthWeekNumber(d));
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
      return DateHelper.date(d).startOf('isoWeek').valueOf();
    },
  };
};

export default weekTemplate;
