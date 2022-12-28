import type CalHeatmap from '../CalHeatmap';

export default class Timezone {
  name = 'Timezone';

  calendar: CalHeatmap;

  options: any;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.options = {};
  }

  setup(pluginOptions?: any): void {
    const moment = pluginOptions?.moment || window.moment;
    const timezone = pluginOptions?.timezone || moment.tz.guess();

    this.calendar.dateHelper.setMoment(moment);
    this.calendar.dateHelper.date = (
      d: number | Date | string = new Date(),
    ) => moment.tz(d, timezone);
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
