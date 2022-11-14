(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CalHeatMap = factory());
})(this, (function () { 'use strict';

  const RESET_ALL_ON_UPDATE = 0;
  const RESET_SINGLE_ON_UPDATE = 1;
  const APPEND_ON_UPDATE = 2;
  const NAVIGATE_LEFT = 1;
  const NAVIGATE_RIGHT = 2;

  var t0$1 = new Date,
      t1$1 = new Date;

  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
    }

    interval.floor = function(date) {
      return floori(date = new Date(+date)), date;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [], previous;
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      while (previous < start && start < stop);
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0$1.setTime(+start), t1$1.setTime(+end);
        floori(t0$1), floori(t1$1);
        return Math.floor(count(t0$1, t1$1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  const durationSecond = 1000;
  const durationMinute = durationSecond * 60;
  const durationHour = durationMinute * 60;
  const durationDay = durationHour * 24;
  const durationWeek = durationDay * 7;

  var minute = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute);
  }, function(start, end) {
    return (end - start) / durationMinute;
  }, function(date) {
    return date.getMinutes();
  });

  var timeMinute = minute;
  minute.range;

  var hour = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
  }, function(date, step) {
    date.setTime(+date + step * durationHour);
  }, function(start, end) {
    return (end - start) / durationHour;
  }, function(date) {
    return date.getHours();
  });

  var timeHour = hour;
  hour.range;

  var day = newInterval(
    date => date.setHours(0, 0, 0, 0),
    (date, step) => date.setDate(date.getDate() + step),
    (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
    date => date.getDate() - 1
  );

  var timeDay = day;
  day.range;

  function weekday(i) {
    return newInterval(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  sunday.range;
  monday.range;
  tuesday.range;
  wednesday.range;
  thursday.range;
  friday.range;
  saturday.range;

  var month = newInterval(function(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });

  var timeMonth = month;
  month.range;

  var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };

  var timeYear = year;
  year.range;

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  var utcDay$1 = utcDay;
  utcDay.range;

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  utcSunday.range;
  utcMonday.range;
  utcTuesday.range;
  utcWednesday.range;
  utcThursday.range;
  utcFriday.range;
  utcSaturday.range;

  var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };

  var utcYear$1 = utcYear;
  utcYear.range;

  function ascending$1(a, b) {
    return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function descending(a, b) {
    return a == null || b == null ? NaN
      : b < a ? -1
      : b > a ? 1
      : b >= a ? 0
      : NaN;
  }

  function bisector(f) {
    let compare1, compare2, delta;

    // If an accessor is specified, promote it to a comparator. In this case we
    // can test whether the search value is (self-) comparable. We can’t do this
    // for a comparator (except for specific, known comparators) because we can’t
    // tell if the comparator is symmetric, and an asymmetric comparator can’t be
    // used to test whether a single value is comparable.
    if (f.length !== 2) {
      compare1 = ascending$1;
      compare2 = (d, x) => ascending$1(f(d), x);
      delta = (d, x) => f(d) - x;
    } else {
      compare1 = f === ascending$1 || f === descending ? f : zero$1;
      compare2 = f;
      delta = f;
    }

    function left(a, x, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x, x) !== 0) return hi;
        do {
          const mid = (lo + hi) >>> 1;
          if (compare2(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }

    function right(a, x, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x, x) !== 0) return hi;
        do {
          const mid = (lo + hi) >>> 1;
          if (compare2(a[mid], x) <= 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }

    function center(a, x, lo = 0, hi = a.length) {
      const i = left(a, x, lo, hi - 1);
      return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
    }

    return {left, center, right};
  }

  function zero$1() {
    return 0;
  }

  function number$1(x) {
    return x === null ? NaN : +x;
  }

  const ascendingBisect = bisector(ascending$1);
  const bisectRight = ascendingBisect.right;
  bisector(number$1).center;
  var bisect = bisectRight;

  var e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2);

  function ticks(start, stop, count) {
    var reverse,
        i = -1,
        n,
        ticks,
        step;

    stop = +stop, start = +start, count = +count;
    if (start === stop && count > 0) return [start];
    if (reverse = stop < start) n = start, start = stop, stop = n;
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

    if (step > 0) {
      let r0 = Math.round(start / step), r1 = Math.round(stop / step);
      if (r0 * step < start) ++r0;
      if (r1 * step > stop) --r1;
      ticks = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks[i] = (r0 + i) * step;
    } else {
      step = -step;
      let r0 = Math.round(start * step), r1 = Math.round(stop * step);
      if (r0 / step < start) ++r0;
      if (r1 / step > stop) --r1;
      ticks = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks[i] = (r0 + i) / step;
    }

    if (reverse) ticks.reverse();

    return ticks;
  }

  function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }

  function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  }

  function generate(interval, date, range) {
    let start = date;
    if (typeof date === 'number') {
      start = new Date(date);
    }

    let stop = range;
    if (!(range instanceof Date)) {
      stop = interval.offset(start, range);
    }

    return interval.range(
      interval.floor(Math.min(start, stop)),
      interval.ceil(Math.max(start, stop)),
    );
  }

  /**
   * Get an array of domain start dates
   *
   * @param  int|Date date A random date included in the wanted domain
   * @param  int|Date range Number of dates to get, or a stop date
   * @return Array of dates
   */
  function generateTimeInterval(
    domain,
    date,
    range,
    weekStartOnMonday,
  ) {
    switch (domain) {
      case 'min':
        return generate(timeMinute, date, range);
      case 'hour':
        return generate(timeHour, date, range);
      case 'day':
        return generate(timeDay, date, range);
      case 'week':
        return generate(weekStartOnMonday ? monday : sunday, date, range);
      case 'month':
        return generate(timeMonth, date, range);
      case 'year':
        return generate(timeYear, date, range);
      default:
        throw new Error('Invalid domain');
    }
  }

  var EOL = {},
      EOF = {},
      QUOTE = 34,
      NEWLINE = 10,
      RETURN = 13;

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "] || \"\"";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function pad$1(value, width) {
    var s = value + "", length = s.length;
    return length < width ? new Array(width - length + 1).join(0) + s : s;
  }

  function formatYear$1(year) {
    return year < 0 ? "-" + pad$1(-year, 6)
      : year > 9999 ? "+" + pad$1(year, 6)
      : pad$1(year, 4);
  }

  function formatDate$1(date) {
    var hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds(),
        milliseconds = date.getUTCMilliseconds();
    return isNaN(date) ? "Invalid Date"
        : formatYear$1(date.getUTCFullYear()) + "-" + pad$1(date.getUTCMonth() + 1, 2) + "-" + pad$1(date.getUTCDate(), 2)
        + (milliseconds ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + ":" + pad$1(seconds, 2) + "." + pad$1(milliseconds, 3) + "Z"
        : seconds ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + ":" + pad$1(seconds, 2) + "Z"
        : minutes || hours ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + "Z"
        : "");
  }

  function dsvFormat(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
        DELIMITER = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns || [];
      return rows;
    }

    function parseRows(text, f) {
      var rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // current line number
          t, // current token
          eof = N <= 0, // current token followed by EOF?
          eol = false; // current token followed by EOL?

      // Strip the trailing newline.
      if (text.charCodeAt(N - 1) === NEWLINE) --N;
      if (text.charCodeAt(N - 1) === RETURN) --N;

      function token() {
        if (eof) return EOF;
        if (eol) return eol = false, EOL;

        // Unescape quotes.
        var i, j = I, c;
        if (text.charCodeAt(j) === QUOTE) {
          while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
          if ((i = I) >= N) eof = true;
          else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          return text.slice(j + 1, i - 1).replace(/""/g, "\"");
        }

        // Find next delimiter or newline.
        while (I < N) {
          if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          else if (c !== DELIMITER) continue;
          return text.slice(j, i);
        }

        // Return last token before EOF.
        return eof = true, text.slice(j, N);
      }

      while ((t = token()) !== EOF) {
        var row = [];
        while (t !== EOL && t !== EOF) row.push(t), t = token();
        if (f && (row = f(row, n++)) == null) continue;
        rows.push(row);
      }

      return rows;
    }

    function preformatBody(rows, columns) {
      return rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      });
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
    }

    function formatBody(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return preformatBody(rows, columns).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(value) {
      return value == null ? ""
          : value instanceof Date ? formatDate$1(value)
          : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
          : value;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatBody: formatBody,
      formatRows: formatRows,
      formatRow: formatRow,
      formatValue: formatValue
    };
  }

  var csv$1 = dsvFormat(",");

  var csvParse = csv$1.parse;

  function responseText(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.text();
  }

  function text(input, init) {
    return fetch(input, init).then(responseText);
  }

  function dsvParse(parse) {
    return function(input, init, row) {
      if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
      return text(input, init).then(function(response) {
        return parse(response, row);
      });
    };
  }

  function dsv(delimiter, input, init, row) {
    if (arguments.length === 3 && typeof init === "function") row = init, init = undefined;
    var format = dsvFormat(delimiter);
    return text(input, init).then(function(response) {
      return format.parse(response, row);
    });
  }

  var csv = dsvParse(csvParse);

  function responseJson(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    if (response.status === 204 || response.status === 205) return;
    return response.json();
  }

  function json(input, init) {
    return fetch(input, init).then(responseJson);
  }

  function interpretCSV(data) {
    const d = {};
    const keys = Object.keys(data[0]);
    let i;
    let total;
    for (i = 0, total = data.length; i < total; i++) {
      d[data[i][keys[0]]] = +data[i][keys[1]];
    }
    return d;
  }

  function parseURI(str, startDate, endDate) {
    // Use a timestamp in seconds
    let newUri = str.replace(/\{\{t:start\}\}/g, startDate.getTime() / 1000);
    newUri = newUri.replace(/\{\{t:end\}\}/g, endDate.getTime() / 1000);

    // Use a string date, following the ISO-8601
    newUri = newUri.replace(/\{\{d:start\}\}/g, startDate.toISOString());
    newUri = newUri.replace(/\{\{d:end\}\}/g, endDate.toISOString());

    return newUri;
  }

  /**
   * Populate the calendar internal data
   *
   * @param object data
   * @param constant updateMode
   * @param Date startDate
   * @param Date endDate
   *
   * @return void
   */
  function parseDatas(calendar, data, updateMode, startDate, endDate, options) {
    if (updateMode === RESET_ALL_ON_UPDATE) {
      calendar.domainCollection.forEach((value) => {
        value.forEach((element, index, array) => {
          array[index].v = null;
        });
      });
    }

    const newData = new Map();

    const extractTime = (d) => d.t;

    Object.keys(data).forEach((d) => {
      if (Number.isNaN(d)) {
        return;
      }

      const date = new Date(d * 1000);

      const domainKey = generateTimeInterval(
        calendar.options.options.domain,
        date,
        1,
        calendar.options.options.weekStartOnMonday,
      )[0].getTime();

      // Skip if data is not relevant to current domain
      if (
        !calendar.domainCollection.has(domainKey) ||
        !(domainKey >= +startDate && domainKey < +endDate)
      ) {
        return;
      }

      const subDomainsData = calendar.domainCollection.get(domainKey);

      if (!newData.has(domainKey)) {
        newData.set(domainKey, subDomainsData.map(extractTime));
      }

      const subDomainIndex = newData
        .get(domainKey)
        .indexOf(calendar.domainSkeleton.at(options.subDomain).extractUnit(date));

      if (updateMode === RESET_SINGLE_ON_UPDATE) {
        subDomainsData[subDomainIndex].v = data[d];
      } else if (!Number.isNaN(subDomainsData[subDomainIndex].v)) {
        subDomainsData[subDomainIndex].v += data[d];
      } else {
        subDomainsData[subDomainIndex].v = data[d];
      }
    });
  }

  /**
   * Fetch and interpret data from the datasource
   *
   * @param string|object source
   * @param Date startDate
   * @param Date endDate
   * @param function callback
   * @param function|boolean afterLoad function used to convert the data into a json object. Use true to use the afterLoad callback
   * @param updateMode
   *
   * @return mixed
   * - True if there are no data to load
   * - False if data are loaded asynchronously
   */
  // eslint-disable-next-line import/prefer-default-export
  function getDatas(
    calendar,
    options,
    source,
    startDate,
    endDate,
    callback,
    afterLoad = true,
    updateMode = APPEND_ON_UPDATE,
  ) {
    const _callback = function (data) {
      if (afterLoad !== false) {
        if (typeof afterLoad === 'function') {
          data = afterLoad(data);
        } else if (typeof options.afterLoadData === 'function') {
          data = options.afterLoadData(data);
        } else {
          console.log('Provided callback for afterLoadData is not a function.');
        }
      } else if (options.dataType === 'csv' || options.dataType === 'tsv') {
        data = interpretCSV(data);
      }
      parseDatas(calendar, data, updateMode, startDate, endDate, options);
      if (typeof callback === 'function') {
        callback();
      }
    };

    switch (typeof source) {
      case 'string':
        if (source === '') {
          _callback({});
          return true;
        }
        const url = parseURI(source, startDate, endDate);

        const reqInit = { method: 'GET' };
        if (options.dataPostPayload !== null) {
          reqInit.method = 'POST';
        }
        if (options.dataPostPayload !== null) {
          reqInit.body = parseURI(options.dataPostPayload, startDate, endDate);
        }
        if (options.dataRequestHeaders !== null) {
          const myheaders = new Headers();
          for (const header in options.dataRequestHeaders) {
            if (options.dataRequestHeaders.hasOwnProperty(header)) {
              myheaders.append(header, options.dataRequestHeaders[header]);
            }
          }
          reqInit.headers = myheaders;
        }

        let request = null;
        switch (options.dataType) {
          case 'json':
            request = json(url, reqInit);
            break;
          case 'csv':
            request = csv(url, reqInit);
            break;
          case 'tsv':
            request = dsv('\t', url, reqInit);
            break;
          case 'txt':
            request = text(url, reqInit);
            break;
        }
        request.then(_callback);

        return false;
      case 'object':
        if (source === Object(source)) {
          _callback(source);
          return false;
        }
      /* falls through */
      default:
        _callback({});
        return true;
    }
  }

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newDate(y, m, d) {
    return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "f": formatMicroseconds,
      "g": formatYearISO,
      "G": formatFullYearISO,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "q": formatQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "f": formatUTCMicroseconds,
      "g": formatUTCYearISO,
      "G": formatUTCFullYearISO,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "q": formatUTCQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "f": parseMicroseconds,
      "g": parseYear,
      "G": parseFullYear,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "q": parseQuarter,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, Z) {
      return function(string) {
        var d = newDate(1900, undefined, 1),
            i = parseSpecifier(d, specifier, string += "", 0),
            week, day;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);
        if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

        // If this is utcParse, never use the local timezone.
        if (Z && !("Z" in d)) d.Z = 0;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If the month was not specified, inherit from the quarter.
        if (d.m === undefined) d.m = "q" in d ? d.q : 0;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
            week = day > 4 || day === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay$1.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
            week = day > 4 || day === 0 ? monday.ceil(week) : monday(week);
            week = timeDay.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return localDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatQuarter(d) {
      return 1 + ~~(d.getMonth() / 3);
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    function formatUTCQuarter(d) {
      return 1 + ~~(d.getUTCMonth() / 3);
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", false);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier += "", true);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"},
      numberRe = /^\s*\d+/, // note: ignores next directive
      percentRe = /^%/,
      requoteRe = /[\\^$*+?|[\]().{}]/g;

  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    return new Map(names.map((name, i) => [name.toLowerCase(), i]));
  }

  function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseQuarter(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + timeDay.count(timeYear(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
  }

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(timeYear(d) - 1, d), p, 2);
  }

  function dISO(d) {
    var day = d.getDay();
    return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
  }

  function formatWeekNumberISO(d, p) {
    d = dISO(d);
    return pad(thursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(monday.count(timeYear(d) - 1, d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatYearISO(d, p) {
    d = dISO(d);
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatFullYearISO(d, p) {
    var day = d.getDay();
    d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay$1.count(utcYear$1(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear$1(d) - 1, d), p, 2);
  }

  function UTCdISO(d) {
    var day = d.getUTCDay();
    return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
  }

  function formatUTCWeekNumberISO(d, p) {
    d = UTCdISO(d);
    return pad(utcThursday.count(utcYear$1(d), d) + (utcYear$1(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear$1(d) - 1, d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCYearISO(d, p) {
    d = UTCdISO(d);
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCFullYearISO(d, p) {
    var day = d.getUTCDay();
    d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUnixTimestamp(d) {
    return +d;
  }

  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
  }

  var locale$1;
  var timeFormat;

  defaultLocale$1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale$1(definition) {
    locale$1 = formatLocale$1(definition);
    timeFormat = locale$1.format;
    locale$1.parse;
    locale$1.utcFormat;
    locale$1.utcParse;
    return locale$1;
  }

  /**
   * Return the day of the year for the date
   * @param  Date
   * @return  int Day of the year [1,366]
   */
  function getDayOfYear() {
    return timeFormat('%j');
  }

  /**
   * Return the week number of the year
   * Monday as the first day of the week
   * @return int  Week number [0-53]
   */
  function getWeekNumber(d, weekStartOnMonday) {
    const f = weekStartOnMonday === true ? timeFormat('%W') : timeFormat('%U');
    return f(d);
  }

  /**
   * Return the week number, relative to its month
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Week number, relative to the month [0-5]
   */
  function getMonthWeekNumber(d, weekStartOnMonday) {
    if (typeof d === 'number') {
      d = new Date(d);
    }

    const monthFirstWeekNumber = getWeekNumber(
      new Date(d.getFullYear(), d.getMonth()),
      weekStartOnMonday
    );
    return getWeekNumber(d, weekStartOnMonday) - monthFirstWeekNumber - 1;
  }

  /**
   * Return the number of days in the date's month
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Number of days in the date's month
   */
  function getDayCountInMonth(d) {
    return getEndOfMonth(d).getDate();
  }

  /**
   * Return the number of days in the date's year
   *
   * @param  int|Date d Date or timestamp in milliseconds
   * @return int Number of days in the date's year
   */
  function getDayCountInYear(d) {
    if (typeof d === 'number') {
      d = new Date(d);
    }
    return new Date(d.getFullYear(), 1, 29).getMonth() === 1 ? 366 : 365;
  }

  /**
   * Get the weekday from a date
   *
   * Return the week day number (0-6) of a date,
   * depending on whether the week start on monday or sunday
   *
   * @param  Date d
   * @return int The week day number (0-6)
   */
  function getWeekDay(d, weekStartOnMonday) {
    if (weekStartOnMonday === false) {
      return d.getDay();
    }
    return d.getDay() === 0 ? 6 : d.getDay() - 1;
  }

  /**
   * Get the last day of the month
   * @param  Date|int  d  Date or timestamp in milliseconds
   * @return Date      Last day of the month
   */
  function getEndOfMonth(d) {
    if (typeof d === 'number') {
      d = new Date(d);
    }
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  /**
   * Returns wether or not dateA is less than or equal to dateB. This function is subdomain aware.
   * Performs automatic conversion of values.
   * @param dateA may be a number or a Date
   * @param dateB may be a number or a Date
   * @returns {boolean}
   */
  function dateIsLessThan(dateA, dateB, options) {
    if (!(dateA instanceof Date)) {
      dateA = new Date(dateA);
    }

    if (!(dateB instanceof Date)) {
      dateB = new Date(dateB);
    }

    function normalizedMillis(date, subdomain) {
      switch (subdomain) {
        case 'x_min':
        case 'min':
          return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes()
          ).getTime();
        case 'x_hour':
        case 'hour':
          return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours()
          ).getTime();
        case 'x_day':
        case 'day':
          return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime();
        case 'x_week':
        case 'week':
        case 'x_month':
        case 'month':
          return new Date(date.getFullYear(), date.getMonth()).getTime();
        default:
          return date.getTime();
      }
    }

    return (
      normalizedMillis(dateA, options.subDomain) <
      normalizedMillis(dateB, options.subDomain)
    );
  }

  /**
   * Return whether 2 dates are equals
   * This function is subdomain-aware,
   * and dates comparison are dependent of the subdomain
   *
   * @param  Date dateA First date to compare
   * @param  Date dateB Secon date to compare
   * @return bool true if the 2 dates are equals
   */
  function dateIsEqual(dateA, dateB, subDomain) {
    if (!(dateA instanceof Date)) {
      dateA = new Date(dateA);
    }

    if (!(dateB instanceof Date)) {
      dateB = new Date(dateB);
    }

    switch (subDomain) {
      case 'x_min':
      case 'min':
        return (
          dateA.getFullYear() === dateB.getFullYear() &&
          dateA.getMonth() === dateB.getMonth() &&
          dateA.getDate() === dateB.getDate() &&
          dateA.getHours() === dateB.getHours() &&
          dateA.getMinutes() === dateB.getMinutes()
        );
      case 'x_hour':
      case 'hour':
        return (
          dateA.getFullYear() === dateB.getFullYear() &&
          dateA.getMonth() === dateB.getMonth() &&
          dateA.getDate() === dateB.getDate() &&
          dateA.getHours() === dateB.getHours()
        );
      case 'x_day':
      case 'day':
        return (
          dateA.getFullYear() === dateB.getFullYear() &&
          dateA.getMonth() === dateB.getMonth() &&
          dateA.getDate() === dateB.getDate()
        );
      case 'x_week':
      case 'week':
        return (
          dateA.getFullYear() === dateB.getFullYear() &&
          getWeekNumber(dateA) === getWeekNumber(dateB)
        );
      case 'x_month':
      case 'month':
        return (
          dateA.getFullYear() === dateB.getFullYear() &&
          dateA.getMonth() === dateB.getMonth()
        );
      default:
        return false;
    }
  }

  /**
   *
   * @param  Date date
   * @param  int count
   * @param  string step
   * @return Date
   */
  function jumpDate(date, count, step) {
    const d = new Date(date);
    switch (step) {
      case 'hour':
        d.setHours(d.getHours() + count);
        break;
      case 'day':
        d.setHours(d.getHours() + count * 24);
        break;
      case 'week':
        d.setHours(d.getHours() + count * 24 * 7);
        break;
      case 'month':
        d.setMonth(d.getMonth() + count);
        break;
      case 'year':
        d.setFullYear(d.getFullYear() + count);
        break;
      default:
        throw new Error('Invalid step');
    }

    return new Date(d);
  }

  /**
   * Convert a keyword or an array of keyword/date to an array of date objects
   *
   * @param  {string|array|Date} value Data to convert
   * @return {array}       An array of Dates
   */
  function expandDateSetting$1(value) {
    if (!Array.isArray(value)) {
      value = [value];
    }

    return value
      .map(data => {
        if (data === 'now') {
          return new Date();
        }
        if (data instanceof Date) {
          return data;
        }
        return false;
      })
      .filter(d => d !== false);
  }

  /**
   * @return int
   */
  const computeDaySubDomainSize = (date, domain) => {
    switch (domain) {
      case 'year':
        return getDayCountInYear(date);
      case 'month':
        return getDayCountInMonth(date);
      case 'week':
        return 7;
      default:
        throw new Error('Invalid domain');
    }
  };

  /**
   * @return int
   */
  const computeMinSubDomainSize = (date, domain) => {
    switch (domain) {
      case 'hour':
        return 60;
      case 'day':
        return 60 * 24;
      case 'week':
        return 60 * 24 * 7;
      default:
        throw new Error('Invalid domain');
    }
  };

  /**
   * @return int
   */
  const computeHourSubDomainSize = (date, domain) => {
    switch (domain) {
      case 'day':
        return 24;
      case 'week':
        return 168;
      case 'month':
        return getDayCountInMonth(date) * 24;
      default:
        throw new Error('Invalid domain');
    }
  };

  /**
   * @return int
   */
  const computeWeekSubDomainSize = (date, domain, weekStartOnMonday) => {
    if (domain === 'month') {
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let endWeekNb = getWeekNumber(endOfMonth, weekStartOnMonday);
      let startWeekNb = getWeekNumber(
        new Date(date.getFullYear(), date.getMonth()),
        weekStartOnMonday,
      );

      if (startWeekNb > endWeekNb) {
        startWeekNb = 0;
        endWeekNb++;
      }

      return endWeekNb - startWeekNb + 1;
    }
    if (domain === 'year') {
      return getWeekNumber(
        new Date(date.getFullYear(), 11, 31),
        weekStartOnMonday,
      );
    }
  };

  // eslint-disable-next-line import/prefer-default-export
  function generateSubDomain(startDate, options) {
    let date = startDate;

    if (typeof date === 'number') {
      date = new Date(date);
    }

    switch (options.subDomain) {
      case 'x_min':
      case 'min':
        return generateTimeInterval(
          'min',
          date,
          computeMinSubDomainSize(date, options.domain),
        );
      case 'x_hour':
      case 'hour':
        return generateTimeInterval(
          'hour',
          date,
          computeHourSubDomainSize(date, options.domain),
        );
      case 'x_day':
      case 'day':
        return generateTimeInterval(
          'day',
          date,
          computeDaySubDomainSize(date, options.domain),
        );
      case 'x_week':
      case 'week':
        return generateTimeInterval(
          'week',
          date,
          computeWeekSubDomainSize(
            date,
            options.domain,
            options.weekStartOnMonday,
          ),
          options.weekStartOnMonday,
        );
      case 'x_month':
      case 'month':
        return generateTimeInterval('month', date, 12);
      default:
        throw new Error('Invalid subDomain');
    }
  }

  class Navigator {
    constructor(calendar) {
      this.calendar = calendar;
      this.maxDomainReached = false;
      this.minDomainReached = false;
    }

    loadNextDomain(n) {
      if (this.maxDomainReached || n === 0) {
        return false;
      }

      const { options } = this.calendar.options;

      const bound = this.loadNewDomains(
        generateTimeInterval(
          options.domain,
          this.#getNextDomain(),
          n,
          options.weekStartOnMonday,
        ),
        NAVIGATE_RIGHT,
      );

      this.calendar.afterLoadNextDomain(bound.end);
      this.#checkIfMaxDomainIsReached(
        this.#getNextDomain().getTime(),
        bound.start,
      );

      return true;
    }

    loadPreviousDomain(n) {
      if (this.minDomainReached || n === 0) {
        return false;
      }

      const { options } = this.calendar.options;

      const bound = this.loadNewDomains(
        generateTimeInterval(
          options.domain,
          this.calendar.getDomainKeys()[0],
          -n,
          options.weekStartOnMonday,
        ),
        NAVIGATE_LEFT,
      );

      this.calendar.afterLoadPreviousDomain(bound.start);
      this.#checkIfMinDomainIsReached(bound.start, bound.end);

      return true;
    }

    jumpTo(date, reset) {
      const domains = this.calendar.getDomainKeys();
      const firstDomain = domains[0];
      const lastDomain = domains[domains.length - 1];
      const { options } = this.calendar.options;

      if (date < firstDomain) {
        return this.loadPreviousDomain(
          generateTimeInterval(
            options.domain,
            firstDomain,
            date,
            options.weekStartOnMonday,
          ).length,
        );
      }
      if (reset) {
        return this.loadNextDomain(
          generateTimeInterval(
            options.domain,
            firstDomain,
            date,
            options.weekStartOnMonday,
          ).length,
        );
      }

      if (date > lastDomain) {
        return this.loadNextDomain(
          generateTimeInterval(
            options.domain,
            lastDomain,
            date,
            options.weekStartOnMonday,
          ).length,
        );
      }

      return false;
    }

    loadNewDomains(newDomains, direction = NAVIGATE_RIGHT) {
      const backward = direction === NAVIGATE_LEFT;
      let i = -1;
      let total = newDomains.length;
      let domains = this.calendar.getDomainKeys();
      const { options } = this.calendar.options;

      const buildSubDomain = (d) => ({
        t: this.calendar.domainSkeleton.at(options.subDomain).extractUnit(d),
        v: null,
      });

      // Remove out of bound domains from list of new domains to prepend
      while (++i < total) {
        if (backward && this.#minDomainIsReached(newDomains[i])) {
          newDomains = newDomains.slice(0, i + 1);
          break;
        }
        if (!backward && this.#maxDomainIsReached(newDomains[i])) {
          newDomains = newDomains.slice(0, i);
          break;
        }
      }

      newDomains = newDomains.slice(-options.range);

      for (i = 0, total = newDomains.length; i < total; i++) {
        this.calendar.domainCollection.set(
          newDomains[i].getTime(),
          generateSubDomain(newDomains[i], options, this.DTSDomain).map(
            buildSubDomain,
          ),
        );

        this.calendar.domainCollection.delete(
          backward ? domains.pop() : domains.shift(),
        );
      }

      domains = this.calendar.getDomainKeys();

      if (backward) {
        newDomains = newDomains.reverse();
      }

      this.calendar.calendarPainter.paint(direction);

      // getDatas(
      //   this.calendar,
      //   options,
      //   options.data,
      //   newDomains[0],
      //   generateSubDomain(
      //     newDomains[newDomains.length - 1],
      //     options,
      //     this.calendar.DTSDomain
      //   ).pop(),
      //   () => {
      //     this.calendar.fill(this.calendar.lastInsertedSvg);
      //   }
      // );

      this.#checkIfMinDomainIsReached(domains[0]);
      this.#checkIfMaxDomainIsReached(this.#getNextDomain().getTime());

      return {
        start: newDomains[backward ? 0 : 1],
        end: domains[domains.length - 1],
      };
    }

    #checkIfMinDomainIsReached(date, upperBound) {
      if (this.#minDomainIsReached(date)) {
        this.onMinDomainReached(true);
      }

      if (arguments.length === 2) {
        if (this.maxDomainReached && !this.#maxDomainIsReached(upperBound)) {
          this.onMaxDomainReached(false);
        }
      }
    }

    #checkIfMaxDomainIsReached(date, lowerBound) {
      if (this.#maxDomainIsReached(date)) {
        this.onMaxDomainReached(true);
      }

      if (arguments.length === 2) {
        if (this.minDomainReached && !this.#minDomainIsReached(lowerBound)) {
          this.onMinDomainReached(false);
        }
      }
    }

    /**
     * Get the n-th next domain after the calendar newest (rightmost) domain
     * @param  int n
     * @return Date The start date of the wanted domain
     */
    #getNextDomain(n = 1) {
      const { options } = this.calendar.options;

      return generateTimeInterval(
        options.domain,
        jumpDate(this.calendar.getDomainKeys().pop(), n, options.domain),
        n,
        options.weekStartOnMonday,
      )[0];
    }

    #setMinDomainReached(status) {
      this.minDomainReached = status;
    }

    #setMaxDomainReached(status) {
      this.maxDomainReached = status;
    }

    /**
     * Return whether a date is inside the scope determined by maxDate
     *
     * @param int datetimestamp The timestamp in ms to test
     * @return bool True if the specified date correspond to the calendar upper bound
     */
    #maxDomainIsReached(datetimestamp) {
      const { maxDate } = this.calendar.options.options;
      return maxDate !== null && maxDate.getTime() < datetimestamp;
    }

    /**
     * Return whether a date is inside the scope determined by minDate
     *
     * @param int datetimestamp The timestamp in ms to test
     * @return bool True if the specified date correspond to the calendar lower bound
     */
    #minDomainIsReached(datetimestamp) {
      const { minDate } = this.calendar.options.options;

      return minDate !== null && minDate.getTime() >= datetimestamp;
    }
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  // Given something array like (or null), returns something that is strictly an
  // array. This is used to ensure that array-like objects passed to d3.selectAll
  // or selection.selectAll are converted into proper arrays when creating a
  // selection; we don’t ever want to create a selection backed by a live
  // HTMLCollection or NodeList. However, note that selection.selectAll will use a
  // static NodeList as a group, since it safely derived from querySelectorAll.
  function array(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      return array(select.apply(this, arguments));
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection$1(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return Array.from(this.children);
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant$2(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$2(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection$1(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  // Given some data, this returns an array-like view of it: an object that
  // exposes a length property and allows numeric indexing. Note that unlike
  // selectAll, this isn’t worried about “live” collections because the resulting
  // array will only be used briefly while data is being bound. (It is possible to
  // cause the data to change while iterating by using a key function, but please
  // don’t; we’d rather avoid a gratuitous copy.)
  function arraylike(data) {
    return typeof data === "object" && "length" in data
      ? data // Array, TypedArray, NodeList, array-like
      : Array.from(data); // Map, Set, iterable, string, or anything else
  }

  function selection_exit() {
    return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
      enter = onenter(enter);
      if (enter) enter = enter.selection();
    } else {
      enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
      update = onupdate(update);
      if (update) update = update.selection();
    }
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(context) {
    var selection = context.selection ? context.selection() : context;

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection$1(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection$1(sortgroups, this._parents).order();
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS$1(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction$1(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS$1(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove$1(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction$1(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove$1 : typeof value === "function"
              ? styleFunction$1
              : styleConstant$1)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction$1
            : textConstant$1)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root$2 = [null];

  function Selection$1(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection$1([[document.documentElement]], root$2);
  }

  function selection_selection() {
    return this;
  }

  Selection$1.prototype = selection.prototype = {
    constructor: Selection$1,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
        : new Selection$1([[selector]], root$2);
  }

  var noop = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get$1(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$1(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var frame = 0, // is an animation frame pending?
      timeout$1 = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout$1 = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout$1) timeout$1 = clearTimeout(timeout$1);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(elapsed => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch("start", "end", "cancel", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set(node, id) {
    var schedule = get(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }

  function get(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout(start);

        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(node, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
      reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
      reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
      reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
      reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
      reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHex8: color_formatHex8,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHex8() {
    return this.rgb().formatHex8();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb() {
      return this;
    },
    clamp() {
      return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
    },
    displayable() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatHex8: rgb_formatHex8,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
  }

  function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
  }

  function rgb_formatRgb() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
  }

  function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
  }

  function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
  }

  function hex(value) {
    value = clampi(value);
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    clamp() {
      return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
    },
    displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
    }
  }));

  function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
  }

  function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
  }

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  const radians = Math.PI / 180;
  const degrees$1 = 180 / Math.PI;

  // https://observablehq.com/@mbostock/lab-and-rgb
  const K = 18,
      Xn = 0.96422,
      Yn = 1,
      Zn = 0.82521,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) return hcl2lab(o);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r),
        g = rgb2lrgb(o.g),
        b = rgb2lrgb(o.b),
        y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
    if (r === g && g === b) x = z = y; else {
      x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
      z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter(k) {
      return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker(k) {
      return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      x = Xn * lab2xyz(x);
      y = Yn * lab2xyz(y);
      z = Zn * lab2xyz(z);
      return new Rgb(
        lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
        lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
        lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * degrees$1;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl$1(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  function hcl2lab(o) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * radians;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }

  define(Hcl, hcl$1, extend(Color, {
    brighter(k) {
      return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker(k) {
      return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
    },
    rgb() {
      return hcl2lab(this).rgb();
    }
  }));

  var constant$1 = x => () => x;

  function linear$1(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear$1(a, d) : constant$1(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function numberArray(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0,
        c = b.slice(),
        i;
    return function(t) {
      for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
      return c;
    };
  }

  function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }

  function genericArray(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = interpolate$1(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b = +b, function(t) {
      return d.setTime(a * (1 - t) + b * t), d;
    };
  }

  function interpolateNumber(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolate$1(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function interpolate$1(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant$1(b)
        : (t === "number" ? interpolateNumber
        : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
        : b instanceof color ? interpolateRgb
        : b instanceof Date ? date
        : isNumberArray(b) ? numberArray
        : Array.isArray(b) ? genericArray
        : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
        : interpolateNumber)(a, b);
  }

  function interpolateRound(a, b) {
    return a = +a, b = +b, function(t) {
      return Math.round(a * (1 - t) + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var identity$3 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var svgNode;

  /* eslint-disable no-undef */
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity$3 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
  }

  function parseSvg(value) {
    if (value == null) return identity$3;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$3;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  function hcl(hue) {
    return function(start, end) {
      var h = hue((start = hcl$1(start)).h, (end = hcl$1(end)).h),
          c = nogamma(start.c, end.c),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.c = c(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }

  var interpolateHcl = hcl(hue);

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get(node, id).value[name];
    };
  }

  function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrConstantNS(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function attrFunctionNS(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
        : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
  }

  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }

  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }

  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get(this.node(), id).ease;
  }

  function easeVarying(id, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error;
      set(this, id).ease = v;
    };
  }

  function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection = selection.prototype.constructor;

  function transition_selection() {
    return new Selection(this._groups, this._parents);
  }

  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function styleFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

      schedule.on = on1;
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant(name, i, value), priority)
        .on("end.style." + name, null);
  }

  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }

  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction(tweenValue(this, "text", value))
        : textConstant(value == null ? "" : value + ""));
  }

  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }

  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};

      that.each(function() {
        var schedule = set(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }

        schedule.on = on1;
      });

      // The selection was empty, resolve end immediately
      if (size === 0) resolve();
    });
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id} not found`);
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  /**
   * Compute the position of a domain on the scrolling axis,
   * relative to the calendar
   *
   * Scrolling axis will depend on the calendar orientation
   */
  class DomainPosition {
    constructor() {
      // { key: timestamp, value: scrollingAxis position }
      this.positions = new Map();
    }

    getPosition(d) {
      return this.positions.get(d);
    }

    getPositionFromIndex(i) {
      return this.positions.get(this.getKeys()[i]);
    }

    getLast() {
      const domains = this.getKeys();
      return this.positions.get(domains[domains.length - 1]);
    }

    setPosition(d, position) {
      this.positions.set(d, position);
    }

    /**
     * Shifiting all domains to the left, by the specified value
     *
     * @param  {[type]} exitingDomainDim [description]
     * @return {[type]}                  [description]
     */
    shiftRightBy(exitingDomainDim) {
      this.positions.forEach((value, key) => {
        this.set(key, value - exitingDomainDim);
      });

      this.positions.delete(this.getKeys()[0]);
    }

    /**
     * Shifting all the domains to the right, by the specified value
     * @param  {[type]} enteringDomainDim [description]
     * @return {[type]}                   [description]
     */
    shiftLeftBy(enteringDomainDim) {
      this.positions.forEach((value, key) => {
        this.set(key, value + enteringDomainDim);
      });

      const domains = this.getKeys();

      this.positions.delete(domains[domains.length - 1]);
    }

    getKeys() {
      return Array.from(this.positions.keys()).sort();
    }

    getDomainPosition(
      enteringDomainDim,
      exitingDomainDim,
      navigationDir,
      domainIndex,
      graphDim,
      axis,
      domainDim,
    ) {
      let tmp = 0;
      switch (navigationDir) {
        case false:
          tmp = graphDim[axis];

          graphDim[axis] += domainDim;
          this.setPosition(domainIndex, tmp);
          return tmp;

        case NAVIGATE_RIGHT:
          this.setPosition(domainIndex, graphDim[axis]);

          enteringDomainDim = domainDim;
          exitingDomainDim = this.getPositionFromIndex(1);

          this.shiftRightBy(exitingDomainDim);
          return graphDim[axis];

        case NAVIGATE_LEFT:
          tmp = -domainDim;

          enteringDomainDim = -tmp;
          exitingDomainDim = graphDim[axis] - getLast();

          this.setPosition(domainIndex, tmp);
          this.shiftLeftBy(enteringDomainDim);
          return tmp;
        default:
          return false;
      }
    }
  }

  class DomainPainter {
    constructor(calendar) {
      this.calendar = calendar;
      this.domainPosition = new DomainPosition();

      // Dimensions of the internal area containing all the domains
      // Excluding all surrounding margins
      this.dimensions = {
        width: 0,
        height: 0,
      };
    }

    paint(navigationDir, root) {
      const { options } = this.calendar.options;

      // Painting all the domains
      const domainSvg = root
        .select('.graph')
        .selectAll('.graph-domain')
        .data(
          () => {
            const data = this.calendar.getDomainKeys();
            return navigationDir === NAVIGATE_LEFT ? data.reverse() : data;
          },
          (d) => d,
        );
      const enteringDomainDim = 0;
      const exitingDomainDim = 0;

      const svg = domainSvg
        .enter()
        .append('svg')
        .attr('width', (d) => {
          const width = this.getWidth(d, true);
          if (options.verticalOrientation) {
            this.dimensions.width = width;
          } else {
            this.dimensions.width += width;
          }
          return width;
        })
        .attr('height', (d) => {
          const height = this.getHeight(d, true);

          if (options.verticalOrientation) {
            this.dimensions.height += height;
          } else {
            this.dimensions.height = height;
          }

          return height;
        })
        .attr('x', (d) => {
          if (options.verticalOrientation) {
            return 0;
          }

          const domains = this.calendar.getDomainKeys();
          return domains.indexOf(d) * this.getWidth(d, true);
        })
        .attr('y', (d) => {
          if (options.verticalOrientation) {
            return this.domainPosition.getDomainPosition(
              enteringDomainDim,
              exitingDomainDim,
              navigationDir,
              d,
              this.dimensions,
              'height',
              this.getHeight(d, true),
            );
          }

          return 0;
        })
        .attr('class', (d) => this.#getClassName(d));

      this.lastInsertedSvg = svg;

      svg
        .append('rect')
        .attr(
          'width',
          (d) =>
            this.getWidth(d, true) - options.domainGutter - options.cellPadding,
        )
        .attr(
          'height',
          (d) =>
            this.getHeight(d, true) - options.domainGutter - options.cellPadding,
        )
        .attr('class', 'domain-background');

      if (navigationDir !== false) {
        domainSvg
          .transition()
          .duration(options.animationDuration)
          .attr('x', (d) =>
            options.verticalOrientation ? 0 : this.domainPosition.getPosition(d),
          )
          .attr('y', (d) =>
            options.verticalOrientation ? this.domainPosition.getPosition(d) : 0,
          );
      }

      // At the time of exit, domainsWidth and domainsHeight already automatically shifted
      domainSvg
        .exit()
        .transition()
        .duration(options.animationDuration)
        .attr('x', (d) => {
          if (options.verticalOrientation) {
            return 0;
          }

          if (navigationDir === NAVIGATE_LEFT) {
            return this.dimensions.width;
          }

          return -this.getWidth(d, true);
        })
        .attr('y', (d) => {
          if (options.verticalOrientation) {
            if (navigationDir === NAVIGATE_LEFT) {
              return this.dimensions.height;
            }

            return -this.getHeight(d, true);
          }
          return 0;
        })
        .attr('width', (d) => {
          const width = this.getWidth(d, true);
          if (!options.verticalOrientation) {
            this.dimensions.width -= width;
          }
          return width;
        })
        .attr('height', (d) => {
          const height = this.getHeight(d, true);

          if (options.verticalOrientation) {
            this.dimensions.height -= height;
          }
          return height;
        })
        .remove();

      return svg;
    }

    #getClassName(d) {
      let classname = 'graph-domain';
      const date = new Date(d);
      switch (this.calendar.options.options.domain) {
        case 'hour':
          classname += ` h_${date.getHours()}`;
          break;
        case 'day':
          classname += ` d_${date.getDate()} dy_${date.getDay()}`;
          break;
        case 'week':
          classname += ` w_${getWeekNumber(date)}`;
          break;
        case 'month':
          classname += ` m_${date.getMonth() + 1}`;
          break;
        case 'year':
          classname += ` y_${date.getFullYear()}`;
          break;
      }
      return classname;
    }

    // Return the width of the domain block, without the domain gutter
    // @param int d Domain start timestamp
    getWidth(d, outer = false) {
      const { options } = this.calendar.options;
      const columnsCount = this.calendar.domainSkeleton
        .at(options.subDomain)
        .column(d);

      let width = (options.cellSize + options.cellPadding) * columnsCount;

      if (outer) {
        width +=
          options.domainHorizontalLabelWidth +
          options.domainGutter +
          options.domainMargin[1] +
          options.domainMargin[3];
      }

      return width;
    }

    // Return the height of the domain block, without the domain gutter
    getHeight(d, outer = false) {
      const { options } = this.calendar.options;
      const rowsCount = this.calendar.domainSkeleton.at(options.subDomain).row(d);

      let height = (options.cellSize + options.cellPadding) * rowsCount;

      if (outer) {
        height +=
          options.domainGutter +
          options.domainVerticalLabelHeight +
          options.domainMargin[0] +
          options.domainMargin[2];
      }
      return height;
    }
  }

  function formatDecimal(x) {
    return Math.abs(x = Math.round(x)) >= 1e21
        ? x.toLocaleString("en").replace(/,/g, "")
        : x.toString(10);
  }

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimalParts(1.23) returns ["123", 0].
  function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatNumerals(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }

  formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
    this.align = specifier.align === undefined ? ">" : specifier.align + "";
    this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === undefined ? undefined : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === undefined ? "" : specifier.type + "";
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width === undefined ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
        + (this.trim ? "~" : "")
        + this.type;
  };

  // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
  function formatTrim(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "%": (x, p) => (x * 100).toFixed(p),
    "b": (x) => Math.round(x).toString(2),
    "c": (x) => x + "",
    "d": formatDecimal,
    "e": (x, p) => x.toExponential(p),
    "f": (x, p) => x.toFixed(p),
    "g": (x, p) => x.toPrecision(p),
    "o": (x) => Math.round(x).toString(8),
    "p": (x, p) => formatRounded(x * 100, p),
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": (x) => Math.round(x).toString(16).toUpperCase(),
    "x": (x) => Math.round(x).toString(16)
  };

  function identity$2(x) {
    return x;
  }

  var map = Array.prototype.map,
      prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function formatLocale(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined ? identity$2 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
        currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
        currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
        decimal = locale.decimal === undefined ? "." : locale.decimal + "",
        numerals = locale.numerals === undefined ? identity$2 : formatNumerals(map.call(locale.numerals, String)),
        percent = locale.percent === undefined ? "%" : locale.percent + "",
        minus = locale.minus === undefined ? "−" : locale.minus + "",
        nan = locale.nan === undefined ? "NaN" : locale.nan + "";

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          trim = specifier.trim,
          type = specifier.type;

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // The "" type, and any invalid type, is an alias for ".12~g".
      else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision === undefined ? 6
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Determine the sign. -0 is not less than 0, but 1 / -0 is!
          var valueNegative = value < 0 || 1 / value < 0;

          // Perform the initial formatting.
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

          // Trim insignificant zeros.
          if (trim) value = formatTrim(value);

          // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
          if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": value = valuePrefix + value + valueSuffix + padding; break;
          case "=": value = valuePrefix + padding + value + valueSuffix; break;
          case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
          default: value = padding + valuePrefix + value + valueSuffix; break;
        }

        return numerals(value);
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  var format;
  var formatPrefix;

  defaultLocale({
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  }

  /**
   * Check if 2 arrays are equals
   *
   * @link http://stackoverflow.com/a/14853974/805649
   * @param  array array the array to compare to
   * @return bool true of the 2 arrays are equals
   */
  function arrayEquals(arrayA, arrayB) {
    // if the other array is a falsy value, return
    if (!arrayB || !arrayA) {
      return false;
    }

    // compare lengths - can save a lot of time
    if (arrayA.length !== arrayB.length) {
      return false;
    }

    for (let i = 0; i < arrayA.length; i++) {
      // Check if we have nested arrays
      if (arrayA[i] instanceof Array && arrayB[i] instanceof Array) {
        // recurse into the nested arrays
        if (!arrayEquals(arrayA[i], arrayB[i])) {
          return false;
        }
      } else if (arrayA[i] !== arrayB[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  }

  function formatNumber() {
    return format(',d');
  }

  function formatDate(d, formatter = 'title') {
    if (typeof formatter === 'function') {
      return formatter(d);
    }
    const f = timeFormat(formatter);
    return f(d);
  }

  /**
   * Expand a number of an array of numbers to an usable 4 values array
   *
   * @param  {integer|array} value
   * @return {array}        array
   */
  function expandMarginSetting(value) {
    if (typeof value === 'number') {
      value = [value];
    }

    if (!Array.isArray(value)) {
      console.log('Margin only takes an integer or an array of integers');
      value = [0];
    }

    switch (value.length) {
      case 1:
        return [value[0], value[0], value[0], value[0]];
      case 2:
        return [value[0], value[1], value[0], value[1]];
      case 3:
        return [value[0], value[1], value[2], value[1]];
      case 4:
        return value;
      default:
        return value.slice(0, 4);
    }
  }

  /**
   * Convert a string to an array like [singular-form, plural-form]
   *
   * @param  {string|array} value Date to convert
   * @return {array}       An array like [singular-form, plural-form]
   */
  function expandItemName(value) {
    if (typeof value === 'string') {
      return [value, value + (value !== '' ? 's' : '')];
    }

    if (Array.isArray(value)) {
      if (value.length === 1) {
        return [value[0], `${value[0]}s`];
      }
      if (value.length > 2) {
        return value.slice(0, 2);
      }

      return value;
    }

    return ['item', 'items'];
  }

  /**
   * Sprintf like function.
   * Replaces placeholders {0} in string with values from provided object.
   *
   * @param string formatted String containing placeholders.
   * @param object args Object with properties to replace placeholders in string.
   *
   * @return String
   */
  function formatStringWithObject(formatted, args) {
    for (const prop in args) {
      if (args.hasOwnProperty(prop)) {
        const regexp = new RegExp(`\\{${prop}\\}`, 'gi');
        formatted = formatted.replace(regexp, args[prop]);
      }
    }
    return formatted;
  }

  /**
   * Return a classname if the specified date should be highlighted
   *
   * @param  timestamp date Date of the current subDomain
   * @return String the highlight class
   */
  function getHighlightClassName(d, options) {
    d = new Date(d);

    if (options.highlight.length > 0) {
      for (const i in options.highlight) {
        if (dateIsEqual(options.highlight[i], d, options.subDomain)) {
          return dateIsEqual(options.highlight[i])
            ? ' highlight-now'
            : ' highlight';
        }
      }
    }
    return '';
  }

  class subDomainPainter {
    constructor(calendar) {
      this.calendar = calendar;
    }

    paint(root) {
      const { options } = this.calendar.options;

      const subDomainSvgGroup = root
        .append('svg')
        .attr('x', () => {
          if (options.label.position === 'left') {
            return options.domainHorizontalLabelWidth + options.domainMargin[3];
          }
          return options.domainMargin[3];
        })
        .attr('y', () => {
          if (options.label.position === 'top') {
            return options.domainVerticalLabelHeight + options.domainMargin[0];
          }

          return options.domainMargin[0];
        })
        .attr('class', 'graph-subdomain-group');

      const rect = subDomainSvgGroup
        .selectAll('g')
        .data(d => this.calendar.domainCollection.get(d))
        .enter()
        .append('g');

      rect
        .append('rect')
        .attr(
          'class',
          d =>
            `graph-rect${getHighlightClassName(d.t, options)}${
            options.onClick !== null ? ' hover_cursor' : ''
          }`
        )
        .attr('width', options.cellSize)
        .attr('height', options.cellSize)
        .attr('x', d => this.#getX(d.t))
        .attr('y', d => this.#getY(d.t))
        .on('click', (ev, d) => this.calendar.onClick(new Date(d.t), d.v))
        .on('mouseover', d => this.calendar.onMouseOver(new Date(d.t), d.v))
        .on('mouseout', d => this.calendar.onMouseOut(new Date(d.t), d.v))
        .call(selection => {
          if (options.cellRadius > 0) {
            selection
              .attr('rx', options.cellRadius)
              .attr('ry', options.cellRadius);
          }

          if (
            this.calendar.legendScale !== null &&
            options.legendColors !== null &&
            options.legendColors.hasOwnProperty('base')
          ) {
            selection.attr('fill', options.legendColors.base);
          }

          if (options.tooltip) {
            this.calendar.calendarPainter.tooltip.update(selection);
          }
        });

      if (!options.tooltip) {
        this.#appendTitle(rect);
      }

      if (options.subDomainTextFormat !== null) {
        this.#appendText(rect);
      }
    }

    #appendText(elem) {
      const { options } = this.calendar.options;

      elem
        .append('text')
        .attr(
          'class',
          d => `subdomain-text${getHighlightClassName(d.t, options)}`
        )
        .attr('x', d => this.#getX(d.t) + options.cellSize / 2)
        .attr('y', d => this.#getY(d.t) + options.cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(d => formatDate(new Date(d.t), options.subDomainTextFormat));
    }

    #appendTitle(elem) {
      const { options } = this.calendar.options;

      elem
        .append('title')
        .text(d => formatDate(new Date(d.t), options.subDomainDateFormat));
    }

    #getX(d) {
      const { options } = this.calendar.options;

      const index = this.calendar.domainSkeleton
        .at(options.subDomain)
        .position.x(new Date(d));

      return index * (options.cellSize + options.cellPadding);
    }

    #getY(d) {
      const { options } = this.calendar.options;

      const index = this.calendar.domainSkeleton
        .at(options.subDomain)
        .position.y(new Date(d));

      return index * (options.cellSize + options.cellPadding);
    }
  }

  class LabelPainter {
    constructor(calendar) {
      this.calendar = calendar;
    }

    paint(root) {
      const { options } = this.calendar.options;

      if (options.domainLabelFormat === '') {
        return false;
      }

      root
        .append('text')
        .attr('class', 'graph-label')
        .attr('y', (d) => {
          let y = options.domainMargin[0];

          if (options.label.position === 'top') {
            y += options.domainVerticalLabelHeight / 2;
          } else {
            y +=
              this.calendar.calendarPainter.domainPainter.getHeight(d) +
              options.domainVerticalLabelHeight / 2;
          }

          return (
            y +
            options.label.offset.y *
              ((options.label.rotate === 'right' &&
                options.label.position === 'right') ||
              (options.label.rotate === 'left' &&
                options.label.position === 'left')
                ? -1
                : 1)
          );
        })
        .attr('x', (d) => {
          let x = options.domainMargin[3];

          switch (options.label.position) {
            case 'right':
              x += this.calendar.calendarPainter.domainPainter.getWidth(d);
              break;
            case 'bottom':
            case 'top':
              x += this.calendar.calendarPainter.domainPainter.getWidth(d) / 2;
          }

          if (options.label.align === 'right') {
            return (
              x +
              options.domainHorizontalLabelWidth -
              options.label.offset.x * (options.label.rotate === 'right' ? -1 : 1)
            );
          }
          return x + options.label.offset.x;
        })
        .attr('text-anchor', () => {
          switch (options.label.align) {
            case 'start':
            case 'left':
              return 'start';
            case 'end':
            case 'right':
              return 'end';
            default:
              return 'middle';
          }
        })
        .attr('dominant-baseline', () =>
          options.verticalDomainLabel ? 'middle' : 'top',
        )
        .text((d) => formatDate(new Date(d), options.domainLabelFormat))
        .call((s) => this.#domainRotate(s));
    }

    #domainRotate(selection) {
      const { options } = this.calendar.options;

      switch (options.label.rotate) {
        case 'right':
          selection.attr('transform', (d) => {
            let s = 'rotate(90), ';
            switch (options.label.position) {
              case 'right':
                s += `translate(-${this.calendar.calendarPainter.domainPainter.getWidth(
                d,
              )} , -${this.calendar.calendarPainter.domainPainter.getWidth(
                d,
              )})`;
                break;
              case 'left':
                s += `translate(0, -${options.domainHorizontalLabelWidth})`;
                break;
            }

            return s;
          });
          break;
        case 'left':
          selection.attr('transform', (d) => {
            let s = 'rotate(270), ';
            switch (options.label.position) {
              case 'right':
                s += `translate(-${
                this.calendar.calendarPainter.domainPainter.getWidth(d) +
                options.domainHorizontalLabelWidth
              } , ${this.calendar.calendarPainter.domainPainter.getWidth(d)})`;
                break;
              case 'left':
                s += `translate(-${options.domainHorizontalLabelWidth} , ${options.domainHorizontalLabelWidth})`;
                break;
            }

            return s;
          });
          break;
      }
    }
  }

  class SubLabelPainter {
    constructor(calendar) {
      this.calendar = calendar;
    }

    paint(root) {
      this.calendar.options;

      return true;

      // if (
      //   options.dayLabel &&
      //   options.domain === 'month' &&
      //   options.subDomain === 'day'
      // ) {
      //   // Create a list of all day names starting with Sunday or Monday, depending on configuration
      //   const daysOfTheWeek = [
      //     'monday',
      //     'tuesday',
      //     'wednesday',
      //     'thursday',
      //     'friday',
      //     'saturday',
      //   ];
      //   if (options.weekStartOnMonday) {
      //     daysOfTheWeek.push('sunday');
      //   } else {
      //     daysOfTheWeek.shif('sunday');
      //   }
      //   // Get the first character of the day name
      //   const daysOfTheWeekAbbr = daysOfTheWeek.map(day =>
      //     formatDate(time[day](new Date()), '%a').charAt(0)
      //   );

      //   // Append "day-name" group to SVG
      //   const dayLabelSvgGroup = root
      //     .append('svg')
      //     .attr('class', 'day-name')
      //     .attr('x', 0)
      //     .attr('y', 0);

      //   const dayLabelSvg = dayLabelSvgGroup
      //     .selectAll('g')
      //     .data(daysOfTheWeekAbbr)
      //     .enter()
      //     .append('g');
      //   // Styling "day-name-rect" elements
      //   dayLabelSvg
      //     .append('rect')
      //     .attr('class', 'day-name-rect')
      //     .attr('width', options.cellSize)
      //     .attr('height', options.cellSize)
      //     .attr('x', 0)
      //     .attr(
      //       'y',
      //       (data, index) =>
      //         index * options.cellSize + index * options.cellPadding
      //     );
      //   // Adding day names to SVG
      //   dayLabelSvg
      //     .append('text')
      //     .attr('class', 'day-name-text')
      //     .attr('dominant-baseline', 'central')
      //     .attr('x', 0)
      //     .attr(
      //       'y',
      //       (data, index) =>
      //         index * options.cellSize +
      //         index * options.cellPadding +
      //         options.cellSize / 2
      //     )
      //     .text(data => data);
      // }
    }
  }

  function initRange(domain, range) {
    switch (arguments.length) {
      case 0: break;
      case 1: this.range(domain); break;
      default: this.range(range).domain(domain); break;
    }
    return this;
  }

  function constants(x) {
    return function() {
      return x;
    };
  }

  function number(x) {
    return +x;
  }

  var unit = [0, 1];

  function identity$1(x) {
    return x;
  }

  function normalize(a, b) {
    return (b -= (a = +a))
        ? function(x) { return (x - a) / b; }
        : constants(isNaN(b) ? NaN : 0.5);
  }

  function clamper(a, b) {
    var t;
    if (a > b) t = a, a = b, b = t;
    return function(x) { return Math.max(a, Math.min(b, x)); };
  }

  // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
  function bimap(domain, range, interpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
    else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
    return function(x) { return r0(d0(x)); };
  }

  function polymap(domain, range, interpolate) {
    var j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++i < j) {
      d[i] = normalize(domain[i], domain[i + 1]);
      r[i] = interpolate(range[i], range[i + 1]);
    }

    return function(x) {
      var i = bisect(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp())
        .unknown(source.unknown());
  }

  function transformer() {
    var domain = unit,
        range = unit,
        interpolate = interpolate$1,
        transform,
        untransform,
        unknown,
        clamp = identity$1,
        piecewise,
        output,
        input;

    function rescale() {
      var n = Math.min(domain.length, range.length);
      if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
      piecewise = n > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
    }

    scale.invert = function(y) {
      return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
    };

    scale.domain = function(_) {
      return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = Array.from(_), interpolate = interpolateRound, rescale();
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
    };

    scale.interpolate = function(_) {
      return arguments.length ? (interpolate = _, rescale()) : interpolate;
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    return function(t, u) {
      transform = t, untransform = u;
      return rescale();
    };
  }

  function continuous() {
    return transformer()(identity$1, identity$1);
  }

  function tickFormat(start, stop, count, specifier) {
    var step = tickStep(start, stop, count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function(count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function(count, specifier) {
      var d = domain();
      return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
    };

    scale.nice = function(count) {
      if (count == null) count = 10;

      var d = domain();
      var i0 = 0;
      var i1 = d.length - 1;
      var start = d[i0];
      var stop = d[i1];
      var prestep;
      var step;
      var maxIter = 10;

      if (stop < start) {
        step = start, start = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }
      
      while (maxIter-- > 0) {
        step = tickIncrement(start, stop, count);
        if (step === prestep) {
          d[i0] = start;
          d[i1] = stop;
          return domain(d);
        } else if (step > 0) {
          start = Math.floor(start / step) * step;
          stop = Math.ceil(stop / step) * step;
        } else if (step < 0) {
          start = Math.ceil(start * step) / step;
          stop = Math.floor(stop * step) / step;
        } else {
          break;
        }
        prestep = step;
      }

      return scale;
    };

    return scale;
  }

  function linear() {
    var scale = continuous();

    scale.copy = function() {
      return copy(scale, linear());
    };

    initRange.apply(scale, arguments);

    return linearish(scale);
  }

  function threshold() {
    var domain = [0.5],
        range = [0, 1],
        unknown,
        n = 1;

    function scale(x) {
      return x != null && x <= x ? range[bisect(domain, x, 0, n)] : unknown;
    }

    scale.domain = function(_) {
      return arguments.length ? (domain = Array.from(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = Array.from(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
    };

    scale.invertExtent = function(y) {
      var i = range.indexOf(y);
      return [domain[i - 1], domain[i]];
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function() {
      return threshold()
          .domain(domain)
          .range(range)
          .unknown(unknown);
    };

    return initRange.apply(scale, arguments);
  }

  class LegendColor {
    constructor(calendar) {
      this.calendar = calendar;
      this.scale = null;
    }

    build() {
      const { options } = this.calendar.options;

      if (options.legendColors === null) {
        this.scale = null;
        return false;
      }

      let colorRange = [];

      if (Array.isArray(options.legendColors)) {
        colorRange = options.legendColors;
      } else if (
        options.legendColors.hasOwnProperty('min') &&
        options.legendColors.hasOwnProperty('max')
      ) {
        colorRange = [options.legendColors.min, options.legendColors.max];
      } else {
        options.legendColors = null;
        return false;
      }

      const legend = options.legend.slice(0);

      if (legend[0] > 0) {
        legend.unshift(0);
      } else if (legend[0] <= 0) {
        // Let's guess the leftmost value, it we have to add one
        legend.unshift(
          legend[0] - (legend[legend.length - 1] - legend[0]) / legend.length
        );
      }

      const colorScale = linear()
        .range(colorRange)
        .interpolate(interpolateHcl)
        .domain([Math.min(...legend), Math.max(...legend)]);
      const legendColors = legend.map(element => colorScale(element));
      this.scale = threshold().domain(options.legend).range(legendColors);

      return true;
    }
  }

  const DEFAULT_CLASSNAME = '.graph-legend';

  class Legend {
    constructor(calendar) {
      this.calendar = calendar;
      this.legendColor = new LegendColor(calendar);

      this.dimensions = {
        width: 0,
        height: 0,
      };
      this.shown = calendar.options.options.displayLegend;
      this.root = null;
    }

    #legendCellLayout(selection) {
      const { legendCellSize, legendCellPadding } = this.calendar.options.options;
      selection
        .attr('width', legendCellSize)
        .attr('height', legendCellSize)
        .attr('x', (d, i) => i * (legendCellSize + legendCellPadding));
    }

    #getXPosition(width) {
      const { options } = this.calendar.options;

      switch (options.legendHorizontalPosition) {
        case 'right':
          if (
            options.legendVerticalPosition === 'center' ||
            options.legendVerticalPosition === 'middle'
          ) {
            return width + options.legendMargin[3];
          }
          return width - this.getWidth() - options.legendMargin[1];
        case 'middle':
        case 'center':
          return Math.round(width / 2 - this.getWidth() / 2);
        default:
          return options.legendMargin[3];
      }
    }

    #getYPosition() {
      const { options } = this.calendar.options;

      if (options.legendVerticalPosition === 'bottom') {
        return (
          this.calendar.calendarPainter.domainPainter.getHeight() +
          options.legendMargin[0] +
          options.domainGutter +
          options.cellPadding
        );
      }
      return options.legendMargin[0];
    }

    #computeDimensions() {
      const { options } = this.calendar.options;

      this.dimensions = {
        width:
          options.legendCellSize * (options.legend.length + 1) +
          options.legendCellPadding * options.legend.length,
        height: options.legendCellSize,
      };
    }

    destroy(root) {
      if (!this.shown) {
        return false;
      }

      this.shown = false;
      root.select(DEFAULT_CLASSNAME).remove();

      return true;
    }

    paint(root) {
      if (this.calendar.options.options.legendColors !== null) {
        this.legendColor.build();
      }

      const { calendar } = this;
      const { options } = calendar.options;
      const width =
        calendar.calendarPainter.getWidth() -
        options.domainGutter -
        options.cellPadding;
      let legend = calendar.calendarPainter.root;
      let legendItem;
      this.shown = true;

      this.#computeDimensions();

      const legendItems = options.legend.slice(0);
      legendItems.push(legendItems[legendItems.length - 1] + 1);

      const legendElement = root.select(DEFAULT_CLASSNAME);
      if (!legendElement.empty()) {
        legend = legendElement;
        legendItem = legend.select('g').selectAll('rect').data(legendItems);
      } else {
        // Creating the new legend DOM if it doesn't already exist
        legend =
          options.legendVerticalPosition === 'top'
            ? legend.insert('svg', '.graph')
            : legend.append('svg');

        legend
          .attr('x', this.#getXPosition(width))
          .attr('y', this.#getYPosition());

        legendItem = legend
          .attr('class', 'graph-legend')
          .attr('height', this.getHeight())
          .attr('width', this.getWidth())
          .append('g')
          .selectAll()
          .data(legendItems);
      }

      legendItem
        .enter()
        .append('rect')
        .call((s) => this.#legendCellLayout(s))
        .attr('class', (d) =>
          this.getClassName(d, this.legendColor.scale === null),
        )
        .call((selection) => {
          if (
            this.legendColor.scale !== null &&
            options.legendColors !== null &&
            options.legendColors.hasOwnProperty('base')
          ) {
            selection.attr('fill', options.legendColors.base);
          }
        })
        .append('title');

      legendItem.exit().transition().duration(options.animationDuration).remove();

      legendItem
        .transition()
        .delay((d, i) => (options.animationDuration * i) / 10)
        .call((s) => this.#legendCellLayout(s))
        .call((element) => {
          element.attr('fill', (d, i) => {
            if (this.legendColor.scale === null) {
              return '';
            }

            if (i === 0) {
              return this.legendColor.scale(d - 1);
            }
            return this.legendColor.scale(options.legend[i - 1]);
          });

          element.attr('class', (d) =>
            this.getClassName(d, this.legendColor.scale === null),
          );
        });

      legendItem.select('title').text((d, i) => {
        if (i === 0) {
          return formatStringWithObject(options.legendTitleFormat.lower, {
            min: options.legend[i],
            name: options.itemName[1],
          });
        }
        if (i === legendItems.length - 1) {
          return formatStringWithObject(options.legendTitleFormat.upper, {
            max: options.legend[i - 1],
            name: options.itemName[1],
          });
        }
        return formatStringWithObject(options.legendTitleFormat.inner, {
          down: options.legend[i - 1],
          up: options.legend[i],
          name: options.itemName[1],
        });
      });

      legend
        .transition()
        .duration(options.animationDuration)
        .attr('x', this.#getXPosition(width))
        .attr('y', this.#getYPosition())
        .attr('width', this.getWidth())
        .attr('height', this.getHeight());

      legend
        .select('g')
        .transition()
        .duration(options.animationDuration)
        .attr('transform', () => {
          if (options.legendOrientation === 'vertical') {
            return `rotate(90 ${options.legendCellSize / 2} ${
            options.legendCellSize / 2
          })`;
          }
          return '';
        });

      return true;
    }

    /**
     * Return the dimension of the legend
     *
     * Takes into account rotation
     *
     * @param  string axis Width or height
     * @return int height or width in pixels
     */
    #getDimensions(axis) {
      const isHorizontal =
        this.calendar.options.options.legendOrientation === 'horizontal';

      switch (axis) {
        case 'height':
          return this.dimensions[isHorizontal ? 'height' : 'width'];
        case 'width':
          return this.dimensions[isHorizontal ? 'width' : 'height'];
        default:
          throw new Error('Invalid axis');
      }
    }

    getWidth() {
      return this.#getDimensions('width');
    }

    getHeight() {
      return this.#getDimensions('height');
    }

    /**
     * Return the classname on the legend for the specified value
     *
     * @param integer n Value associated to a date
     * @param bool withCssClass Whether to display the css class used to style the cell.
     *                          Disabling will allow styling directly via html fill attribute
     *
     * @return string Classname according to the legend
     */
    getClassName(n, withCssClass) {
      if (n === null || isNaN(n)) {
        return '';
      }

      const { legend } = this.calendar.options.options;
      let index = [legend.length + 1];

      for (let i = 0, total = legend.length - 1; i <= total; i++) {
        if (legend[0] > 0 && n < 0) {
          index = ['1', 'i'];
          break;
        }

        if (n <= legend[i]) {
          index = [i + 1];
          break;
        }
      }

      if (n === 0) {
        index.push(0);
      }

      index.unshift('');
      return (index.join(' r') + (withCssClass ? index.join(' q') : '')).trim();
    }
  }

  function getSubDomainTitle(d, options, connector) {
    if (d.v === null && !options.considerMissingDataAsZero) {
      return formatStringWithObject(options.subDomainTitleFormat.empty, {
        date: formatDate(new Date(d.t), options.subDomainDateFormat),
      });
    }
    let value = d.v;
    // Consider null as 0
    if (value === null && options.considerMissingDataAsZero) {
      value = 0;
    }

    return formatStringWithObject(options.subDomainTitleFormat.filled, {
      count: formatNumber(),
      name: options.itemName[value !== 1 ? 1 : 0],
      connector,
      date: formatDate(new Date(d.t), options.subDomainDateFormat),
    });
  }

  class Tooltip {
    constructor(calendar) {
      this.calendar = calendar;
      this.node = null;
    }

    init() {
      const { itemSelector } = this.calendar.options.options;

      this.node = select(itemSelector)
        .attr('style', () => {
          const current = select(itemSelector).attr('style');
          return `${current !== null ? current : ''}position:relative;`;
        })
        .append('div')
        .attr('class', 'ch-tooltip');
    }

    update(element) {
      const { options } = this.calendar.options;

      element.on('mouseover', (ev, d) => {
        if (options.onTooltip) {
          this.#setTitle(options.onTooltip(new Date(d.t), d.v));
        } else {
          this.#setTitle(getSubDomainTitle(d, options));
        }

        this.#show(ev.target);
      });

      element.on('mouseout', () => this.#hide());
    }

    #getCoordinates(axis, cell) {
      const { options } = this.calendar.options;
      const domainNode = cell.parentNode.parentNode;

      let coordinate =
        cell.getAttribute(axis) -
        (axis === 'x'
          ? this.node.node().offsetWidth / 2 - options.cellSize / 2
          : this.node.node().offsetHeight + options.cellSize);
      // Offset by the domain position
      coordinate += parseInt(domainNode.getAttribute(axis), 10);

      // Offset by the calendar position (when legend is left/top)
      coordinate += parseInt(
        this.calendar.calendarPainter.root.select('.graph').attr(axis) || 0,
        10
      );

      // Offset by the inside domain position (when label is left/top)
      coordinate += parseInt(domainNode.parentNode.getAttribute(axis), 10);

      return coordinate;
    }

    #getX(cell) {
      return this.#getCoordinates('x', cell);
    }

    #getY(cell) {
      return this.#getCoordinates('y', cell);
    }

    #setTitle(title) {
      this.node.html(title);
    }

    #show(cell) {
      // Force display:block, because `offsetHeight` returns 0 on hidden element
      this.node.attr('style', 'display: block;');
      this.node.attr(
        'style',
        'display: block;' +
          `left: ${this.#getX(cell)}px; ` +
          `top: ${this.#getY(cell)}px;`
      );
    }

    #hide() {
      this.node.attr('style', 'display:none').html('');
    }
  }

  class CalendarPainter {
    constructor(calendar) {
      this.calendar = calendar;
      this.graphDimensions = {
        width: 0,
        height: 0,
      };
      this.root = null;
      this.tooltip = new Tooltip(calendar);
      this.domainPainter = new DomainPainter(calendar);
      this.subDomainPainter = new subDomainPainter(calendar);
      this.labelPainter = new LabelPainter(calendar);
      this.subLabelPainter = new SubLabelPainter(calendar);
      this.legend = new Legend(calendar);

      // Record the address of the last inserted domain when browsing
      this.lastInsertedSvg = null;
    }

    setup() {
      const { itemSelector } = this.calendar.options.options;

      this.root = select(itemSelector)
        .append('svg')
        .attr('class', 'cal-heatmap-container');

      this.tooltip.init(this.root);

      this.root.attr('x', 0).attr('y', 0).append('svg').attr('class', 'graph');

      this.#attachNavigationEvents();

      return true;
    }

    #attachNavigationEvents() {
      const { options } = this.calendar;

      if (options.nextSelector !== false) {
        select(options.nextSelector).on(
          `click.${options.itemNamespace}`,
          (ev) => {
            ev.preventDefault();
            return this.calendar.next(1);
          },
        );
      }

      if (options.previousSelector !== false) {
        select(options.previousSelector).on(
          `click.${options.itemNamespace}`,
          (ev) => {
            ev.preventDefault();
            return this.calendar.previous(1);
          },
        );
      }
    }

    paint(navigationDir = false) {
      const domainSvg = this.domainPainter.paint(navigationDir, this.root);
      this.subDomainPainter.paint(domainSvg);
      this.subLabelPainter.paint(domainSvg);
      this.labelPainter.paint(domainSvg);
      this.legend.paint(this.root);

      this.resize();

      return true;
    }

    getHeight() {
      const { options } = this.calendar.options;

      const legendHeight = options.displayLegend
        ? this.legend.getHeight() +
          options.legendMargin[0] +
          options.legendMargin[2]
        : 0;

      if (
        options.legendVerticalPosition === 'middle' ||
        options.legendVerticalPosition === 'center'
      ) {
        return Math.max(this.domainPainter.dimensions.height, legendHeight);
      }
      return this.domainPainter.dimensions.height + legendHeight;
    }

    getWidth() {
      const { options } = this.calendar.options;

      const legendWidth = options.displayLegend
        ? this.legend.getWidth() +
          options.legendMargin[1] +
          options.legendMargin[3]
        : 0;

      if (
        options.legendVerticalPosition === 'middle' ||
        options.legendVerticalPosition === 'center'
      ) {
        return this.domainPainter.dimensions.width + legendWidth;
      }
      return Math.max(this.domainPainter.dimensions.width, legendWidth);
    }

    resize() {
      const { options } = this.calendar.options;

      this.root
        .transition()
        .duration(options.animationDuration)
        .attr('width', this.getWidth())
        .attr('height', this.getHeight());

      this.calendar.onResize(this.getHeight(), this.getWidth());

      // this.root
      //   .select('.graph')
      //   .transition()
      //   .duration(options.animationDuration)
      //   .attr('y', () => {
      //     if (options.legendVerticalPosition === 'top') {
      //       return legendHeight;
      //     }
      //     return 0;
      //   })
      //   .attr('x', () => {
      //     let xPosition = 0;
      //     if (
      //       options.dayLabel &&
      //       options.domain === 'month' &&
      //       options.subDomain === 'day'
      //     ) {
      //       xPosition = options.cellSize + options.cellPadding;
      //     }
      //     if (
      //       (options.legendVerticalPosition === 'middle' ||
      //         options.legendVerticalPosition === 'center') &&
      //       options.legendHorizontalPosition === 'left'
      //     ) {
      //       return legendWidth + xPosition;
      //     }
      //     return xPosition;
      //   });
    }

    destroy(callback) {
      this.root
        .transition()
        .duration(this.calendar.options.options.animationDuration)
        .attr('width', 0)
        .attr('height', 0)
        .remove()
        .each(() => {
          if (typeof callback === 'function') {
            callback();
          } else if (typeof callback !== 'undefined') {
            console.log('Provided callback for destroy() is not a function.');
          }
        });

      callback();
    }

    highlight(args) {
      if (
        (this.calendar.options.highlight = expandDateSetting(args)).length > 0
      ) {
        this.fill();
        return true;
      }
      return false;
    }

    removeLegend() {
      return this.legend.destroy(this.root) && this.resize();
    }

    showLegend() {
      return this.legend.paint(this.root) && this.resize();
    }
  }

  class Populator {
    constructor(calendar) {
      this.calendar = calendar;
    }

    /**
     * Colorize the cell via a style attribute if enabled
     */
    #addStyle(element) {
      const { options } = this.calendar.options;

      if (this.calendar.calendarPainter.legend.legendColor.scale === null) {
        return false;
      }

      element.attr('fill', d => {
        if (
          d.v === null &&
          options.hasOwnProperty('considerMissingDataAsZero') &&
          !options.considerMissingDataAsZero
        ) {
          if (options.legendColors.hasOwnProperty('base')) {
            return options.legendColors.base;
          }
        }

        if (
          options.legendColors !== null &&
          options.legendColors.hasOwnProperty('empty') &&
          (d.v === 0 ||
            (d.v === null &&
              options.hasOwnProperty('considerMissingDataAsZero') &&
              options.considerMissingDataAsZero))
        ) {
          return options.legendColors.empty;
        }

        if (
          d.v < 0 &&
          options.legend[0] > 0 &&
          options.legendColors !== null &&
          options.legendColors.hasOwnProperty('overflow')
        ) {
          return options.legendColors.overflow;
        }

        return this.calendar.calendarPainter.legend.legendColor.scale(
          Math.min(d.v, options.legend[options.legend.length - 1])
        );
      });
    }

    #getClassName(d) {
      const { calendar } = this;
      const { options } = calendar.options;

      const htmlClass = getHighlightClassName(d.t, options).trim().split(' ');
      const pastDate = dateIsLessThan(d.t, new Date(), options);

      if (
        calendar.calendarPainter.legend.legendColor.scale === null ||
        (d.v === null &&
          options.hasOwnProperty('considerMissingDataAsZero') &&
          !options.considerMissingDataAsZero &&
          !options.legendColors.hasOwnProperty('base'))
      ) {
        htmlClass.push('graph-rect');
      }

      if (d.v !== null) {
        htmlClass.push(
          calendar.calendarPainter.legend.getClassName(
            d.v,
            calendar.calendarPainter.legend.legendColor.scale === null
          )
        );
      } else if (options.considerMissingDataAsZero && pastDate) {
        htmlClass.push(
          calendar.calendarPainter.legend.getClassName(
            0,
            calendar.calendarPainter.legend.legendColor.scale === null
          )
        );
      }

      if (options.onClick !== null) {
        htmlClass.push('hover_cursor');
      }

      return htmlClass.join(' ');
    }

    #formatSubDomainText(element) {
      const formatter = this.calendar.options.options.subDomainTextFormat;
      if (typeof formatter === 'function') {
        element.text(d => formatter(d.t, d.v));
      }
    }

    populate() {
      const { calendar } = this;
      const { options } = calendar.options;
      const svg = this.calendar.calendarPainter.root.selectAll('.graph-domain');

      const rect = svg
        .selectAll('svg')
        .selectAll('g')
        .data(d => calendar.domainCollection.get(d) || []);

      rect
        .transition()
        .duration(options.animationDuration)
        .select('rect')
        .attr('class', d => this.#getClassName(d))
        .call(d => this.#addStyle(d));

      rect
        .transition()
        .duration(options.animationDuration)
        .select('title')
        .text(d =>
          getSubDomainTitle(
            d,
            options,
            calendar.domainSkeleton.at(options.subDomain).format.connector
          )
        );

      /**
       * Change the subDomainText class if necessary
       * Also change the text, e.g when text is representing the value
       * instead of the date
       */
      rect
        .transition()
        .duration(options.animationDuration)
        .select('text')
        .attr(
          'class',
          d => `subdomain-text${getHighlightClassName(d.t, options)}`
        )
        .call(e => this.#formatSubDomainText(e));
    }
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  var freeGlobal$1 = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal$1 || freeSelf || Function('return this')();

  var root$1 = root;

  /** Built-in value references. */
  var Symbol$1 = root$1.Symbol;

  var Symbol$2 = Symbol$1;

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$a.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty$8.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto$9.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var isArray$1 = isArray;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag$1 = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root$1['__core-js_shared__'];

  var coreJsData$1 = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$8 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$7).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /** Built-in value references. */
  var objectCreate = Object.create;

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  var baseCreate$1 = baseCreate;

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  var defineProperty = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  var defineProperty$1 = defineProperty;

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
    return defineProperty$1(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  var baseSetToString$1 = baseSetToString;

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString$1);

  var setToString$1 = setToString;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty$1) {
      defineProperty$1(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString$1(overRest(func, start, identity), func + '');
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$6;

    return value === proto;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$1;
  }

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$5.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$5.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  var isArguments$1 = isArguments;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /** Detect free variable `exports`. */
  var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

  /** Built-in value references. */
  var Buffer$1 = moduleExports$2 ? root$1.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  var isBuffer$1 = isBuffer;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag$1 = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) &&
      isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */
  var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports$1 && freeGlobal$1.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  var nodeUtil$1 = nodeUtil;

  /* Node.js helper references. */
  var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  var isTypedArray$1 = isTypedArray;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray$1(value),
        isArg = !isArr && isArguments$1(value),
        isBuff = !isArr && !isArg && isBuffer$1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray$1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$4.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$3.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');

  var nativeCreate$1 = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$2 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? undefined : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$1.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate$1 && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /* Built-in method references that are verified to be native. */
  var Map$1 = getNative(root$1, 'Map');

  var Map$2 = Map$1;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map$2 || ListCache),
      'string': new Hash
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Built-in value references. */
  var getPrototype = overArg(Object.getPrototypeOf, Object);

  var getPrototype$1 = getPrototype;

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype$1(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString.call(Ctor) == objectCtorString;
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$2 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? root$1.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  /** Built-in value references. */
  var Uint8Array = root$1.Uint8Array;

  var Uint8Array$1 = Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !isPrototype(object))
      ? baseCreate$1(getPrototype$1(object))
      : {};
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  var baseFor$1 = baseFor;

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignMergeValue(object, key, value) {
    if ((value !== undefined && !eq(object[key], value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function safeGet(object, key) {
    if (key === 'constructor' && typeof object[key] === 'function') {
      return;
    }

    if (key == '__proto__') {
      return;
    }

    return object[key];
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key),
        srcValue = safeGet(source, key),
        stacked = stack.get(srcValue);

    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer
      ? customizer(objValue, srcValue, (key + ''), object, source, stack)
      : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray$1(srcValue),
          isBuff = !isArr && isBuffer$1(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray$1(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray$1(objValue)) {
          newValue = objValue;
        }
        else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        }
        else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        }
        else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        }
        else {
          newValue = [];
        }
      }
      else if (isPlainObject(srcValue) || isArguments$1(srcValue)) {
        newValue = objValue;
        if (isArguments$1(objValue)) {
          newValue = toPlainObject(objValue);
        }
        else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      }
      else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor$1(source, function(srcValue, key) {
      stack || (stack = new Stack);
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      }
      else {
        var newValue = customizer
          ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
          : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  /**
   * This method is like `_.assign` except that it recursively merges own and
   * inherited enumerable string keyed properties of source objects into the
   * destination object. Source properties that resolve to `undefined` are
   * skipped if a destination value exists. Array and plain object properties
   * are merged recursively. Other objects and value types are overridden by
   * assignment. Source objects are applied from left to right. Subsequent
   * sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 0.5.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = {
   *   'a': [{ 'b': 2 }, { 'd': 4 }]
   * };
   *
   * var other = {
   *   'a': [{ 'c': 3 }, { 'e': 5 }]
   * };
   *
   * _.merge(object, other);
   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
   */
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });

  var merge$1 = merge;

  /**
   * Validate that a queryString is valid
   *
   * @param  {Element|string|bool} selector   The queryString to test
   * @param  {bool}  canBeFalse  Whether false is an accepted and valid value
   * @param  {string} name    Name of the tested selector
   * @throws {Error}        If the selector is not valid
   * @return {bool}        True if the selector is a valid queryString
   */
  function validateSelector(selector, canBeFalse, name) {
    if (
      ((canBeFalse && selector === false) ||
        selector instanceof Element ||
        typeof selector === 'string') &&
      selector !== ''
    ) {
      return true;
    }
    throw new Error(`The ${name} is not valid`);
  }

  /**
   * Ensure that the domain and subdomain are valid
   *
   * @throw {Error} when domain or subdomain are not valid
   * @return {bool} True if domain and subdomain are valid and compatible
   */
  function validateDomainType(domainSkeleton, { domain, subDomain }) {
    if (
      !domainSkeleton.has(domain) ||
      domain === 'min' ||
      domain.substring(0, 2) === 'x_'
    ) {
      throw new Error(`The domain '${domain}' is not valid`);
    }

    if (!domainSkeleton.has(subDomain) || subDomain === 'year') {
      throw new Error(`The subDomain '${subDomain}' is not valid`);
    }

    if (domainSkeleton.at(domain).level <= domainSkeleton.at(subDomain).level) {
      throw new Error(`'${subDomain}' is not a valid subDomain to '${domain}'`);
    }

    return true;
  }

  const ALLOWED_DATA_TYPES = ['json', 'csv', 'tsv', 'txt'];
  const DEFAULT_LEGEND_MARGIN = 10;

  /**
   * Return the optimal subDomain for the specified domain
   *
   * @param  {string} domain a domain name
   * @return {string}        the subDomain name
   */
  function getOptimalSubDomain(domain) {
    switch (domain) {
      case 'year':
        return 'month';
      case 'month':
        return 'day';
      case 'week':
        return 'day';
      case 'day':
        return 'hour';
      default:
        return 'min';
    }
  }

  class Options {
    constructor(calendar) {
      this.calendar = calendar;

      this.options = {
        // selector string of the container to append the graph to
        // Accept any string value accepted by document.querySelector or CSS3
        // or an Element object
        itemSelector: '#cal-heatmap',

        // Whether to paint the calendar on init()
        // Used by testsuite to reduce testing time
        paintOnLoad: true,

        // ================================================
        // DOMAIN
        // ================================================

        // Number of domain to display on the graph
        range: 12,

        // Size of each cell, in pixel
        cellSize: 10,

        // Padding between each cell, in pixel
        cellPadding: 2,

        // For rounded subdomain rectangles, in pixels
        cellRadius: 0,

        domainGutter: 2,

        domainMargin: [0, 0, 0, 0],

        domain: 'hour',

        subDomain: 'min',

        // Number of columns to split the subDomains to
        // If not null, will takes precedence over rowLimit
        colLimit: null,

        // Number of rows to split the subDomains to
        // Will be ignored if colLimit is not null
        rowLimit: null,

        // First day of the week is Monday
        // 0 to start the week on Sunday
        weekStartOnMonday: true,

        // Show week name when showing full month
        dayLabel: false,

        // Start date of the graph
        // @default now
        start: new Date(),

        minDate: null,

        maxDate: null,

        // ================================================
        // DATA
        // ================================================

        // Data source
        // URL, where to fetch the original datas
        data: '',

        // Data type
        // Default: json
        dataType: ALLOWED_DATA_TYPES[0],

        // Payload sent when using POST http method
        // Leave to null (default) for GET request
        // Expect a string, formatted like "a=b;c=d"
        dataPostPayload: null,

        // Additional headers sent when requesting data
        // Expect an object formatted like:
        // { 'X-CSRF-TOKEN': 'token' }
        dataRequestHeaders: null,

        // Whether to consider missing date:value from the datasource
        // as equal to 0, or just leave them as missing
        considerMissingDataAsZero: false,

        // Load remote data on calendar creation
        // When false, the calendar will be left empty
        loadOnInit: true,

        // Calendar orientation
        // false: display domains side by side
        // true : display domains one under the other
        verticalOrientation: false,

        // Domain dynamic width/height
        // The width on a domain depends on the number of
        domainDynamicDimension: true,

        // Domain Label properties
        label: {
          // valid: top, right, bottom, left
          position: 'bottom',

          // Valid: left, center, right
          // Also valid are the direct svg values: start, middle, end
          align: 'center',

          // By default, there is no margin/padding around the label
          offset: {
            x: 0,
            y: 0,
          },

          rotate: null,

          // Used only on vertical orientation
          width: 100,

          // Used only on horizontal orientation
          height: null,
        },

        // ================================================
        // LEGEND
        // ================================================

        // Threshold for the legend
        legend: [10, 20, 30, 40],

        // Whether to display the legend
        displayLegend: true,

        legendCellSize: 10,

        legendCellPadding: 2,

        legendMargin: [0, 0, 0, 0],

        // Legend vertical position
        // top: place legend above calendar
        // bottom: place legend below the calendar
        legendVerticalPosition: 'bottom',

        // Legend horizontal position
        // accepted values: left, center, right
        legendHorizontalPosition: 'left',

        // Legend rotation
        // accepted values: horizontal, vertical
        legendOrientation: 'horizontal',

        // Objects holding all the heatmap different colors
        // null to disable, and use the default css styles
        //
        // Examples:
        // legendColors: {
        //    min: "green",
        //    max: "red",
        //    empty: "#ffffff",
        //    base: "grey",
        //    overflow: "red"
        // }
        legendColors: null,

        // ================================================
        // HIGHLIGHT
        // ================================================

        // List of dates to highlight
        // Valid values:
        // - []: don't highlight anything
        // - "now": highlight the current date
        // - an array of Date objects: highlight the specified dates
        highlight: [],

        // ================================================
        // TEXT FORMATTING / i18n
        // ================================================

        // Name of the items to represent in the calendar
        itemName: ['item', 'items'],

        // Formatting of the domain label
        // @default: null, will use the formatting according to domain type
        // Accept a string used as specifier by timeFormat()
        // or a function
        //
        // Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
        // for accepted date formatting used by timeFormat()
        domainLabelFormat: null,

        // Formatting of the title displayed when hovering a subDomain cell
        subDomainTitleFormat: {
          empty: '{date}',
          filled: '{count} {name} {connector} {date}',
        },

        // Formatting of the {date} used in subDomainTitleFormat
        // @default: null, will use the formatting according to subDomain type
        // Accept a string used as specifier by timeFormat()
        // or a function
        //
        // Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
        // for accepted date formatting used by timeFormat()
        subDomainDateFormat: null,

        // Formatting of the text inside each subDomain cell
        // @default: null, no text
        // Accept a string used as specifier by timeFormat()
        // or a function
        //
        // Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
        // for accepted date formatting used by timeFormat()
        subDomainTextFormat: null,

        // Formatting of the title displayed when hovering a legend cell
        legendTitleFormat: {
          lower: 'less than {min} {name}',
          inner: 'between {down} and {up} {name}',
          upper: 'more than {max} {name}',
        },

        // Animation duration, in ms
        animationDuration: 500,

        nextSelector: false,

        previousSelector: false,

        itemNamespace: 'cal-heatmap',

        tooltip: false,

        // ================================================
        // EVENTS CALLBACK
        // ================================================

        // Callback when clicking on a time block
        onClick: null,

        // Callback when hovering on a time block
        onMouseOver: null,

        // Callback when hovering on a time block
        onMouseOut: null,

        // Callback after painting the empty calendar
        // Can be used to trigger an API call, once the calendar is ready to be filled
        afterLoad: null,

        // Callback after loading the next domain in the calendar
        afterLoadNextDomain: null,

        // Callback after loading the previous domain in the calendar
        afterLoadPreviousDomain: null,

        // Callback after finishing all actions on the calendar
        onComplete: null,

        onResize: null,

        // Callback after fetching the datas, but before applying them to the calendar
        // Used mainly to convert the datas if they're not formatted like expected
        // Takes the fetched "data" object as argument, must return a json object
        // formatted like {timestamp:count, timestamp2:count2},
        afterLoadData: (data) => data,

        // Callback triggered after calling and completing update().
        afterUpdate: null,

        // Callback triggered after calling next().
        // The `status` argument is equal to true if there is no
        // more next domain to load
        //
        // This callback is also executed once, after calling previous(),
        // only when the max domain is reached
        onMaxDomainReached: null,

        // Callback triggered after calling previous().
        // The `status` argument is equal to true if there is no
        // more previous domain to load
        //
        // This callback is also executed once, after calling next(),
        // only when the min domain is reached
        onMinDomainReached: null,

        // Callback when hovering over a time block
        onTooltip: (title) => title,
      };
    }

    set(key, value) {
      if (this.options[key] === value) {
        return false;
      }

      this.options[key] = value;

      return true;
    }

    #validate() {
      const { options } = this;

      // Fatal errors
      // Stop script execution on error
      validateDomainType(this.calendar.domainSkeleton, this.options);
      validateSelector(options.itemSelector, false, 'itemSelector');

      if (!ALLOWED_DATA_TYPES.includes(options.dataType)) {
        throw new Error(
          `The data type '${options.dataType}' is not valid data type`,
        );
      }

      if (select(options.itemSelector).empty()) {
        throw new Error(
          `The node '${options.itemSelector}' specified in itemSelector does not exist`,
        );
      }

      try {
        validateSelector(options.nextSelector, true, 'nextSelector');
        validateSelector(options.previousSelector, true, 'previousSelector');
      } catch (error) {
        console.log(error.message);
        return false;
      }

      // If other settings contains error, will fallback to default

      if (!options.hasOwnProperty('subDomain')) {
        options.subDomain = getOptimalSubDomain(options.domain);
      }

      if (
        typeof options.itemNamespace !== 'string' ||
        options.itemNamespace === ''
      ) {
        console.log(
          'itemNamespace can not be empty, falling back to cal-heatmap',
        );
        options.itemNamespace = 'cal-heatmap';
      }

      return true;
    }

    #parseRowLimit(value) {
      if (value > 0 && this.options.colLimit > 0) {
        console.log(
          'colLimit and rowLimit are mutually exclusive, rowLimit will be ignored',
        );
        return null;
      }
      return value > 0 ? value : null;
    }

    /**
     * Fine-tune the label alignement depending on its position
     *
     * @return void
     */
    #autoAlignLabel() {
      // Auto-align label, depending on it's position
      if (
        !this.options.hasOwnProperty('label') ||
        (this.options.hasOwnProperty('label') &&
          !this.options.label.hasOwnProperty('align'))
      ) {
        switch (this.options.label.position) {
          case 'left':
            this.options.label.align = 'right';
            break;
          case 'right':
            this.options.label.align = 'left';
            break;
          default:
            this.options.label.align = 'center';
        }

        if (this.options.label.rotate === 'left') {
          this.options.label.align = 'right';
        } else if (this.options.label.rotate === 'right') {
          this.options.label.align = 'left';
        }
      }

      if (
        !this.options.hasOwnProperty('label') ||
        (this.options.hasOwnProperty('label') &&
          !this.options.label.hasOwnProperty('offset'))
      ) {
        if (
          this.options.label.position === 'left' ||
          this.options.label.position === 'right'
        ) {
          this.options.label.offset = {
            x: 10,
            y: 15,
          };
        }
      }
    }

    init(settings) {
      this.options = merge$1(this.options, settings);

      const { options } = this;

      this.calendar.domainSkeleton.compute();
      this.#validate();

      options.subDomainDateFormat =
        typeof options.subDomainDateFormat === 'string' ||
        typeof options.subDomainDateFormat === 'function'
          ? options.subDomainDateFormat
          : this.calendar.domainSkeleton.at(options.subDomain).format.date;
      options.domainLabelFormat =
        typeof options.domainLabelFormat === 'string' ||
        typeof options.domainLabelFormat === 'function'
          ? options.domainLabelFormat
          : this.calendar.domainSkeleton.at(options.domain).format.legend;
      options.subDomainTextFormat =
        (typeof options.subDomainTextFormat === 'string' &&
          options.subDomainTextFormat !== '') ||
        typeof options.subDomainTextFormat === 'function'
          ? options.subDomainTextFormat
          : null;
      options.domainMargin = expandMarginSetting(options.domainMargin);
      options.legendMargin = expandMarginSetting(options.legendMargin);
      options.highlight = expandDateSetting$1(options.highlight);
      options.itemName = expandItemName(options.itemName);
      options.colLimit = options.colLimit > 0 ? options.colLimit : null;
      options.rowLimit = this.#parseRowLimit(options.rowLimit);

      this.#autoAlignLabel();

      options.verticalDomainLabel =
        options.label.position === 'top' || options.label.position === 'bottom';

      options.domainVerticalLabelHeight =
        options.label.height === null
          ? Math.max(25, options.cellSize * 2)
          : options.label.height;
      options.domainHorizontalLabelWidth = 0;

      if (options.domainLabelFormat === '' && options.label.height === null) {
        options.domainVerticalLabelHeight = 0;
      }

      if (!options.verticalDomainLabel) {
        options.domainVerticalLabelHeight = 0;
        options.domainHorizontalLabelWidth = options.label.width;
      }

      if (!options.legendMargin !== [0, 0, 0, 0]) {
        switch (options.legendVerticalPosition) {
          case 'top':
            options.legendMargin[2] = DEFAULT_LEGEND_MARGIN;
            break;
          case 'bottom':
            options.legendMargin[0] = DEFAULT_LEGEND_MARGIN;
            break;
          case 'middle':
          case 'center':
            options.legendMargin[
              options.legendHorizontalPosition === 'right' ? 3 : 1
            ] = DEFAULT_LEGEND_MARGIN;
            break;
        }
      }
    }
  }

  function extractSVG(root, options) {
    const styles = {
      '.cal-heatmap-container': {},
      '.graph': {},
      '.graph-rect': {},
      'rect.highlight': {},
      'rect.now': {},
      'rect.highlight-now': {},
      'text.highlight': {},
      'text.now': {},
      'text.highlight-now': {},
      '.domain-background': {},
      '.graph-label': {},
      '.subdomain-text': {},
      '.q0': {},
      '.qi': {},
    };

    for (let j = 1, total = options.legend.length + 1; j <= total; j++) {
      styles[`.q${j}`] = {};
    }

    const whitelistStyles = [
      // SVG specific properties
      'stroke',
      'stroke-width',
      'stroke-opacity',
      'stroke-dasharray',
      'stroke-dashoffset',
      'stroke-linecap',
      'stroke-miterlimit',
      'fill',
      'fill-opacity',
      'fill-rule',
      'marker',
      'marker-start',
      'marker-mid',
      'marker-end',
      'alignement-baseline',
      'baseline-shift',
      'dominant-baseline',
      'glyph-orientation-horizontal',
      'glyph-orientation-vertical',
      'kerning',
      'text-anchor',
      'shape-rendering',

      // Text Specific properties
      'text-transform',
      'font-family',
      'font',
      'font-size',
      'font-weight',
    ];

    const filterStyles = (attribute, property, value) => {
      if (whitelistStyles.indexOf(property) !== -1) {
        styles[attribute][property] = value;
      }
    };

    const getElement = e => root.select(e).node();

    for (const element in styles) {
      if (!styles.hasOwnProperty(element)) {
        continue;
      }

      const dom = getElement(element);

      if (dom === null) {
        continue;
      }

      // The DOM Level 2 CSS way
      if ('getComputedStyle' in window) {
        const cs = getComputedStyle(dom, null);
        if (cs.length !== 0) {
          for (let i = 0; i < cs.length; i++) {
            filterStyles(element, cs.item(i), cs.getPropertyValue(cs.item(i)));
          }

          // Opera workaround. Opera doesn"t support `item`/`length`
          // on CSSStyleDeclaration.
        } else {
          for (const k in cs) {
            if (cs.hasOwnProperty(k)) {
              filterStyles(element, k, cs[k]);
            }
          }
        }

        // The IE way
      } else if ('currentStyle' in dom) {
        const css = dom.currentStyle;
        for (const p in css) {
          filterStyles(element, p, css[p]);
        }
      }
    }

    let string =
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"><![CDATA[ ';

    for (const style in styles) {
      string += `${style} {\n`;
      for (const l in styles[style]) {
        string += `\t${l}:${styles[style][l]};\n`;
      }
      string += '}\n';
    }

    string += ']]></style>';
    string += new XMLSerializer().serializeToString(root.node());
    string += '</svg>';

    return string;
  }

  class DomainSkeleton {
    constructor(calendar) {
      this.settings = {};
      this.calendar = calendar;
    }

    #getSubDomainRowNumber(d) {
      const { options } = this.calendar.options;

      if (options.colLimit > 0) {
        let i = this.settings[options.subDomain].maxItemNumber;
        if (typeof i === 'function') {
          i = i(d);
        }
        return Math.ceil(i / options.colLimit);
      }

      let j = this.settings[options.subDomain].defaultRowNumber;
      if (typeof j === 'function') {
        j = j(d);
      }
      return options.rowLimit || j;
    }

    #getSubDomainColumnNumber(d) {
      const { options } = this.calendar.options;

      if (options.rowLimit > 0) {
        let i = this.settings[options.subDomain].maxItemNumber;
        if (typeof i === 'function') {
          i = i(d);
        }
        return Math.ceil(i / options.rowLimit);
      }

      let j = this.settings[options.subDomain].defaultColumnNumber;
      if (typeof j === 'function') {
        j = j(d);
      }
      return options.colLimit || j;
    }

    at(domain) {
      return this.settings[domain];
    }

    has(domain) {
      return this.settings.hasOwnProperty(domain);
    }

    compute() {
      const { options } = this.calendar.options;
      const self = this;
      this.settings = {
        min: {
          name: 'minute',
          level: 10,
          maxItemNumber: 60,
          defaultRowNumber: 10,
          defaultColumnNumber: 6,
          row(d) {
            return self.#getSubDomainRowNumber(d);
          },
          column(d) {
            return self.#getSubDomainColumnNumber(d);
          },
          position: {
            x(d) {
              return Math.floor(d.getMinutes() / self.settings.min.row(d));
            },
            y(d) {
              return d.getMinutes() % self.settings.min.row(d);
            },
          },
          format: {
            date: '%H:%M, %A %B %-e, %Y',
            legend: '',
            connector: 'at',
          },
          extractUnit(d) {
            return new Date(
              d.getFullYear(),
              d.getMonth(),
              d.getDate(),
              d.getHours(),
              d.getMinutes(),
            ).getTime();
          },
        },
        hour: {
          name: 'hour',
          level: 20,
          maxItemNumber(d) {
            switch (options.domain) {
              case 'day':
                return 24;
              case 'week':
                return 24 * 7;
              case 'month':
                return (
                  24 *
                  (options.domainDynamicDimension ? getDayCountInMonth(d) : 31)
                );
            }
          },
          defaultRowNumber: 6,
          defaultColumnNumber(d) {
            switch (options.domain) {
              case 'day':
                return 4;
              case 'week':
                return 28;
              case 'month':
                return options.domainDynamicDimension
                  ? getDayCountInMonth(d)
                  : 31;
            }
          },
          row(d) {
            return self.#getSubDomainRowNumber(d);
          },
          column(d) {
            return self.#getSubDomainColumnNumber(d);
          },
          position: {
            x(d) {
              if (options.domain === 'month') {
                if (options.colLimit > 0 || options.rowLimit > 0) {
                  return Math.floor(
                    (d.getHours() + (d.getDate() - 1) * 24) /
                      self.settings.hour.row(d),
                  );
                }
                return (
                  Math.floor(d.getHours() / self.settings.hour.row(d)) +
                  (d.getDate() - 1) * 4
                );
              }
              if (options.domain === 'week') {
                if (options.colLimit > 0 || options.rowLimit > 0) {
                  return Math.floor(
                    (d.getHours() +
                      getWeekDay(d, options.weekStartOnMonday) * 24) /
                      self.settings.hour.row(d),
                  );
                }
                return (
                  Math.floor(d.getHours() / self.settings.hour.row(d)) +
                  getWeekDay(d, options.weekStartOnMonday) * 4
                );
              }
              return Math.floor(d.getHours() / self.settings.hour.row(d));
            },
            y(d) {
              let p = d.getHours();
              if (options.colLimit > 0 || options.rowLimit > 0) {
                switch (options.domain) {
                  case 'month':
                    p += (d.getDate() - 1) * 24;
                    break;
                  case 'week':
                    p += getWeekDay(d, options.weekStartOnMonday) * 24;
                    break;
                }
              }
              return Math.floor(p % self.settings.hour.row(d));
            },
          },
          format: {
            date: '%Hh, %A %B %-e, %Y',
            legend: '%H:00',
            connector: 'at',
          },
          extractUnit(d) {
            return new Date(
              d.getFullYear(),
              d.getMonth(),
              d.getDate(),
              d.getHours(),
            ).getTime();
          },
        },
        day: {
          name: 'day',
          level: 30,
          maxItemNumber(d) {
            switch (options.domain) {
              case 'week':
                return 7;
              case 'month':
                return options.domainDynamicDimension
                  ? getDayCountInMonth(d)
                  : 31;
              case 'year':
                return options.domainDynamicDimension
                  ? getDayCountInYear(d)
                  : 366;
            }
          },
          defaultColumnNumber(d) {
            d = new Date(d);
            switch (options.domain) {
              case 'week':
                return 1;
              case 'month':
                return options.domainDynamicDimension &&
                  !options.verticalOrientation
                  ? getWeekNumber(
                      new Date(d.getFullYear(), d.getMonth() + 1, 0),
                    ) -
                      getWeekNumber(d) +
                      1
                  : 6;
              case 'year':
                return options.domainDynamicDimension
                  ? getWeekNumber(new Date(d.getFullYear(), 11, 31)) -
                      getWeekNumber(new Date(d.getFullYear(), 0)) +
                      1
                  : 54;
            }
          },
          defaultRowNumber: 7,
          row(d) {
            return self.#getSubDomainRowNumber(d);
          },
          column(d) {
            return self.#getSubDomainColumnNumber(d);
          },
          position: {
            x(d) {
              switch (options.domain) {
                case 'week':
                  return Math.floor(
                    getWeekDay(d, options.weekStartOnMonday) /
                      self.settings.day.row(d),
                  );
                case 'month':
                  if (options.colLimit > 0 || options.rowLimit > 0) {
                    return Math.floor(
                      (d.getDate() - 1) / self.settings.day.row(d),
                    );
                  }
                  return (
                    getWeekNumber(d) -
                    getWeekNumber(new Date(d.getFullYear(), d.getMonth()))
                  );
                case 'year':
                  if (options.colLimit > 0 || options.rowLimit > 0) {
                    return Math.floor(
                      (getDayOfYear() - 1) / self.settings.day.row(d),
                    );
                  }
                  return getWeekNumber(d);
              }
            },
            y(d) {
              let p = getWeekDay(d, options.weekStartOnMonday);
              if (options.colLimit > 0 || options.rowLimit > 0) {
                switch (options.domain) {
                  case 'year':
                    p = getDayOfYear() - 1;
                    break;
                  case 'week':
                    p = getWeekDay(d, options.weekStartOnMonday);
                    break;
                  case 'month':
                    p = d.getDate() - 1;
                    break;
                }
              }
              return Math.floor(p % self.settings.day.row(d));
            },
          },
          format: {
            date: '%A %B %-e, %Y',
            legend: '%e %b',
            connector: 'on',
          },
          extractUnit(d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          },
        },
        week: {
          name: 'week',
          level: 40,
          maxItemNumber: 54,
          defaultColumnNumber(d) {
            d = new Date(d);
            switch (options.domain) {
              case 'year':
                return self.settings.week.maxItemNumber;
              case 'month':
                return options.domainDynamicDimension
                  ? getWeekNumber(
                      new Date(d.getFullYear(), d.getMonth() + 1, 0),
                    ) - getWeekNumber(d)
                  : 5;
            }
          },
          defaultRowNumber: 1,
          row(d) {
            return self.#getSubDomainRowNumber(d);
          },
          column(d) {
            return self.#getSubDomainColumnNumber(d);
          },
          position: {
            x(d) {
              switch (options.domain) {
                case 'year':
                  return Math.floor(getWeekNumber(d) / self.settings.week.row(d));
                case 'month':
                  return Math.floor(
                    getMonthWeekNumber(d) / self.settings.week.row(d),
                  );
              }
            },
            y(d) {
              return getWeekNumber(d) % self.settings.week.row(d);
            },
          },
          format: {
            date: '%B Week #%W',
            legend: '%B Week #%W',
            connector: 'in',
          },
          extractUnit(d) {
            const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            // According to ISO-8601, week number computation are based on week starting on Monday
            let weekDay = dt.getDay() - (options.weekStartOnMonday ? 1 : 0);
            if (weekDay < 0) {
              weekDay = 6;
            }
            dt.setDate(dt.getDate() - weekDay);
            return dt.getTime();
          },
        },
        month: {
          name: 'month',
          level: 50,
          maxItemNumber: 12,
          defaultColumnNumber: 12,
          defaultRowNumber: 1,
          row() {
            return self.#getSubDomainRowNumber();
          },
          column() {
            return self.#getSubDomainColumnNumber();
          },
          position: {
            x(d) {
              return Math.floor(d.getMonth() / self.settings.month.row(d));
            },
            y(d) {
              return d.getMonth() % self.settings.month.row(d);
            },
          },
          format: {
            date: '%B %Y',
            legend: '%B',
            connector: 'in',
          },
          extractUnit(d) {
            return new Date(d.getFullYear(), d.getMonth()).getTime();
          },
        },
        year: {
          name: 'year',
          level: 60,
          row() {
            return options.rowLimit || 1;
          },
          column() {
            return options.colLimit || 1;
          },
          position: {
            x() {
              return 1;
            },
            y() {
              return 1;
            },
          },
          format: {
            date: '%Y',
            legend: '%Y',
            connector: 'in',
          },
          extractUnit(d) {
            return new Date(d.getFullYear()).getTime();
          },
        },
      };

      for (const type in self.settings) {
        if (self.settings.hasOwnProperty(type)) {
          const d = self.settings[type];
          self.settings[`x_${type}`] = {
            name: `x_${type}`,
            level: d.type,
            maxItemNumber: d.maxItemNumber,
            defaultRowNumber: d.defaultRowNumber,
            defaultColumnNumber: d.defaultColumnNumber,
            row: d.column,
            column: d.row,
            position: {
              x: d.position.y,
              y: d.position.x,
            },
            format: d.format,
            extractUnit: d.extractUnit,
          };
        }
      }
    }
  }

  class CalendarEvent {
    constructor() {
      this.statusComplete = false;
    }

    /**
     * Helper method for triggering event callback
     *
     * @param  string  eventName       Name of the event to trigger
     * @param  array  successArgs     List of argument to pass to the callback
     * @param  boolean  skip      Whether to skip the event triggering
     * @return mixed  True when the triggering was skipped, false on error, else the callback function
     */
    #triggerEvent(eventName, successArgs, skip = false) {
      if (skip || this.options.options[eventName] === null) {
        return true;
      }

      if (typeof this.options.options[eventName] === 'function') {
        if (typeof successArgs === 'function') {
          successArgs = successArgs();
        }
        return this.options.options[eventName].apply(this, successArgs);
      }
      console.log(`Provided callback for ${eventName} is not a function.`);
      return false;
    }

    /**
     * Event triggered on a mouse click on a subDomain cell
     *
     * @param  Date    d    Date of the subdomain block
     * @param  int    itemNb  Number of items in that date
     */
    onClick(...args) {
      return this.#triggerEvent('onClick', [...args]);
    }

    /**
     * Event triggered when the mouse cursor enteres a subDomain cell
     *
     * @param  Date    d    Date of the subdomain block
     * @param  int    itemNb  Number of items in that date
     */
    onMouseOver(...args) {
      return this.#triggerEvent('onMouseOver', [...args]);
    }

    /**
     * Event triggered when the mouse cursor leaves a subDomain cell
     *
     * @param  Date    d    Date of the subdomain block
     * @param  int    itemNb  Number of items in that date
     */
    onMouseOut(...args) {
      return this.#triggerEvent('onMouseOut', [...args]);
    }

    /**
     * Event triggered after drawing the calendar, but before filling it with data
     */
    afterLoad() {
      return this.#triggerEvent('afterLoad');
    }

    /**
     * Event triggered after completing drawing and filling the calendar
     */
    onComplete() {
      const response = this.#triggerEvent('onComplete', [], this.statusComplete);
      this.statusComplete = true;
      return response;
    }

    /**
     * Event triggered after resize event
     */
    onResize(h, w) {
      return this.#triggerEvent('onResize', [h, w]);
    }

    /**
     * Event triggered after shifting the calendar one domain back
     *
     * @param  Date    start  Domain start date
     * @param  Date    end    Domain end date
     */
    afterLoadPreviousDomain(start) {
      return this.#triggerEvent('afterLoadPreviousDomain', () => {
        const subDomain = generateSubDomain(
          start,
          this.options.options,
          this.DTSDomain
        );
        return [subDomain.shift(), subDomain.pop()];
      });
    }

    /**
     * Event triggered after shifting the calendar one domain above
     *
     * @param  Date    start  Domain start date
     * @param  Date    end    Domain end date
     */
    afterLoadNextDomain(start) {
      return this.#triggerEvent('afterLoadNextDomain', () => {
        const subDomain = generateSubDomain(
          start,
          this.options.options,
          this.DTSDomain
        );
        return [subDomain.shift(), subDomain.pop()];
      });
    }

    /**
     * Event triggered after loading the leftmost domain allowed by minDate
     *
     * @param  boolean  reached True if the leftmost domain was reached
     */
    onMinDomainReached(reached) {
      this.navigator.minDomainReached = reached;
      return this.#triggerEvent('onMinDomainReached', [reached]);
    }

    /**
     * Event triggered after loading the rightmost domain allowed by maxDate
     *
     * @param  boolean  reached True if the rightmost domain was reached
     */
    onMaxDomainReached(reached) {
      this.navigator.maxDomainReached = reached;
      return this.#triggerEvent('onMaxDomainReached', [reached]);
    }

    afterUpdate() {
      return this.#triggerEvent('afterUpdate');
    }
  }

  class CalHeatMap extends CalendarEvent {
    constructor() {
      super();

      // Default settings
      this.options = new Options(this);

      this.domainSkeleton = new DomainSkeleton(this);

      // Record all the valid domains
      // Each domain value is a timestamp in milliseconds
      this.domainCollection = new Map();

      this.navigator = new Navigator(this);
      this.populator = new Populator(this);

      this.calendarPainter = new CalendarPainter(this);
    }

    #initDomainCollection() {
      const { options } = this.options;

      this.navigator.loadNewDomains(
        generateTimeInterval(
          options.domain,
          options.start,
          options.range,
          options.weekStartOnMonday,
        ),
      );
    }

    /**
     * Return the list of the calendar's domain timestamp
     *
     * @return Array a sorted array of timestamp
     */
    getDomainKeys() {
      return Array.from(this.domainCollection.keys()).sort();
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    init(settings) {
      const { options } = this.options;

      this.options.init(settings);

      this.calendarPainter.setup();
      this.#initDomainCollection();

      if (options.paintOnLoad) {
        this.calendarPainter.paint();
        this.afterLoad();
        // Fill the graph with some datas
        if (options.loadOnInit) {
          this.update();
        } else {
          this.onComplete();
        }
      }
    }

    /**
     * Shift the calendar by n domains forward
     */
    next(n = 1) {
      if (this.navigator.loadNextDomain(n)) {
        this.calendarPainter.paint();
      }
    }

    /**
     * Shift the calendar by n domains backward
     */
    previous(n = 1) {
      if (this.navigator.loadPreviousDomain(n)) {
        this.calendarPainter.paint();
      }
    }

    /**
     * Jump directly to a specific date
     *
     * JumpTo will scroll the calendar until the wanted domain with the specified
     * date is visible. Unless you set reset to true, the wanted domain
     * will not necessarily be the first (leftmost) domain of the calendar.
     *
     * @param Date date Jump to the domain containing that date
     * @param bool reset Whether the wanted domain should be the first domain of the calendar
     * @param bool True of the calendar was scrolled
     */
    jumpTo(date, reset = false) {
      return this.navigator.jumpTo(date, reset);
    }

    /**
     * Navigate back to the start date
     *
     * @since  3.3.8
     * @return void
     */
    rewind() {
      return this.navigator.jumpTo(this.options.options.start, true);
    }

    /**
     * Update the calendar with new data
     *
     * @param  object|string    dataSource    The calendar's datasource, same type as this.options.data
     * @param  boolean|function    afterLoadDataCallback    Whether to execute afterLoadDataCallback() on the data. Pass directly a function
     * if you don't want to use the afterLoadDataCallback() callback
     */
    update(
      dataSource = this.options.options.data,
      afterLoadDataCallback = this.options.options.afterLoadData,
      updateMode = RESET_ALL_ON_UPDATE,
    ) {
      const { options } = this.options;
      const domains = this.getDomainKeys();
      const lastSubDomain = this.domainCollection.get(
        domains[domains.length - 1],
      );

      getDatas(
        this,
        options,
        dataSource,
        new Date(domains[0]),
        new Date(lastSubDomain[lastSubDomain.length - 1].t),
        () => {
          this.populator.populate();
          this.afterUpdate();
          this.onComplete();
        },
        afterLoadDataCallback,
        updateMode,
      );
    }

    /**
     * Set the legend
     *
     * @param array legend an array of integer, representing the different threshold value
     * @param array colorRange an array of 2 hex colors, for the minimum and maximum colors
     */
    setLegend() {
      const oldLegend = this.options.options.legend.slice(0);
      if (arguments.length >= 1 && Array.isArray(arguments[0])) {
        this.options.options.legend = arguments[0];
      }
      if (arguments.length >= 2) {
        if (Array.isArray(arguments[1]) && arguments[1].length >= 2) {
          this.options.options.legendColors = [arguments[1][0], arguments[1][1]];
        } else {
          this.options.options.legendColors = arguments[1];
        }
      }

      if (
        (arguments.length > 0 &&
          !arrayEquals(oldLegend, this.options.options.legend)) ||
        arguments.length >= 2
      ) {
        this.calendarPainter.legend.buildColors();
        this.populator.populate();
      }

      this.calendarPainter.legend.paint();
    }

    /**
     * Remove the legend
     *
     * @return bool False if there is no legend to remove
     */
    removeLegend() {
      if (!this.options.set('displayLegend', false)) {
        return false;
      }
      return this.calendarPainter.removeLegend();
    }

    /**
     * Display the legend
     *
     * @return bool False if the legend was already displayed
     */
    showLegend() {
      if (this.options.set('displayLegend', true)) {
        return false;
      }

      return this.calendarPainter.showLegend();
    }

    /**
     * Highlight dates
     *
     * Add a highlight class to a set of dates
     *
     * @since  3.3.5
     * @param  array Array of dates to highlight
     * @return bool True if dates were highlighted
     */
    highlight(args) {
      return this.calendarPainter.highlight(args);
    }

    /**
     * Destroy the calendar
     *
     * Usage: cal = cal.destroy();
     *
     * @since  3.3.6
     * @param function A callback function to trigger after destroying the calendar
     * @return null
     */
    destroy(callback) {
      this.calendarPainter.destroy(callback);

      return null;
    }

    getSVG() {
      return extractSVG(this.calendarPainter.root, this.options.options);
    }
  }

  return CalHeatMap;

}));
