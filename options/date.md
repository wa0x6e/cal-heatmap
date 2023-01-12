---
layout: default
title: date
nav_order: 5
parent: Options
---

# date

Specify the calendar's time boundaries and settings

```js
type DateOptions: {
  start: Date;
  min?: Date;
  max?: Date;
  highlight?: Date[];
  locale: string;
}
```

<hr/>

## start

Start date of the calendar

```js
start: Date;
```

Default: `new Date()` (today)

{: .highlight}
Date is rounded to the start of the domain's type.  
If `start` is `new Date(2000-06-16)`, and the chosen domain is `month`, the
calendar will start on `2000-06-01` (start of the month).

{: mt-8}

## min

Minimum allowed date.
Used on navigation, to set a lower bound when navigating backward.

Should always be `<= start`

```js
min?: Date;
```

Default: `null`

#### Playground

<div class="code-example" >
  <div id="mindate-example-1"></div>

  <script>
      const cal4 = new CalHeatmap();
      cal4.on('minDateReached', (event, date, value) => {
        d3.select('#mindate-prev').classed('btn-blue', false);
      });
      cal4.on('minDateNotReached', (event, date, value) => {
        d3.select('#mindate-prev').classed('btn-blue', true);
      });
      cal4.paint({ date: { start: new Date(2020, 0, 1), min: new Date(2019, 10, 1)  }, domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#mindate-example-1'});
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
  <a href="#" id="mindate-prev" class="btn btn-blue" onClick="cal4.previous(); return false;">Previous</a>
  <a href="#" class="btn btn-blue" onClick="cal4.next(); return false;">Next</a>
  </div>
</div>

{: mt-8}

## max

Maximum allowed date.
Used on navigation, to set a upper bound when navigating forward.

Should always be `>= start`

```js
max?: Date;
```

Default: `null`

#### Playground

<div class="code-example" >
  <div id="maxdate-example-1"></div>

  <script>
      const cal5 = new CalHeatmap();
      cal5.on('maxDateReached', (event, date, value) => {
        d3.select('#maxdate-next').classed('btn-blue', false);
      });
      cal5.on('maxDateNotReached', (event, date, value) => {
        d3.select('#maxdate-next').classed('btn-blue', true);
      });
      cal5.paint({ date: { start: new Date(2020, 0, 1), max: new Date(2020, 3, 1)  }, domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#maxdate-example-1'});
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
  <a href="#" class="btn btn-blue" onClick="cal5.previous(); return false;">Previous</a>
  <a href="#" id="maxdate-next" class="btn btn-blue" onClick="cal5.next(); return false;">Next</a>
  </div>
</div>

{: mt-8}

## highlight

Array of dates to highlight.  
Highlighted subDomain cells are given a special class to make them standout.

```js
highlight?: Date[];
```

Default: `[]`

#### Playground

<div class="code-example" >
  <div id="highlight-example-1"></div>
</div>
<div class="highlighter-rouge p-3">
  <script>
      const cal = new CalHeatmap();
      const start = new Date(2020, 3, 1, 2);
      const randomDate = function () {
        return new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), Math.floor(Math.random() * (59 - 0 + 1)) + 0)
      };

      cal.paint({ domain: { type: 'hour' }, subDomain: { type: 'minute' }, date: { start: start, highlight: [randomDate()] }, range: 1, itemSelector: '#highlight-example-1'});

  </script>
  <div class="fs-3">
  <div class="btn btn-blue" onClick="cal.paint({ date: { highlight: [randomDate(), randomDate()] } }); return false">Highlight 2 random minutes</div>
</div>
</div>

{: .note}
See the `highlight` class in the CSS to customize its style

{: mt-8}

## locale

MomentJS locale.

```js
locale: string;
```

`locale` is used by the underlying MomentJS library to set the language and format of the dates,
as well as the first day of the week (monday/sunday).

Default: `en`

For performance reasons, only the `en` locale is included by default.

To add more locales, you can either:

- Add `<script src="https://momentjs.com/downloads/moment-with-locales.min.js"></script>` in your page `<head>`
- Add your chosen locale manually, via [`moment.locale(LOCALE)`](https://momentjs.com/docs/#/i18n/loading-into-nodejs/)

#### Example with the french locale

<div class="code-example">
  <div id="locale-example-1"></div>
  <script>
    const cal2 = new CalHeatmap();
    cal2.paint({ range: 6, itemSelector: '#locale-example-1', domain: { type: 'month' }, subDomain: { type: 'day' }, date: { locale: 'fr' } });
  </script>
</div>
