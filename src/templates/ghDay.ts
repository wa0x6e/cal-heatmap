import type { Template, DomainType } from '../index';

const dayTemplate: Template = (DateHelper) => {
  const ROWS_COUNT = 7;
  const ALLOWED_DOMAIN_TYPE: DomainType[] = ['month'];

  return {
    name: 'ghDay',
    allowedDomainType: ALLOWED_DOMAIN_TYPE,
    rowsCount: () => ROWS_COUNT,
    columnsCount: (ts) => DateHelper.getWeeksCountInMonth(ts),
    mapping: (startTimestamp, endTimestamp) => {
      const clampStart = DateHelper.getFirstWeekOfMonth(startTimestamp);
      const clampEnd = DateHelper.getFirstWeekOfMonth(endTimestamp);

      let x = -1;
      const pivotDay = clampStart.weekday();

      return DateHelper.intervals('day', clampStart, clampEnd).map((ts) => {
        const weekday = DateHelper.date(ts).weekday();
        if (weekday === pivotDay) {
          x += 1;
        }

        return {
          t: ts,
          x,
          y: weekday,
        };
      });
    },
    extractUnit: (ts) => DateHelper.date(ts).startOf('day').valueOf(),
  };
};

export default dayTemplate;
