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
    const { type, requestInit } = this.calendar.options.options;

    const url = this.#parseURI(source, startTimestamp, endTimestamp);

    switch (type) {
      case 'json':
        return json(url, requestInit);
      case 'csv':
        return csv(url, requestInit);
      case 'tsv':
        return dsv('\t', url, requestInit);
      case 'txt':
        return text(url, requestInit);
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
