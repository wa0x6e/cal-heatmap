---
layout: default
title: verticalOrientation
nav_order: 21
parent: Options
---

# verticalOrientation

Whether the domains should be arranged on top of each other, or side by side.
{: .fs-6 }

```js
verticalOrientation: boolean;
```

Default: `false`

<hr />

#### Playground

<div class="code-example">
  <div id="verticalOrientation-example-1"></div>
</div>
<div class="highlighter-rouge p-3">
  <script>
      let status = false;
      const cal = new CalHeatmap();
      cal.paint({ domain: { type: 'month'}, subDomain: { type: 'day' }, range: 3, verticalOrientation: status, itemSelector: '#verticalOrientation-example-1'});
  </script>
  <div class="fs-3">
    <div class="btn btn-blue" onClick="status = !status; cal.paint({ verticalOrientation: status }); return false">Toggle verticalOrientation</div>
  </div>
</div>

{: .note }
Use [`domain.sort`](/options/domain.html#sort) if you want to show the most recent domain first
