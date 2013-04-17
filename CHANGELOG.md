# Changelog

## v2.1.6 [2013-04-17]

* [new] Add `startWeekOnMonday` to choose whether to start the week on Monday or Sunday

## v2.1.5 [2013-04-17]

* [new] `x_day` subdomain to display days horizontally, grouped by week
* [new] `cellradius` property to apply rounded corner to subdomain cell

## v2.1.4 [2013-04-16]

[enhancement] More faster tests 

## v2.1.3 [2013-04-09]
 
* [fix#6] Can now pass a function to date formatter, to format the date using an external library like moment.js

## v2.1.2 [2013-04-02]
 
* [fix#9] null values not interpreted as "empty" when rendering the title

## v2.1.1 [2013-03-28]

* [new] onComplete callback

## v2.1.0 [2013-03-28]

* [new#5] AfterLoad callback, called when the calendar is fully drawn, but not filled with datas yet
* [new#6] Add options to customize all text
* [fix] Handle not valid callback

> See [documentation](http://kamisama.github.com/cal-heatmap/) for i18n usage


## v2.0.3 [2013-03-21]

* [fix#8] Support for null values
* [fix#7] Wrong color for the last interval values

## v2.0.2 [2013-03-20]

* [fix] Floating number does not display in tooltip
* [enhancement] Change cursor to pointer on subdomain hover if it's associated to an onClick event

## v2.0.1 [2013-03-07]

* [fix] Fix domain positioning on Firefox

## v2.0.0 [2013-03-06]

* [new] Can know browse the calendar, by setting the new `browsing` property to `true`
* [new] Add animation when displaying the scale
* [change] Rename `scales` property to `scale`

## v1.1.1 [2013-02-28]

* [fix] Fix displaying week subdomain from a year domain
* [new] Add test code coverage in grunt

## v1.1.0 [2013-02-27]

* [new] Add Bower and Jam support
* [new] Change `uri` property to `data`. It can now accepts a file path to a JSON file, directly a JSON object, or a string template.

> The string template is usually a dynamic url to an API, like `api.com/get?start=xxx&end=yyy`, where *xxx* and *yyy* are respectively the first and last date of the calendar. You can use tokens to dynamically insert the calendar first and last date in the url. See [documentation](http://kamisama.github.com/cal-heatmap/) for accepted tokens.  
> **Example** : `api?start={{t:start}}&end={{d:end}}` will fetch `api?start=1362006000&end=2013-02-27T23:00:00.000Z`


## v1.0.1 [2013-02-26]

* [new] Add AMD support

## v1.0.0 [2013-02-25]

* First release