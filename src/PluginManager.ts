import isEqual from 'lodash-es/isEqual';

import type CalHeatmap from './CalHeatmap';
import {
  PluginDefinition,
  PluginOptions,
  IPluginContructor,
  IPlugin,
} from './index';

type PluginSetting = { options?: PluginOptions; dirty: boolean };

function createPlugin(
  Creator: IPluginContructor,
  calendar: CalHeatmap,
): IPlugin {
  return new Creator(calendar);
}

export default class PluginManager {
  calendar: CalHeatmap;

  settings: Map<IPlugin['name'], PluginSetting>;

  plugins: Map<IPlugin['name'], IPlugin>;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.settings = new Map();
    this.plugins = new Map();
  }

  add(plugins: PluginDefinition[]): void {
    plugins.forEach(([PluginClass, pluginOptions]) => {
      const { name } = PluginClass;
      const existingPlugin = this.plugins.get(name);

      if (
        existingPlugin &&
        this.settings.get(name) &&
        isEqual(this.settings.get(name)!.options, pluginOptions)
      ) {
        return;
      }

      this.settings.set(name, { options: pluginOptions, dirty: true });

      if (!this.plugins.has(name)) {
        this.plugins.set(name, createPlugin(PluginClass, this.calendar));
      }
    });
  }

  setupAll(): void {
    this.plugins.forEach((pluginInstance, name) => {
      const settings = this.settings.get(name);

      if (typeof settings !== 'undefined') {
        if (settings.dirty) {
          pluginInstance.setup(settings.options);
          settings.dirty = false;

          this.settings.set(name, settings);
        }
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
