---
layout: default
title: Timezone
nav_order: 3
parent: Plugins
---

# Timezone

This plugin adds timezone support
{: .fs-6}

## Install

### NPM

The plugin is built-in in the core CalHeatmap, just import the module with

```js
import { Timezone } from 'cal-heatmap';
```

### CDN

Add the timezone plugin script and its dependencies in your page's `<head>`

```html
<script src="https://unpkg.com/cal-heatmap@4.0.0-beta.3/dist/plugins/Timezone.min.js"></script>
<script src="https://momentjs.com/downloads/moment.min.js"></script>
// Choose one of the following choices, depending on your need
<script src="https://momentjs.com/downloads/moment-timezone-with-data.min.js"></script>
<script src="https://momentjs.com/downloads/moment-timezone-with-data-1970-2030.js"></script>
<script src="https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.js"></script>
```

<hr/>

## Usage

```js
const cal = new CalHeatmap();
cal.paint({}, [[Timezone, TIMEZONE_OPTIONS]]);
```

## TimezoneOptions

```js
interface TimezoneOptions {
  moment?: any;
  timezone?: string;
}
```

{:. mt-8}

### timezone

A timezone identifier, as defined by [Moment-Timezone](https://momentjs.com/timezone/docs/#/using-timezones/) (ie. `UTC`, `America/Toronto`, etc ...)

Default: the user's browser local timezone.

#### Example

```js
const cal = new CalHeatmap();
cal.paint({}, [[Timezone, { timezone: 'Europe/Paris' }]]);
```

{:. mt-8}

### moment

A momentJS object

Default: `window.moment`

{: .note}
Use if you want the calendar to not use the global momentjs object,
or on nodejs environment, where `window` is not defined.
