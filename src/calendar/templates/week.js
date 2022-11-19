const weekTemplate = (dateHelper, { domain, domainDynamicDimension }) => {
  function getTotalColNumber(d) {
    switch (domain) {
      case 'year':
        return domainDynamicDimension
          ? dateHelper.moment(d).endOf('year').isoWeeksInYear()
          : 52;
      case 'month':
        return domainDynamicDimension
          ? dateHelper.moment(d).endOf('month').isoWeek()
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
            return dateHelper.moment(d).isoWeek() - 1;
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
      return dateHelper.moment(d).startOf('isoWeek').valueOf();
    },
  };
};

export default weekTemplate;
