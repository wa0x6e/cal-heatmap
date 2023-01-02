---
layout: default
title: Migrating from 3.x
nav_order: 20
---

# Migrating from 3.x

{: .warning}
Documention for this option is still work in progress, and is incomplete

The current v4 release is rewritten from the ground up, and have a _lot of major breaking changes_.

The last release of the 3.x version was released on October 2016,
and was built on top of a vanilla JS codebase from 2012.
After 7 years, the javascript scene has seen some changes,
such as the maturity of ECMAScript, babel, and other various bundler tools,
as well as newer versions of the underlying d3.js libraries used by Cal-Heatmap.

Aside from the bugfixes and new features, the v4 branch has been rewritten
from the ground up as ES modules,
and transpiled to support older browsers.
This direction allows an easier code maintainability and readability
than the previous single file 3k lines codebase.

Most of the breaking changes come from the settings renaming, and methods removal.

## Default settings update

- `animationDuration` has been decreased from 500ms to 200ms.

## New settings

### `domain.sort`

Control the sort order of the domains

### `date.locale`

Set a custom momentJS locale. Default to `en`

### `data.x`

### `data.y`

### `data.groupY`

### `subDomain.color`

Dynamically color the subDomain's label

### `scale`

## Renamed/moved settings

### `legend`

`legend` is now a namespace, grouping all the settings related to the legend.
Data color definition has been moved to `scale`

### `displayLegend`

`displayLegend` has been renamed to just `show`, and is nested inside `legend`

### `label.align`

Renamed to `label.textAlign`.

### `label`

Moved inside the `domain` namespace.

### `date`

`date` is now a namespace, grouping all date related options.
Date definition has been moved to `date.start`

### `minDate`

Moved to `date.min`

### `maxDate`

Moved to `date.max`

### `highlight`

Moved to `date.highlight`

### `data`

`data` is now a namespace, grouping all data related options.
Data source definition has been moved to `data.source`

### `dataType`

Moved to `data.type`

### `domain`

`domain` is now a namespace, grouping all domain related options.
SubDomain type definition has been moved to `subDomain.type`

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
Domain type definition has been moved to `domain.type`

### `cellSize`

Moved to `subDomain.width` and `subDomain.height`

### `cellRadius`

Moved to `subDomain.radius`

### `cellPadding`

Moved to `subDomain.gutter`

### `subDomainTextFormat`

Moved to `subDomain.label`

### `subDomainTitleFormat`

Moved to `subDomain.title`

## Removed settings

### `weekStartOnMonday`

Use a custom `date.locale`, or a custom subDomain Template.

### `legendCellSize`

Use the new `legend.height` to control the height of the entire legend element.

### `legendCellPadding`

Legend does not have a cell concept anymore, as it can be linear.

### `legendCellMargin`, `legendVerticalPosition`, `legendHorizontalPosition`, `legendOrientation`

To control spacing and other styling, render the legend inside your desired DOM Element,
and style it with CSS.

### `legendColors`

See `scale` instead.

### `legendTitleFormat`

The title concept has been removed, legend is now showing ticks by default

### `subDomainDateFormat` and `itemName`

Removed, use `domain.title` directly.

### `tooltip`

Removed, migrated to [Tooltip](/plugins/tooltip.html) plugin.

### `afterLoadData`

CalHeatmap is not expecting a strict opinionated data structure anymore,
and accept an array of object, just like d3.js

`colLimit`, `rowLimit`

To customize the layout of the subDomains, a new [`subDomainTemplate`](/templates.html) has been introduced

`nextSelector`, `previousSelector`

The same objective can be achieved by adding an `onClick()` event on
your desired DOM Element, and call `next()` or `previous()` on your calendar instance.

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
- `destroy(callback)` do not any argument anymore, and returns a Promise.

## Removed methods

### `rewind()`

The same objective can be achieved by calling `jumpTo()` with your initial start date on your calendar instance.

### `showLegend()`

The same objective can achieved by calling `paint({ legend: { show: true } })` on your calendar instance.

### `removeLegend()`

The same objective can achieved by calling `paint({ legend: { show: false } })` on your calendar instance.

### `setLegend()`

The same objective can be achieved by calling `paint({ legend: { YOUR_NEW_OPTIONS } })` on your calendar instance.

### `highlight`

The same objective can be achieved by calling `paint({ date: { highlight: [YOUR_DATES] } })` on your calendar instance.

### `getSVG`

Delegated to a plugin

## Over changes

- All the CSS classes used for data coloring have been removed. The `scale` option allow a more precise color customization.
- All the `x_` subDomains variants aside from `x_day` have been removed. You can re-created them with a custom subDomain template.
- All functions using callbacks have been migrated to use Promise
- Code base rewritten in Typescript
- The mouse cursor do not change to `pointer` when hovering on a subDomain cell automatically when there is an `onClick` event registered, since there is no reliable way to detect the onClick event anymore.
