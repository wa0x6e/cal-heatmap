const weekTemplate = (dateHelper, { domain, domainDynamicDimension }) => {
  function getTotalColNumber(d) {
    switch (domain) {
      case 'year':
        return 52;
      case 'month':
        return domainDynamicDimension
          ? dateHelper.moment(dateHelper.moment(d).endOf('year')).isoWeek() -
              dateHelper.moment(d).isoWeek()
          : 5;
      default:
    }
  }

  return {
    name: 'week',
    level: 40,
    rowsCount(d) {
      return 1;
    },
    columnsCount(d) {
      return getTotalColNumber(d);
    },
    position: {
      x(d) {
        switch (domain) {
          case 'year':
            return Math.floor(dateHelper.moment(d).isoWeek());
          case 'month':
            return Math.floor(dateHelper.getMonthWeekNumber(d));
          default:
        }
      },
      y(d) {
        return dateHelper.moment(d).isoWeek() % 1;
      },
    },
    format: {
      date: '%B Week #%W',
      legend: '%B Week #%W',
      connector: 'in',
    },
    extractUnit(d) {
      return dateHelper.moment(d).startOf('isoWeek').valueOf();
    },
  };
};

export default weekTemplate;
