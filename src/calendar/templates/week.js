const weekTemplate = (
  domainTemplate,
  dateHelper,
  { domain, domainDynamicDimension },
) => ({
  name: 'week',
  level: 40,
  maxItemNumber: 52,
  defaultColumnNumber(d) {
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
            dateHelper.moment(d).isoWeek() /
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
        dateHelper.moment(d).isoWeek() % domainTemplate.getSubDomainRowNumber(d)
      );
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
});

export default weekTemplate;
