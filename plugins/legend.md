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

{: .mt-8}

### NPM

The plugin is built-in in the core CalHeatmap, just import the module with

```js
import { Legend } from 'cal-heatmap';
```

{: .mt-8}

### CDN

Add the legend plugin in your page's `<head>`

```html
<script src="https://unpkg.com/cal-heatmap@4.0.0-beta.4/dist/plugins/Legend.min.js"></script>
```

<hr />

## Usage

```js
const cal = new CalHeatmap();
cal.paint({}, [[Legend, LEGEND_OPTIONS]]);
```

## LegendOptions

```js
interface LegendOptions {
  enabled: boolean;
  itemSelector: string | null;
  label: string | null;
  width: number;
}
```

{: .mt-8}

### enabled

Whether to enable the legend

#### Example

```js
let cal = new CalHeatmap();
cal.paint({}, [[Legend]]);
```

Default: `true`

#### Playground

<div class="code-example">
  <div id="legend-example-2"></div>
  <script>
      let status = true;
     const cal = new CalHeatmap();
     cal.paint({ range: 2, itemSelector: '#legend-example-2' }, [[Legend, { enabled: status }]]);
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
    <a href="#" class="btn btn-blue" onClick="status = !status; cal.paint({}, [[Legend, { enabled: status } ]]); return false;">Toggle Legend</a>
  </div>
</div>

{: .mt-8}

### itemSelector

Specify where the legend should be rendered

If not sepcified, the legend will be inserted just after the calendar, in the same DOM node defined by [`itemSelector`](/options/itemSelector).

#### Example

```js
const cal = new CalHeatmap();
cal.paint({}, [[Legend, { itemSelector: '#my-legend-container' }]]);
```

{: .mt-8}

### label

Set the legend's title

Default: `null`

#### Example

<div class="code-example">
  <div id="legend-example-3"></div>
  <script>
     const cal3 = new CalHeatmap();
     cal3.paint({ range: 2, itemSelector: '#legend-example-3' }, [[Legend, { label: 'Temperature (°F)' }]]);
  </script>
</div>
```js
const cal = new CalHeatmap();
cal.paint({}, [[Legend, { label: 'Temperature (°F)' }]])
```

{: .mt-8}

### width

Set the legend's width

Default: `null`

#### Example

<div class="code-example">
  <div id="legend-example-4"></div>
  <script>
     const cal4 = new CalHeatmap();
     cal4.paint({ range: 2, itemSelector: '#legend-example-4' }, [[Legend, { width: 80 }]]);
  </script>
</div>
```js
const cal = new CalHeatmap();
cal.paint({}, [[Legend, { width: 80 }]])
```

{: .mt-8}

### Notes

The legend uses [ObservaleHQ Plot library](https://github.com/observablehq/plot) under the hood.
See [this article](https://observablehq.com/@d3/color-legend) for a more detailed and advanced customisation of the legend.
