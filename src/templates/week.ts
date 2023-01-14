import type { DomainOptions } from '../options/Options';
import type { Template } from '../index';

const weekTemplate: Template = (
  DateHelper,
  { domain }: { domain: DomainOptions },
) => {
  const { dynamicDimension } = domain;

  return {
    name: 'week',
    rowsCount: () => 1,
    columnsCount: (ts) => {
      switch (domain.type) {
        case 'year':
          return dynamicDimension ?
            DateHelper.date(ts).endOf('year').weeksInYear() :
            53;
        case 'month':
          return dynamicDimension ?
            DateHelper.getMonthWeekNumber(DateHelper.date(ts).endOf('month')) :
            5;
        default:
          return 1;
      }
    },
    mapping: (startTimestamp, endTimestamp) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals(
        'week',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts, i) => ({
        t: ts,
        x: i,
        y: 0,
      })),
    extractUnit: (ts) => DateHelper.date(ts).startOf('week').valueOf(),
  };
};

export default weekTemplate;
