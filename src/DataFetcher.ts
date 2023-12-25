import {
  json, csv, dsv, text,
} from 'd3-fetch';

import type { DataOptions, DataRecord } from './options/Options';
import type { Timestamp } from './index';
import type CalHeatmap from './CalHeatmap';

export default class DataFetcher {
  calendar: CalHeatmap;

  constructor(calendar: CalHeatmap) {
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
  async getDatas(
    source: DataOptions['source'],
    startTimestamp: Timestamp,
    endTimestamp: Timestamp,
  ): Promise<unknown> {
    if (typeof source === 'string' && source.length > 0) {
      return this.#fetch(source, startTimestamp, endTimestamp);
    }

    let d: DataRecord[] = [];
    if (Array.isArray(source)) {
      d = source;
    }

    return new Promise((resolve) => {
      resolve(d);
    });
  }

  parseURI(
    str: string,
    startTimestamp: Timestamp,
    endTimestamp: Timestamp,
  ): string {
    let newUri = str.replace(/\{\{start=(.*?)\}\}/g, (_, format) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      this.calendar.dateHelper.date(startTimestamp).format(format));
    newUri = newUri.replace(/\{\{end=(.*?)\}\}/g, (_, format) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      this.calendar.dateHelper.date(endTimestamp).format(format));

    return newUri;
  }

  #fetch(
    source: DataOptions['source'],
    startTimestamp: Timestamp,
    endTimestamp: Timestamp,
  ): Promise<unknown> {
    const { type, requestInit } = this.calendar.options.options.data;

    const url = this.parseURI(source as string, startTimestamp, endTimestamp);

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
