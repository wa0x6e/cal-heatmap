---
layout: default
title: Events
nav_order: 8
---

# Events

Listen for events emitted by the calendar
{: .fs-6 }

```js
const cal = new CalHeatmap();
cal.on(eventName: String, (arguments: any): void => {
  // Do something with the arguments
})
cal.paint({});
```

Define your listeners before calling `paint()`, to make sure you're catching events emitted by the `init()` call.

## List of events

### resize

Event emitted when the calendar size has changed.

Arguments:

- `newWidth`
- `newHeight`
- `oldWidth`
- `oldHeight`

<div class="code-example" >
  <div id="resize-example-1" style="display: inline-block; outline: 1px dotted gray;margin-bottom: 10px;"></div>

  <script>
      const cal5 = new CalHeatmap();
      cal5.on('resize', (newW, newH, oldW, oldH) => {
        d3.select('#resize-example-1-log').html('Calendar has been resized from ' + oldW + 'x' + oldH + ' to ' + newW + 'x' + newH)
      });
      cal5.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 5, itemSelector: '#resize-example-1'});
  </script>
</div>
<div class="highlighter-rouge">
  <div id="resize-example-1-log">Navigate the calendar to trigger the resize</div>
  <button type="button" name="button" class="btn btn-blue" onClick="cal5.next(); return false;">Next</button>
</div>

{: .note}
You can also retrieve the dimensions with [`dimensions()`](/methods/dimensions.html)

### fill

Event emitted after new data has been loaded and painted into the calendar.

Arguments: `none`

### click

Event emitted on a subDomain cell click

Arguments:

- [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) object
- subDomain timestamp, rounded to the start of the subdomain
- Value (from your dataset) associated to this subdomain

#### Example

<div class="code-example" >
  <div id="eventclick-example-1"></div>

  <script>
      const cal1 = new CalHeatmap();
      cal1.on('click', (event, date, value) => {
        d3.select('#eventclick-example-1-log').html('You clicked on <b>' + new Date().toISOString() + '</b> with value ' + value)
      });
      cal1.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#eventclick-example-1'});
  </script>
</div>
<div class="highlighter-rouge">
  <div id="eventclick-example-1-log">Click on a subdomain</div>
</div>

### mouseover

Event emitted when the mouse enter a subDomain cell.

Arguments:

- [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) object
- subDomain timestamp, rounded to the start of the subdomain
- Value (from your dataset) associated to this subdomain

#### Example

<div class="code-example" >
  <div id="eventmouseover-example-1"></div>

  <script>
      const cal2 = new CalHeatmap();
      cal2.on('mouseover', (event, date, value) => {
        d3.select('#eventmouseover-example-1-log').html('You hovered over <b>' + new Date().toISOString() + '</b> with value ' + value)
      });
      cal2.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#eventmouseover-example-1'});
  </script>
</div>
<div class="highlighter-rouge">
  <div id="eventmouseover-example-1-log">Click on a subdomain</div>
</div>

### mouseout

Event emitted when the mouse exit a subDomain cell.

Arguments:

- [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) object
- subDomain timestamp, rounded to the start of the subdomain
- Value (from your dataset) associated to this subdomain

#### Example

<div class="code-example" >
  <div id="eventmouseout-example-1"></div>

  <script>
      const cal3 = new CalHeatmap();
      cal3.on('mouseout', (event, date, value) => {
        d3.select('#eventmouseout-example-1-log').html('You exited <b>' + new Date().toISOString() + '</b> with value ' + value)
      });
      cal3.paint({ domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#eventmouseout-example-1'});
  </script>
</div>
<div class="highlighter-rouge">
  <div id="eventmouseout-example-1-log">Hover over a subDomain</div>
</div>

### minDateReached

Event emitted after a navigation event, and when the calendar has reached the [`min`](/options/date.html#min) date, as defined in the options.

Arguments: `none`

#### Example

{: .text-grey-dk-000}
Use the event to disable the _PREVIOUS_ navigation button when min date is reached.
We have to use the opposite [`minDateNotReached`](#minDateNotReached) event to enable it back when necessary.

<div class="code-example" >
  <div id="mindate-example-1"></div>

  <script>
      const cal4 = new CalHeatmap();
      cal4.on('minDateReached', (event, date, value) => {
        d3.select('#mindate-prev').attr('disabled', true);
      });
      cal4.on('minDateNotReached', (event, date, value) => {
        d3.select('#mindate-prev').attr('disabled', null);
      });
      cal4.paint({ date: { start: new Date(2020, 0, 1), min: new Date(2019, 10, 1)  }, domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#mindate-example-1'});
  </script>
</div>
<div class="highlighter-rouge">
  <button type="button" name="button" id="mindate-prev" class="btn btn-blue" onClick="cal4.previous(); return false;">Previous</button>
  <button type="button" name="button" class="btn btn-blue" onClick="cal4.next(); return false;">Next</button>
</div>

### maxDateReached

Event emitted after a navigation event, and when the calendar has reached the [`max`](/options/date.html#max) date, as defined in the options.

Arguments: `none`

### minDateNotReached

Event emitted after a navigation event, and when the calendar has _not_ reached the [`min`](/options/date.html#min) date, as defined in the options.
Used to exit the calendar from the `minDateReached` status.

Arguments: `none`

### maxDateNotReached

Event emitted after a navigation event, and when the calendar has _not_ reached the [`max`](/options/date.html#max) date, as defined in the options.
Used to exit the calendar from the `maxDateReached` status.

Arguments: `none`

### destroy

Event emitted when calling [`destroy()`](/methods/destroy.html). Called at the start of the destroy process,
use the promise returned by `destroy` if you want to wait for the destroy to complete.

Arguments: none
