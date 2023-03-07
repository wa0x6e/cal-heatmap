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
    return this.#allPlugins().map((p: IPlugin) => p.paint());
  }

  /**
   * Return the total width of all the plugins
   * Will exclude plugins located outside the calendar,
   * and not affecting its dimensions
   *
   * @return {number} Aggregated width of all the plugins
   */
  totalInsideWidth(): number {
    return this.#allPlugins()
      .map((p: IPlugin) => {
        const { position, dimensions } = p.options;

        if (position === 'left' || position === 'right') {
          return dimensions!.width;
        }

        return 0;
      })
      .reduce((a, b) => a + b, 0);
  }

  totalInsideHeight(): number {
    return this.#allPlugins()
      .map((p: IPlugin) => {
        const { position, dimensions } = p.options;

        if (position === 'top' || position === 'bottom') {
          return dimensions!.height;
        }

        return 0;
      })
      .reduce((a, b) => a + b, 0);
  }

  destroyAll(): Promise<unknown>[] {
    return this.#allPlugins().map((p: IPlugin) => p.destroy());
  }

  #allPlugins() {
    return Array.from(this.plugins.values());
  }
}
