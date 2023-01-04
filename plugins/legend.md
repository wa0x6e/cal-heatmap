---
layout: default
title: Legend
nav_order: 3
parent: Plugins
---

# Legend

This plugin generates a legend
{: .fs-6}

## Install

### NPM

The plugin is built-in in the core CalHeatmap, just import the module with

```js
import Legend from 'cal-heatmap/src/plugins/Legend';
```

### CDN

Add the legend plugin in your `<head>`

```html
<script src="https://unpkg.com/cal-heatmap@4.0.0-beta.2/dist/plugins/Legend.min.js"></script>
```

## Usage

```js
const cal = new CalHeatmap();
cal.paint({}, [[Legend, LEGEND_OPTIONS]]);
```

## LegendOptions

```js
type LegendOptions = {
  enabled: boolean,
  itemSelector?: string | null
  label?: string | null,
  width:? number,
  color?: ColorOptions,
  opacity?: OpacityOptions,
  ...
};
```

### enabled

Whether to enable the legend

```js
let cal = new CalHeatmap();
cal.paint({}, [[Legend]]); // Show the legend with the default options
cal.paint({}, [[Legend, { enabled: false }]]); // Disable/Hide the legend
```

Default: `true`

#### Example

<div class="code-example">
  <div id="legend-example-2"></div>
  <script>
      let status = true;
     const cal = new CalHeatmap();
     cal.paint({ range: 2, itemSelector: '#legend-example-2' }, [[Legend, { enabled: status }]]);
  </script>
</div>
<div class="highlighter-rouge">
  <a href="#" class="btn btn-blue" onClick="status = !status; cal.paint({}, [[Legend, { enabled: status } ]]); return false;">Toggle Legend</a>
</div>

### itemSelector

By default, the legend will be inserted just after the calendar, in the same DOM node defined by `itemSelector`.
If you want more control about its presentation and position, you can choose to insert it in your targeted DOM node, with the `legend.itemSelector` option.

```js
let cal = new CalHeatmap();
cal.paint({}, [[Legend, { itemSelector: '#my-legend-container' }]]);
```

### label

Customize the title of the legend

Default: `null`

<div class="code-example">
  <div id="legend-example-3"></div>
  <script>
     const cal3 = new CalHeatmap();
     cal3.paint({ range: 2, itemSelector: '#legend-example-3' }, [[Legend, { label: 'Temperature (°F)' }]]);
  </script>
</div>
```js
  cal.paint({}, [[Legend, { label: 'Temperature (°F)' }]])
```

### Customizing the colors

See [scale](/options/scale)

### Notes

The legend uses [ObservaleHQ Plot library](https://github.com/observablehq/plot) under the hood.
See [this article](https://observablehq.com/@d3/color-legend) for a more detailed and advanced customisation of the legend.
