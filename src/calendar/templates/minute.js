const minuteTemplate = (domainTemplate, dateHelper) => ({
  name: 'minute',
  level: 10,
  maxItemNumber: 60,
  defaultRowNumber: 10,
  defaultColumnNumber: 6,
  row(d) {
    return domainTemplate.getSubDomainRowNumber(d);
  },
  column(d) {
    return domainTemplate.getSubDomainColumnNumber(d);
  },
  position: {
    x(d) {
      return Math.floor(
        dateHelper.moment(d).minute() / domainTemplate.getSubDomainRowNumber(d),
      );
    },
    y(d) {
      return (
        dateHelper.moment(d).minute() % domainTemplate.getSubDomainRowNumber(d)
      );
    },
  },
  format: {
    date: '%H:%M, %A %B %-e, %Y',
    legend: '',
    connector: 'at',
  },
  extractUnit(d) {
    return dateHelper.moment(d).startOf('minute').valueOf();
  },
});

export default minuteTemplate;
