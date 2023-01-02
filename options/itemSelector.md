---
layout: default
title: itemSelector
nav_order: 1
parent: Options
---

# itemSelector

Defines where the calendar should be rendered
{: .fs-6 }

```js
itemSelector: Element | string;
```

Accepts either an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element), or any [W3C Selector string](https://www.w3.org/TR/selectors-api/), such as `#my-id` or `.myclass`.

Default: `#cal-heatmap`

#### Example

```js
const cal = new CalHeatmap();
// These two calls are identicals
cal.paint({ itemSelector: '#my-node' });
cal.paint({ itemSelector: document.getElementById('my-node') });
```

{: .note}
If the chosen DOM node is not empty, the calendar will be inserted after the existing children.
