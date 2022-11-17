const hourTemplate = (dateHelper, { domain, domainDynamicDimension }) => {
  const TOTAL_ITEMS = 24;
  const ROWS_COUNT = 6;

  function getTotalColNumber(d) {
    switch (domain) {
      case 'week':
        return (TOTAL_ITEMS / ROWS_COUNT) * 7;
      case 'month':
        return (TOTAL_ITEMS / ROWS_COUNT) * domainDynamicDimension
          ? dateHelper.moment(d).daysInMonth()
          : 31;
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
        const hour = dateHelper.moment(d).hour();
        const date = dateHelper.moment(d).date();
        const baseX = Math.floor(hour / ROWS_COUNT);
        const columnOffset = TOTAL_ITEMS / ROWS_COUNT;

        if (domain === 'month') {
          return baseX + (date - 1) * columnOffset;
        }
        if (domain === 'week') {
          return baseX + (dateHelper.moment(d).isoWeekday() - 1) * columnOffset;
        }
        return baseX;
      },
      y(d) {
        return Math.floor(dateHelper.moment(d).hour() % ROWS_COUNT);
      },
    },
    format: {
      date: '%Hh, %A %B %-e, %Y',
      legend: '%H:00',
      connector: 'at',
    },
    extractUnit(d) {
      return dateHelper.moment(d).startOf('hour').valueOf();
    },
  };
};

export default hourTemplate;
