import type { Template, DomainType } from '../index';

const monthTemplate: Template = (DateHelper) => {
  const ALLOWED_DOMAIN_TYPE: DomainType[] = ['year'];

  return {
    name: 'month',
    allowedDomainType: ALLOWED_DOMAIN_TYPE,
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
  };
};

export default monthTemplate;
