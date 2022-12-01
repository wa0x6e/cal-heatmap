const hourTemplate = (DateHelper, { domain, domainDynamicDimension }) => {
  const TOTAL_ITEMS = 24;
  const ROWS_COUNT = 6;

  function getTotalColNumber(d) {
    switch (domain) {
      case 'week':
        return (TOTAL_ITEMS / ROWS_COUNT) * 7;
      case 'month':
        return (
          (TOTAL_ITEMS / ROWS_COUNT) *
          (domainDynamicDimension ? DateHelper.date(d).daysInMonth() : 31)
        );
      case 'day':
      default:
        return TOTAL_ITEMS / ROWS_COUNT;
    }
  }

  return {
    name: 'hour',
    level: 20,
    rowsCount() {
      return ROWS_COUNT;
    },
    columnsCount(d) {
      return getTotalColNumber(d);
    },
    mapping: (startDate, endDate, defaultValues) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals('hour', startDate, DateHelper.date(endDate)).map(
        (d) => {
          const date = DateHelper.date(d);
          const hour = date.hour();
          const monthDate = date.date();
          const baseX = Math.floor(hour / ROWS_COUNT);
          const columnOffset = TOTAL_ITEMS / ROWS_COUNT;

          if (domain === 'month') {
            return baseX + (monthDate - 1) * columnOffset;
          }
          if (domain === 'week') {
            return baseX + (date.isoWeekday() - 1) * columnOffset;
          }

          return {
            t: d,
            x: baseX,
            y: Math.floor(hour % ROWS_COUNT),
            ...defaultValues,
          };
        },
      ),

    format: {
      date: 'HH[h], dddd MMMM D, Y',
      legend: 'HH:00',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('hour').valueOf();
    },
  };
};

export default hourTemplate;
