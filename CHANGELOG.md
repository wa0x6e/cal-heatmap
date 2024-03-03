# Changelog

## v4.3.0 []

### BREAKING CHANGES

- [refactor] - Move all plugins to their own repositories in https://github.com/cal-heatmap/

### Fixes

- [fix] fix call signature of on(...) to allow a function with arguments (@terencehonles)
- [fix] Add non-null asserts to min/max function usage (@Uzaaft)

### Chores

- [chores] Dependencies update

## v4.2.3 [2023-05-21]

### Fixes

- [fix] Fix error when using with typescript `noUnusedParameters` options

### Chores

- [chore] Dependencies update

## v4.2.2 [2023-03-28]

### Fixes

- [fix] fix invalid dayjs locale import from nodejs

## v4.2.1 [2023-03-28]

### Fixes

- [fix] Add support for SSR

## v4.2.0 [2023-03-17]

### Features

- [feat] dataset values should accept string type
- [feat] extract DomainSubLabel into a plugin
- [feat] allow multiple instances of same plugin to co-exist
- [feat] refactor all CSS classnames, for a more consistent naming
- [feat] add defaultValue option to set a default value for missing values in dataset

### Bugfixes

- [fix] fix remaining wrong templates name, which should be migrated to snakeCase
- [fix] fix CalendarLabel missing coordinates on repaint
- [fix] fix missing dark theme style for Legend plugin

### BREAKING CHANGES

- All CSS classname have been refactor, plase update your CSS if required
- `domain.subLabel` option has been extracted to `CalendarLabel` plugin

## v4.1.0 [2023-02-28]

### Features

- [feat] add github-like day subdomain template
- [feat] add safeguard and error message when Domain/SubDomain couple is not valid

### Bugfixes

- [fix] DomainSubLabel vertical position ignoring padding and label position
- [fix] rename subDomain template, for consistency
- [fix] fix plugins export from package.json

## v4.0.0 [2023-02-27]

See all previous changelogs from v4.0.0-beta.1 though 12

## v4.0.0-beta.12 [2023-02-27]

### Features

- [feat] add legend lite plugin

### Chores

- [chore] CSS file is not exported from the package
- [refactor] extract variables to constant file
- [refactor] improve typescript definition

## v4.0.0-beta.11 [2023-02-25]

### Features

- [feat] data source URI now accepts dayjs format token (BREAKING CHANGES)
- [feat] add support for RTL

### Bugfixes

- [fix] fix missing data when subDomain range is overflow the domain range
- [fix] fix cells stroke cut off on calendar edge
- [fix] week subDomain where first and last week not assigned to correct month
- [fix] scale color and opacity should always be clamped to the domain

### Chores

- Improve typescript d.ts

## v4.0.0-beta.10 [2023-02-19]

### Bugfixes

- [fix] fix en locale always loaded instead of user defined custom locale

## v4.0.0-beta.9 [2023-02-18]

### Features

- [feat] dark/Light mode option can be toggled via an option

## v4.0.0-beta.8 [2023-02-18]

## Bugfixes

- [fix] fix legend UI, where dimension where bigger than expected
- [fix] remove legend background to support dark/light mode

### Features

- [feat] add support for opacity scale

## v4.0.0-beta.7 [2023-02-15]

### Bugfixes

- [fix] fix dataset shifted by one day due to timezone

### Chores

- Dependencies update

## v4.0.0-beta.6 [2023-02-14]

### Features

- [feat] add API to extend/inject custom dayjs locale

## v4.0.0-beta.5 [2023-02-02]

### Bugfixes

- [fix] keep default text color when subDomain do not have value
- [fix] fix ignored subDomain.color option

## Features

- [feat] add CSS support for dark theme

### Chores

- [tests] Refactor tests to test only against the minimum browser version

## v4.0.0-beta.4 [2023-01-21]

### BREAKING CHANGES

#### Replace momentjs by dayjs

Momentjs have been replaced by the more lighter day.js, slimming down
the bundle by 75%. Timezone support is now a built-in function, instead
of a plugin.

### Refactor/Performance

- Some refactoring, so that `d3-array` is not a required depency anymore
- Avoid redundant calls to dayjs initializer
- Do not process data irrelevant to the calendar current time window

### Features

- Locales will be loaded asynchronously by the calendar itself
- Add new `extendDayjs()` method to extend dayjs with a plugin, as it's built-in with the minimum number of plugins

This migration required further tests, to ensure listed browser support is met.

### Pending issues

- Dayjs is having some performance issues when using the timezone plugin (https://github.com/iamkun/dayjs/pull/2019).

## v4.0.0-beta.3 [2023-01-14]

### Bug Fixes

- [fix] Fix #293 Tooltip default date should use same timezone as calendar
- [fix] Fix #297 Ignore date.min and date.max when invalid

### Features

- Template can now inherit from another template via `parent` property

### Chores

- [chores] Dependencies update
- [chores] Add more typescript
- [tests] Refactor JSDom tests to be compatible with real browsers
- [tests] Tests with various browsers (version/os/device), via browserstack, see browser-support.md for browsers matrix

## v4.0.0-beta.2 [2023-01-05]

### Bug Fixes

- [fix] Fix #286 Uncaught TypeError: Cannot set properties of undefined (setting 'range')

## v4.0.0-beta.1 [2023-01-02]

V4 is a complete rewrite from the ground up.
See the [Migration guide](https://cal-heatmap.com/migrate_from_v3.html) if migrating from v3.x

### Features

- [new] New SubDomainTemplate module, to create your own custom subDomains
- [new] New plugin system, to extend calendar function
- [new] New opt-in Timezone plugin, to add timezone support (depends on MomentJS-Timezone)
- [new] Legend has been extracted as an opt-in plugin
- [new] Tooltip has been extracted as an opt-in plugin (depends on @popperJS)

- [new] Fix #249 Day label
- [new] Fix #111 (Request) Reverse domain order
- [new] Fix #241 Any way to determine size
- [new] Fix #162/#163 added onResize event
- [new] Fix #265 Accessing click event from onClick
- [new] Fix #164 Customize interval
- [new] Fix #194 Add `afterUpdate()` callback
- [new] Fix #234 Pass custom headers to XHR request
- [new] Fix #216 Question about Label Values - Why not aware of data?

### Bug Fixes

- [fix] Fix #229 Calling `update()` without arguments refresh the calendar with original data
- [fix] Fix #154 Tooltip does not align
- [fix] Fix #158 Dynamically changing properties set during init()
- [fix] Fix #134 Navigation Issue with Next and previous functionality
- [fix] Fix #189 Tooltips appearing in the wrong place
- [fix] Fix #131 tooltip contained by {overflow:hidden / auto} not fully displayed
- [fix] Fix #266 interpolateHcl produces colors that are hard to understand
- [fix] Fix #82 Add callbacks for mouseover and mouseout
- [fix] Fix #52 Parsing data leads to undefined index
- [fix] Fix #171 cal.previous not working properly
- [fix] Fix #95 Calendar start and end date are not correctly generated
- [fix] Fix #169 added a callback when showing tooltips to customize contents
- [fix] Fix #91 Add 'middle' value for legend
- [fix] Fix #186 keep styling on q{n} selectors when value transition
- [fix] Fix #257 displaying value/data from json
- [fix] Fix #115 no date past 08
- [fix] Fix #220 Moved format function in library implementation
- [fix] Fix #87 Fix Year > Weeks aligning issue
- [fix] Fix #223 Fix an issue the max color becomes black when legend starts with 0
- [fix] Fix #190 Ajax requests sent twice
- [fix] Fix #90 Fix Legend colors/values not working properly
- [fix] Fix #100 Responsive cal-heatmap
- [fix] Fix #238 Aggregated Day/Week view?
- [fix] Fix #260 Cross off date possible with two subDomainTextFormat?
- [fix] Fix #176 Responsive view for Cal-heatmap chart
- [fix] Fix #127 Legend range labels display constantly - not hover dependent (feature request)

### Chores

- Code base rewritten in typescript
- Code base rewritten in ES6 modules
- Build tool changed from Grunt to Rollup
- EMS/UMD bundle are now handled by a rollup plugin
- Code standard have been updated
- Build files are now located in `dist` folder, and not versioned anymore

### BREAKING CHANGES

- [change] Update D3js library to v7 (latest)
- [new] MomentJS is now a required dependency
- [change] All callbacks methods have been removed, and replaced by a node-like EventListener
- [change] The whole `options` object given to `init()` has been refactored, and all options have been renamed for consistency
- [change] The opinionated expected data format have been removed, and now expect any array of object, like d3js
- [change] `init()` method has been renamed to `paint()`
- [change] As `paint()` can now be called multiple times to update the options dynamically, a couple of redundant methods have been removed
- [removed] All CSS classes used for data coloring have been removed
- [removed] All the `x_` subDomains variants aside from `x_day` have been removed

## v3.6.2 [2016-10-09]

- [fix] Fix #217 Month domain and week subdomain not working when week start set to sunday

> From now, 3.x branch will only include bugfixes, all new features will go to 4.x branch

## v3.6.1 [2016-08-30]

- [fix] Fix #207 Locking d3.js version to v3.x

## v3.6.0 [2016-04-24]

- [fix] Fix #183 Fix/add now without highlight

## v3.5.4 [2015-08-24]

- [fix] Update all references to github account new username

## v3.5.3 [2015-07-23]

- [fix] Fix #156 Remove trailing comma in object literal
- [fix] Fix #161 `domainDynamicDimension` not working with x_week subdomain

## v3.5.2 [2015-02-05]

- [fix] Fix #74: Let `empty` target cells with no data

## v3.5.1 [2015-01-19]

- [fix] Fix #97 Make "class" of all elements more dedicated
- [fix] Fix #93 Tooltip position due to legendOffset and domainLabel
- [fix] Fix #89 Add a `.future` class to future subdomain cells
- [fix] Fix false error output when no callback passed to `destroy()`

## v3.5.0 [2014-11-12]

- [fix] Fix #84 Fixing highlighting for week subdomain (Dominic Barnes)
- [new] Fix #85 Adding some CommonJS as well as Component support (Dominic Barnes)
- [fix] Fix #107 Fix connectors for week/month/year (Andreas Jaggi)
- [change] Use NPM to install jquery and qunit dev dependencies

## v3.4.0 [2014-02-02]

- [fix] Fix #57 display data values in subdomain

## v3.3.12 [2014-01-31]

- [fix] Fix #69 the 'now' and 'highlight' classes are not applied to subdomain text

## v3.3.11 [2014-01-26]

- [new] Only consider entries less than now (in the subdomain) as zero, when considering null as zero (Peter Schwarz)
- [change] Remove sourcemaps comment in js

## v3.3.10 [2013-12-03]

- [fix] Fix #58 Legend colors are shifted
- [fix] Fix #62 Bug when calendar container already have a style attribute

## v3.3.9 [2013-11-24]

- [new] Fix hidden day cells for leap year in some domain/subDomainc configuration
- [fix] Allow other data type to be passed to `data`
- [fix] Fix DST for time change occuring other than midnight

## v3.3.8 [2013-10-31]

- [new] Add `rewind()` method to navigate the calendar back to the starting date
- [change] Code improvement and cleaning

## v3.3.7 [2013-10-29]

- [fix] Fix `getSVG()` not returning all needed classes

## v3.3.6 [2013-10-28]

- [new] Add `destroy()` method

## v3.3.5 [2013-10-16]

- [new] Add `highlight()` method to change highlighted date after calendar initialization
- [new] CSV files works out-of-the-box, as long as the first 2 columns are the timestamp and value.
- [change] Fatal errors throws errors intead of a simply console.log()
- [fix] Fix bug when trying to load plain text file as datasource
- More test and code improvement

## v3.3.4 [2013-10-10]

- [fix] Fix #47: Increase d3 version dependency

## v3.3.3 [2013-10-09]

- [new] Add tooltip on date hover

## v3.3.2 [2013-10-08]

- [Fix] Fix #45: Fix loss of htmlClass (e.g. highlight) for graph rects with zero scale

## v3.3.1 [2013-10-07]

- [fix] Fix broken `afterLoadPreviousDomain` callback

## v3.3.0 [2013-10-07]

- [new] Add `jumpTo()` method to scroll the calendar to the specified date
- [new] `setLegend()` will redraw the legend if some of its settings (cellSize/padding, position, etc ...) were changed
- [new] Add `legendColors` setting, to dynamically control the heatmap colors
- [new] Add `showLegend()` and `removeLegend()` methods
- [new] `next()` and `previous()` now takes an argument, to scroll multiple domains at once
- [new] Add `legendOrientation` setting
- [new] Add `rowLimit` and `colLimit` setting to control the number of columns and rows in a domain
- [fix] Fix #37: two days get summed
- [change] All invalid data (not a number) will be ignored
- [change] `setLegend()` now takes a legend threshold array as first argument, and a color array as second argument

## v3.2.1 [2013-09-17]

- [fix] Fix #35: Can't load new domain with `next()` when the new domain's timestamp contains more character

## v3.2.0 [2013-09-12]

- [fix] Fix #33: domain browsing is incrementing the calendar's value when data is a json object
- [fix] Fix #34: Only the newly appended domain can be manipulated by `update()` after calling `next()` or `previous()`
- [new] Add `setLegend()` method to redefine legend threshold

## v3.1.0 [2013-08-08]

- [new] Add `update()` method, to update calendar data.
- [improvement] Use d3.js internal methods to bind data to subDomains

## v3.0.9 [2013-08-01]

- [new] Fix #26: add `considerMissingDataAsZero` option to consider missing value as zero

## v3.0.8 [2013-08-01]

- [new] Add `minDate`, `startDate` to limit domain navigation beyond certain dates
- [new] Add `onMaxDomainReached()` and `onMinDomainReached()` events, triggered when navigation is hitting the lower/upper domain limit
- [change] `next()` and `previous()` will now always return `true`, as long as there is more domain to load

## v3.0.7 [2013-07-24]

- [fix] Fix domain month class (`m_x`) beginning at `m_0` insted of `m_1`
- [new] Add new domain class: `dy_x` for the day of the week

## v3.0.6 [2013-07-24]

- [fix] Bring back the dynamic domain width/height
- [fix] Fix `day` subdomains displaying garbage when using domain other than `month`
- [new] Add `domainDynamicDimension` to disable dynamic domain width/height (default: true)

## v3.0.5 [2013-07-23]

- [fix] Fix domain month when using day subDomain

## v3.0.4 [2013-07-20]

- [Fix] Fix calendar crashing in IE when using d3.js >= v3.2.4
- [Fix] Fix overflow when adding/removing domains dynamically in IE

## v3.0.3 [2013-07-19]

- [fix] Fix `subDomainTitleFormat` not applying to subDomain with data

## v3.0.2 [2013-07-18]

- [fix] Fix `onComplete()` event not firing when loading data from a json object in `data` option

## v3.0.1 [2013-07-18]

- [fix] Add missing files

## v3.0.0 [2013-07-18]

> v3 is a major release, a lot of changes are not backward compatible with v2.
> See the [migration guide](https://cal-heatmap.com/v3/index.html#migrating-from-2x) for update process.

- [new] Add Vertical orientation
- [new] Add option to display a date inside subDomain cells
- [new] Replace `id` with `itemSelector`, and accept any kind of CSS3 selector string
- [new] subDomain highlighting can highlight more that today
- [new] domain highlighting
- [new] `nextSelector` and `previousSelector` to attach domain navigation to any DOM Element
- [new] Add `tsv` to accepted dataType
- [new] More control about legend position and size
- [new] More control about domain label position and size
- [new] Label rotation, to display text vertically
- [new] `getSVG()` method to export SVG code

## v2.2.1 [2013-06-19]

- [new] Highlight today's rectangle (only available when subdomain is equal to "day")
- [fix] Fix plurals title (Issue #14)

## v2.2.0 [2013-05-05]

- [new] Add `afterLoadData` callback, to apply your own conversion function when the API don't return data in the expected format
- [new] Add `dataType` property to specify data source format type. Can use json (default), csv or txt.
- [fix] Fix wrong number of minutes when using minutes subdomain with a week domain

## v2.1.6 [2013-04-17]

- [new] Add `startWeekOnMonday` to choose whether to start the week on Monday or Sunday

## v2.1.5 [2013-04-17]

- [new] `x_day` subdomain to display days horizontally, grouped by week
- [new] `cellradius` property to apply rounded corner to subdomain cell

## v2.1.4 [2013-04-16]

[enhancement] More faster tests

## v2.1.3 [2013-04-09]

- [fix#6] Can now pass a function to date formatter, to format the date using an external library like moment.js

## v2.1.2 [2013-04-02]

- [fix#9] null values not interpreted as "empty" when rendering the title

## v2.1.1 [2013-03-28]

- [new] onComplete callback

## v2.1.0 [2013-03-28]

- [new#5] AfterLoad callback, called when the calendar is fully drawn, but not filled with datas yet
- [new#6] Add options to customize all text
- [fix] Handle not valid callback

> See [documentation](https://cal-heatmap.com) for i18n usage

## v2.0.3 [2013-03-21]

- [fix#8] Support for null values
- [fix#7] Wrong color for the last interval values

## v2.0.2 [2013-03-20]

- [fix] Floating number does not display in tooltip
- [enhancement] Change cursor to pointer on subdomain hover if it's associated to an onClick event

## v2.0.1 [2013-03-07]

- [fix] Fix domain positioning on Firefox

## v2.0.0 [2013-03-06]

- [new] Can know browse the calendar, by setting the new `browsing` property to `true`
- [new] Add animation when displaying the scale
- [change] Rename `scales` property to `scale`

## v1.1.1 [2013-02-28]

- [fix] Fix displaying week subdomain from a year domain
- [new] Add test code coverage in grunt

## v1.1.0 [2013-02-27]

- [new] Add Bower and Jam support
- [new] Change `uri` property to `data`. It can now accepts a file path to a JSON file, directly a JSON object, or a string template.

> The string template is usually a dynamic url to an API, like `api.com/get?start=xxx&end=yyy`, where _xxx_ and _yyy_ are respectively the first and last date of the calendar. You can use tokens to dynamically insert the calendar first and last date in the url. See [documentation](https://cal-heatmap.com) for accepted tokens.
> **Example** : `api?start={{t:start}}&end={{d:end}}` will fetch `api?start=1362006000&end=2013-02-27T23:00:00.000Z`

## v1.0.1 [2013-02-26]

- [new] Add AMD support

## v1.0.0 [2013-02-25]

- First release
