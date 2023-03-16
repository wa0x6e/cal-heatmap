import type { PluginFunc } from 'dayjs';
import type dayjs from 'dayjs';

import type { OptionsType } from './options/Options';
import type DateHelper from './helpers/DateHelper';

declare namespace CalHeatmap {
  export type Timestamp = number;
  export type DomainType =
    | 'year'
    | 'month'
    | 'week'
    | 'xDay'
    | 'ghDay'
    | 'day'
    | 'hour'
    | 'minute';

  export type DeepPartial<T> = T extends object
    ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
    : T;

  // Template

  export type Template = {
    (dateHelper: DateHelper, options: OptionsType): TemplateResult;
  };

  export type TemplateResult = {
    name: string;
    parent?: string;
    allowedDomainType: DomainType[];
    rowsCount: (ts: Timestamp) => number;
    columnsCount: (ts: Timestamp) => number;
    mapping: (
      startTimestamp: Timestamp,
      endTimestamp: Timestamp,
    ) => SubDomain[];
    extractUnit: (ts: Timestamp) => Timestamp;
  };

  export type SubDomain = {
    t: Timestamp;
    x: number;
    y: number;
    v?: number | string | null;
  };

  export type Dimensions = {
    width: number;
    height: number;
  };

  // Plugin

  export interface IPlugin {
    name: string;
    calendar: CalHeatmap;
    options: PluginOptions;
    root: any;

    setup: (options?: PluginOptions) => void;
    paint: () => Promise<unknown>;
    destroy: () => Promise<unknown>;
  }
  export interface IPluginContructor {
    new (calendar?: CalHeatmap): IPlugin;
  }

  export interface PluginOptions {
    position?: 'top' | 'right' | 'bottom' | 'left';
    dimensions?: Dimensions;
    key?: string;
  }
  export type PluginDefinition = [IPluginContructor, Partial<PluginOptions>?];
}

declare class CalHeatmap {
  constructor();

  paint(
    options?: CalHeatmap.DeepPartial<OptionsType>,
    plugins?: CalHeatmap.PluginDefinition[] | CalHeatmap.PluginDefinition,
  ): Promise<unknown>;

  addTemplates(templates: CalHeatmap.Template | CalHeatmap.Template[]): void;

  next(n?: number): Promise<unknown>;

  previous(n?: number): Promise<unknown>;

  jumpTo(date: Date, reset?: boolean): Promise<unknown>;

  fill(dataSource?: OptionsType['data']['source']): Promise<unknown>;

  on(name: string, fn: () => any): void;

  dimensions(): CalHeatmap.Dimensions;

  destroy(): Promise<unknown>;

  extendDayjs(plugin: PluginFunc): dayjs.Dayjs;
}

export = CalHeatmap;
export as namespace CalHeatmap;
