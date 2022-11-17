const weekTemplate = (dateHelper, { domain, domainDynamicDimension }) => {
  function getColNumber(d) {
    switch (domain) {
      case 'year':
        return 52;
      case 'month':
        return domainDynamicDimension
          ? dateHelper.moment(dateHelper.moment(d).startOf('year')).isoWeek() -
              dateHelper.moment(d).isoWeek()
          : 5;
      default:
    }
  }

  return {
    name: 'week',
    level: 40,
    maxItemNumber: 52,
    defaultColumnNumber(d) {
      getColNumber(d);
    },
    defaultRowNumber: 1,
    row(d) {
      return 1;
    },
    column(d) {
      return getColNumber(d);
    },
    position: {
      x(d) {
        switch (domain) {
          case 'year':
            return Math.floor(dateHelper.moment(d).isoWeek() / 1);
          case 'month':
            return Math.floor(dateHelper.getMonthWeekNumber(d) / 1);
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
