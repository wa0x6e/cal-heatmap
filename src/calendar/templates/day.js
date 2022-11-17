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
        return domainDynamicDimension ? dateHelper.getDayCountInMonth(d) : 31;
      case 'year':
        return domainDynamicDimension ? dateHelper.getDayCountInYear(d) : 366;
      case 'week':
      default:
        return 7;
    }
  },
  defaultColumnNumber(d) {
    d = new Date(d);
    switch (domain) {
      case 'month':
        return domainDynamicDimension && !verticalOrientation
          ? dateHelper.getWeekNumber(
              new Date(d.getFullYear(), d.getMonth() + 1, 0),
            ) -
              dateHelper.getWeekNumber(d) +
              1
          : 6;
      case 'year':
        return domainDynamicDimension
          ? dateHelper.getWeekNumber(new Date(d.getFullYear(), 11, 31)) -
              dateHelper.getWeekNumber(new Date(d.getFullYear(), 0)) +
              1
          : 54;
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
            dateHelper.getWeekDay(d) / domainTemplate.getSubDomainRowNumber(d),
          );
        case 'month':
          if (colLimit > 0 || rowLimit > 0) {
            return Math.floor(
              (d.getDate() - 1) / domainTemplate.getSubDomainRowNumber(d),
            );
          }
          return (
            dateHelper.getWeekNumber(d) -
            dateHelper.getWeekNumber(new Date(d.getFullYear(), d.getMonth()))
          );
        case 'year':
          if (colLimit > 0 || rowLimit > 0) {
            return Math.floor(
              (dateHelper.getDayOfYear(d) - 1) /
                domainTemplate.getSubDomainRowNumber(d),
            );
          }
          return dateHelper.getWeekNumber(d);
        default:
      }
    },
    y(d) {
      let p = dateHelper.getWeekDay(d);
      if (colLimit > 0 || rowLimit > 0) {
        switch (domain) {
          case 'year':
            p = dateHelper.getDayOfYear(d) - 1;
            break;
          case 'week':
            p = dateHelper.getWeekDay(d);
            break;
          case 'month':
            p = d.getDate() - 1;
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
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  },
});

export default dayTemplate;
