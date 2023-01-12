---
layout: default
title: itemSelector
nav_order: 1
parent: Options
---

# itemSelector

Specify where the calendar should be rendered
{: .fs-6 }

```js
itemSelector: Element | string;
```

Accepts either an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element), or any [W3C Selector string](https://www.w3.org/TR/selectors-api/), such as `#my-id` or `.myclass`.

Default: `#cal-heatmap`

<hr />

## Usage

#### Example with the _default_ itemselector

```html
// Insert the following element somewhere in your page at the place you want to
// insert the calendar
<div id="cal-heatmap"></div>
```

```js
const cal = new CalHeatmap();
cal.paint(); // itemSelector can be omitted when using the default selector
```

{: .mt-8}

#### Example with a _custom_ itemselector

```html
// Assuming you have the following element somewhere in your page
<div id="my-node"></div>
```

```js
const cal = new CalHeatmap();
// These two calls are identicals
cal.paint({ itemSelector: '#my-node' });
cal.paint({ itemSelector: document.getElementById('my-node') });
```

{: .note .mt-8}
If the DOM node is not empty, the calendar will be inserted after the existing children.
