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
export default interface ITooltip extends IPlugin {
}
