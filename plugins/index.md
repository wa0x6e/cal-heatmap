---
layout: default
title: Plugins
nav_order: 15
has_children: true
---

# Plugins

Cal-heatmap can be customized further with the help of plugins.
{: .fs-6}

There's some few plugins, shipped with CalHeatmap, but not bundled in the main
library.

## Usage

```js
const cal = new CalHeatmap();
cal.paint(/*OPTIONS*/, [
  [Tooltip, /*TOOLTIP_OPTIONS*/],
  [Legend, /*LEGEND_OPTIONS*/],
  [Timezone, /*TIMEZONE_OPTIONS*/],
]);
```

See each plugin documentation for install and usage details.
