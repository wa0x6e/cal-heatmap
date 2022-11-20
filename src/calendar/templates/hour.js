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
    position: {
      x(d) {
        const hour = DateHelper.date(d).hour();
        const date = DateHelper.date(d).date();
        const baseX = Math.floor(hour / ROWS_COUNT);
        const columnOffset = TOTAL_ITEMS / ROWS_COUNT;

        if (domain === 'month') {
          return baseX + (date - 1) * columnOffset;
        }
        if (domain === 'week') {
          return baseX + (DateHelper.date(d).isoWeekday() - 1) * columnOffset;
        }
        return baseX;
      },
      y(d) {
        return Math.floor(DateHelper.date(d).hour() % ROWS_COUNT);
      },
    },
    format: {
      date: 'HH[h], dddd MMMM D, Y',
      legend: 'HH:00',
      connector: 'at',
    },
    extractUnit(d) {
      return DateHelper.date(d).startOf('hour').valueOf();
    },
  };
};

export default hourTemplate;
