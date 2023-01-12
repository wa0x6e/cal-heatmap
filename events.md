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
cal.on(eventName: string, (arguments: any): void => {
  // Do something with the arguments on event trigger
})
cal.paint();
```

{: .highlight}
Define your listeners before calling `paint()`, to make sure you're catching events emitted by the `paint()` call.

<hr/>

## List of events

### resize

Event emitted when the calendar size has changed.

Arguments:

- `newWidth`
- `newHeight`
- `oldWidth`
- `oldHeight`

#### Usage Example

```js
cal.on('resize', (newW, newH, oldW, oldH) => {
  console.log(
    `Calendar has been resized from ${oldW}x${oldH} to ${newW}x${newH}`
  );
});
```

#### Playground

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
<div class="highlighter-rouge p-3">
  <div id="resize-example-1-log">Navigate the calendar to trigger the resize</div>
  <div class="fs-3 mt-2">
    <a class="btn btn-blue" href="#" onClick="cal5.next(); return false;">Next</a>
  </div>
</div>

{: .note}
You can also retrieve the current dimensions with the [`dimensions()`](/methods/dimensions.html) method

{: .mt-8}

### fill

Event emitted after new data have been loaded and painted into the calendar.

Arguments: `none`

#### Usage Example

```js
cal.on('fill', () => {
  console.log('New data have been loaded!');
});
```

{: .mt-8}

### click

Event emitted on a subDomain cell click

Arguments:

- [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) object
- subDomain timestamp (in ms), rounded to the start of the subdomain
- Value (from your dataset) associated to this subdomain

#### Usage Example

```js
cal.on('click', (event, timestamp, value) => {
  console.log(
    'On <b>' +
      new Date(timestamp).toLocaleDateString() +
      '</b>, the max temperature was ' +
      value +
      '°C'
  );
});
```

#### Playground

<div class="code-example" >
  <div id="eventclick-example-1"></div>

  <script>
      const cal1 = new CalHeatmap();
      cal1.on('click', (event, date, value) => {
        d3.select('#eventclick-example-1-log').html('On <b>' + new Date(date).toLocaleDateString() + '</b>, the max temperature was ' + value + '°C')
      });
      cal1.paint({ 
        domain: { type: 'month' }, 
        subDomain: { type: 'day' }, 
        date: { start: new Date(2012,0,1) },
        data: { source: 'fixtures/seattle-weather.csv', type: 'csv', x: 'date', y: 'temp_max', groupY: 'max' },
        range: 2, 
        scale: {
          type: 'linear',
          color: 'Greens',
          domain: [0, 20]
        },
        itemSelector: '#eventclick-example-1'
      });
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div id="eventclick-example-1-log">Click on a subdomain</div>
</div>

{: .mt-8}

### mouseover

Event emitted when the mouse enter a subDomain cell.

Arguments:

- [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) object
- subDomain timestamp (in ms), rounded to the start of the subdomain
- Value (from your dataset) associated to this subdomain

#### Usage Example

```js
cal.on('mouseover', (event, timestamp, value) => {
  console.log(
    'On <b>' +
      new Date(timestamp).toLocaleDateString() +
      '</b>, the max temperature was ' +
      value +
      '°C'
  );
});
```

#### Playground

<div class="code-example" >
  <div id="eventmouseover-example-1"></div>

  <script>
      const cal2 = new CalHeatmap();
      cal2.on('mouseover', (event, date, value) => {
        d3.select('#eventmouseover-example-1-log').html('You hovered over <b>' + new Date(date).toLocaleDateString() + '</b> with value ' + value)
      });
      cal2.paint({
        domain: { type: 'month' }, 
        subDomain: { type: 'day' }, 
        date: { start: new Date(2012,0,1) },
        data: { source: 'fixtures/seattle-weather.csv', type: 'csv', x: 'date', y: 'temp_max', groupY: 'max' },
        range: 2, 
        scale: {
          type: 'linear',
          color: 'Greens',
          domain: [0, 20]
        },
        itemSelector: '#eventmouseover-example-1'});
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div id="eventmouseover-example-1-log">Hover a subdomain</div>
</div>

{: .mt-8}

### mouseout

Event emitted when the mouse exit a subDomain cell.

Arguments:

- [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) object
- subDomain timestamp (in ms), rounded to the start of the subdomain
- Value (from your dataset) associated to this subdomain

#### Usage example

```js
cal.on('mouseout', (event, timestamp, value) => {
  console.log(
    'On <b>' +
      new Date(timestamp).toLocaleDateString() +
      '</b>, the max temperature was ' +
      value +
      '°C'
  );
});
```

#### Playground

<div class="code-example" >
  <div id="eventmouseout-example-1"></div>

  <script>
      const cal3 = new CalHeatmap();
      cal3.on('mouseout', (event, date, value) => {
        d3.select('#eventmouseout-example-1-log').html('You exited <b>' + new Date(date).toLocaleDateString() + '</b> with value ' + value)
      });
      cal3.paint({
        domain: { type: 'month' }, 
        subDomain: { type: 'day' }, 
        date: { start: new Date(2012,0,1) },
        data: { source: 'fixtures/seattle-weather.csv', type: 'csv', x: 'date', y: 'temp_max', groupY: 'max' },
        range: 2, 
        scale: {
          type: 'linear',
          color: 'Greens',
          domain: [0, 20]
        },
        itemSelector: '#eventmouseout-example-1'});
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div id="eventmouseout-example-1-log">Hover a subDomain</div>
</div>

{: .mt-8}

### minDateReached

Event emitted after a navigation event, and when the calendar has reached the [`min`](/options/date.html#min) date, if set.

Arguments: `none`

#### Usage example

```js
cal.on('minDateReached', () => {
  // Do something to disable the navigation PREVIOUS button
});
```

#### Playground

<div class="code-example" >
  <div id="mindate-example-1"></div>

  <script>
      const cal4 = new CalHeatmap();
      cal4.on('minDateReached', () => {
        d3.select('#mindate-prev').classed('btn-blue', false);
      });
      cal4.on('minDateNotReached', () => {
        d3.select('#mindate-prev').classed('btn-blue', true);
      });
      cal4.paint({ date: { start: new Date(2020, 0, 1), min: new Date(2019, 10, 1)  }, domain: { type: 'month' }, subDomain: { type: 'day' }, range: 2, itemSelector: '#mindate-example-1'});
  </script>
</div>
<div class="highlighter-rouge p-3">
  Try navigating back, until the min date is reached
  <div class="fs-3 mt-2">
  <a href="#" id="mindate-prev" class="btn btn-blue" onClick="cal4.previous(); return false;">Previous</a>
  <a href="#" class="btn btn-blue" onClick="cal4.next(); return false;">Next</a>
  </div>
</div>

{: .mt-8}

### maxDateReached

Event emitted after a navigation event, and when the calendar has reached the [`max`](/options/date.html#max) date, if set.

Arguments: `none`

#### Usage example

```js
cal.on('maxDateReached', () => {
  // Do something to disable the navigation NEXT button
});
```

{: .mt-8}

### minDateNotReached

Event emitted after a navigation event, and when the calendar has _not_ reached the [`min`](/options/date.html#min) date, if set.
Used to exit the calendar from the `minDateReached` status.

Arguments: `none`

#### Usage example

```js
cal.on('minDateNotReached', () => {
  // Do something to enable back the PREVIOUS button,
  // after disabling it with the minDateReached event
});
```

{: .mt-8}

### maxDateNotReached

Event emitted after a navigation event, and when the calendar has _not_ reached the [`max`](/options/date.html#max) date, if set.
Used to exit the calendar from the `maxDateReached` status.

Arguments: `none`

#### Usage example

```js
cal.on('maxDateNotReached', () => {
  // Do something to enable back the NEXT button,
  // after disabling it with the maxDateReached event
});
```

{: .mt-8}

### destroy

Event emitted when calling [`destroy()`](/methods/destroy.html).

Arguments: `none`

{: .highlight}
Called at the start of the destroy process,
use the promise returned by `destroy` if you want to wait for the
destroy process to complete.

#### Usage example

```js
cal.on('destroy', () => {
  // Calendar has started destroying
  // Do something
});
```
