---
layout: default
title: paint()
parent: Methods
nav_order: 1
---

# paint()

Paint the calendar using the given Options and Plugins.
{: .fs-6}

```js
const cal = new CalHeatmap();
cal.paint(options: Options, plugins? PluginDefinition[] | PluginDefinition);
```

This is the core method, used to setup and paint the calendar.

### Arguments:

- `options`: An [`Options`](/options) object.
- `plugins`: An array of [Plugin Definition](/plugins/) definition.

### Return

- A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that will resolve once the calendar is painted, and filled with data.

{: .note}
The calendar can be updated dynamically by calling this method with new `Options`.

<hr/>

## Usage

#### Example with random options

```js
const cal = new CalHeatmap();
cal.paint({
  range: 1,
  date: { start: new Date(2020, 0, 1) },
});
```

#### Example with no options, and random plugins

```js
const cal = new CalHeatmap();
cal.paint({}, [[Timezone, { timezone: 'Europe/Paris' }]]);
```
