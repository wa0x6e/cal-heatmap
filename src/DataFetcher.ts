import isString from 'lodash-es/isString';

import {
  json, csv, dsv, text,
} from 'd3-fetch';

import type { DataOptions } from './options/Options';
import type Options from './options/Options';

const parseURI = (
  str: string,
  startTimestamp: number,
  endTimestamp: number,
): string => {
  // Use a timestamp in seconds
  let newUri = str.replace(/\{\{t:start\}\}/g, `${startTimestamp / 1000}`);
  newUri = newUri.replace(/\{\{t:end\}\}/g, `${endTimestamp / 1000}`);

  // Use a string date, following the ISO-8601
  newUri = newUri.replace(
    /\{\{d:start\}\}/g,
    new Date(startTimestamp).toISOString(),
  );
  newUri = newUri.replace(
    /\{\{d:end\}\}/g,
    new Date(endTimestamp).toISOString(),
  );

  return newUri;
};

export default class DataFetcher {
  options: Options;

  constructor(options: Options) {
    this.options = options;
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
  async getDatas(
    source: DataOptions['source'],
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<unknown> {
    if (isString(source) && source.length > 0) {
      return this.#fetch(source, startTimestamp, endTimestamp);
    }

    let d: any[] = [];
    if (Array.isArray(source)) {
      d = source;
    }

    return new Promise((resolve) => {
      resolve(d);
    });
  }

  #fetch(
    source: DataOptions['source'],
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<unknown> {
    const { type, requestInit } = this.options.options.data;

    const url = parseURI(source, startTimestamp, endTimestamp);

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
        return new Promise((resolve) => {
          resolve([]);
        });
    }
  }
}
