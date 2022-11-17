import { json, csv, dsv, text } from 'd3-fetch';

import generateTimeInterval from './utils/timeInterval';
import DateHelper from './utils/DateHelper';

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

function parseURI(str, startTimestamp, endTimestamp) {
  // Use a timestamp in seconds
  let newUri = str.replace(/\{\{t:start\}\}/g, startTimestamp / 1000);
  newUri = newUri.replace(/\{\{t:end\}\}/g, endTimestamp / 1000);

  // Use a string date, following the ISO-8601
  newUri = newUri.replace(
    /\{\{d:start\}\}/g,
    DateHelper.moment(startTimestamp).toISOString(),
  );
  newUri = newUri.replace(
    /\{\{d:end\}\}/g,
    DateHelper.moment(endTimestamp).toISOString(),
  );

  return newUri;
}

/**
 * Populate the calendar internal data
 *
 * @param object data
 * @param constant updateMode
 * @param Date startTimestamp
 * @param Date endTimestamp
 *
 * @return void
 */
function parseDatas(
  calendar,
  data,
  updateMode,
  startTimestamp,
  endTimestamp,
  options,
) {
  if (updateMode === RESET_ALL_ON_UPDATE) {
    calendar.domainCollection.forEach((value) => {
      value.forEach((element, index, array) => {
        array[index].v = null;
      });
    });
  }

  const newData = new Map();

  const extractTime = (d) => d.t;

  Object.keys(data).forEach((d) => {
    if (Number.isNaN(d)) {
      return;
    }

    const timestamp = d * 1000;

    const domainKey = generateTimeInterval(
      calendar.options.options.domain,
      timestamp,
      1,
    )[0];

    // Skip if data is not relevant to current domain
    if (
      !calendar.domainCollection.has(domainKey) ||
      !(domainKey >= startTimestamp && domainKey < endTimestamp)
    ) {
      return;
    }

    const subDomainsData = calendar.domainCollection.get(domainKey);

    if (!newData.has(domainKey)) {
      newData.set(domainKey, subDomainsData.map(extractTime));
    }

    const subDomainIndex = newData
      .get(domainKey)
      .indexOf(
        calendar.domainTemplate.at(options.subDomain).extractUnit(timestamp),
      );

    if (updateMode === RESET_SINGLE_ON_UPDATE) {
      subDomainsData[subDomainIndex].v = data[d];
    } else if (!Number.isNaN(subDomainsData[subDomainIndex].v)) {
      subDomainsData[subDomainIndex].v += data[d];
    } else {
      subDomainsData[subDomainIndex].v = data[d];
    }
  });
}

/**
 * Fetch and interpret data from the datasource
 *
 * @param string|object source
 * @param int startTimestamp
 * @param int endTimestamp
 * @param function callback
 * @param function|boolean afterLoad function used to convert the data into a json object. Use true to use the afterLoad callback
 * @param updateMode
 *
 * @return mixed
 * - True if there are no data to load
 * - False if data are loaded asynchronously
 */
// eslint-disable-next-line import/prefer-default-export
export function getDatas(
  calendar,
  options,
  source,
  startTimestamp,
  endTimestamp,
  callback,
  afterLoad = true,
  updateMode = APPEND_ON_UPDATE,
) {
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
    parseDatas(
      calendar,
      data,
      updateMode,
      startTimestamp,
      endTimestamp,
      options,
    );
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
      const url = parseURI(source, startTimestamp, endTimestamp);

      const reqInit = { method: 'GET' };
      if (options.dataPostPayload !== null) {
        reqInit.method = 'POST';
      }
      if (options.dataPostPayload !== null) {
        reqInit.body = parseURI(
          options.dataPostPayload,
          startTimestamp,
          endTimestamp,
        );
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
        default:
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
