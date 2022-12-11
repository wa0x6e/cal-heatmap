const hourTemplate = ({ DateHelper }, { domain }) => {
  const TOTAL_ITEMS = 24;
  const ROWS_COUNT = 6;

  const domainType = domain.type;

  function getTotalColNumber(d) {
    switch (domainType) {
      case 'week':
        return (TOTAL_ITEMS / ROWS_COUNT) * 7;
      case 'month':
        return (
          (TOTAL_ITEMS / ROWS_COUNT) *
          (domain.dynamicDimension ? DateHelper.date(d).daysInMonth() : 31)
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
    columnsCount(ts) {
      return getTotalColNumber(ts);
    },
    mapping: (startTimestamp, endTimestamp, defaultValues) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals(
        'hour',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts) => {
        const date = DateHelper.date(ts);
        const hour = date.hour();
        const monthDate = date.date();
        const baseX = Math.floor(hour / ROWS_COUNT);
        const columnOffset = TOTAL_ITEMS / ROWS_COUNT;

        if (domainType === 'month') {
          return baseX + (monthDate - 1) * columnOffset;
        }
        if (domainType === 'week') {
          return baseX + (date.isoWeekday() - 1) * columnOffset;
        }

        return {
          t: ts,
          x: baseX,
          y: Math.floor(hour % ROWS_COUNT),
          ...defaultValues,
        };
      }),

    format: {
      domainLabel: 'HH:00',
    },
    extractUnit(ts) {
      return DateHelper.date(ts).startOf('hour').valueOf();
    },
  };
};

export default hourTemplate;
