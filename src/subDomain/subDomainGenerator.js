/**
 * @return int
 */
const computeDaySubDomainSize = (d, domain) => {
  switch (domain) {
    case 'year':
      return d.endOf('year').dayOfYear();
    case 'month':
      return d.daysInMonth();
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
      return date.daysInMonth() * 24;
    default:
      throw new Error('Invalid domain');
  }
};

/**
 * @return int
 */
const computeWeekSubDomainSize = (date, domain) => {
  if (domain === 'month') {
    const endWeekNb = date.endOf('month').week();
    const startWeekNb = date.startOf('month').week();

    return endWeekNb - startWeekNb;
  }
  if (domain === 'year') {
    return date.weeksInYear();
  }
};

// eslint-disable-next-line import/prefer-default-export
export function generateSubDomain(calendar, date, options) {
  switch (options.subDomain) {
    case 'minute':
      return calendar.helpers.DateHelper.generateTimeInterval(
        'minute',
        date,
        computeMinuteSubDomainSize(
          calendar.helpers.DateHelper.date(date),
          options.domain,
        ),
      );
    case 'hour':
      return calendar.helpers.DateHelper.generateTimeInterval(
        'hour',
        date,
        computeHourSubDomainSize(
          calendar.helpers.DateHelper.date(date),
          options.domain,
        ),
      );
    case 'day':
      return calendar.helpers.DateHelper.generateTimeInterval(
        'day',
        date,
        computeDaySubDomainSize(
          calendar.helpers.DateHelper.date(date),
          options.domain,
        ),
      );
    case 'week':
      return calendar.helpers.DateHelper.generateTimeInterval(
        'week',
        date,
        computeWeekSubDomainSize(
          calendar.helpers.DateHelper.date(date),
          options.domain,
        ),
      );
    case 'month':
      return calendar.helpers.DateHelper.generateTimeInterval(
        'month',
        date,
        12,
      );
    default:
      throw new Error('Invalid subDomain');
  }
}
