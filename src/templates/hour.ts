import type { DomainOptions } from '../options/Options';
import type { Template } from '../index';

const hourTemplate: Template = (
  DateHelper,
  { domain }: { domain: DomainOptions },
) => {
  const TOTAL_ITEMS = 24;
  const ROWS_COUNT = 6;

  const domainType = domain.type;

  return {
    name: 'hour',
    rowsCount: () => ROWS_COUNT,
    columnsCount: (ts) => {
      switch (domainType) {
        case 'week':
          return (TOTAL_ITEMS / ROWS_COUNT) * 7;
        case 'month':
          return (
            (TOTAL_ITEMS / ROWS_COUNT) *
            (domain.dynamicDimension ? DateHelper.date(ts).daysInMonth() : 31)
          );
        case 'day':
        default:
          return TOTAL_ITEMS / ROWS_COUNT;
      }
    },
    mapping: (startTimestamp, endTimestamp) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals(
        'hour',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts) => {
        const date = DateHelper.date(ts);
        const hour = date.hour();
        const monthDate = date.date();
        let baseX = Math.floor(hour / ROWS_COUNT);
        const columnOffset = TOTAL_ITEMS / ROWS_COUNT;

        if (domainType === 'month') {
          baseX += (monthDate - 1) * columnOffset;
        }
        if (domainType === 'week') {
          baseX += (date.isoWeekday() - 1) * columnOffset;
        }

        return {
          t: ts,
          x: baseX,
          y: Math.floor(hour % ROWS_COUNT),
        };
      }),
    extractUnit: (ts) => DateHelper.date(ts).startOf('hour').valueOf(),
  };
};

export default hourTemplate;
