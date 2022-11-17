import DateHelper from '../utils/DateHelper';
import generateTimeInterval from '../utils/timeInterval';

/**
 * @return int
 */
const computeDaySubDomainSize = (d, domain) => {
  switch (domain) {
    case 'year':
      return DateHelper.moment(d).daysInYear();
    case 'month':
      return DateHelper.moment(d).daysInMonth();
    case 'week':
      return 7;
    default:
      throw new Error('Invalid domain');
  }
};

/**
 * @return int
 */
const computeMinuteSubDomainSize = (date, domain) => {
  switch (domain) {
    case 'hour':
      return 60;
    case 'day':
      return 60 * 24;
    case 'week':
      return 60 * 24 * 7;
    default:
      throw new Error('Invalid domain');
  }
};

/**
 * @return int
 */
const computeHourSubDomainSize = (date, domain) => {
  switch (domain) {
    case 'day':
      return 24;
    case 'week':
      return 168;
    case 'month':
      return DateHelper.moment(date).daysInMonth() * 24;
    default:
      throw new Error('Invalid domain');
  }
};

/**
 * @return int
 */
const computeWeekSubDomainSize = (date, domain) => {
  if (domain === 'month') {
    const endWeekNb = DateHelper.moment(
      DateHelper.moment(date).endOf('month'),
    ).isoWeek();
    const startWeekNb = DateHelper.moment(
      DateHelper.moment(date).startOf('month'),
    ).isoWeek();

    return endWeekNb - startWeekNb;
  }
  if (domain === 'year') {
    return DateHelper.moment(DateHelper.moment(date).endOf('year')).isoWeek();
  }
};

// eslint-disable-next-line import/prefer-default-export
export function generateSubDomain(date, options) {
  switch (options.subDomain) {
    case 'x_minute':
    case 'minute':
      return generateTimeInterval(
        'minute',
        date,
        computeMinuteSubDomainSize(date, options.domain),
      );
    case 'x_hour':
    case 'hour':
      return generateTimeInterval(
        'hour',
        date,
        computeHourSubDomainSize(date, options.domain),
      );
    case 'x_day':
    case 'day':
      return generateTimeInterval(
        'day',
        date,
        computeDaySubDomainSize(date, options.domain),
      );
    case 'x_week':
    case 'week':
      return generateTimeInterval(
        'week',
        date,
        computeWeekSubDomainSize(date, options.domain),
      );
    case 'x_month':
    case 'month':
      return generateTimeInterval('month', date, 12);
    default:
      throw new Error('Invalid subDomain');
  }
}
