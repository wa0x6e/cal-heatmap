import { format } from 'd3-format';

/**
 * Sprintf like function.
 * Replaces placeholders {0} in string with values from provided object.
 *
 * @param string formatted String containing placeholders.
 * @param object args Object with properties to replace placeholders in string.
 *
 * @return String
 */
export function formatStringWithObject(string, args) {
  let formattedString = string;

  Object.entries(args).forEach(([key, value]) => {
    formattedString = formattedString.replace(
      new RegExp(`\\{${key}\\}`, 'gi'),
      value,
    );
  });
  return formattedString;
}

/**
 * Return a classname if the specified date should be highlighted
 *
 * @param  int timestamp Unix timestamp of the current subDomain
 * @return String the highlight class
 */
export function getHighlightClassName(calendar, timestamp, options) {
  const { highlight, subDomain } = options;
  let classname = '';

  if (highlight.length > 0) {
    highlight.forEach((d) => {
      if (
        calendar.helpers.DateHelper.datesFromSameInterval(
          subDomain,
          +d,
          timestamp,
        )
      ) {
        classname = calendar.helpers.DateHelper.datesFromSameInterval(
          subDomain,
          +d,
        ) ?
          ' highlight-now' :
          ' highlight';
      }
    });
  }

  return classname;
}

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
