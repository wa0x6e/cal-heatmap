import type DateHelper from '../../helpers/DateHelper';
import type { Template, TemplateResult } from '../../index';

const minuteTemplate: Template = ({
  DateHelper,
}: {
  DateHelper: DateHelper;
}): TemplateResult => {
  const COLUMNS_COUNT = 10;
  const ROWS_COUNT = 6;

  return {
    name: 'minute',
    level: 10,
    rowsCount() {
      return COLUMNS_COUNT;
    },
    columnsCount() {
      return ROWS_COUNT;
    },
    mapping: (
      startTimestamp: number,
      endTimestamp: number,
      defaultValues: any = {},
    ) =>
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
          ...defaultValues,
        };
      }),
    format: {
      domainLabel: '',
    },
    extractUnit(ts: number) {
      return DateHelper.date(ts).startOf('minute').valueOf();
    },
  };
};

export default minuteTemplate;
