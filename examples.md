---
layout: default
title: Examples
nav_order: 11
---

## Examples

### Seattle max daily temperature by year

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
          start: new Date(2012,0,1),
          min: new Date(2012,0,1),
          max: new Date(2015,11,1)
        },
        data: {
          source: '/fixtures/seattle-weather.csv',
          type: 'csv',
          x: 'date',
          y: 'temp_max',
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
          scheme: 'Greens',
          domain: [0, 40]
        },
        itemSelector: '#example-3',
      }, [[Tooltip, {
        text: function (date, value) {
          return value + '°C on ' + cal1.dateHelper.format(date, 'LL')
        }
      }]]);

  </script>
  <div class="fs-3">
    <div class="btn btn-blue" onClick="cal1.previous(); return false">Previous</div>
    <div class="btn btn-blue" onClick="cal1.next(); return false">Next</div>
  </div>
</div>

### Down Jones Industrial Average

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
      const cal2 = new CalHeatmap();
      cal2.paint({
        range: 5,
        date: {
          start: new Date(2010,0,1),
          min: new Date(2000,5,1),
          max: new Date(2020, 5, 1)
        },
        data: {
          source: '/fixtures/DJIA.csv',
          type: 'csv',
          x: 'Date',
          y: (datum, i, data) => {
            console.log(datum);
            console.log(i);
            console.log(data);
            return i > 0 ? (datum.Close - data[i - 1].Close) / data[i - 1].Close : NaN
          }
        },
        domain: { type: "year" },
        label: {
          position: "left",
          textAlign: "end",
          width: 50,
          offset: { x: -10, y: 5 }
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
          type: "day"
        },
        scale: {
          type: 'diverging',
          domain: [-0.06, 0.06],
          scheme: 'PuOr'
        },
        itemSelector: '#example-4',
      }, [[Tooltip, {
        text: function (date, value) {
          return (value ? d3.format('+.2%')(value) : 'No value') + ' on ' + cal2.dateHelper.format(date, 'LL')
        }
      }]]);

  </script>
  <div class="fs-3">
    <div class="btn btn-blue" onClick="cal2.previous(); return false">Previous</div>
    <div class="btn btn-blue" onClick="cal2.next(); return false">Next</div>
  </div>
</div>
