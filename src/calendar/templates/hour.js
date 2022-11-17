const hourTemplate = (dateHelper, { domain, domainDynamicDimension }) => {
  function getColNumber(d) {
    switch (domain) {
      case 'week':
        return 28;
      case 'month':
        return domainDynamicDimension ? dateHelper.moment(d).daysInMonth() : 31;
      case 'day':
      default:
        return 4;
    }
  }

  return {
    name: 'hour',
    level: 20,
    maxItemNumber(d) {
      switch (domain) {
        case 'week':
          return 24 * 7;
        case 'month':
          return (
            24 *
            (domainDynamicDimension ? dateHelper.moment(d).daysInMonth() : 31)
          );
        case 'day':
        default:
          return 24;
      }
    },
    defaultRowNumber: 6,
    defaultColumnNumber(d) {
      return getColNumber(d);
    },
    row(d) {
      return 6;
    },
    column(d) {
      return getColNumber(d);
    },
    position: {
      x(d) {
        const hour = dateHelper.moment(d).hour();
        const date = dateHelper.moment(d).date();

        if (domain === 'month') {
          return Math.floor(hour / 6) + (date - 1) * 4;
        }
        if (domain === 'week') {
          return Math.floor(hour / 6) + dateHelper.moment(d).isoWeekday() * 4;
        }
        return Math.floor(hour / 6);
      },
      y(d) {
        let p = dateHelper.moment(d).hour();

        return Math.floor(p % 6);
      },
    },
    format: {
      date: '%Hh, %A %B %-e, %Y',
      legend: '%H:00',
      connector: 'at',
    },
    extractUnit(d) {
      return dateHelper.moment(d).startOf('hour').valueOf();
    },
  };
};

export default hourTemplate;
