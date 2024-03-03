import type { PluginFunc } from 'dayjs';
import type dayjs from 'dayjs';
import type EventEmitter from 'eventemitter3';
import type Options, { OptionsType } from './options/Options';
import type DateHelper from './helpers/DateHelper';
import type CalendarPainter from './calendar/CalendarPainter';

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

declare class CalHeatmap {
  static readonly VERSION = string;

  options: Options;

  eventEmitter: EventEmitter;

  dateHelper: DateHelper;

  calendarPainter: CalendarPainter;

  constructor();

  paint(
    options?: DeepPartial<OptionsType>,
    plugins?: IPlugin[],
  ): Promise<unknown>;

  addTemplates(templates: Template | Template[]): void;

  next(n?: number): Promise<unknown>;

  previous(n?: number): Promise<unknown>;

  jumpTo(date: Date, reset?: boolean): Promise<unknown>;

  fill(dataSource?: OptionsType['data']['source']): Promise<unknown>;

  on(name: string, fn: () => any): void;

  dimensions(): Dimensions;

  destroy(): Promise<unknown>;

  extendDayjs(plugin: PluginFunc): dayjs.Dayjs;
}

declare const constants: Record<string, any>;
declare const helpers: {
  position: {
    isHorizontal(position: string): boolean
    isVertical(position: string): boolean
    horizontalPadding(padding: Padding): number
    verticalPadding(padding: Padding): number
  },
  scale: {
    normalizedScale(scaleOptions: OptionsType['scale']): any
    applyScaleStyle(
      elem: any,
      _scale: any,
      scaleOptions: OptionsType['scale'],
      keyname?: string,
    ): void
  }
};

export default CalHeatmap;
export { constants, helpers };
