import type { Template } from '../index';

const yearTemplate: Template = (DateHelper) => ({
  name: 'year',
  rowsCount: () => 1,
  columnsCount: () => 1,
  mapping: (startTimestamp, endTimestamp) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    DateHelper.intervals(
      'year',
      startTimestamp,
      DateHelper.date(endTimestamp),
    ).map((ts, index) => ({
      t: ts,
      x: index,
      y: 0,
    })),
  extractUnit: (ts) => DateHelper.date(ts).startOf('year').valueOf(),
});

export default yearTemplate;
