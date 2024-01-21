import type { IPlugin, PluginOptions } from '../index';

export interface LegendLiteOptions extends PluginOptions {
  enabled: boolean;
  itemSelector: string | null;
  width: number;
  height: number;
  radius: number;
  gutter: number;
  includeBlank: boolean;
}

export interface ILegendLite extends IPlugin {
}

export default class LegendLite {
  name: string;

  calendar: CalHeatmap;

  options: PluginOptions;

  root: any;

  setup: (options?: PluginOptions) => void;

  paint: () => Promise<unknown>;

  destroy: () => Promise<unknown>;
}
