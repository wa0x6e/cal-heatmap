import type DateHelper from '../../helpers/DateHelper';
import type { Template, TemplateResult } from '../../index';

const monthTemplate: Template = (DateHelper: DateHelper): TemplateResult => ({
  name: 'month',
  level: 50,
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 12;
  },
  mapping: (startTimestamp: number, endTimestamp: number) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    DateHelper.intervals(
      'month',
      startTimestamp,
      DateHelper.date(endTimestamp),
    ).map((ts) => ({
      t: ts,
      x: DateHelper.date(ts).month(),
      y: 0,
    })),

  format: {
    domainLabel: 'MMMM',
  },
  extractUnit(ts: number) {
    return DateHelper.date(ts).startOf('month').valueOf();
  },
});

export default monthTemplate;
