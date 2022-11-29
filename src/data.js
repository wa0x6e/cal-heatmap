import {
  json, csv, dsv, text,
} from 'd3-fetch';

import {
  RESET_ALL_ON_UPDATE,
  APPEND_ON_UPDATE,
  RESET_SINGLE_ON_UPDATE,
} from './constant';

function interpretCSV(data) {
  const d = {};
  const keys = Object.keys(data[0]);

  data.forEach((datum) => {
    d[datum[keys[0]]] = +datum[keys[1]];
  });

  return d;
}

function parseURI(calendar, str, startDate, endDate) {
  // Use a timestamp in seconds
  let newUri = str.replace(/\{\{t:start\}\}/g, startDate / 1000);
  newUri = newUri.replace(/\{\{t:end\}\}/g, endDate / 1000);

  // Use a string date, following the ISO-8601
  newUri = newUri.replace(
    /\{\{d:start\}\}/g,
    calendar.helpers.DateHelper.date(startDate).toISOString(),
  );
  newUri = newUri.replace(
    /\{\{d:end\}\}/g,
    calendar.helpers.DateHelper.date(endDate).toISOString(),
  );

  return newUri;
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
    calendar.domainCollection.forEach((value) => {
      value.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        value[index].v = null;
      });
    });
  }

  Object.keys(data).forEach((date) => {
    if (Number.isNaN(date)) {
      return;
    }

    const timestamp = date * 1000;

    const domainKey = calendar.subDomainTemplate
      .at(calendar.options.options.domain)
      .extractUnit(timestamp);

    // Skip if data is not relevant to current domain
    if (
      !calendar.domainCollection.has(domainKey) ||
      !(domainKey >= startDate && domainKey < endDate)
    ) {
      return;
    }

    const existingSubDomainsData = calendar.domainCollection.get(domainKey);

    const subDomainIndex = existingSubDomainsData
      .map((d) => d.t)
      .indexOf(
        calendar.subDomainTemplate.at(options.subDomain).extractUnit(timestamp),
      );

    if (updateMode === RESET_SINGLE_ON_UPDATE) {
      existingSubDomainsData[subDomainIndex].v = data[date];
    } else if (typeof existingSubDomainsData[subDomainIndex].v === 'number') {
      existingSubDomainsData[subDomainIndex].v += data[date];
    } else {
      existingSubDomainsData[subDomainIndex].v = data[date];
    }
  });
}

/**
 * Fetch and interpret data from the datasource
 *
 * @param string|object source
 * @param int startDate
 * @param int endDate
 * @param function callback
 * @param function|boolean afterLoad function used to convert
 * the data into a json object. Use true to use the afterLoad callback
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
  startDate,
  endDate,
  callback,
  afterLoad = true,
  updateMode = APPEND_ON_UPDATE,
) {
  const processData = (data) => {
    let processedData = data;

    if (afterLoad !== false) {
      if (typeof afterLoad === 'function') {
        processedData = afterLoad(data);
      } else if (typeof options.dataProcessor === 'function') {
        processedData = options.dataProcessor(data);
      } else {
        // eslint-disable-next-line no-console
        console.log('Provided options for dataProcessor is not a function.');
      }
    } else if (options.dataType === 'csv' || options.dataType === 'tsv') {
      processedData = interpretCSV(data);
    }

    parseDatas(
      calendar,
      processedData,
      updateMode,
      startDate,
      endDate,
      options,
    );
    if (typeof callback === 'function') {
      callback();
    }
  };

  switch (typeof source) {
    case 'string': {
      if (source === '') {
        processData({});
        return true;
      }
      const url = parseURI(calendar, source, startDate, endDate);

      const reqInit = { method: 'GET' };
      if (options.dataPostPayload !== null) {
        reqInit.method = 'POST';
      }
      if (options.dataPostPayload !== null) {
        reqInit.body = parseURI(
          calendar,
          options.dataPostPayload,
          startDate,
          endDate,
        );
      }
      if (options.dataRequestHeaders !== null) {
        const myheaders = new Headers();
        Object(options.dataRequestHeaders).forEach(([key, value]) => {
          myheaders.append(key, value);
        });

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
      request.then(processData);

      return false;
    }
    case 'object':
      if (source === Object(source)) {
        processData(source);
        return false;
      }
    /* falls through */
    default:
      processData({});
      return true;
  }
}
