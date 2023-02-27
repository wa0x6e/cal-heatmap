import type { Template } from '../index';

const dayTemplate: Template = (DateHelper) => {
  const ROWS_COUNT = 7;

  return {
    name: 'ghDay',
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
