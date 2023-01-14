import type { Template } from '../index';

const monthTemplate: Template = (DateHelper) => ({
  name: 'month',
  rowsCount: () => 1,
  columnsCount: () => 12,
  mapping: (startTimestamp, endTimestamp) =>
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
  extractUnit: (ts) => DateHelper.date(ts).startOf('month').valueOf(),
});

export default monthTemplate;
