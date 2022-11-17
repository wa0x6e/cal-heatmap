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
          24 * (domainDynamicDimension ? dateHelper.getDayCountInMonth(d) : 31)
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
        return domainDynamicDimension ? dateHelper.getDayCountInMonth(d) : 31;
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
      if (domain === 'month') {
        if (colLimit > 0 || rowLimit > 0) {
          return Math.floor(
            (d.getHours() + (d.getDate() - 1) * 24) /
              domainTemplate.settings.hour.row(d),
          );
        }
        return (
          Math.floor(d.getHours() / domainTemplate.getSubDomainRowNumber(d)) +
          (d.getDate() - 1) * 4
        );
      }
      if (domain === 'week') {
        if (colLimit > 0 || rowLimit > 0) {
          return Math.floor(
            (d.getHours() + dateHelper.getWeekDay(d) * 24) /
              domainTemplate.getSubDomainRowNumber(d),
          );
        }
        return (
          Math.floor(d.getHours() / domainTemplate.getSubDomainRowNumber(d)) +
          dateHelper.getWeekDay(d) * 4
        );
      }
      return Math.floor(d.getHours() / domainTemplate.getSubDomainRowNumber(d));
    },
    y(d) {
      let p = d.getHours();
      if (colLimit > 0 || rowLimit > 0) {
        switch (domain) {
          case 'month':
            p += (d.getDate() - 1) * 24;
            break;
          case 'week':
            p += dateHelper.getWeekDay(d) * 24;
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
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
    ).getTime();
  },
});

export default hourTemplate;
