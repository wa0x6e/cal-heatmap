---
layout: default
title: Plugins
nav_order: 15
has_children: true
---

# Plugins

Cal-heatmap can be customized further with the help of plugins.
{: .fs-6}

Below are the built-in plugins shipped with Cal-Heatmap

- [Tooltip](/plugins/tooltip): add tooltip support
- [Legend](/plugins/legend): add legend support
- [Timezone](/plugins/timezone): add timezone support

These plugins are not included in the main bundled, and have to be loaded
separatly, alongside their dependencies. See each plugin documentation for details.

```js
interface PluginOptions {}
// IPluginContructor is the plugin's class
type PluginDefinition = [IPluginContructor, PluginOptions?];

cal.paint(options: Options, plugins?: PluginDefinition[] | PluginDefinition),
```

<hr />

## Usage

#### Example

```js
const cal = new CalHeatmap();
cal.paint({}, [
  [Timezone { timezone: 'Europe/Paris' }],
  [Tooltip { text: (t) => `${new Date(t)}` }],
]);
```

See each plugin documentation for install and usage details.
