import isEqual from 'lodash-es/isEqual';

import type CalHeatmap from './CalHeatmap';

export default class PluginManager {
  calendar: CalHeatmap;

  settings: Map<string, any>;

  plugins: Map<string, any>;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.settings = new Map();
    this.plugins = new Map();
  }

  add(plugins: Array<[any, any?]>) {
    plugins.forEach(([PluginClass, pluginOptions]) => {
      const { name } = PluginClass;
      const existingPlugin = this.plugins.get(name);

      if (existingPlugin && isEqual(this.settings.get(name), pluginOptions)) {
        return;
      }

      this.settings.set(name, { options: pluginOptions, dirty: true });

      if (!this.plugins.has(name)) {
        this.plugins.set(name, new PluginClass(this.calendar));
      }
    });
  }

  setupAll() {
    this.plugins.forEach((pluginInstance, name) => {
      const settings = this.settings.get(name);

      if (settings.dirty) {
        pluginInstance.setup(settings.options);
        delete settings.dirty;

        this.settings.set(name, settings);
      }
    });
  }

  paintAll(): Promise<unknown>[] {
    return Array.from(this.plugins.values()).map((p: any) => p.paint());
  }

  destroyAll(): Promise<unknown>[] {
    return Array.from(this.plugins.values()).map((p: any) => p.destroy());
  }
}
