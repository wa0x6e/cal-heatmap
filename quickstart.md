---
layout: default
title: Quick Start
nav_order: 3
---

# Quick start

After [installing](/install.html) the script:

- insert `<div id="cal-heatmap"></div>` where you want to render the calendar in your page
- create a calendar instance
- paint the calendar with your desired options/plugins.

#### Example calendar with no set options

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

#### Example calendar with custom options

<div class="code-example">
  <div id="default-example-2"></div>
  <script>
    const cal2 = new CalHeatmap();
    cal2.paint({ itemSelector: '#default-example-2', date: { start: new Date(2020, 0, 15) }, domain: { type: 'month' }, subDomain: { type: 'day' } });
  </script>
</div>
```js
const cal = new CalHeatmap();
cal.paint({
  date: { start: new Date(2020, 0, 15) },
  domain: { type: 'month' },
  subDomain: { type: 'day' },
});
```

You can customize the calendar by passing an [`Options`](/options/) object and/or
a [Plugins list](/plugins/) to [`paint()`](/methods/paint.html).

{: .note}
See the [Examples](/examples) section for more examples.
