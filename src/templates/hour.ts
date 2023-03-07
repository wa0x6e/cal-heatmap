import type { DomainOptions } from '../options/Options';
import type { Template, DomainType } from '../index';

const hourTemplate: Template = (
  DateHelper,
  { domain }: { domain: DomainOptions },
) => {
  const TOTAL_ITEMS = 24;
  const ROWS_COUNT = 6;
  const ALLOWED_DOMAIN_TYPE: DomainType[] = ['month', 'week', 'day'];

  return {
    name: 'hour',
    allowedDomainType: ALLOWED_DOMAIN_TYPE,
    rowsCount: () => ROWS_COUNT,
    columnsCount: (ts) => {
      switch (domain.type) {
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

        if (domain.type === 'month') {
          baseX += (monthDate - 1) * columnOffset;
        }
        if (domain.type === 'week') {
          baseX += +date.format('d') * columnOffset;
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
