import type DateHelper from './helpers/DateHelper';
import { OptionsType } from './options/Options';
import CalHeatmap from './CalHeatmap';

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
export type TextAlign = 'start' | 'middle' | 'end';
export type Padding = [number, number, number, number];

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
  
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
    calendar: CalHeatmap;
    options: PluginOptions;
    root: any;
  
    setup: (calendar: CalHeatmap, options?: PluginOptions) => void;
    paint: () => Promise<unknown>;
    destroy: () => Promise<unknown>;
  }
  
  export interface PluginOptions {
    position?: 'top' | 'right' | 'bottom' | 'left';
    dimensions?: Dimensions;
    key?: string;
}