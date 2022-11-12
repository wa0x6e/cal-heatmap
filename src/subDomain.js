import { formatNumber, formatDate, formatStringWithObject } from './function';
import { getDayCountInYear, getDayCountInMonth, getWeekNumber } from './date';
import {
  generateMinuteDomain,
  generateDayDomain,
  generateHourDomain,
  generateMonthDomain,
} from './domain/domainGenerator';

export function formatSubDomainText(element, formatter) {
  if (typeof formatter === 'function') {
    element.text(d => formatter(d.t, d.v));
  }
}

export function getSubDomainTitle(d, options, connector) {
  if (d.v === null && !options.considerMissingDataAsZero) {
    return formatStringWithObject(options.subDomainTitleFormat.empty, {
      date: formatDate(new Date(d.t), options.subDomainDateFormat),
    });
  }
  let value = d.v;
  // Consider null as 0
  if (value === null && options.considerMissingDataAsZero) {
    value = 0;
  }

  return formatStringWithObject(options.subDomainTitleFormat.filled, {
    count: formatNumber(value),
    name: options.itemName[value !== 1 ? 1 : 0],
    connector,
    date: formatDate(new Date(d.t), options.subDomainDateFormat),
  });
}

/**
 * Return the optimal subDomain for the specified domain
 *
 * @param  {string} domain a domain name
 * @return {string}        the subDomain name
 */
export function getOptimalSubDomain(domain) {
  switch (domain) {
    case 'year':
      return 'month';
    case 'month':
      return 'day';
    case 'week':
      return 'day';
    case 'day':
      return 'hour';
    default:
      return 'min';
  }
}

export function getSubDomain(date, options, DTSDomain) {
  if (typeof date === 'number') {
    date = new Date(date);
  }

  /**
   * @return int
   */
  const computeDaySubDomainSize = function (date, domain) {
    switch (domain) {
      case 'year':
        return getDayCountInYear(date);
      case 'month':
        return getDayCountInMonth(date);
      case 'week':
        return 7;
    }
  };

  /**
   * @return int
   */
  const computeMinSubDomainSize = function (date, domain) {
    switch (domain) {
      case 'hour':
        return 60;
      case 'day':
        return 60 * 24;
      case 'week':
        return 60 * 24 * 7;
    }
  };

  /**
   * @return int
   */
  const computeHourSubDomainSize = function (date, domain) {
    switch (domain) {
      case 'day':
        return 24;
      case 'week':
        return 168;
      case 'month':
        return getDayCountInMonth(date) * 24;
    }
  };

  /**
   * @return int
   */
  const computeWeekSubDomainSize = function (date, domain, DTSDomain) {
    if (domain === 'month') {
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let endWeekNb = getWeekNumber(endOfMonth, options.weekStartOnMonday);
      let startWeekNb = getWeekNumber(
        new Date(date.getFullYear(), date.getMonth()),
        options.weekStartOnMonday
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
        options.weekStartOnMonday
      );
    }
  };

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
        computeWeekSubDomainSize(date, options.domain),
        options.weekStartOnMonday
      );
    case 'x_month':
    case 'month':
      return generateMonthDomain(date, 12);
  }
}
