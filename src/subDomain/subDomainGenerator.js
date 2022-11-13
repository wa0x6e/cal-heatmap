import { getDayCountInYear, getDayCountInMonth, getWeekNumber } from '../date';
import {
  generateMinuteDomain,
  generateDayDomain,
  generateHourDomain,
  generateWeekDomain,
  generateMonthDomain,
} from '../domain/domainGenerator';

/**
 * @return int
 */
const computeDaySubDomainSize = (date, domain) => {
  switch (domain) {
    case 'year':
      return getDayCountInYear(date);
    case 'month':
      return getDayCountInMonth(date);
    case 'week':
      return 7;
    default:
      throw new Error('Invalid domain');
  }
};

/**
 * @return int
 */
const computeMinSubDomainSize = (date, domain) => {
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
      return getDayCountInMonth(date) * 24;
    default:
      throw new Error('Invalid domain');
  }
};

/**
 * @return int
 */
const computeWeekSubDomainSize = (date, domain, weekStartOnMonday) => {
  if (domain === 'month') {
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let endWeekNb = getWeekNumber(endOfMonth, weekStartOnMonday);
    let startWeekNb = getWeekNumber(
      new Date(date.getFullYear(), date.getMonth()),
      weekStartOnMonday
    );

    if (startWeekNb > endWeekNb) {
      startWeekNb = 0;
      endWeekNb++;
    }

    return endWeekNb - startWeekNb + 1;
  }
  if (domain === 'year') {
    return getWeekNumber(
      new Date(date.getFullYear(), 11, 31),
      weekStartOnMonday
    );
  }
};

// eslint-disable-next-line import/prefer-default-export
export function generateSubDomain(startDate, options, DTSDomain) {
  let date = startDate;

  if (typeof date === 'number') {
    date = new Date(date);
  }

  switch (options.subDomain) {
    case 'x_min':
    case 'min':
      return generateMinuteDomain(
        date,
        computeMinSubDomainSize(date, options.domain)
      );
    case 'x_hour':
    case 'hour':
      return generateHourDomain(
        date,
        computeHourSubDomainSize(date, options.domain),
        DTSDomain
      );
    case 'x_day':
    case 'day':
      return generateDayDomain(
        date,
        computeDaySubDomainSize(date, options.domain)
      );
    case 'x_week':
    case 'week':
      return generateWeekDomain(
        date,
        computeWeekSubDomainSize(
          date,
          options.domain,
          options.weekStartOnMonday
        ),
        options.weekStartOnMonday
      );
    case 'x_month':
    case 'month':
      return generateMonthDomain(date, 12);
    default:
      throw new Error('Invalid subDomain');
  }
}
