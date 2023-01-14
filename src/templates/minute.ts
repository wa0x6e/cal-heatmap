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
      ).map((ts) => {
        const minute = DateHelper.date(ts).minute();

        return {
          t: ts,
          x: Math.floor(minute / COLUMNS_COUNT),
          y: minute % COLUMNS_COUNT,
        };
      }),
    extractUnit: (ts) => DateHelper.date(ts).startOf('minute').valueOf(),
  };
};

export default minuteTemplate;
