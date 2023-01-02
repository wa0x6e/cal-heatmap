---
layout: default
title: subDomain
nav_order: 4
parent: Options
---

# subDomain

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

## type

Defines the subDomain's type interval

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
You can add your own custom subDomain, see the [`Templates section`](/templates)

## gutter

Space between each subdomain, in pixel

```js
gutter: number,
```

Default: `2`

#### Example

<div class="code-example" >
  <div id="subdomainGutter-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge">
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

## width

Width of each subDomain cell, in pixel

```js
width: number,
```

Default: `10`

<div class="code-example" >
  <div id="width-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge">
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

## height

Height of each subDomain cell, in pixel

```js
height: number,
```

Default: `10`

<div class="code-example" >
  <div id="height-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge">
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

## radius

Radius of each subDomain cell, in pixel

```js
radius: number,
```

Default: `0`

<div class="code-example" >
  <div id="radius-example-1" style="display: inline-block; "></div>
</div>
<div class="highlighter-rouge">
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

## label

Format the subDomain's label

```js
label:
    | string
    | null
    | ((timestamp: number, value: number, element: SVGElement) => string);
```

Default: `null`

| Value      | Description                                                                                                                           | Example Value                                                                                     | Example output                         |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `string`   | Pass the string to [momentJS `format()`](https://momentjs.com/docs/#/displaying/format/), and display its result. _(not value aware)_ | `MMMM`                                                                                            | `March`                                |
| `null`     | Do not show any label                                                                                                                 | `null`                                                                                            |                                        |
| `function` | Display the function's return value. The function receives the subDomain's timestamp, value and the label's SVG Element as argument   | `` function (timestamp, value) { return `${value} items on ${new Date(date).toISOString()}`; } `` | `50 items on 2022-12-06T20:01:51.290Z` |

{: .note}
momentJS `format()` is [`locale`](/options/date.html#locale) and [`timezone`](/options/date.html#timezone) aware.

{: .note }
Depending on your chosen cell size, subDomain label may overflow

You can customize the style of the subDomain label text via css, or by
manipulating the `SVGElement` given as argument when using a `function`.

<div class="code-example" >
  <div id="subdomainlabel-example-1" style="display: inline-block; "></div>
  <script>
      const cal5 = new CalHeatmap();
      cal5.paint({ domain: { type: 'month' }, subDomain: { type: 'day', label: 'D' , width: 20, height: 20}, range: 3, itemSelector: '#subdomainlabel-example-1'});
  </script>
</div>
```js
const cal = new CalHeatmap();
cal.paint({
  domain: { type: 'month' },
  subDomain: { type: 'day', label: 'D', width: 20, height: 20 },
  range: 3
});
```

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

| Value      | Description                                                                                                                                      | Example Value                                                                                                  | Example Output |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------- |
| `string`   | A hexadecimal color code                                                                                                                         | `#000`                                                                                                         | `#000`         |
| `function` | Use the hexadecimal color code returned by the function. The function receives the subDomain's timestamp, value and background color as argument | `function (timestamp, value, backgroundColor) { return d3.hcl(backgroundColor).l > 60 ? 'black' : 'white' ; }` | `#000`         |

Using the `string` value, the same color will be applied to the whole calendar,
regardless of the subDomain's background color. Depending on your color scale,
the label color may not be visible.

The `function` will allow more fine-tuning of the label color, by using:

- a [d3-color scale](https://github.com/d3/d3-scale-chromatic)
- a range of static colors (i.e `['#fff', '#eee', '#000']`, matching the [`scale's range`](/options/scale.html))
- a custom function returning a color, depending on the background color (like the default value)
