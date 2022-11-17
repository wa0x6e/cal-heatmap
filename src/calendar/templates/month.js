const monthTemplate = (domainTemplate) => ({
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
      return Math.floor(d.getMonth() / domainTemplate.getSubDomainRowNumber(d));
    },
    y(d) {
      return d.getMonth() % domainTemplate.getSubDomainRowNumber(d);
    },
  },
  format: {
    date: '%B %Y',
    legend: '%B',
    connector: 'in',
  },
  extractUnit(d) {
    return new Date(d.getFullYear(), d.getMonth()).getTime();
  },
});

export default monthTemplate;
