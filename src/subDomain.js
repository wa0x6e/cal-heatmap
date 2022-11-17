import { format } from 'd3-format';

import { formatDate, formatStringWithObject } from './function';

export function getSubDomainTitle(d, options, connector) {
  if (d.v === null && !options.considerMissingDataAsZero) {
    return formatStringWithObject(options.subDomainTitleFormat.empty, {
      date: formatDate(d.t, options.subDomainDateFormat),
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
    date: formatDate(d.t, options.subDomainDateFormat),
  });
}
