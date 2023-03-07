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
  const ROWS_COUNT = 7;
  const ALLOWED_DOMAIN_TYPE: DomainType[] = ['year', 'month', 'week'];

  return {
    name: 'day',
    allowedDomainType: ALLOWED_DOMAIN_TYPE,
    rowsCount: () => (domain.type === 'week' ? 1 : ROWS_COUNT),
    columnsCount: (ts) => {
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
              DateHelper.date(ts).endOf('year').dayOfYear() / ROWS_COUNT :
              54,
          );
        case 'week':
        default:
          return ROWS_COUNT;
      }
    },
    mapping: (startTimestamp, endTimestamp) => {
      let weekNumber = 0;
      let x = -1;

      return DateHelper.intervals(
        'day',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts) => {
        const date = DateHelper.date(ts);

        switch (domain.type) {
          case 'month':
            x = DateHelper.getMonthWeekNumber(ts) - 1;
            break;
          case 'year':
            if (weekNumber !== date.week()) {
              weekNumber = date.week();
              x += 1;
            }
            break;
          case 'week':
            x = date.weekday();
            break;
          default:
        }

        return {
          t: ts,
          x,
          y: domain.type === 'week' ? 0 : date.weekday(),
        };
      });
    },
    extractUnit: (ts) => DateHelper.date(ts).startOf('day').valueOf(),
  };
};

export default dayTemplate;
