import type { Template } from '../index';

const minuteTemplate: Template = (DateHelper) => {
  const COLUMNS_COUNT = 10;
  const ROWS_COUNT = 6;

  return {
    name: 'minute',
    rowsCount: () => COLUMNS_COUNT,
    columnsCount: () => ROWS_COUNT,
    mapping: (startTimestamp, endTimestamp) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      DateHelper.intervals(
        'minute',
        startTimestamp,
        DateHelper.date(endTimestamp),
      ).map((ts, index: number) => ({
        t: ts,
        x: Math.floor(index / COLUMNS_COUNT),
        y: index % COLUMNS_COUNT,
      })),
    extractUnit: (ts) => DateHelper.date(ts).startOf('minute').valueOf(),
  };
};

export default minuteTemplate;
