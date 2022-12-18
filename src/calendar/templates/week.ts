import type DateHelper from '../../helpers/DateHelper';
import type { DomainOptions } from '../../options/Options';

const weekTemplate = (
  { DateHelper }: { DateHelper: DateHelper },
  { domain }: { domain: DomainOptions },
) => {
  const { dynamicDimension } = domain;

  function getTotalColNumber(ts: number) {
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
  }

  return {
    name: 'week',
    level: 40,
    rowsCount() {
      return 1;
    },
    columnsCount(ts: number) {
      return getTotalColNumber(ts);
    },
    mapping: (
      startTimestamp: number,
      endTimestamp: number,
      defaultValues: any = {},
    ) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals(
        'week',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts, i) => ({
        t: ts,
        x: i,
        y: 0,
        ...defaultValues,
      })),
    position: {
      x() {},
      y() {
        return 0;
      },
    },
    format: {
      domainLabel: 'wo [week] Y',
    },
    extractUnit(ts: number) {
      return DateHelper.date(ts).startOf('week').valueOf();
    },
  };
};

export default weekTemplate;
