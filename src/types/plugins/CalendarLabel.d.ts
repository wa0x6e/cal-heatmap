import type { IPlugin, PluginOptions } from '../index';
import type { TextAlign, Padding } from '../../options/Options';

export type ComputedOptions = {
  radius: number;
  width: number;
  height: number;
  gutter: number;
  textAlign: TextAlign;
};

export interface CalendarLabelOptions extends PluginOptions,
  Partial<ComputedOptions> {
  enabled: boolean;
  text: () => string[];
  padding: Padding;
}

export interface ICalendarLabel extends IPlugin {
}

export default class CalendarLabel {
  name: string;

  calendar: CalHeatmap;

  options: PluginOptions;

  root: any;

  setup: (options?: PluginOptions) => void;

  paint: () => Promise<unknown>;

  destroy: () => Promise<unknown>;
}
