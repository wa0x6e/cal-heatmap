---
layout: default
title: destroy()
parent: Methods
nav_order: 4
---

# destroy()

Destroy the calendar
{: .fs-6 }

```js
cal.destroy(): Promise<unknown>
```

### Return

Return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which will resolve when the calendar finished destroying (after all animations completed).

#### Example

```js
const cal = new CalHeatmap();
cal.paint({ ... });

// Destroy it
cal.destroy().then(() => { console.log('destroy complete!') });
```
