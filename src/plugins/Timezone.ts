import type CalHeatmap from '../CalHeatmap';
import type { IPlugin, PluginOptions } from '../index';

interface TimezoneOptions extends PluginOptions {
  moment?: any;
  timezone?: string;
}

export default class Timezone implements IPlugin {
  name = 'Timezone';

  calendar: CalHeatmap;

  options: TimezoneOptions;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.options = {};
  }

  setup(pluginOptions?: Partial<TimezoneOptions>): void {
    const moment = pluginOptions?.moment || window.moment;
    const timezone = pluginOptions?.timezone || moment.tz.guess();

    this.calendar.dateHelper.setMoment(moment);
    this.calendar.dateHelper.date = (d: number | Date | string = new Date()) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      moment.tz(d, timezone);
  }

  // eslint-disable-next-line class-methods-use-this
  paint(): Promise<unknown> {
    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  destroy(): Promise<unknown> {
    return Promise.resolve();
  }
}
