---
layout: default
title: Options
nav_order: 4
has_children: true
---

# Options

Customize the UI and content of the calendar
{: .fs-6 }

The calendar can be customized by passing an `Options` object to the `paint()` method on the calendar instance.

```js
const cal = new CalHeatmap();
cal.paint(options?: Options);
```

#### Options signature

```js
type Options = {
  itemSelector: Element | string,
  range: number,
  domain: DomainOptions,
  subDomain: SubDomainOptions,
  verticalOrientation: boolean,
  date: DateOptions,
  data: DataOptions,
  label: LabelOptions,
  animationDuration: number,
  tooltip: TooltipOptions,
  legend: LegendOptions,
  scale: ScaleOptions,
};
```
