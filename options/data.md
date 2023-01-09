---
layout: default
title: data
parent: Options
nav_order: 6
---

# data

{: .fs-6}
Define how to fetch the data used to fill the calendar

```js
type DataGroupType = 'sum' | 'count' | 'min' | 'max' | 'median';

type DataOptions = {
  source: string | Object,
  type: string,
  requestInit?: {},
  x: string | ((datum: any) => number),
  y: string | ((datum: any) => number),
  groupY: DataGroupType | ((values: number[]) => number),
};
```

## source

Data used to populate the calendar.

CalHeatmap is expecting an array of [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) as input, with at least one
property for the date, and another for the value.

Accepted values kind:

- `string`: will be interpreted as url, and a network `GET` request will be sent to this url to retrieve the data
- An array of objects.

#### Example input

```js
[
  { date: '2012-01-01', value: 3 },
  { date: '2012-01-02', value: 6 },
  ...
];
```

The keyname for the date and value can be customized via [x](#x) and [y](#y).

## type

The parser used to interpret the data returned by your source.

Accepted types are : `json`, `csv`, `tsv`, `txt`

If your source is not returning a supported content type, use `txt`,
then use the [`processor`](#processor) function to parse and format the data.

Default: `json`

{: .warning}
This option is ignored when your source is already a JSON object.

## requestInit

Additional [requestInit](https://fetch.spec.whatwg.org/#requestinit) options, send along your data request.

[d3-fetch](https://github.com/d3/d3-fetch) is used under the hood to handle all network requests.

Default: `{}`

## x

The property name used to extract the date, or a function returning a timestamp

```js
x: string | ((datum: any) => number),
```

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

## y

The property name used to extract the value, or a function returning the value

```js
y: string | ((datum: any) => number),
```

#### Example using a STRING

```js
var data = [{ column1: '2012-01-01', column2: 3 }];

cal.paint({
  data: { source: data, y: 'column2' },
});
```

#### Example using a FUNCTION

```js
var data = [{ column1: '2012-01-01', column2: 3 }];

cal.paint({
  data: {
    source: data,
    y: datum => {
      // You can use the function to pre-process your values
      return parseInt(datum['column2']) * 10;
    },
  },
});
```

## groupY

Function used to group all values belonging to the same subDomain.

```js
groupY: DataGroupType | ((values: number[]) => number),
```

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
