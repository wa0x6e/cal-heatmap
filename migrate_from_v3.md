---
layout: default
title: Migrating from 3.x
nav_order: 25
---

# Migrating from 3.x

The current v4 release is rewritten from the ground up, and have a _lot of major breaking changes_.
{: .fs-6}

The last 3.x release was from October 2016,
and was built on top of a vanilla JS codebase from 2012.

After 7 years, the javascript scene has seen some changes,
such as the maturity of ECMAScript, babel, and other various bundler tools,
as well as newer versions of the underlying d3.js libraries used by Cal-Heatmap.

Aside from some bugfixes and new features, the v4 branch has been rewritten
from the ground up as ES modules,
and transpiled to support older browsers.
This direction allows an easier code maintainability and readability
than the previous single file 3k lines codebase.

Most of the breaking changes come from the settings renaming, and methods removal.

## Major changes

- All functions using callbacks have been migrated to use a Promise instead
- Code base rewritten in Typescript, and ESnext (babel transpiled for older browser support)
- New plugin system to extend/modify calendar capabilities
- New Template system to use user-created calendar layout
- All dates handling delegated to dayjs
- Bundles for ESM, UMD
- Support for D3.js v6 and v7

## Default settings update

- `animationDuration` has been decreased from 500ms to 200ms.

## New settings

### `domain.sort`

Control the sort order of the domains

### `date.locale`

Set a custom date locale. Default to `en`

### `data.x`

Instruct the calendar how to extract the date from your dataset

### `data.y`

Instruct the calendar how to extract the value from your dataset

### `data.groupY`

Instruct the calendar how to aggregate values from same time range

### `data.subLabel`

Still experimental option, add a customizable secondary label to domain

### `subDomain.color`

Dynamically color the subDomain's label

### `scale`

New option, grouping previous functions from `legend` and `legendColors`, to control how to colorize your dataset

## Renamed/moved settings

### `label.align`

Renamed to `label.textAlign`.

### `label`

Moved inside the `domain` namespace.

### `date`

`date` is now a namespace, grouping all date related options.
Old `date` option has been moved to `date.start`

### `minDate`

Moved to `date.min`

### `maxDate`

Moved to `date.max`

### `highlight`

Moved to `date.highlight`

### `data`

`data` is now a namespace, grouping all data related options.
Old `data` option has been moved to `data.source`

### `dataType`

Moved to `data.type`

### `domain`

`domain` is now a namespace, grouping all domain related options.
Old `doamin` option has been moved to `subDomain.type`

### `domainGutter`

Moved to `domain.gutter`

### `domainMargin`

Moved to `domain.padding`

### `domainDynamicDimension`

Moved to `domain.dynamicDimension`

### `domainLabelFormat`

Moved to `domain.label`

### `subDomain`

`subDomain` is now a namespace, grouping all subDomain related options.
Old `subDomain` option has been moved to `subDomain.type`

### `cellSize`

Moved to `subDomain.width` and `subDomain.height`

### `cellRadius`

Moved to `subDomain.radius`

### `cellPadding`

Moved to `subDomain.gutter`

### `subDomainTextFormat`

Moved to `subDomain.label`

## Removed settings

### `weekStartOnMonday`

Use a custom `date.locale`, or a custom Template.

### `legend`, `displayLegend`, `legendCellSize`, `legendCellPadding`, `legendCellMargin`, `legendVerticalPosition`, `legendHorizontalPosition`, `legendOrientation`, `legendTitleFormat`

Removed, migrated to [Legend](/plugins/Legend) plugin

### `legendColors`

Moved to a new option inside `scale`.

### `subDomainDateFormat`, `subDomainTitleFormat`, `itemName`

Removed, use Tooltip `text`

### `tooltip`

Removed, migrated to [Tooltip](/plugins/tooltip.html) plugin.

### `afterLoadData`

CalHeatmap is not expecting a strict opinionated data structure anymore,
and accept an array of object, just like d3.js. See `data.x`, `data.y` and `data.groupY`

`colLimit`, `rowLimit`

To customize the layout of the subDomains, a new [`Template`](/templates.html) system has been introduced

`nextSelector`, `previousSelector`

The same objective can be achieved by adding an `onClick()` event on
your desired DOM Element, and call `next()` or `previous()` on the calendar instance.

`considerMissingDataAsZero`

Data are treated as they are, you can preprocess/transform them using `data.y` and `data,.groupY` options.

`itemNamespace`

Obsolete, was only used internally to namespace the `nextSelector` and `previousSelector` onclick events.

## New methods

- `on(eventName, callback)` has been added, to replace all old callback functions.

See [Events](/events.html) for the complete list of events

### `afterLoad` and `onComplete` removed

These events are now obsolete, as all methods now return a promise.

## Renamed methods

- `init(options)` renamed to `paint(options)`. This method can now be called multiple times with new options, and will update the calendar dynamically, instead of redrawing it from scratch.
- `update(data, afterLoad, updateMode)` renamed to `fill(data)`, to reflect that it's for updating data only, and not the options. It now accepts only `data` as its only argument, all other arguments can be set via `paint()`
- `destroy(callback)` do not take a callback argument anymore, and returns a Promise.

## Removed methods

### `rewind()`

The same objective can be achieved by calling `jumpTo()` with your initial start date on the calendar instance.

### `showLegend()`, `removeLegend()`, `setLegend()`

The same objective can be achieved by calling `paint({}, [[Legend, LEGEND_OPTIONS]])` on the calendar instance.

### `highlight`

The same objective can be achieved by calling `paint({ date: { highlight: [YOUR_DATES] } })` on the calendar instance.

### `getSVG`

Delegated to a plugin

## Over changes

- All the CSS classes used for data coloring have been removed. The `scale` option allow a more precise color customization.
- All the `x_` subDomains variants aside from `x_day` have been removed. You can re-created them with a custom template.
- The mouse cursor do not change to `pointer` when hovering on a subDomain cell automatically when there is an `onClick` event registered, since there is no reliable way to detect if an onClick listener is registered anymore.
- Test suite migrated to Jest, and start testing on browserstack against a matrix of browsers.
