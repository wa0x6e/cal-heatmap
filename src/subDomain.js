import { formatNumber, formatDate, formatStringWithObject } from './function';

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
