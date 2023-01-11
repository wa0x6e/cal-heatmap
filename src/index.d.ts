import type { OptionsType } from './options/Options';
import type DateHelper from './helpers/DateHelper';

export type Template = {
  (dateHelper: DateHelper, options: OptionsType): TemplateResult;
};

export type SubDomain = {
  t: number;
  v?: number | null;
  x?: number;
  y?: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type TemplateResult = {
  name: string;
  level: number;
  rowsCount: (ts: number) => number;
  columnsCount: (ts: number) => number;
  mapping: (
    startTimestamp: number,
    endTimestamp: number,
    defaultValues: any,
  ) => SubDomain[];
  format: {
    domainLabel: string;
  };
  extractUnit: (ts: number) => number;
};

export interface IPlugin {
  name: string;
  calendar: CalHeatmap;
  options: pluginOptions;

  setup: (options?: PluginOptions) => void;
  paint: () => Promise<unknown>;
  destroy: () => Promise<unknown>;
}
export interface IPluginContructor {
  new (calendar: CalHeatmap): IPlugin;
}

export interface PluginOptions {}
export type PluginDefinition = [IPluginContructor, PluginOptions?];
