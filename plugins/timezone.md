---
layout: default
title: Timezone
nav_order: 3
parent: Plugins
---

# Timezone

This plugin add timezone support
{: .fs-6}

{: .warning}
Documention for this option is still work in progress, and is incomplete

## Install

### NPM

The plugin is built-in in the core CalHeatmap, just import the module with

```js
import Timezone from 'cal-heatmap/src/plugins/Timezone';
```

### CDN

Add the timezone plugin script and its dependencies in your `<head>`

```html
<script src="https://unpkg.com/cal-heatmap@4.0.0-beta.2/dist/plugins/Timezone.min.js"></script>
// Choose one of the following choices, depending on your need
<script src="https://momentjs.com/downloads/moment-timezone-with-data.min.js"></script>
<script src="https://momentjs.com/downloads/moment-timezone-with-data-1970-2030.js"></script>
<script src="https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.js"></script>
```

## Usage

```js
const cal = new CalHeatmap();
cal.paint({}, [[Timezone, TIMEZONE_OPTIONS]]);
```

## TimezoneOptions

```js
type TimezoneOptions = {
  timezone: string,
};
```

### timezone

A timezone identifier, as defined by [Moment-Timezone](https://momentjs.com/timezone/docs/#/using-timezones/) (ie. `UTC`, `America/Toronto`, etc ...)

Default: the user's browser local timezone.
