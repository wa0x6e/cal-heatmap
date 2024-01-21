import type { IPlugin, PluginOptions } from '../index';

export interface LegendOptions extends PluginOptions {
  enabled: boolean;
  itemSelector: string | null;
  label: string | null;
  width: number;
}

export default interface ILegend extends IPlugin {
}
