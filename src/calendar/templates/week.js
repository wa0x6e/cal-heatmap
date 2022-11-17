const weekTemplate = (
  domainTemplate,
  dateHelper,
  { domain, domainDynamicDimension },
) => ({
  name: 'week',
  level: 40,
  maxItemNumber: 54,
  defaultColumnNumber(d) {
    d = new Date(d);
    switch (domain) {
      case 'year':
        return domainTemplate.settings.week.maxItemNumber;
      case 'month':
        return domainDynamicDimension
          ? dateHelper.getWeekNumber(
              new Date(d.getFullYear(), d.getMonth() + 1, 0),
            ) - dateHelper.getWeekNumber(d)
          : 5;
      default:
    }
  },
  defaultRowNumber: 1,
  row(d) {
    return domainTemplate.getSubDomainRowNumber(d);
  },
  column(d) {
    return domainTemplate.getSubDomainColumnNumber(d);
  },
  position: {
    x(d) {
      switch (domain) {
        case 'year':
          return Math.floor(
            dateHelper.getWeekNumber(d) /
              domainTemplate.getSubDomainRowNumber(d),
          );
        case 'month':
          return Math.floor(
            dateHelper.getMonthWeekNumber(d) /
              domainTemplate.getSubDomainRowNumber(d),
          );
        default:
      }
    },
    y(d) {
      return (
        dateHelper.getWeekNumber(d) % domainTemplate.getSubDomainRowNumber(d)
      );
    },
  },
  format: {
    date: '%B Week #%W',
    legend: '%B Week #%W',
    connector: 'in',
  },
  extractUnit(d) {
    const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    // According to ISO-8601, week number computation are based on week starting on Monday
    let weekDay = dt.getDay();
    if (weekDay < 0) {
      weekDay = 6;
    }
    dt.setDate(dt.getDate() - weekDay);
    return dt.getTime();
  },
});

export default weekTemplate;
