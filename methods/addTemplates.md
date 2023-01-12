---
layout: default
title: addTemplates()
parent: Methods
nav_order: 6
---

# addTemplates()

Add a new subDomain template
{: .fs-6}

```js
addTemplates(Template[] | Template): void;
```

{: .warning}
This method have to be called before you call `paint()`.

See the [SubDomain Templates](/templates) for more informations about the `Template`.

<hr/>

## Usage

#### Example

Injecting a custom quarter subDomain template.

<div class="code-example">
  <div id="template-example-2"></div>
  <script>
    const quarterTemplate = function (dateHelper) {
      return {
        name: 'quarter',
        level: 50,
        rowsCount() {
          return 1;
        },
        columnsCount() {
          return 4;
        },
        mapping: function (startDate, endDate, defaultValues) {
          return dateHelper.intervals(
            'quarter',
            startDate,
            dateHelper.date(endDate)
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
          return dateHelper.date(d).startOf('quarter').valueOf();
        }
      }
    };

    const cal = new CalHeatmap();
    cal.addTemplates(quarterTemplate);
    cal.paint({
      range: 2,
      itemSelector: '#template-example-2',
      domain: { type: 'year', gutter: 10, label: { textAlign: 'start' } },
      subDomain: { type: 'quarter', width: 60, height: 15, label: '[Quarter] Q', radius: 3 },
    });

  </script>
</div>

```js
// Create a quarter Template
// Content skipped here, see the Templates section for full template example
const quarterTemplate = () => {};

const cal = new CalHeatmap();
// Add the template
cal.addTemplates(quarterTemplate);

cal.paint({
  range: 2,
  domain: { type: 'year', gutter: 10, label: { textAlign: 'start' } },
  subDomain: {
    type: 'quarter',
    width: 60,
    height: 15,
    label: '[Quarter] Q',
    radius: 3,
  },
});
```
