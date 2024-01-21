import type { IPlugin, PluginOptions } from '../index';
import type { TextAlign, Padding } from '../../src/options/Options';

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

export default interface ICalendarLabel extends IPlugin {
}
