---
layout: default
title: fill()
parent: Methods
nav_order: 2
---

# fill()

Update the calendar data set
{: .fs-6}

```js
const cal = new CalHeatmap();
cal.fill(data: DataOptions['source']);
```

Use this method if you only want to update your calendar dataset,
without trigerring any other changes, as `fill()` is already called behind the scene by [`paint()`](/methods/paint.html)
and all [navigation methods](/options/navigation.html).

### Arguments:

- `data`: A [`Data.source`](/options/data.html#source).

### Return

- A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that will resolve once the calendar is filled with the new data.

<hr/>

## Usage

#### Example

```js
const cal = new CalHeatmap();
cal.paint({ data: { source: 'https://my-api.com/weather-min-temp.json' } });
// User opted to show max temp instead of min temp
cal.fill('https://my-api.com/weather-max-temp.json');
```
