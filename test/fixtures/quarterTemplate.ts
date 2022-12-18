import type DateHelper from '../../src/helpers/DateHelper';

const quarterTemplate = ({ DateHelper }: { DateHelper: DateHelper }) => ({
  name: 'quarter',
  level: 50,
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 4;
  },
  mapping: (startDate: number, endDate: number, defaultValues: any = {}) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    DateHelper.intervals('quarter', startDate, DateHelper.date(endDate)).map(
      (d: number, index: number) => ({
        t: d,
        x: index,
        y: 0,
        ...defaultValues,
      }),
    ),

  format: {
    date: 'Q',
    legend: 'Q',
  },
  extractUnit(ts: number) {
    return DateHelper.date(ts).startOf('quarter').valueOf();
  },
});

export default quarterTemplate;
