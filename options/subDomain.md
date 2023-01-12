---
layout: default
title: subDomain
nav_order: 4
parent: Options
---

# subDomain

Specify all options related to the subDomain configuration

```js
type subDomain: {
  type: string,
  gutter: number,
  width: number,
  height: number,
  radius: number,
  label:
    | string
    | null
    | ((timestamp: number, value: number, element: SVGElement) => string);
  color?:
    | string
    | ((timestamp: number, value: number, backgroundColor: string) => string);
}
```

<hr/>

## type

SubDomain's type, representing a time unit

```js
type: string,
```

The `subDomain` should always be smaller than the `domain` type.

### Available default subDomains type

- `month`
- `week`
- `day`
- `x_day`
- `hour`
- `minute`

{: .note}
You can create and add your own custom subDomain, see the [`Templates`](/templates) section.

{: .mt-8}

## gutter

Space between each subDomain, in pixel

```js
gutter: number,
```

Default: `2`

#### Playground

<div class="code-example" >
  <div id="subdomainGutter-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge p-3">
  <label>
    Gutter:
    <input type="range" min="0" max="100" value="4" class="slider" id="gutter-slider" >
    <span id="gutter-value">4</span> pixels
</label>
  <script>
      const cal = new CalHeatmap();
      cal.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 3, itemSelector: '#subdomainGutter-example-1'});
      d3.select("#gutter-slider").on("input", function() {
        cal.paint({ subDomain: { gutter: +this.value } });
        d3.select("#gutter-value").html(+this.value);
      });
  </script>
</div>

{: .mt-8}

## width

Width of each subDomain cell, in pixel

```js
width: number,
```

Default: `10`

#### Playground

<div class="code-example" >
  <div id="width-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge p-3">
  <label>
    Width:
    <input type="range" min="2" max="50" value="10" class="slider" id="width-slider" >
    <span id="width-value">10</span> pixels
</label>
  <script>
      const cal2 = new CalHeatmap();
      cal2.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 3, itemSelector: '#width-example-1'});
      d3.select("#width-slider").on("input", function() {
        cal2.paint({ subDomain: { width: +this.value } });
        d3.select("#width-value").html(+this.value);
      });
  </script>
</div>

{: .mt-8}

## height

Height of each subDomain cell, in pixel

```js
height: number,
```

Default: `10`

#### Playground

<div class="code-example" >
  <div id="height-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge p-3">
  <label>
    Height:
    <input type="range" min="2" max="50" value="10" class="slider" id="height-slider" >
    <span id="height-value">10</span> pixels
</label>
  <script>
      const cal3 = new CalHeatmap();
      cal3.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 3, itemSelector: '#height-example-1'});
      d3.select("#height-slider").on("input", function() {
        cal3.paint({ subDomain: { height: +this.value } });
        d3.select("#height-value").html(+this.value);
      });
  </script>
</div>

{: .mt-8}

## radius

Border radius of each subDomain cell, in pixel

```js
radius: number,
```

Default: `0`

<div class="code-example" >
  <div id="radius-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge p-3">
  <label>
    Radius:
    <input type="range" min="0" max="10" value="0" class="slider" id="radius-slider" >
    <span id="radius-value">0</span> pixels
</label>
  <script>
      const cal4 = new CalHeatmap();
      cal4.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 3, itemSelector: '#radius-example-1'});
      d3.select("#radius-slider").on("input", function() {
        cal4.paint({ subDomain: { radius: +this.value } });
        d3.select("#radius-value").html(+this.value);
      });
  </script>
</div>

{: .mt-8}

## label

Label of the subDomain

```js
label:
    | string
    | null
    | ((timestamp: number, value: number, element: SVGElement) => string);
```

Default: `null`

This option accepts different value's type, see table below for usage.

| Value Type | Description                                                                                                                           | Example Value                                                                                     | Example output                         |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `string`   | Pass the string to [momentJS `format()`](https://momentjs.com/docs/#/displaying/format/), and display its result. _(not value aware)_ | `MMMM`                                                                                            | `March`                                |
| `null`     | Do not show any label                                                                                                                 | `null`                                                                                            |                                        |
| `function` | Display the function's return value. The function takes the subDomain's timestamp, value and the label's SVG Element as argument      | `` function (timestamp, value) { return `${value} items on ${new Date(date).toISOString()}`; } `` | `50 items on 2022-12-06T20:01:51.290Z` |

{: .note}
momentJS `format()` is [`locale`](/options/date.html#locale) aware.

{: .note }
Depending on your chosen cell size, subDomain label may overflow

You can customize the style of the subDomain label text via css, or by
manipulating the `SVGElement` given as argument when using a `function`.

#### Example

<div class="code-example" >
  <div id="subdomainlabel-example-1" style="display: inline-block; "></div>
  <script>
      const cal5 = new CalHeatmap();
      cal5.paint({ domain: { type: 'month' }, subDomain: { type: 'day', label: 'D' , width: 20, height: 20, color: '#000'}, range: 3, itemSelector: '#subdomainlabel-example-1'});
  </script>
</div>
```js
const cal = new CalHeatmap();
cal.paint({
  domain: { type: 'month' },
  subDomain: { type: 'day', label: 'D', width: 20, height: 20, color: '#000' },
  range: 3
});
```

{: .mt-8}

## color

Color of the subDomain's label

```js
color?:
| string
| ((timestamp: number, value: number, backgroundColor: string) => string);
```

Default:

```js
d3.hcl(backgroundColor).l > 60 ? 'black' : 'white';
```

This option accepts different value's type, see table below for usage.

| Value Type | Description                                                                                                                                   | Example Value                                                                                                  | Example Output |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------- |
| `string`   | A hexadecimal color code                                                                                                                      | `#000`                                                                                                         | `#000`         |
| `function` | Use the hexadecimal color code returned by the function. The function takes the subDomain's timestamp, value and background color as argument | `function (timestamp, value, backgroundColor) { return d3.hcl(backgroundColor).l > 60 ? 'black' : 'white' ; }` | `#000`         |

Using the `string` value, the same color will be applied to the whole calendar,
regardless of the subDomain's background color. Depending on your color scale,
the label color may not be readable.

Using a `function` will allow more fine-tuning of the label color, as you can use:

- a [d3-color scale](https://github.com/d3/d3-scale-chromatic)
- a range of static colors (i.e `['#fff', '#eee', '#000']`, matching the [`scale's range`](/options/scale.html))
- a custom function returning a color, computed from the background color (like the default value)
