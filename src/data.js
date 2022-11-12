import { json, csv, dsv, text } from 'd3-fetch';
import {
  RESET_ALL_ON_UPDATE,
  APPEND_ON_UPDATE,
  RESET_SINGLE_ON_UPDATE,
} from './constant';

function interpretCSV(data) {
  const d = {};
  const keys = Object.keys(data[0]);
  let i;
  let total;
  for (i = 0, total = data.length; i < total; i++) {
    d[data[i][keys[0]]] = +data[i][keys[1]];
  }
  return d;
}

function parseURI(str, startDate, endDate) {
  // Use a timestamp in seconds
  str = str.replace(/\{\{t:start\}\}/g, startDate.getTime() / 1000);
  str = str.replace(/\{\{t:end\}\}/g, endDate.getTime() / 1000);

  // Use a string date, following the ISO-8601
  str = str.replace(/\{\{d:start\}\}/g, startDate.toISOString());
  str = str.replace(/\{\{d:end\}\}/g, endDate.toISOString());

  return str;
}

/**
 * Populate the calendar internal data
 *
 * @param object data
 * @param constant updateMode
 * @param Date startDate
 * @param Date endDate
 *
 * @return void
 */
function parseDatas(calendar, data, updateMode, startDate, endDate, options) {
  if (updateMode === RESET_ALL_ON_UPDATE) {
    calendar._domains.forEach(value => {
      value.forEach((element, index, array) => {
        array[index].v = null;
      });
    });
  }

  const temp = {};

  const extractTime = function (d) {
    return d.t;
  };

  for (const d in data) {
    const date = new Date(d * 1000);
    let domainUnit = calendar.getDomain(date)[0].getTime();

    // The current data belongs to a domain that was compressed
    // Compress the data for the two duplicate hours into the same hour
    if (calendar.DSTDomain.indexOf(domainUnit) >= 0) {
      // Re-assign all data to the first or the second duplicate hours
      // depending on which is visible
      if (calendar._domains.has(domainUnit - 3600 * 1000)) {
        domainUnit -= 3600 * 1000;
      }
    }

    // Skip if data is not relevant to current domain
    if (
      isNaN(d) ||
      !data.hasOwnProperty(d) ||
      !calendar._domains.has(domainUnit) ||
      !(domainUnit >= +startDate && domainUnit < +endDate)
    ) {
      continue;
    }

    const subDomainsData = calendar._domains.get(domainUnit);

    if (!temp.hasOwnProperty(domainUnit)) {
      temp[domainUnit] = subDomainsData.map(extractTime);
    }

    const index = temp[domainUnit].indexOf(
      calendar.domainSkeleton.at(options.subDomain).extractUnit(date)
    );

    if (updateMode === RESET_SINGLE_ON_UPDATE) {
      subDomainsData[index].v = data[d];
    } else if (!isNaN(subDomainsData[index].v)) {
      subDomainsData[index].v += data[d];
    } else {
      subDomainsData[index].v = data[d];
    }
  }
}

/**
 * Fetch and interpret data from the datasource
 *
 * @param string|object source
 * @param Date startDate
 * @param Date endDate
 * @param function callback
 * @param function|boolean afterLoad function used to convert the data into a json object. Use true to use the afterLoad callback
 * @param updateMode
 *
 * @return mixed
 * - True if there are no data to load
 * - False if data are loaded asynchronously
 */
export function getDatas(
  calendar,
  options,
  source,
  startDate,
  endDate,
  callback,
  afterLoad,
  updateMode
) {
  if (arguments.length < 5) {
    afterLoad = true;
  }
  if (arguments.length < 6) {
    updateMode = APPEND_ON_UPDATE;
  }
  const _callback = function (data) {
    if (afterLoad !== false) {
      if (typeof afterLoad === 'function') {
        data = afterLoad(data);
      } else if (typeof options.afterLoadData === 'function') {
        data = options.afterLoadData(data);
      } else {
        console.log('Provided callback for afterLoadData is not a function.');
      }
    } else if (options.dataType === 'csv' || options.dataType === 'tsv') {
      data = interpretCSV(data);
    }
    parseDatas(calendar, data, updateMode, startDate, endDate, options);
    if (typeof callback === 'function') {
      callback();
    }
  };

  switch (typeof source) {
    case 'string':
      if (source === '') {
        _callback({});
        return true;
      }
      const url = parseURI(source, startDate, endDate);

      const reqInit = { method: 'GET' };
      if (options.dataPostPayload !== null) {
        reqInit.method = 'POST';
      }
      if (options.dataPostPayload !== null) {
        reqInit.body = parseURI(options.dataPostPayload, startDate, endDate);
      }
      if (options.dataRequestHeaders !== null) {
        const myheaders = new Headers();
        for (const header in options.dataRequestHeaders) {
          if (options.dataRequestHeaders.hasOwnProperty(header)) {
            myheaders.append(header, options.dataRequestHeaders[header]);
          }
        }
        reqInit.headers = myheaders;
      }

      let request = null;
      switch (options.dataType) {
        case 'json':
          request = json(url, reqInit);
          break;
        case 'csv':
          request = csv(url, reqInit);
          break;
        case 'tsv':
          request = dsv('\t', url, reqInit);
          break;
        case 'txt':
          request = text(url, reqInit);
          break;
      }
      request.then(_callback);

      return false;
    case 'object':
      if (source === Object(source)) {
        _callback(source);
        return false;
      }
    /* falls through */
    default:
      _callback({});
      return true;
  }
}
