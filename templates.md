---
layout: default
title: SubDomain Templates
nav_order: 10
---

# SubDomain Templates

Generate and map content of a sudDomain type.
{: .fs-6}

{: .warning}
Documention for this option is still work in progress, and is incomplete

Previously a static internal function, templates have been extracted as
a customizable module since v4, to allow developers to inject their own
templates, and create their own subDomains content, when the default
subDomain does not achieve what they seek.

By default, CalHeatmap ship with the `year`, `month`, `week`, `day`, `hour` and `minute` templates.

Example of custom templates:

- days subdomain, but only show weekdays (only 5 subdomains instead of 7)
- minutes subdomain, but grouped by 15 minutes (only 4 subdomains instead of 60)

{: .note}
You can add your custom templates with the [`addTemplates()`](/methods/addTemplates) method.

```js
type Template = function(helpers, Options) {
  return TemplateResult;
}
```

A `Template` is a javascript function accepting 2 arguments
and returning a `TemplateResult`

## Arguments

`helpers`

`Options`

The full [options](/options) passed to the calendar.

## Return value

```js
type TemplateResult = {
  name: string,
  level: number,
  rowsCount: function(): number,
  columnsCount: function(): number,
  mapping: function(startTimestamp: number, endTimestamp: number, defaultvalues: {}),
  format: {
    date: string,
    legend: string
  },
  extractUnit: function(timestamp: number): number
}
```

### name

Name of the subDomain type.

Will be used by `subDomain.type` options.

### level

### rowsCount

Number of rows

### columnsCount

Number of columns

### mapping

```js
{
  t: number,
  x: number,
  y: number,
  ...defaultValues,
}
```

### format

### extractUnit

Given a timestamp, this function should return the timestamp related to
the subdomain.

## Example

```js
const quarterTemplate = function (helpers) {
  return {
    name: 'quarter',
    level: 50,
    rowsCount() {
      return 1;
    },
    columnsCount() {
      return 4;
    },
    mapping: (startDate, endDate, defaultValues) =>
      helpers.DateHelper.intervals(
        'quarter',
        startDate,
        helpers.DateHelper.date(endDate)
      ).map((d, index) => ({
        t: d,
        x: index,
        y: 0,
        ...defaultValues,
      })),

    format: {
      date: 'Q',
      legend: 'Q',
    },
    extractUnit(d) {
      return helpers.DateHelper.date(d).startOf('quarter').valueOf();
    },
  };
};
```

{: .note}
You can see all default templates on the [github](https://github.com/wa0x6e/cal-heatmap/tree/master/src/calendar/templates).
