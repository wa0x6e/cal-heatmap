import type { OpUnitType } from 'dayjs';
import type DateHelper from '../../src/helpers/DateHelper';
import type { DomainType } from '../../src/types';

const quarterTemplate = (DateHelper: DateHelper) => ({
  name: 'quarter',
  allowedDomainType: ['year'],
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 4;
  },
  mapping: (startDate: number, endDate: number, defaultValues: any = {}) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    DateHelper.intervals(
      'quarter' as DomainType,
      startDate,
      DateHelper.date(endDate),
    ).map((d: number, index: number) => ({
      t: d,
      x: index,
      y: 0,
      ...defaultValues,
    })),
  extractUnit(ts: number) {
    return DateHelper.date(ts)
      .startOf('quarter' as OpUnitType)
      .valueOf();
  },
});

export default quarterTemplate;
