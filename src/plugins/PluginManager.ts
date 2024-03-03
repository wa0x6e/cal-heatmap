import isEqual from 'lodash-es/isEqual';

import type CalHeatmap from '../CalHeatmap';
import {
  IPlugin,
  PluginOptions,
} from '../types';

type PluginSetting = {
  options?: PluginOptions;
  dirty: boolean;
};

function extractPluginName(plugin: IPlugin): string {
  return `${plugin.constructor.name}${plugin.options?.key || ''}`;
}

export default class PluginManager {
  calendar: CalHeatmap;

  settings: Map<string, PluginSetting>;

  plugins: Map<string, IPlugin>;

  pendingPaint: Set<IPlugin>;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
    this.settings = new Map();
    this.plugins = new Map();
    this.pendingPaint = new Set();
  }

  add(plugins: IPlugin[]): void {
    plugins.forEach((plugin) => {
      const name = extractPluginName(plugin);

      const existingPlugin = this.plugins.get(name);

      if (
        existingPlugin &&
        this.settings.get(name) &&
        isEqual(this.settings.get(name)!.options, plugin.options)
      ) {
        return;
      }

      this.settings.set(name, {
        options: plugin.options,
        dirty: true,
      });

      if (!this.plugins.has(name)) {
        this.plugins.set(name, plugin);
      }

      this.pendingPaint.add(this.plugins.get(name)!);
    });
  }

  setupAll(): void {
    this.plugins.forEach((pluginInstance, name) => {
      const settings = this.settings.get(name);

      if (typeof settings !== 'undefined') {
        if (settings.dirty) {
          pluginInstance.setup(this.calendar, settings.options);
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
