---
layout: default
title: dimensions()
parent: Methods
nav_order: 3
---

# dimensions()

Return the calendar's dimension
{: .fs-6}

```js
export type Dimensions = {
  width: number,
  height: number,
};

const cal = new CalHeatmap();
cal.dimensions(): Dimensions;
```

#### Example

```js
const cal = new CalHeatmap();
cal.paint().then(() => {
  // Wait for paint() to complete before retrieving the dimensions
  cal.dimensions();
});
// { width: 969, height: 142 }
```

### Return

- An object, with the `width` and `height` properties.

{: .note}
You can also retrieve the dimension with the [`resize`](/events.html#resize) event.
