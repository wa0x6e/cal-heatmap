---
layout: default
title: Install
nav_order: 2
---

# Installation

## CDN

Install the library and its dependencies in your page `head`.

### Dependencies

```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```

Although v7 is recommended, `d3js >= 6` is supported.

### CalHeatmap

```html
<script src="https://unpkg.com/cal-heatmap@4.0.0-beta.4/dist/cal-heatmap.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/cal-heatmap@4.0.0-beta.4/dist/cal-heatmap.css"></script>
```

## Package Manager

### Using NPM

```
npm install cal-heatmap@4.0.0-beta.4
```

Once installed, you can import the library using ES6 `import`:

```js
import CalHeatmap from 'cal-heatmap';
```
