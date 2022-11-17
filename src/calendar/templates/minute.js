const minuteTemplate = (domainTemplate) => ({
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
        d.getMinutes() / domainTemplate.getSubDomainRowNumber(d),
      );
    },
    y(d) {
      return d.getMinutes() % domainTemplate.getSubDomainRowNumber(d);
    },
  },
  format: {
    date: '%H:%M, %A %B %-e, %Y',
    legend: '',
    connector: 'at',
  },
  extractUnit(d) {
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
    ).getTime();
  },
});

export default minuteTemplate;
