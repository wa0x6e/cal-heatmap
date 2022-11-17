const dayTemplate = (
  dateHelper,
  { domain, domainDynamicDimension, verticalOrientation },
) => {
  function getColNumber(d) {
    switch (domain) {
      case 'month':
        return domainDynamicDimension && !verticalOrientation
          ? dateHelper.moment(dateHelper.moment(d).startOf('month')).isoWeek() -
              dateHelper.moment(d).isoWeek() +
              1
          : 6;
      case 'year':
        return domainDynamicDimension
          ? dateHelper.moment(dateHelper.moment(d).endOf('month')).isoWeek() -
              dateHelper
                .moment(dateHelper.moment(d).startOf('year'))
                .isoWeek() +
              1
          : 52;
      case 'week':
      default:
        return 1;
    }
  }

  return {
    name: 'day',
    level: 30,
    maxItemNumber(d) {
      switch (domain) {
        case 'month':
          return domainDynamicDimension
            ? dateHelper.moment(d).daysInMonth()
            : 31;
        case 'year':
          return domainDynamicDimension
            ? dateHelper.moment(d).endOf('year').dayOfYear()
            : 366;
        case 'week':
        default:
          return 7;
      }
    },
    defaultColumnNumber(d) {
      return getColNumber(d);
    },
    defaultRowNumber: 7,
    row(d) {
      return 7;
    },
    column(d) {
      return getColNumber(d);
    },
    position: {
      x(d) {
        switch (domain) {
          case 'week':
            return Math.floor(dateHelper.moment(d).isoWeekday() / 7);
          case 'month':
            return (
              dateHelper.moment(d).isoWeek() -
              dateHelper.moment(dateHelper.moment(d).startOf('month')).isoWeek()
            );
          case 'year':
            return dateHelper.moment(d).isoWeek();
          default:
        }
      },
      y(d) {
        let p = dateHelper.moment(d).isoWeekday();

        return Math.floor(p % 7);
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
