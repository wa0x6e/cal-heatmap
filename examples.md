---
layout: default
title: Examples
nav_order: 18
---

# Examples

### hour/minute (default) layout

<div class="code-example">
  <div id="d-options"></div>
  <script>
    const cal10 = new CalHeatmap();
    cal10.paint({ itemSelector: '#d-options' });
  </script>
</div>

### day/hour layout

<div class="code-example">
  <div id="d2-options"></div>
  <script>
    const cal11 = new CalHeatmap();
    cal11.paint({ 
      domain: { type: 'day' }, 
      subDomain:{ type: 'hour' },
      itemSelector: '#d2-options' });
  </script>
</div>

### month/day layout

<div class="code-example">
  <div id="d3-options"></div>
  <script>
    const cal12 = new CalHeatmap();
    cal12.paint({ 
      data: {
        source: '/fixtures/seattle-weather.csv',
        type: 'csv',
        x: 'date',
        y: 'temp_max',
      },
      date: {
        start: new Date('2012-01-01'),
        min: new Date('2012-01-01'),
        max: new Date('2015-12-01'),
      },
      scale: {
        type: 'linear',
        scheme: 'Greens',
        domain: [0, 40]
      },
      domain: { type: 'month' }, 
      subDomain:{ type: 'day' },
      itemSelector: '#d3-options' });
  </script>
</div>

### year/month layout

<div class="code-example">
  <div id="d4-options"></div>
  <script>
    const cal13 = new CalHeatmap();
    cal13.paint({ 
      data: {
        source: '/fixtures/seattle-weather.csv',
        type: 'csv',
        x: 'date',
        y: 'temp_max',
        groupY: 'max'
      },
      date: {
        start: new Date('2012-01-01'),
        min: new Date('2012-01-01'),
        max: new Date('2015-12-01'),
      },
      scale: {
        type: 'linear',
        scheme: 'Turbo',
        domain: [0, 40]
      },
      domain: { type: 'year',  label: { textAlign: 'start' } }, 
      subDomain:{ type: 'month', radius: 15 },
      itemSelector: '#d4-options' });
  </script>
</div>

### year/day layout

<div class="code-example">
  <div id="d5-options"></div>
  <script>
    const cal14 = new CalHeatmap();
    cal14.paint({ 
      data: {
        source: '/fixtures/seattle-weather.csv',
        type: 'csv',
        x: 'date',
        y: 'temp_max',
        groupY: 'max'
      },
      date: {
        start: new Date('2012-01-01'),
      },
      range: 1,
      scale: {
        type: 'linear',
        scheme: 'PRGn',
        domain: [0, 40]
      },
      domain: { 
        type: 'year', 
        label: { text: null },
        subLabel: {
          width: 30,
          textAlign: 'start',
          text: () => dayjs.weekdaysShort().map((d, i) => i % 2 == 0 ? '' : d),
        }
      }, 
      subDomain:{ type: 'day', radius: 2 },
      itemSelector: '#d5-options' });
  </script>
</div>

<div class="code-example">
  <div id="d55-options"></div>
  <script>
    const cal24 = new CalHeatmap();
    cal24.paint({ 
      data: {
        source: '/fixtures/seattle-weather.csv',
        type: 'csv',
        x: 'date',
        y: 'temp_max',
        groupY: 'max'
      },
      date: {
        start: new Date('2012-01-01'),
      },
      range: 1,
      scale: {
        type: 'linear',
        scheme: 'PRGn',
        domain: [0, 40]
      },
      domain: { 
        type: 'year', 
        label: { text: null },
        subLabel: {
          width: 30,
          textAlign: 'start',
          text: () => dayjs.weekdaysShort().map((d, i) => i % 2 == 0 ? '' : d),
        }
      }, 
      subDomain:{ type: 'day', radius: 0, gutter: 0 },
      itemSelector: '#d55-options' });
  </script>
</div>

<hr/>

### Seattle daily min temperature

<div class="code-example">
  <style>
    #d6-options .domain-background {
      fill: rgb(246, 245, 249);
    }
    #d6-options .graph-label { 
      
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }
  </style>
  <div id="d6-options"></div>
  <script>
    const cal15 = new CalHeatmap();
    cal15.paint({ 
      data: {
        source: '/fixtures/seattle-weather.csv',
        type: 'csv',
        x: 'date',
        y: 'temp_min',
        groupY: 'min'
      },
      verticalOrientation: true,
      range: 5,
      date: {
        start: new Date('2012-01-01'),
      },
      scale: {
        type: 'diverging',
        scheme: 'PRGn',
        domain: [-10, 10]
      },
      domain: { type: 'month', padding: [10,10,10,10], label: { position: 'top' } }, 
      subDomain:{ type: 'x_day', radius: 2, width: 15, height: 15, label: 'D' },
      itemSelector: '#d6-options' }, [[Tooltip, {
        text: function (date, value) {
          return value + '°C on ' + cal1.dateHelper.format(date, 'LL')
        }
      }]]);
  </script>
</div>

### Seattle daily average precipitation

<div class="code-example">
  <style>
    #example-3 .graph-label {
      font-size: 10px;
      font-weight: bold;
      fill: #444;
    }

    #example-legend-3 {
      text-align: right;
    }

  </style>
  <div id="example-3"></div>
  <div id="example-legend-3"></div>
  <script>
      const cal1 = new CalHeatmap();

      let dayRowTemplate = (dateHelper, { domain }) => ({
        name: "day_row",
        level: 31,
        rowsCount() {
          return 1;
        },
        columnsCount(d) {
          return domain.dynamicDimension ? dateHelper.date(d).endOf('month').date() : 31;
        },
        mapping: (startDate, endDate, defaultValues) => {

          return dateHelper.intervals(
            "day",
            startDate,
            dateHelper.date(endDate)
          ).map((d, index) => ({
            t: d,
            x: index,
            y: 0,
            ...defaultValues,
          }));
        },

        format: {
          date: "Do",
          legend: "Do",
        },
        extractUnit(d) {
          return dateHelper.date(d).startOf("day").valueOf();
        },
      });

      cal1.addTemplates(dayRowTemplate);

      cal1.paint({
        range: 6,
        date: {
          start: new Date('2012-01-01'),
          min: new Date('2012-01-01'),
          max: new Date('2015-12-01')
        },
        data: {
          source: '/fixtures/seattle-weather.csv',
          type: 'csv',
          x: 'date',
          y: 'precipitation',
        },
        domain: { type: "month", gutter: 5 },
        label: {
          textAlign: "start",
        },
        legend: {
          show: true,
          label: 'Max Temperature (°C)',
          itemSelector: '#example-legend-3',
          width: 150,
          marginLeft: 10,
          marginRight: 10
        },
        subDomain: {
          type: "day_row",
          width: 3,
          height: 35,
          gutter: 0
        },
        scale: {
          type: 'linear',
          scheme: 'Purples',
          domain: [0, 35]
        },
        itemSelector: '#example-3',
      }, [[Tooltip, {
        text: function (date, value) {
          return value + 'cm on ' + cal1.dateHelper.format(date, 'LL')
        }
      }]]);

  </script>
  <div class="fs-3">
    <div class="btn btn-blue" onClick="cal1.previous(); return false">Previous</div>
    <div class="btn btn-blue" onClick="cal1.next(); return false">Next</div>
  </div>
</div>

### Dow Jones Industrial Trading volume

Data from [Yahoo Finance](https://finance.yahoo.com/quote/%5EDJI/history/).
Inspired by [this article](https://observablehq.com/@d3/calendar) from Mike Bostok.

<div class="code-example">
  <style>
    #example-4 .graph-label {
      font-size: 13px;
      font-weight: bold;
      fill: #444;
    }

  </style>
  <div id="example-4"></div>
  <div id="example-legend-4"></div>
  <script>
      const weekDaysTemplate = (DateHelper, options) => ({
        name: 'weekday',
        parent: 'day',
        rowsCount: () => 5,
        columnsCount: () => 54,
        mapping: (startTimestamp, endTimestamp) => {
          let weekNumber = 0;
          let x = -1;
          const domainType = options.domain.type;

          return DateHelper.intervals(
            'day',
            startTimestamp,
            DateHelper.date(endTimestamp),
          ).map((ts) => {
            const date = DateHelper.date(ts);

            if (weekNumber !== date.week()) {
                weekNumber = date.week();
                x += 1;
              }

            return {
              t: ts,
              x,
              y: (date.format('d') == 0 || date.format('d') === 6) ? -1 : date.format('d') - 1,
            };
          }).filter(n => n.y >= 0);
        },
      });
      const cal2 = new CalHeatmap();
      cal2.addTemplates(weekDaysTemplate);
      cal2.paint({
        range: 5,
        date: {
          start: new Date('2007-01-01'),
          min: new Date('200-05-01'),
          max: new Date('2020-05-01'),
          timezone: 'utc'
        },
        data: {
          source: '/fixtures/DJIA.csv',
          type: 'csv',
          x: 'Date',
          y: 'Volume',
          Grouppy: (datum, i, data) => {
            return i > 0 ? (datum.Close - data[i - 1].Close) / data[i - 1].Close : NaN
          }
        },
        domain: {
          type: "year",
          label: {
            position: "left",
            textAlign: "end",
            width: 50,
            offset: { x: -10, y: 5 }
          },
        },
        legend: {
          show: true,
          label: 'Daily Change',
          itemSelector: '#example-legend-4',
          width: 150,
          marginLeft: 10,
          marginRight: 10,
          tickFormat: '+%'
        },
        verticalOrientation: true,
        subDomain: {
          type: "weekday"
        },
        scale: {
          type: 'linear',
          domain: [50000000, 500000000],
          scheme: 'YlOrRd'
        },
        itemSelector: '#example-4',
      }, [[Tooltip, {
        text: function (date, value) {
          return (value ? d3.format(',')(value) : 'No value') + ' on ' + cal2.dateHelper.format(date, 'dddd LL')
        }
      }]]);

  </script>
  <div class="fs-3 mt-3">
    <div class="btn btn-blue" onClick="cal2.previous(); return false">Previous</div>
    <div class="btn btn-blue" onClick="cal2.next(); return false">Next</div>
  </div>
</div>
