const dayTemplate = (
  domainTemplate,
  dateHelper,
  { domain, rowLimit, colLimit, domainDynamicDimension, verticalOrientation },
) => ({
  name: 'day',
  level: 30,
  maxItemNumber(d) {
    switch (domain) {
      case 'month':
        return domainDynamicDimension ? dateHelper.moment(d).daysInMonth() : 31;
      case 'year':
        return domainDynamicDimension ? dateHelper.moment(d).daysInYear() : 366;
      case 'week':
      default:
        return 7;
    }
  },
  defaultColumnNumber(d) {
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
  },
  defaultRowNumber: 7,
  row(d) {
    return domainTemplate.getSubDomainRowNumber(d);
  },
  column(d) {
    return domainTemplate.getSubDomainColumnNumber(d);
  },
  position: {
    x(d) {
      switch (domain) {
        case 'week':
          return Math.floor(
            dateHelper.moment(d).isoWeekday() /
              domainTemplate.getSubDomainRowNumber(d),
          );
        case 'month':
          if (colLimit > 0 || rowLimit > 0) {
            return Math.floor(
              (dateHelper.moment(d).date() - 1) /
                domainTemplate.getSubDomainRowNumber(d),
            );
          }
          return (
            dateHelper.moment(d).isoWeek() -
            dateHelper.moment(dateHelper.moment(d).startOf('month')).isoWeek()
          );
        case 'year':
          if (colLimit > 0 || rowLimit > 0) {
            return Math.floor(
              (dateHelper.moment(d).dayOfYear() - 1) /
                domainTemplate.getSubDomainRowNumber(d),
            );
          }
          return dateHelper.moment(d).isoWeek();
        default:
      }
    },
    y(d) {
      let p = dateHelper.moment(d).isoWeekday();
      if (colLimit > 0 || rowLimit > 0) {
        switch (domain) {
          case 'year':
            p = dateHelper.moment(d).dayOfYear() - 1;
            break;
          case 'week':
            p = dateHelper.moment(d).isoWeekday();
            break;
          case 'month':
            p = dateHelper.moment(d).date() - 1;
            break;
          default:
        }
      }
      return Math.floor(p % domainTemplate.getSubDomainRowNumber(d));
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
});

export default dayTemplate;
