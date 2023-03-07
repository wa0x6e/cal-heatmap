import type { OptionsType, DomainOptions } from '../options/Options';
import type { Template, DomainType } from '../index';

const dayTemplate: Template = (
  DateHelper,
  {
    domain,
    verticalOrientation,
  }: {
    domain: DomainOptions;
    verticalOrientation: OptionsType['verticalOrientation'];
  },
) => {
  const COLUMNS_COUNT = 7;
  const ALLOWED_DOMAIN_TYPE: DomainType[] = ['year', 'month', 'week'];

  return {
    name: 'xDay',
    allowedDomainType: ALLOWED_DOMAIN_TYPE,
    rowsCount: (ts) => {
      switch (domain.type) {
        case 'month':
          return Math.ceil(
            domain.dynamicDimension && !verticalOrientation ?
              DateHelper.getMonthWeekNumber(
                DateHelper.date(ts).endOf('month'),
              ) :
              6, // In rare case, when the first week contains less than 3 days
          );
        case 'year':
          return Math.ceil(
            domain.dynamicDimension ?
              DateHelper.date(ts).endOf('year').dayOfYear() / COLUMNS_COUNT :
              54,
          );
        case 'week':
        default:
          return COLUMNS_COUNT;
      }
    },
    columnsCount: () => {
      if (domain.type === 'week') {
        return 1;
      }
      return COLUMNS_COUNT;
    },
    mapping: (startTimestamp, endTimestamp) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals(
        'day',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts) => {
        const date = DateHelper.date(ts);
        const endWeekNumber = date.endOf('year').week();
        let x = 0;

        switch (domain.type) {
          case 'month':
            x = DateHelper.getMonthWeekNumber(ts) - 1;
            break;
          case 'year':
            if (endWeekNumber === 1 && date.week() === endWeekNumber) {
              x = date.subtract(1, 'week').week() + 1;
            }

            x = date.week() - 1;
            break;
          case 'week':
            x = date.weekday();
            break;
          default:
        }

        return {
          t: ts,
          y: x,
          x: domain.type === 'week' ? 0 : date.weekday(),
        };
      }),
    extractUnit: (ts) => DateHelper.date(ts).startOf('day').valueOf(),
  };
};

export default dayTemplate;
