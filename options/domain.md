---
layout: default
title: domain
nav_order: 3
parent: Options
has_children: true
---

# domain

Defines all options related to the domain
{: .fs-6}

```js
type DomainOptions: {
  type: string;
  gutter: number;
  padding: [number, number, number, number];
  dynamicDimension: boolean;
  label: LabelOptions;
  subLabel: SubLabelOptions;
  sort: 'asc' | 'desc';
}
```

## type

Defines the domain's type interval

```js
type: string;
```

A domain type represents a time interval.

### Available default domains type

- `year`
- `month`
- `week`
- `day`
- `hour`

## gutter

Space between each domain, in pixel

```js
gutter: number;
```

Default: `4`

#### Interactive Example

<div class="code-example" >
  <style>
    #domainGutter-example-1 {
      background: greenyellow;
    }
    #domainGutter-example-1 .domain-background {
      fill: white;
    }
  </style>
  <div id="domainGutter-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge">
  <label>
    Gutter:
    <input type="range" min="0" max="100" value="4" class="slider" id="gutter-slider" >
    <span id="gutter-value">4</span> pixels
</label>
  <script>
      const cal = new CalHeatmap();
      cal.paint({ domain: { type: 'month', gutter: 10 }, subDomain: { type: 'day' }, range: 3, itemSelector: '#domainGutter-example-1'});
      d3.select("#gutter-slider").on("input", function() {
        cal.paint({ domain: { gutter: +this.value } });
        d3.select("#gutter-value").html(+this.value);
      });
  </script>
</div>

## padding

Padding inside each domain, in pixel

```js
padding: [number, number, number, number];
```

Expect an array of 4 numbers, in the same order as CSS padding property (top, right, bottom, left)

Default: `[0, 0, 0, 0]`

#### Interactive Example

<div class="code-example" >
  <style>
    #padding-example-1 .domain-background {
      stroke: gray;
      stroke-width:1px;
      stroke-dasharray: 2 2;
    }
  </style>
  <div id="padding-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge">
  <label>
    Padding top:
    <input type="range" min="0" max="20" value="0" class="slider" id="padding-top" >
    <span id="padding-top-value">0</span> pixels
   </label>
   <br>
   <label>
     Padding right:
    <input type="range" min="0" max="20" value="0" class="slider" id="padding-right" >
    <span id="padding-right-value">0</span> pixels
    </label>
    <br>
    <label>
      Padding bottom:<input type="range" min="0" max="20" value="0" class="slider" id="padding-bottom" >
    <span id="padding-bottom-value">0</span> pixels
    </label>
    <br>
    <label>
      Padding left:<input type="range" min="0" max="20" value="0" class="slider" id="padding-left" >
    <span id="padding-left-value">0</span> pixels
</label>
  <script>
      let ptop = 0;
      let pright = 0;
      let pbottom = 0;
      let pleft = 0;
      const cal4 = new CalHeatmap();
      cal4.paint({ domain: { type: 'month', padding: [ptop, pright, pbottom, pleft] }, subDomain: { type: 'day' }, range: 3, itemSelector: '#padding-example-1'});
      d3.select("#padding-top").on("input", function() {
        ptop = +this.value;
        cal4.paint({ domain: { padding: [ptop, pright, pbottom, pleft]  } });
        d3.select("#padding-top-value").html(+ptop);
      });
      d3.select("#padding-right").on("input", function() {
        pright = +this.value;
        cal4.paint({ domain: { padding: [ptop, pright, pbottom, pleft]  } });
        d3.select("#padding-right-value").html(+pright);
      });
      d3.select("#padding-bottom").on("input", function() {
        pbottom = +this.value;
        cal4.paint({ domain: { padding: [ptop, pright, pbottom, pleft]  } });
        d3.select("#padding-bottom-value").html(+pbottom);
      });
      d3.select("#padding-left").on("input", function() {
        pleft = +this.value;
        cal4.paint({ domain: { padding: [ptop, pright, pbottom, pleft]  } });
        d3.select("#padding-left-value").html(+pleft);
      });
  </script>
</div>

## dynamicDimension

Whether the domain's should be resized to fit its content.

```js
dynamicDimension: boolean;
```

The domain dimension depends on the chosen subDomain, more precisely on the
number of columns and rows of the subDomains.

Some of the subDomains such as `day` do not have a fixed number of items,
as there can be 28, 29, 30 or 31 days in a `month`.

This leads to different domains having different sizes, and
may cause the calendar total dimension to change on navigation.

When disabled, the domains will all take the same maximum size
as defined by the subDomain template,
and some blank space may appear between domain.

Usually, only either the width or the height will by dynamic.

Default: `true`

#### Interactive Example

<div class="code-example" >
  <div id="domainDynamicDimension-example-1" style="display: inline-block; outline: 1px dotted gray;margin-bottom: 10px;"></div>
  <script>

      const cal3 = new CalHeatmap();
      cal3.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#domainDynamicDimension-example-1'});

  </script>
  <br>
  <a href="#" class="btn btn-blue" onClick="cal3.previous(); return false;">Previous</a>
  <a href="#" class="btn btn-blue" onClick="cal3.next(); return false;">Next</a>

</div>
```markdown
When set to true, notice how the calendar may resize on navigation
```

<div class="code-example">
  <div id="domainDynamicDimension-example-2" style="display: inline-block; outline: 1px dotted gray;margin-bottom: 10px;"></div>
  <script>

      const cal2 = new CalHeatmap();
      cal2.paint({ domain: { type: 'month', dynamicDimension: false }, subDomain: { type: 'day' }, range: 2, itemSelector: '#domainDynamicDimension-example-2'});

  </script>
  <br>
  <a href="#" class="btn btn-blue" onClick="cal2.previous(); return false;">Previous</a>
    <a href="#" class="btn btn-blue" onClick="cal2.next(); return false;">Next</a>

</div>
```markdown
When set to false, notice how the calendar never resize on navigation, but some white space may appear between domains
```

## label

Defines all options related to the domain’s label

```js
label: LabelOptions;
```

See the [Domain Label section](/options/domain/label.html)

## sort

Sort order of the domains.

```js
sort: 'asc' | 'desc';
```

Default: `asc`

{: .note }
This only affect the domain order, not the subDomain.

#### Example

<div class="code-example">
  <div id="reversedDirection-example-1"></div>
</div>
<div class="highlighter-rouge">
  <script>
      let sortOrder = 'asc';
      const cal5 = new CalHeatmap();
      cal5.paint({ domain: { type: 'month', sort: sortOrder }, subDomain: { type: 'day' }, range: 7, itemSelector: '#reversedDirection-example-1'});
  </script>
  <div class="btn btn-blue" onClick="sortOrder = (sortOrder === 'asc' ? 'desc' : 'asc'); cal5.paint({ domain: { sort: sortOrder } }); return false">Toggle sort order</div>
</div>
