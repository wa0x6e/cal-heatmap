---
layout: default
title: scale
nav_order: 47
parent: Options
---

# scale

Control your data colors
{: .fs-6}

{: .warning}
Documention for this option is still work in progress, and is incomplete

```js
type scaleOptions = {
  as: 'color' | 'opacity',
  type: 'threshold',
  domain: number[],
  scheme: string,
  range: string[] | d3-scale-chromatic
};
```

## as

```js
as: 'color' | 'opacity',
```

## type

```js
type: 'threshold',
```

## domain

```js
domain: number[],
```

## scheme

Set a color scheme.

```js
scheme: string,
```

Support all schemes from [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic).
Just use any scheme name without the `scheme` prefix.

{: .note}
`range`, which allow more advanced scheme customization, will take precedence if set.

## range

Define a range of colors, instead of using one the predefined `scheme`.

```js
range: string[] | d3-scale-chromatic
```

Accepts an array of colors, a color scheme, or an color interpolator.
