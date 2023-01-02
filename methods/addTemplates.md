---
layout: default
title: addTemplates()
parent: Methods
nav_order: 4
---

# addTemplates()

Add a new subDomain template
{: .fs-6}

{: .warning}
Documention for this option is still work in progress, and is incomplete

```js
addTemplates(Template[] | Template): void;
```

{: .warning}
This function have to be called before you call `init()`.

See [SubDomain Templates section](/templates) for more details about the `Template` type.

#### Example

Injecting a custom quarter subDomain template.

<div class="code-example">
  <div id="template-example-2"></div>
  <script>
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
        }
      }
    };

    const cal = new CalHeatmap();
    cal.addTemplates(quarterTemplate);
    cal.paint({
      range: 2,
      domain: { type: 'year', gutter: 10 },
      label: { textAlign: 'start' },
      subDomain: { type: 'quarter', width: 60, height: 15 },
      formatter: { subDomainLabel: '[Quarter] Q' }
    });

  </script>
</div>
```js
const quarterTemplate = (helpers) => ({
  name: 'quarter',
  level: 50,
  rowsCount() {
    return 1;
  },
  columnsCount() {
    return 4;
  },
  mapping: (startDate, endDate, defaultValues) =>  {
     return helpers.DateHelper.intervals(
      'quarter',
      startDate,
      helpers.DateHelper.date(endDate)
    ).map((d, index) => ({
      t: d,
      x: index,
      y: 0,
      ...defaultValues,
    }));
  },
  format: {
    date: 'Q',
    legend: 'Q',
  },
  extractUnit(d) {
    return helpers.DateHelper.date(d).startOf('quarter').valueOf();
  }
});

const cal = new CalHeatmap();
cal.addTemplates(quarterTemplate);
cal.paint({
range: 2,
domain: { type: 'year', gutter: 10 },
label: { textAlign: 'start' },
subDomain: { type: 'quarter', width: 60, height: 15 },
formatter: { subDomainLabel: '[Quarter] Q' },
itemSelector: '#template-example-2'
});

```

```
