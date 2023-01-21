---
layout: default
title: extendDayjs()
parent: Methods
nav_order: 12
---

# extendDayjs()

Extend the dayjs library with plugins
{: .fs-6}

```js
const cal = new CalHeatmap();
cal.extend(PluginFunc);
```

The built-in dayjs is already shipped with some plugins, see the [DateHelper](https://github.com/wa0x6e/cal-heatmap/blob/master/src/helpers/DateHelper.ts) for
the list of plugins.

### Arguments:

- `plugin`: A [`Dayjs Plugin`](https://day.js.org/docs/en/plugin/plugin)

<hr/>

## Usage

#### Example with the [BuddhistEra](https://day.js.org/docs/en/plugin/buddhist-era) plugin

{: .mt-3}

Inject the dayjs plugin in your page `<head>`

```html
<script src="https://cdn.jsdelivr.net/npm/dayjs@1/plugin/buddhistEra.js"></script>
```

Extend dayjs with the plugin, before any `paint()` call

```js
const cal = new CalHeatmap();
cal.extendDayjs(window.dayjs_plugin_buddhistEra);
```
