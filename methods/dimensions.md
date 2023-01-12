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
type Dimensions = {
  width: number,
  height: number,
};

const cal = new CalHeatmap();
cal.dimensions(): Dimensions;
```

### Return

- An object, with the calendar `width` and `height` in pixels.

{: .note}
You can also retrieve the dimension with the [`resize`](/events.html#resize) event.

<hr>

## Usage

#### Example

```js
const cal = new CalHeatmap();
cal.paint().then(() => {
  // Wait for paint() to complete before retrieving the dimensions
  cal.dimensions(); // { width: 969, height: 142 }
});
```
