---
layout: default
title: date
nav_order: 5
parent: Options
---

# date

```js
type DateOptions: {
  start: Date;
  min?: null | Date;
  max?: null | Date;
  highlight?: Date[];
  locale: string;
}
```

## start

Start date of the calendar

```js
start: Date;
```

Date is rounded to the start of the domain.

Default: `new Date()`

#### Example

If `start` is `2000-06-16`, and the chosen domain is `month`, the
calendar will start on `2000-06-01`.

## min

Minimum allowed date.
Used on navigation, to set a lower bound when navigating backward.

```js
min?: null | Date;
```

Default: `null`

## max

Maximum allowed date.
Used on navigation, to set a upper bound when navigating forward.

```js
max?: null | Date;
```

Default: `null`

## highlight

Array of dates to highlight.
Highlighted subDomain cells are given a special class to make them standout.

```js
highlight?: Date[];
```

Default: `[]`

<div class="code-example" >
  <div id="highlight-example-1"></div>
</div>
<div class="highlighter-rouge">
  <script>
      const cal = new CalHeatmap();
      const start = new Date(2020, 3, 1, 2);
      const randomDate = function () {
        return new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), Math.floor(Math.random() * (59 - 0 + 1)) + 0)
      };

      cal.paint({ domain: { type: 'hour' }, subDomain: { type: 'minute' }, date: { start: start, highlight: [randomDate()] }, range: 1, itemSelector: '#highlight-example-1'});

  </script>
  <div class="btn btn-blue" onClick="cal.paint({ date: { highlight: [randomDate(), randomDate()] } }); return false">Highlight 2 random minutes</div>
</div>

{: .note}
You can dynamically highlight new dates by calling `paint({ date: { highlight: [Date, Date ...] } })` again.

## locale

MomentJS locale.

The locale will define the language and format of the dates, as well as the first day of the week (monday/sunday).

```js
locale: string;
```

Default: `en`

For performance reasons, only the `en` locale is included by default.
