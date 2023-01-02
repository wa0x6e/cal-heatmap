---
layout: default
title: data
parent: Options
nav_order: 6
---

# data

{: .fs-6}
Data used to fill the calendar

{: .warning}
Documention for this option is still work in progress, and is incomplete

```js
type DataOptions = {
  source: string | Object,
  type: string,
  requestInit?: {},
  x: string | ((datum: any) => number),
  y: string | ((data: any[]) => number[]),
  groupY: string | ((values: number[]) => number),
};
```

{: .note}
[d3-fetch](https://github.com/d3/d3-fetch) is used under the hood to handle all network requests.
You can customize the requests with [`requestInit`](#requestInit)

In case your data source is not returning the data in the expected format

## source

Data used to populate the calendar.

Accepted values:

- `string`: will be interpreted as url, and a network `GET` request will be sent to this url to retrieve the data
- JSON object

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

Default: `{}`

## x

## y

## groupY
