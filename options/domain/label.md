---
layout: default
title: label
nav_order: 1
parent: domain
grand_parent: Options
---

# label

Specify all options related to the domain's label configuration
{: .fs-6 }

```js
type LabelOptions: {
  text?: string | null | ((timestamp: number, element: SVGElement) => string);
  position: 'top' | 'right' | 'bottom' | 'left',
  textAlign: 'start' | 'middle' | 'end',
  offset: {
    x: number,
    y: number,
  },
  rotate: null | 'left' | 'right',
  width: number,
  height: number,
}
```

<hr />

## text

Specify the label's content

```js
label?: string | null | ((timestamp: number, element: SVGElement) => string);
```

Default: `undefined`

This option accepts different value's type, see table below for usage.

| Value type  | Description                                                                                                            | Example Value                                                   | Example output             |
| :---------- | :--------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------- |
| `undefined` | Let the calendar decides, based on the chosen `type`                                                                   |                                                                 | `March`                    |
| `string`    | Pass the string to [dayjs `format()`](https://day.js.org/docs/en/display/format), and display its result               | `MMMM`                                                          | `March`                    |
| `null`      | Do not show any label                                                                                                  | `null`                                                          |                            |
| `function`  | Display the function's return value. The function takes the domain's timestamp and the label's SVG Element as argument | `function (timestamp) { return new Date(date).toISOString(); }` | `2022-12-06T20:01:51.290Z` |

{: .note}
dayjs `format()` is [`locale`](/options/date.html#locale) and timezone aware.

{: .mt-8}

## position

Position of the label, relative to its domain

```js
position: 'top' | 'right' | 'bottom' | 'left',
```

Default: `bottom`

#### Example with each possible values

<div class="code-example">
  <span id="label-example-1" style="display: inline-block; outline: 1px dotted gray;margin-right: 10px;"></span>
  <span id="label-example-2" style="display: inline-block; outline: 1px dotted gray;margin-right: 10px;"></span>
  <span id="label-example-3" style="display: inline-block; outline: 1px dotted gray;margin-right: 10px;"></span>
  <span id="label-example-4" style="display: inline-block; outline: 1px dotted gray;"></span>
  <script>
    (function() {
      const cal = new CalHeatmap();
      cal.paint({ domain: { type: 'hour', label: { position: 'top' } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-1' });
      const cal2 = new CalHeatmap();
      cal2.paint({ domain: { type: 'hour', label: { position: 'right' } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-2' });
      const cal3 = new CalHeatmap();
      cal3.paint({ domain: { type: 'hour', label: { position: 'bottom' } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-3' });
      const cal4 = new CalHeatmap();
      cal4.paint({ domain: { type: 'hour', label: { position: 'left' } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-4' });
    })()
  </script>
</div>

{: .mt-8}

## textAlign

Horizontal alignment of the label

```js
textAlign: 'start' | 'middle' | 'end',
```

Default: `middle`

#### Example with each possible values

<div class="code-example">
  <span id="label-example-11" style="display: inline-block"></span>
  <span id="label-example-21" style="display: inline-block"></span>
  <span id="label-example-31" style="display: inline-block"></span>
  <script>
    (function() {
      const cal5 = new CalHeatmap();
      cal5.paint({ domain: { type: 'hour', label: { textAlign: 'left' } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-11' });
      const cal6 = new CalHeatmap();
      cal6.paint({ domain: { type: 'hour', label: { textAlign: 'middle' } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-21' });
      const cal7 = new CalHeatmap();
      cal7.paint({ domain: { type: 'hour', label: { textAlign: 'end' } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-31' });
    })()
  </script>
</div>

{: .mt-8}

## offset

Further customize the label placement along its x and y axis

```js
offset: {
    x: number, // in pixels
    y: number, // in pixels
  },
```

{: .mt-8}

## rotate

Rotate to obtain a vertical label

```js
rotate: null | 'left' | 'right',
```

Default: `null`

#### Example with left and right

<div class="code-example">
  <span id="label-example-5" style="display: inline-block; outline: 1px dotted gray;margin-right: 10px;"></span>
  <span id="label-example-6" style="display: inline-block; outline: 1px dotted gray;"></span>
  <script>
    (function() {
      const cal5 = new CalHeatmap();
      cal5.paint({ domain: { type: 'hour', label: { position: 'left', rotate: 'left', offset: { y: -10 }, width: 20 } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-5' });
      const cal6 = new CalHeatmap();
      cal6.paint({ domain: { type: 'hour', label: { position: 'right', rotate: 'right', offset: { y: -10 }, width: 20 } }, subDomain: { type: 'minute' }, range: 1, itemSelector: '#label-example-6' });
    })()
  </script>
</div>

{: .mt-8}

## width

Width of the label, in pixel

```js
width: number,
```

Default: `100`

{: .note}
Ignored when `position` is set to `top` or `bottom`.
In these cases, the width is capped to the domain width.

#### Playground

<div class="code-example" >
  <style>
    #width-example-1 .domain-background {
      stroke: gray;
    }
  </style>
  <div id="width-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge p-3">
  <label>
    Width:
    <input type="range" min="50" max="300" value="100" class="slider" id="width-slider" >
    <span id="width-value">100</span> pixels
</label>
  <script>
      const cal = new CalHeatmap();
      let width = 100;
      cal.paint({ domain: { type: 'month', width: 10, label: { position: 'right', width: width, textAlign: 'middle' } }, subDomain: { type: 'day' } , range: 3, itemSelector: '#width-example-1'});
      d3.select("#width-slider").on("input", function() {
        cal.paint({ domain: { label: { width: +this.value } } });
        d3.select("#width-value").html(+this.value);
      });
  </script>
</div>

{: .mt-8}

## height

Height of the label, in pixel

```js
height: number,
```

Default: `25`

{: .note}
Ignored when `position` is set to `left` or `right`.
In these cases, the height is capped to the domain height.

#### Playground

<div class="code-example" >
  <style>
    #height-example-1 .domain-background {
      stroke: gray;
    }
  </style>
  <div id="height-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge p-3">
  <label>
    Height:
    <input type="range" min="0" max="50" value="25" class="slider" id="height-slider" >
    <span id="height-value">25</span> pixels
</label>
  <script>
      const cal6 = new CalHeatmap();
      let height = 20;
      cal6.paint({ domain: { type: 'month', height: 10, label: { height: height } }, subDomain: { type: 'day' } , range: 3, itemSelector: '#height-example-1'});
      d3.select("#height-slider").on("input", function() {
        cal6.paint({ domain: { label: { height: +this.value } } });
        d3.select("#height-value").html(+this.value);
      });
  </script>
</div>
