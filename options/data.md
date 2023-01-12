---
layout: default
title: data
parent: Options
nav_order: 6
---

# data

{: .fs-6}
Specify how to fetch and process the data used to fill the calendar

```js
type DataRecord = Record<string, string | number>;
type DataGroupType = 'sum' | 'count' | 'min' | 'max' | 'median';

type DataOptions = {
  source: string | DataRecord[],
  type: 'json' | 'csv' | 'tsv' | 'txt',
  requestInit: object,
  x: string | ((datum: DataRecord) => number),
  y: string | ((datum: DataRecord) => number),
  groupY: DataGroupType | ((values: number[]) => number),
};
```

The calendar is expecting an array of objects as input.  
There is no expected pre-defined structure for the object,
but it must at least have one or more property for the date,
and another one for the value.

#### Example #1

```js
[
  { date: '2012-01-01', value: 3 },
  { date: '2012-01-02', value: 6 },
  ...
];
```

#### Example #2

```js
[
  { t: 1673388319933, p: 3, v: 58 },
  { t: 1673388319934, p: 6, v: 1 },
  ...
];
```

#### Example #2

```js
[
  { year: 2020, month: 1, day: 1, temp: 38 },
  ...
];
```

More options are available below to instruct the calendar on
how to fetch, read and extract the date and value from your dataset.

<hr/>

## source

Data used to populate the calendar.

```js
source: string | DataRecord[],
```

There are 2 ways to pass your data to the calendar:

### Pass your data directly

```js
const data = [
  { date: '2012-01-01', value: 3 },
  { date: '2012-01-02', value: 6 },
];

const cal = new CalHeatmap();
cal.paint({
  data: { source: data },
});
```

### Instruct the calendar to fetch it

A `string` value will be interpreted as an url, and the data
will be retrieved via a `GET` request.

```js
const cal = new CalHeatmap();
cal.paint({
  data: { source: 'https://your-api.com/data.json' },
});
```

Some tokens are available to customize your url,
in order to limit the data time range from your remote source.

| Token       | Description                                                                                                                  | Example output             |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------- |
| `{t:start}` | Timestamp (in seconds)                                                                                                       | `1673388319`               |
| `{t:end}`   | Timestamp (in seconds)                                                                                                       | `1673388319`               |
| `{d:start}` | [ISO 8601 formatted Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) | `2011-10-05T14:48:00.000Z` |
| `{d:end}`   | [ISO 8601 formatted Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) | `2011-10-05T14:48:00.000Z` |

- `start` refers to the start of the first subDomain of the calendar
- `end` refers to the end of the last subDomain of the calendar

The tokens' value will dynamically update on [navigation](/methods/navigation).

#### Example usage

```js
const cal = new CalHeatmap();
cal.paint({
  data: { source: 'https://your-api.com/data?start={t:start}&end{t:end}' },
});
```

If the remote source is behind authentication, or requires additional request
customization, see [requestInit](#requestinit).

## type

Parser used to interpret the data returned by your url source.

```js
type: 'json' | 'csv' | 'tsv' | 'txt',
```

The parser will interpret the data, and convert it to an array of objects.

Default: `json`

{: .note}
This option is used only when the `source` is an url.

## requestInit

Additional [requestInit](https://fetch.spec.whatwg.org/#requestinit) options, send along your data request.

[d3-fetch](https://github.com/d3/d3-fetch) is used under the hood to handle all network requests. See their documentation for further information and usage.

Default: `{}`

{: .note}
This option is used only when the `source` is an url.

## x

Property name of the date, or a function returning a timestamp.  
Instruct the calendar how to extract the _date_ property from your data.

```js
x: string | ((datum: DataRecord) => number),
```

You can either pass a:

- `string`: key name of the property holding the date, in your datum object. The date will be parsed using [`Date.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date). Ensure that
  the date format is ISO 8601 compliant.
- `function`: function taking the datum as argument, and should return a timestamp

#### Example using a STRING

```js
var data = [{ column1: '2012-01-01', column2: 3 }];

cal.paint({
  data: { source: data, x: 'column1' },
});
```

#### Example using a FUNCTION

```js
var data = [{ column1: '2012-01-01', column2: 3 }];

cal.paint({
  data: {
    source: data,
    x: datum => {
      return +new Date(datum['column1']);
    },
  },
});
```

#### Example using a FUNCTION

```js
var data = [{ year: 2020, month: 1, value: 3 }];

cal.paint({
  data: {
    source: data,
    x: datum => {
      return +new Date(datum['year'], datum['month'] - 1, 1);
    },
  },
});
```

## y

Property name of the the value, or a function returning the value.  
Instruct the calendar how to extract the _value_ property from your data.

```js
y: string | ((datum: DataRecord) => number),
```

You can either pass a:

- `string`: key name of the property holding the value, in your datum object. The value should be a number.
- `function`: function taking the datum as argument, and should return the value, as a number.

#### Example using a STRING

```js
var data = [{ column1: '2012-01-01', column2: 3 }];

cal.paint({
  data: { source: data, y: 'column2' },
});
```

#### Example using a FUNCTION

```js
var data = [{ date: '2012-01-01', high: '30', low: '16' }];

cal.paint({
  data: {
    source: data,
    y: datum => {
      // You can use the function to pre-process your values
      return +datum['high'] + +datum['low']) / 2;
    },
  },
});
```

## groupY

Aggregate function, to group all values from the same subDomain.

```js
type DataGroupType = 'sum' | 'count' | 'min' | 'max' | 'median';
```

```js
groupY: DataGroupType | ((values: number[]) => number),
```

You can either pass a:

- `string`: name of a built-in aggregate function (see _DataGroupType_)
- `function`: function taking an array of datum from the same subDomain, and should return a new aggregated value.

#### Example using a STRING

```js
var data = [
  { column1: '2012-01-01', column2: 3 },
  { column1: '2012-01-01', column2: 3 },
  { column1: '2012-01-02', column2: 3 },
];

cal.paint({
  data: {
    source: data,
    x: 'column1',
    y: 'column2',
    groupY: 'sum',
  },
});
```

#### Example using a FUNCTION

```js
var data = [
  { column1: '2012-01-01', column2: 3 },
  { column1: '2012-01-01', column2: 3 },
  { column1: '2012-01-02', column2: 3 },
];

cal.paint({
  data: {
    source: data,
    x: 'column1',
    y: 'column2',
    groupY: data => {
      return data.reduce((a, b) => a + b, 0);
    },
  },
});
```
