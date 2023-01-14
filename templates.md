---
layout: default
title: Templates
nav_order: 10
---

# Templates

Defines the structure and content of a subDomain
{: .fs-6}

## Introduction

A subDomain is a time range, each represented by a cell in the calendar.

<div id="example-1"></div>
<script>
  const cal = new CalHeatmap();
  cal.paint({range: 6, itemSelector: '#example-1', domain: {type: 'month'}, subDomain: {type: 'day'}});
</script>

Taking the `month/day` example above, there is 6 `month` domains, each having
a varying number of `days` subDomain, months having a different number of days.

Given a domain type and a time window, a Template generates a collection
of subDomains, and defines how they are arranged on a x/y axis.

This template is then consumed by the calendar in order to draw the
given subDomain cells.

## When to use

By default, CalHeatmap ships with the `year`, `month`, `week`, `day`, `x_day`,
`hour` and `minute` templates.

Each of these templates are pretty basic, but will be enough for most use cases.

You can create and use a custom template if you wish to:

- change the number of columns and rows (ex: all subDomains on same row)
- change the time interval of a subDomain (ex: each subDomain equal 5min)
- exclude some time window (ex: showing only weekdays)

## How to use

- Creates a template
- Register the template using [`addTemplates()`](/methods/addTemplates)

### Creating a template

A template is a javascript function taking 2 arguments
and returning a `TemplateResult`.

```js
type Template = function(DateHelper: DateHelper, options: Options) {
  return TemplateResult;
}
```

### Arguments

- `DateHelper`: a [Datehelper](https://github.com/wa0x6e/cal-heatmap/blob/master/src/helpers/DateHelper.ts) object, also used internally by the calendar for all date related computation. You should always rely on this helper whenever possible for date computation consistency.
- `Options`: the [Options](/options) object

### Return value

```js
type TemplateResult = {
  name: string,
  parent?: string,
  rowsCount: (ts: number) => number,
  columnsCount: (ts: number) => number,
  mapping: (startTimestamp: number, endTimestamp: number) => SubDomain[],
  extractUnit: (ts: number) => number,
};
```

### name

Name of the subDomain type.

Will be used by [`subDomain.type`](/options/subDomain.html#type) options, and child template.

{: .highlight}
Name should be unique

### parent

Parent template's name

Optional, set the name of another template to inherit its options.

### rowsCount

Total number of rows

This number may vary depending on the `domain` type.

#### Example from the hour template

```js
rowsCount: ts => {
  const TOTAL_ITEMS = 24;
  const ROWS_COUNT = 6;
  const { domain } = options;

  switch (domain.type) {
    case 'week':
      return (TOTAL_ITEMS / ROWS_COUNT) * 7;
    case 'month':
      return (
        (TOTAL_ITEMS / ROWS_COUNT) *
        (domain.dynamicDimension ? DateHelper.date(ts).daysInMonth() : 31)
      );
    case 'day':
    default:
      return TOTAL_ITEMS / ROWS_COUNT;
  }
};
```

### columnsCount

Total number of columns

This number may vary depending on the `domain` type.

### mapping

Function returning an array of `SubDomain`, used to populate each domain in the calendar.

A subDomain have 3 main properties:

```js
type SubDomain = {
  t: number,
  x: number,
  y: number,
};
```

- `t`: the subDomain timestamp, rounded to the start of the time range
- `x`: the row index of the cell
- `y`: the column index of the cell

- Rows are indexed from top to bottom, with the top one being 0.
- Columns are indexed from left to right, with the left one being 0.

### extractUnit

Function returning the start of the subDomain time range.

This function is used to bind your data to a subDomain

#### Example

- If each subDomain is a 5min range, the timestamp for `9:18AM` should return
  the timestamp for `9:15AM`
- If each subDomain is a weekday, the function should return the timestamp for the start of that day (`00:00AM`), and return `null` for a weekend.

{: .highlight}
Take a look at the built-in templates on the [github](https://github.com/wa0x6e/cal-heatmap/tree/master/src/calendar/templates) repository, for real-world examples.

<hr/>

## Real world Example

### Quarter subDomain template

Each subDomain represent 3 months.

You can see a the final result [here](/methods/addTemplates)

```js
const quarterTemplate = function (DateHelper) {
  return {
    name: 'quarter',
    rowsCount() {
      return 1;
    },
    columnsCount() {
      return 4;
    },
    mapping: (startDate, endDate, defaultValues) =>
      DateHelper.intervals('quarter', startDate, DateHelper.date(endDate)).map(
        (d, index) => ({
          t: d,
          x: index,
          y: 0,
          ...defaultValues,
        })
      ),
    extractUnit(d) {
      return DateHelper.date(d).startOf('quarter').valueOf();
    },
  };
};
```

### Days subDomain, with all days on the same row

Using `day` template as `parent`.

<div class="code-example">
  <div id="example-2"></div>
  <script>
    const cal2 = new CalHeatmap();
    const sameRowDayTemplate = function (DateHelper) {
      return {
        name: 'day_same_row',
        parent: 'day',
        rowsCount() {
          return 1;
        },
        columnsCount() {
          return 31;
        },
        mapping: (startDate, endDate, defaultValues) =>
          DateHelper.intervals('day', startDate, DateHelper.date(endDate)).map(
            (d, index) => ({
              t: d,
              x: index,
              y: 0,
              ...defaultValues,
            })
          ),
        };
    };
    cal2.addTemplates(sameRowDayTemplate);
    cal2.paint({
      range: 1,
      itemSelector: '#example-2',
      domain: { type: 'month' },
      subDomain: { type: 'day_same_row' },
    });

  </script>
</div>

```js
const sameRowDayTemplate = function (DateHelper) {
  return {
    name: 'day_same_row',
    parent: 'day',
    rowsCount() {
      return 1;
    },
    columnsCount() {
      return 31;
    },
    mapping: (startDate, endDate, defaultValues) =>
      DateHelper.intervals('day', startDate, DateHelper.date(endDate)).map(
        (d, index) => ({
          t: d,
          x: index,
          y: 0,
          ...defaultValues,
        })
      ),
    // Missing extractUnit property, will be inherit from parent
  };
};
const cal = new CalHeatmap();
call.addTemplates(sameRowDayTemplate);
cal.paint({
  range: 1,
  domain: { type: 'month' },
  subDomain: { type: 'day_same_row' },
});
```

{: .important}
These example make full use of the provided DateHelper class, which uses momentjs for date computation
