import type dayjs from 'dayjs';
import type { IPlugin, PluginOptions } from '../index';

interface PopperOptions {
  placement: any;
  modifiers: any[];
  strategy: any;
  onFirstUpdate?: any;
}

interface TooltipOptions extends PluginOptions, PopperOptions {
  enabled: boolean;
  text: (timestamp: Timestamp, value: number, dayjsDate: dayjs.Dayjs) => string;
}

export interface ITooltip extends IPlugin {
}

export default class Tooltip {
  name: string;
}
