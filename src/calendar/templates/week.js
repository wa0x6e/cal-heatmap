const weekTemplate = ({ DateHelper }, { domain }) => {
  const { dynamicDimension } = domain;

  function getTotalColNumber(d) {
    switch (domain.type) {
      case 'year':
        return dynamicDimension ?
          DateHelper.date(d).endOf('year').weeksInYear() :
          53;
      case 'month':
        return dynamicDimension ?
          DateHelper.getMonthWeekNumber(DateHelper.date(d).endOf('month')) :
          5;
      default:
        return 1;
    }
  }

  return {
    name: 'week',
    level: 40,
    rowsCount() {
      return 1;
    },
    columnsCount(d) {
      return getTotalColNumber(d);
    },
    mapping: (startDate, endDate, defaultValues) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals('week', startDate, DateHelper.date(endDate)).map(
        (d, i) => ({
          t: d,
          x: i,
          y: 0,
          ...defaultValues,
        }),
      ),
    position: {
      x() {},
      y() {
        return 0;
      },
    },
    format: {
      date: 'wo [week] Y',
      legend: 'wo [week] Y',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('week').valueOf();
    },
  };
};

export default weekTemplate;
