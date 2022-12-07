import {
  json, csv, dsv, text,
} from 'd3-fetch';

export default class DataFetcher {
  constructor(calendar) {
    this.calendar = calendar;
  }

  /**
   * Fetch and interpret data from the datasource
   *
   * @param {string|object} source
   * @param {number} startTimestamp
   * @param {number} endTimestamp
   *
   * @return {Promize} A promise, that will return the final data when resolved
   */
  async getDatas(source, startTimestamp, endTimestamp) {
    if (typeof source === 'string' && source.length > 0) {
      return this.#fetch(source, startTimestamp, endTimestamp);
    }

    let d = {};
    if (typeof source === 'object' && source === Object(source)) {
      d = source;
    }

    return new Promise((resolve) => {
      resolve(d);
    });
  }

  #fetch(source, startTimestamp, endTimestamp) {
    const { options } = this.calendar.options;

    const url = this.#parseURI(source, startTimestamp, endTimestamp);

    const reqInit = { method: 'GET' };
    if (options.dataPostPayload !== null) {
      reqInit.method = 'POST';
    }
    if (options.dataPostPayload !== null) {
      reqInit.body = this.#parseURI(
        options.dataPostPayload,
        startTimestamp,
        endTimestamp,
      );
    }
    if (options.dataRequestHeaders !== null) {
      const myheaders = new Headers();
      Object(options.dataRequestHeaders).forEach(([key, value]) => {
        myheaders.append(key, value);
      });

      reqInit.headers = myheaders;
    }

    switch (options.dataType) {
      case 'json':
        return json(url, reqInit);
      case 'csv':
        return csv(url, reqInit);
      case 'tsv':
        return dsv('\t', url, reqInit);
      case 'txt':
        return text(url, reqInit);
      default:
        return new Promise();
    }
  }

  #parseURI(str, startTimestamp, endTimestamp) {
    const { DateHelper } = this.calendar.helpers;

    // Use a timestamp in seconds
    let newUri = str.replace(/\{\{t:start\}\}/g, startTimestamp / 1000);
    newUri = newUri.replace(/\{\{t:end\}\}/g, endTimestamp / 1000);

    // Use a string date, following the ISO-8601
    newUri = newUri.replace(
      /\{\{d:start\}\}/g,
      DateHelper.date(startTimestamp).toISOString(),
    );
    newUri = newUri.replace(
      /\{\{d:end\}\}/g,
      DateHelper.date(endTimestamp).toISOString(),
    );

    return newUri;
  }
}
