---
layout: default
title: range
nav_order: 2
parent: Options
---

# range

Specify the number of domains
{: .fs-6 }

```js
range: number; // must be >= 1
```

Default: `12`

<hr />

## Usage

```js
const cal = new CalHeatmap();
cal.paint({ range: 8 });
```

#### Playground

<div class="code-example">
  <div id="range-example-1"></div>
</div>
<div class="highlighter-rouge p-3">
  <label>
    Range:
    <input type="range" min="1" max="10" value="3" class="slider" id="range-slider" >
    <span id="range-value">3</span>
</label>
  <script>
      let count = 3;
      const cal = new CalHeatmap();
      cal.paint({ range: count, itemSelector: '#range-example-1'});
      d3.select("#range-slider").on("input", function() {
        cal.paint({ range: +this.value });
        d3.select("#range-value").html(+this.value);
      });
  </script>
</div>
