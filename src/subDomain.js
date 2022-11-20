import { format } from 'd3-format';

import { formatStringWithObject } from './function';

export function getSubDomainTitle(calendar, d, options, connector) {
  if (d.v === null && !options.considerMissingDataAsZero) {
    return formatStringWithObject(options.subDomainTitleFormat.empty, {
      date: calendar.helpers.DateHelper.format(
        d.t,
        options.subDomainDateFormat,
      ),
    });
  }
  let value = d.v;
  // Consider null as 0
  if (value === null && options.considerMissingDataAsZero) {
    value = 0;
  }

  return formatStringWithObject(options.subDomainTitleFormat.filled, {
    count: format(',d')(value),
    name: options.itemName[value !== 1 ? 1 : 0],
    connector,
    date: calendar.helpers.DateHelper.format(d.t, options.subDomainDateFormat),
  });
}
