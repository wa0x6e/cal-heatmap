---
layout: default
title: Quick Start
nav_order: 3
---

# Quick start

After [installing](/install.html) the script:

- insert `<div id="cal-heatmap"></div>` where you want to render the calendar in your page
- create a calendar
- paint the calendar with a set of given options/plugins.

By default, it renders an empty calendar with the default options

#### Example calendar with default options

<div class="code-example">
  <div id="default-example-1"></div>
  <script>
    const cal = new CalHeatmap();
    cal.paint({ itemSelector: '#default-example-1' });
  </script>
</div>
```js
const cal = new CalHeatmap();
cal.paint();
```

You can customize the calendar by passing an [`Options`](/options/) object and/or
a [Plugins list](/plugins/) to [`paint()`](/methods/paint.html).
