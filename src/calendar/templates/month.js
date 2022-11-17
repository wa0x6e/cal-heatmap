const monthTemplate = (domainTemplate, dateHelper) => ({
  name: 'month',
  level: 50,
  maxItemNumber: 12,
  defaultColumnNumber: 12,
  defaultRowNumber: 1,
  row() {
    return domainTemplate.getSubDomainRowNumber();
  },
  column() {
    return domainTemplate.getSubDomainColumnNumber();
  },
  position: {
    x(d) {
      return Math.floor(
        dateHelper.moment(d).month() / domainTemplate.getSubDomainRowNumber(d),
      );
    },
    y(d) {
      return (
        dateHelper.moment(d).month() % domainTemplate.getSubDomainRowNumber(d)
      );
    },
  },
  format: {
    date: '%B %Y',
    legend: '%B',
    connector: 'in',
  },
  extractUnit(d) {
    return dateHelper.moment(d).startOf('month').valueOf();
  },
});

export default monthTemplate;
