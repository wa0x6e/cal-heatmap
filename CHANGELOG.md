# Changelog

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