---
layout: default
title: Navigation
parent: Methods
nav_order: 5
---

# Navigation()

Update the calendar time window dynamically
{: .fs-6 }

All following methods return a Promise from [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled),
which will fulfill once all the underlying asynchronous tasks
(scrolling animation, data fetching, etc ...) settled, whether resolved or rejected.

<hr/>

## next()

Shift the calendar by the given number of domains forward (in the future).

```
cal.next(steps?: number): Promise<unknown>
```

### Arguments:

- `steps`: the number of domains to shift, default `1`

### Return:

- A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that will resolve once all the new domains have loaded, and filled with data.

#### Playground

<div class="code-example">
  <div id="nav-example-1"></div>
  <script>
     const cal = new CalHeatmap();
     cal.paint({ range: 3, domain: { type: 'day' } , subDomain: { type: 'hour' }, itemSelector: '#nav-example-1' });
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
    <a href="#" class="btn btn-blue" onClick="cal.next(1); return false;">Next by 1 day</a>
    <a href="#" class="btn btn-blue" onClick="cal.next(5); return false;">Next by 5 days</a>
  </div>
</div>

#### Playground with max date

<div class="code-example">
  <div id="nav-example-4"></div>
  <script>
     const cal4 = new CalHeatmap();
     cal4.on('maxDateReached', () => { alert('Max date reached') });
     cal4.paint({
      range: 1,
      date: { start: new Date(2020, 0, 1), max: new Date(2022, 0, 1) },
      domain: { type: 'year' } ,
      subDomain: { type: 'month' },
      itemSelector: '#nav-example-4'
    });
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
    <a href="#" class="btn btn-blue" onClick="cal4.next(); return false;">Next</a>
  </div>
</div>

{: .mt-8}

## previous()

Shift the calendar by the given number of domains backward (in the past).

```
cal.previous(steps?: number): Promise<unknown>
```

### Arguments:

- `steps`: the number of domains to shift, default `1`

### Return:

- A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that will resolve once all the new domains have loaded, and filled with data.

#### Playground

<div class="code-example">
  <div id="nav-example-2"></div>
  <script>
     const cal2 = new CalHeatmap();
     cal2.paint({ range: 3,  domain: { type: 'day' } , subDomain: { type: 'hour' }, itemSelector: '#nav-example-2' });
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
    <a href="#" class="btn btn-blue" onClick="cal2.previous(1); return false;">Back by 1 day</a>
    <a href="#" class="btn btn-blue" onClick="cal2.previous(5); return false;">Back by 5 days</a>
  </div>
</div>

#### Playground with min date

<div class="code-example">
  <div id="nav-example-5"></div>
  <script>
     const cal5 = new CalHeatmap();
     cal5.on('minDateReached', () => { alert('Min date reached') });
     cal5.paint({
      range: 1,
      date: { start: new Date(2020, 0, 1), min: new Date(2018, 0, 1) },
      domain: { type: 'year' } ,
      subDomain: { type: 'month' },
      itemSelector: '#nav-example-5'
    });
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
    <a href="#" class="btn btn-blue" onClick="cal5.previous(); return false;">Previous</a>
  </div>
</div>

{: .mt-8}

## jumpTo()

Scroll the calendar to the given date.

```
cal.jumpTo(date: Date, reset: boolean): Promise<unknown>
```

### Arguments:

- `date`: a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object, representing the date to jump to.
- `reset`: whether if the given date should be at the start of the calendar. Default `false`

### Return:

- A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that will resolve once all the new domains have loaded, and filled with data.

#### Playground

<div class="code-example">
  <div id="nav-example-3"></div>
  <script>
     const cal3 = new CalHeatmap();
     cal3.paint({ startDate: new Date(2020),  domain: { type: 'day' } , subDomain: { type: 'hour' }, range: 3, itemSelector: '#nav-example-3' });
  </script>
</div>
<div class="highlighter-rouge p-3">
  <div class="fs-3">
    <a href="#" class="btn btn-blue" onClick="cal3.jumpTo(new Date(2015,1,14)); return false;">Jump to February 14th, 2015</a>
    <a href="#" class="btn btn-blue" onClick="cal3.jumpTo(new Date(2020,5,20)); return false;">Jump to June 20th, 2025</a>
  </div>
</div>
