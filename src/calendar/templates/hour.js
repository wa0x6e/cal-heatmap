const hourTemplate = (
  domainTemplate,
  dateHelper,
  { domain, rowLimit, colLimit, domainDynamicDimension },
) => ({
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
    switch (domain) {
      case 'week':
        return 28;
      case 'month':
        return domainDynamicDimension ? dateHelper.moment(d).daysInMonth() : 31;
      case 'day':
      default:
        return 4;
    }
  },
  row(d) {
    return domainTemplate.getSubDomainRowNumber(d);
  },
  column(d) {
    return domainTemplate.getSubDomainColumnNumber(d);
  },
  position: {
    x(d) {
      const hour = dateHelper.moment(d).hour();
      const date = dateHelper.moment(d).date();

      if (domain === 'month') {
        if (colLimit > 0 || rowLimit > 0) {
          return Math.floor(
            (hour + (date - 1) * 24) / domainTemplate.getSubDomainRowNumber(d),
          );
        }
        return (
          Math.floor(hour / domainTemplate.getSubDomainRowNumber(d)) +
          (date - 1) * 4
        );
      }
      if (domain === 'week') {
        if (colLimit > 0 || rowLimit > 0) {
          return Math.floor(
            (hour + dateHelper.moment(d).isoWeekday() * 24) /
              domainTemplate.getSubDomainRowNumber(d),
          );
        }
        return (
          Math.floor(hour / domainTemplate.getSubDomainRowNumber(d)) +
          dateHelper.moment(d).isoWeekday() * 4
        );
      }
      return Math.floor(hour / domainTemplate.getSubDomainRowNumber(d));
    },
    y(d) {
      let p = dateHelper.moment(d).hour();
      if (colLimit > 0 || rowLimit > 0) {
        switch (domain) {
          case 'month':
            p += (dateHelper.moment(d).date() - 1) * 24;
            break;
          case 'week':
            p += dateHelper.moment(d).isoWeekday() * 24;
            break;
          default:
        }
      }
      return Math.floor(p % domainTemplate.getSubDomainRowNumber(d));
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
});

export default hourTemplate;
