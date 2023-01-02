---
layout: default
title: Tooltip
parent: Plugins
nav_order: 1
---

# Tooltip

This plugin add a tooltip when hovering over a subDomain's cell
{: .fs-6 }

## Install

### NPM

The plugin is built-in in the core CalHeatmap, just import the module with

```js
import Tooltip from 'cal-heatmap/src/plugins/Tooltip';
```

### CDN

Add the tooltip plugin script and its dependencies in your `<head>`

```html
<script src="https://unpkg.com/@popperjs/core@2"></script>
<script src="https://unpkg.com/cal-heatmap@4.0.0-beta.1/dist/plugins/Tooltip.min.js"></script>
```

### Usage

```js
const cal = new CalHeatmap();
cal.paint({}, [[Tooltip, TOOLTIP_OPTIONS]]);
```

## TooltipOptions

```js
type TooltipOptions = {
  enabled: boolean,
  text: (timestamp: number, value: number) => string,
} & PopperOptions;

// Popper options, as defined in https://popper.js.org/docs/v2/constructors/
type PopperOptions = {
  placement: Placement, // "bottom"
  modifiers: Array<$Shape<Modifier<any>>>, // []
  strategy: PositioningStrategy, // "absolute",
  onFirstUpdate?: ($Shape<State>) => void, // undefined
};

type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';
type Strategy = 'absolute' | 'fixed';
```

### enabled

Whether to enable the tooltip

Default: `true`

<div class="code-example">
<div id="tooltip-example-1"></div>
<script>
  (function () {
     const cal = new CalHeatmap();
     cal.paint({ range: 1, itemSelector: '#tooltip-example-1' }, [[Tooltip]]);
   })()
</script>
</div>
```js
const cal = new CalHeatmap();
cal.paint({}, [ [ Tooltip ] ]); // Enable the tooltip with the default options
```

To customize the tooltip's UI, look for `#ch-tooltip` in the CSS.

### text

Content of the tooltip

```js
text: (timestamp: number, value: number) => string;
```

Default:

```js
function (timestamp, value) {
  return `${value} - ${new Date(timestamp).toISOString()}`;
}
```

### Addition Popper options

You can customize the underlying popper instance further,
passing the same object as [`createPopper`](https://popper.js.org/docs/v2/constructors/)'s `Options` argument.

<div class="code-example">
  <div id="tooltip-example-2"></div>
  <script>
    (function () {
       const cal = new CalHeatmap();
       cal.paint({ range: 1, itemSelector: '#tooltip-example-2' }, [[Tooltip, { placement: 'right', modifiers: [{ name: 'offset', options: {offset: [0, 40]}}] }]]);
      })();
  </script>
</div>
```js
const cal = new CalHeatmap();
cal.paint(
  {},
  [
    [
      Tooltip,
      {
        placement: 'right',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 40],
            },
          },
        ],
      }
    ]
  ]
);
```
