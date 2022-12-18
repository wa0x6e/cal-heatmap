import type DateHelper from '../../helpers/DateHelper';
import type { OptionsType, DomainOptions } from '../../options/Options';

const dayTemplate = (
  { DateHelper }: { DateHelper: DateHelper },
  {
    domain,
    verticalOrientation,
  }: {
    domain: DomainOptions;
    verticalOrientation: OptionsType['verticalOrientation'];
  },
) => {
  const COLUMNS_COUNT = 7;
  const domainType = domain.type;
  const { dynamicDimension } = domain;

  return {
    name: 'x_day',
    level: 30,
    rowsCount(ts: number) {
      switch (domainType) {
        case 'month':
          return Math.ceil(
            dynamicDimension && !verticalOrientation ?
              DateHelper.getMonthWeekNumber(
                DateHelper.date(ts).endOf('month'),
              ) :
              6, // In rare case, when the first week contains less than 3 days
          );
        case 'year':
          return Math.ceil(
            dynamicDimension ?
              DateHelper.date(ts).endOf('year').dayOfYear() / COLUMNS_COUNT :
              54,
          );
        case 'week':
        default:
          return COLUMNS_COUNT;
      }
    },
    columnsCount() {
      if (domainType === 'week') {
        return 1;
      }
      return COLUMNS_COUNT;
    },
    mapping: (
      startTimestamp: number,
      endTimestamp: number,
      defaultValues: any = {},
    ) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals(
        'day',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts) => {
        const date = DateHelper.date(ts);
        const endWeekNumber = DateHelper.date(ts).endOf('year').week();
        let x = 0;

        switch (domainType) {
          case 'month':
            x = DateHelper.getMonthWeekNumber(ts) - 1;
            break;
          case 'year':
            if (endWeekNumber === 1 && date.week() === endWeekNumber) {
              x = DateHelper.date(ts).subtract(1, 'week').week() + 1;
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
          x: domainType === 'week' ? 0 : date.weekday(),
          ...defaultValues,
        };
      }),
    format: {
      domainLabel: 'Do MMM',
    },
    extractUnit(ts: number) {
      return DateHelper.date(ts).startOf('day').valueOf();
    },
  };
};

export default dayTemplate;
