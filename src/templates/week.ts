import type { DomainOptions } from '../options/Options';
import type { Template, DomainType } from '../index';

const weekTemplate: Template = (
  DateHelper,
  { domain }: { domain: DomainOptions },
) => {
  const ALLOWED_DOMAIN_TYPE: DomainType[] = ['year', 'month'];

  return {
    name: 'week',
    allowedDomainType: ALLOWED_DOMAIN_TYPE,
    rowsCount: () => 1,
    columnsCount: (ts) => {
      switch (domain.type) {
        case 'year':
          return domain.dynamicDimension ?
            DateHelper.date(ts).endOf('year').isoWeeksInYear() :
            53;
        case 'month':
          return domain.dynamicDimension ?
            DateHelper.getWeeksCountInMonth(ts) :
            5;
        default:
          return 1;
      }
    },
    mapping: (startTimestamp, endTimestamp) => {
      const clampStart = DateHelper.getFirstWeekOfMonth(startTimestamp);
      const clampEnd = DateHelper.getFirstWeekOfMonth(endTimestamp);

      return DateHelper.intervals('week', clampStart, clampEnd).map(
        (ts, i) => ({
          t: ts,
          x: i,
          y: 0,
        }),
      );
    },
    extractUnit: (ts) => DateHelper.date(ts).startOf('week').valueOf(),
  };
};

export default weekTemplate;
