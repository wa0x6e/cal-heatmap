import isEqual from 'lodash-es/isEqual';

import type CalHeatmap from '../CalHeatmap';
import {
  PluginDefinition,
  PluginOptions,
  IPluginContructor,
  IPlugin,
} from '../index';

type PluginSetting = {
  options?: PluginOptions;
  dirty: boolean;
};

function createPlugin(
  Creator: IPluginContructor,
  calendar: CalHeatmap,
): IPlugin {
  return new Creator(calendar);
}

function extractPluginName(
  PluginClass: IPluginContructor,
  options?: PluginOptions,
): string {
  return `${new PluginClass().name}${options?.key || ''}`;
}

export default class PluginManager {
  calendar: CalHeatmap;

  settings: Map<IPlugin['name'], PluginSetting>;

  plugins: Map<IPlugin['name'], IPlugin>;

  pendingPaint: Set<IPlugin>;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.settings = new Map();
    this.plugins = new Map();
    this.pendingPaint = new Set();
  }

  add(plugins: PluginDefinition[]): void {
    plugins.forEach(([PluginClass, pluginOptions]) => {
      const name = extractPluginName(PluginClass, pluginOptions);

      const existingPlugin = this.plugins.get(name);

      if (
        existingPlugin &&
        this.settings.get(name) &&
        isEqual(this.settings.get(name)!.options, pluginOptions)
      ) {
        return;
      }

      this.settings.set(name, {
        options: pluginOptions,
        dirty: true,
      });

      if (!this.plugins.has(name)) {
        this.plugins.set(name, createPlugin(PluginClass, this.calendar));
      }

      this.pendingPaint.add(this.plugins.get(name)!);
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
    return Array.from(this.pendingPaint.values()).map((p) => p.paint());
  }

  destroyAll(): Promise<unknown>[] {
    return this.allPlugins().map((p) => p.destroy());
  }

  getFromPosition(position: PluginOptions['position']): IPlugin[] {
    return this.allPlugins().filter(
      (plugin) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        plugin.options?.position === position,
    );
  }

  getHeightFromPosition(position: PluginOptions['position']): number {
    return this.getFromPosition(position)
      .map((d) => d.options.dimensions!.height)
      .reduce((a, b) => a + b, 0);
  }

  getWidthFromPosition(position: PluginOptions['position']): number {
    return this.getFromPosition(position)
      .map((d) => d.options.dimensions!.width)
      .reduce((a, b) => a + b, 0);
  }

  allPlugins(): IPlugin[] {
    return Array.from(this.plugins.values());
  }
}
