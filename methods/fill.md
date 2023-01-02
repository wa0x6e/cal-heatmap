---
layout: default
title: fill()
parent: Methods
nav_order: 2
---

# fill()

Fill the calendar with data
{: .fs-6}

```js
const cal = new CalHeatmap();
cal.fill(data: DataOptions['source']);
```

`fill()` is already called behind the scene by [`paint()`](/methods/paint.html)
and all [navigation methods](/options/navigation.html).

This method should be called only if the given data source is different from the one
set in the `Options`.

### Arguments:

- `data`: A [`Data.source`](/options/data.html#source).

### Return

- A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that will resolve once the calendar is filled with the new data.
