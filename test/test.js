/*! cal-heatmap v4.0.0 (Wed Nov 09 2022 20:45:09)
 *  ---------------------------------------------
 *  Cal-Heatmap is a javascript module to create calendar heatmap to visualize time series data
 *  https://github.com/wa0x6e/cal-heatmap
 *  Licensed under the MIT license
 *  Copyright 2014 Wan Qi Chen
 */

CalHeatMap.prototype.svg = function () {
  return this.root.selectAll(".graph-domain");
};

QUnit.testStart(function (details) {
  $("body").append("<div id='cal-heatmap' style='display:none;'></div>");
});

QUnit.testDone(function (details) {
  $("#cal-heatmap").remove();
});

function createCalendar(settings) {
  const cal = new CalHeatMap();
  if (!settings.hasOwnProperty("loadOnInit")) {
    settings.loadOnInit = false;
  }

  settings.animationDuration = 0;

  if (!settings.hasOwnProperty("paintOnLoad")) {
    settings.paintOnLoad = false;
  }

  cal.init(settings);

  return cal;
}

/**
 * Mark a test as skipped
 *
 * @link http://stackoverflow.com/questions/13748129/skipping-a-test-in-qunit
 * @return {[type]} [description]
 */
QUnit.testSkip = function (assert) {
  QUnit.test(arguments[0] + " (SKIPPED)", function (assert) {
    const li = document.getElementById(QUnit.config.current.id);
    QUnit.done(function () {
      if (li !== null) {
        li.style.background = "#FFFF99";
      }
    });
    assert.ok(true);
  });
};
testSkip = QUnit.testSkip;

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : destroy()");

QUnit.test("Destroying the calendar", function (assert) {
  assert.expect(3);

  const node = d3
    .select("body")
    .append("div")
    .attr("id", "test-destroy")
    .node();
  let cal = createCalendar({
    itemSelector: node,
    animationDuration: 0,
    paintOnLoad: true,
  });

  assert.ok(cal !== null, "the instance is created");

  const done = assert.async();
  cal = cal.destroy(function () {
    assert.ok("callback called");
    done();
  });

  assert.ok(cal === null, "the instance is deleted");
});

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : highlight()");

QUnit.test("Highlighting one date", function (assert) {
  assert.expect(4);

  const highlightedDate = new Date(2000, 0, 1);
  const cal = createCalendar({
    animationDuration: 0,
    paintOnLoad: true,
    start: new Date(2000, 0),
    domain: "month",
  });
  assert.ok(cal.highlight(highlightedDate));
  assert.strictEqual(d3.selectAll("#cal-heatmap .highlight").nodes().length, 0);

  const done = assert.async();
  setTimeout(function () {
    assert.strictEqual(
      d3.selectAll("#cal-heatmap .highlight").nodes().length,
      1
    );
    assert.strictEqual(
      d3.selectAll("#cal-heatmap .highlight").nodes()[0].__data__.t,
      +highlightedDate
    );

    done();
  }, 50);
});

QUnit.test("Highlighting multiple dates", function (assert) {
  assert.expect(7);

  $("body").append('<div id="hglt2"></div>');

  const highlightedDate = [
    new Date(2000, 0, 1),
    new Date(2000, 0, 2),
    new Date(2001, 0, 1),
  ];
  const cal = createCalendar({
    itemSelector: "#hglt2",
    highlight: [new Date(2000, 0, 3)],
    animationDuration: 0,
    paintOnLoad: true,
    start: new Date(2000, 0),
    domain: "month",
    range: 1,
  });
  assert.ok(cal.highlight(highlightedDate));
  assert.strictEqual(
    d3.selectAll("#hglt2 .highlight").nodes().length,
    1,
    "There is already one highlighted date, defined in init()"
  );

  const done = assert.async();
  setTimeout(function () {
    const highlightedCells = d3.selectAll("#hglt2 .highlight").nodes();
    assert.strictEqual(
      highlightedCells.length,
      2,
      "There is 2 highlighted dates"
    );
    assert.strictEqual(highlightedCells[0].__data__.t, +highlightedDate[0]);
    assert.strictEqual(highlightedCells[1].__data__.t, +highlightedDate[1]);

    const d = d3.selectAll("#hglt2 .m_1 .graph-rect").nodes()[2];
    assert.strictEqual(
      d.getAttribute("class").trim(),
      "graph-rect",
      "The initial highlighted date is not highlighted anymore"
    );
    assert.strictEqual(d.__data__.t, new Date(2000, 0, 3).getTime());

    done();

    $("#hglt2").remove();
  }, 50);
});

function _testInvalidHighlight(input) {
  QUnit.test("Testing invalid values", function (assert) {
    assert.expect(1);

    const cal = createCalendar({});
    assert.strictEqual(cal.highlight(input), false);
  });
}

_testInvalidHighlight("");
_testInvalidHighlight([]);
_testInvalidHighlight("tomorrow");
_testInvalidHighlight(2000);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test that when no legendMargin is set, margin are automatically
	computed from legend position and orientation
	-----------------------------------------------------------------
 */

QUnit.module("API: init(legendMargin)");

function __testAutoSetLegendMarginSetting(title, ver, hor, autoMarginIndex) {
  QUnit.test("Automatically add margin to " + title, function (assert) {
    assert.expect(1);

    const margin = [0, 0, 0, 0];
    const cal = createCalendar({
      legendVerticalPosition: ver,
      legendHorizontalPosition: hor,
    });
    margin[autoMarginIndex] = cal.DEFAULT_LEGEND_MARGIN;

    assert.deepEqual(
      cal.options.legendMargin,
      margin,
      "domainMargin is set to [" + margin.join(", ") + "]"
    );
  });
}

__testAutoSetLegendMarginSetting("bottom", "top", "left", 2);
__testAutoSetLegendMarginSetting("bottom", "top", "center", 2);
__testAutoSetLegendMarginSetting("bottom", "top", "right", 2);
__testAutoSetLegendMarginSetting("top", "bottom", "left", 0);
__testAutoSetLegendMarginSetting("top", "bottom", "center", 0);
__testAutoSetLegendMarginSetting("top", "bottom", "right", 0);
__testAutoSetLegendMarginSetting("right", "middle", "left", 1);
__testAutoSetLegendMarginSetting("left", "middle", "right", 3);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test colLimit and rowLimit setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(colLimit)");

function __testcolLimitSetting(title, value, expected) {
  QUnit.test("Set colLimit from " + title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ colLimit: value });
    assert.deepEqual(
      cal.options.colLimit,
      expected,
      "colLimit is set to " + expected
    );
  });
}

__testcolLimitSetting("null will disable colLimit", null, null);
__testcolLimitSetting("false will disable colLimit", false, null);
__testcolLimitSetting(
  "an invalid value (string) will disable colLimit",
  false,
  null
);
__testcolLimitSetting("a valid empty integer will disable colLimit", 0, null);
__testcolLimitSetting("a valid non-empty integer will set colLimit", 2, 2);

QUnit.module("API: init(rowLimit)");

function __testRowLimitSetting(title, value, expected) {
  QUnit.test("Set rowLimit from " + title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ rowLimit: value });
    assert.deepEqual(
      cal.options.rowLimit,
      expected,
      "rowLimit is set to " + expected
    );
  });
}

__testRowLimitSetting("null will disable rowLimit", null, null);
__testRowLimitSetting("false will disable rowLimit", false, null);
__testRowLimitSetting(
  "an invalid value (string) will disable rowLimit",
  false,
  null
);
__testRowLimitSetting("a valid empty integer will disable rowLimit", 0, null);
__testRowLimitSetting("a valid non-integer will set rowLimit", 2, 2);

QUnit.test("RowLimit is disabled when colLimit is set", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ colLimit: 5, rowLimit: 5 });
  assert.deepEqual(cal.options.rowLimit, null, "rowLimit is disabled");
});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test dataType options passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(dataType)");

QUnit.test("Allow only valid data type", function (assert) {
  const types = ["json", "txt", "csv", "tsv"];
  assert.expect(types.length);
  const cal = new CalHeatMap();

  for (let i = 0, total = types.length; i < total; i++) {
    assert.ok(
      cal.init({
        range: 1,
        dataType: types[i],
        loadOnInit: false,
        paintOnLoad: false,
      }),
      types[i] + " is a valid domain"
    );
  }
});

function _testInvalidDataType(name, input) {
  QUnit.test(
    "Invalid dataType (" + name + ") throws an Error",
    function (assert) {
      assert.expect(1);
      const cal = new CalHeatMap();
      assert.throws(function () {
        cal.init({ dataType: input });
      });
    }
  );
}

_testInvalidDataType("not supported extension", "html");
_testInvalidDataType("empty string", "");
_testInvalidDataType("null", null);
_testInvalidDataType("false", false);
_testInvalidDataType("undefined", undefined);
_testInvalidDataType("random string", "random string");
_testInvalidDataType("number", 15);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test domain and subDomain options passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(domain)");

(function () {
  function _testValidDomain(d) {
    QUnit.test("Testing that " + d + " is a valid domain", function (assert) {
      assert.expect(1);

      const cal = createCalendar({ domain: d });
      assert.strictEqual(cal.options.domain, d);
    });
  }

  const domains = ["hour", "day", "week", "month", "year"];
  for (let i = 0, total = domains.length; i < total; i++) {
    _testValidDomain(domains[i]);
  }
})();

function _testInvalidDomain(name, input) {
  QUnit.test(
    "Invalid domain (" + name + ") throws an Error",
    function (assert) {
      assert.expect(1);

      assert.throws(function () {
        createCalendar({ domain: input });
      });
    }
  );
}

_testInvalidDomain("empty string", "");
_testInvalidDomain("null", null);
_testInvalidDomain("false", false);
_testInvalidDomain("not-valid domain type", "random-value");
_testInvalidDomain("min", "min"); // Min is a valid subDomain but not domain

QUnit.test("Set default domain and subDomain", function (assert) {
  assert.expect(2);

  const cal = createCalendar({});

  assert.strictEqual(cal.options.domain, "hour", "Default domain is HOUR");
  assert.strictEqual(cal.options.subDomain, "min", "Default subDomain is MIN");
});

QUnit.module("API: init(subDomain)");

(function () {
  function _testValidSubDomain(d) {
    QUnit.test(
      "Testing that " + d + " is a valid subDomains",
      function (assert) {
        assert.expect(1);

        const cal = createCalendar({ subDomains: d });
        assert.strictEqual(cal.options.subDomains, d);
      }
    );
  }

  const subDomains = [
    "min",
    "x_min",
    "hour",
    "x_hour",
    "day",
    "x_day",
    "week",
    "x_week",
    "month",
    "x_month",
  ];
  for (let i = 0, total = subDomains.length; i < total; i++) {
    _testValidSubDomain(subDomains[i]);
  }
})();

function _testInvalidSubDomain(name, input) {
  QUnit.test(
    "Invalid subDomain (" + name + ") throws an Error",
    function (assert) {
      assert.expect(1);

      assert.throws(function () {
        createCalendar({ subDomain: input });
      });
    }
  );
}

_testInvalidSubDomain("empty string", "");
_testInvalidSubDomain("null", null);
_testInvalidSubDomain("false", false);
_testInvalidSubDomain("not-valid subDomain type", "random-value");
_testInvalidSubDomain("year", "year"); // Year is a valid domain but not subDomain

function _testSubDomainSmallerThanDomain(domain, subDomain) {
  QUnit.test(
    subDomain + " is a valid subDomain for " + domain,
    function (assert) {
      assert.expect(2);

      const cal = createCalendar({ domain, subDomain });
      assert.strictEqual(cal.options.domain, domain);
      assert.strictEqual(cal.options.subDomain, subDomain);
    }
  );
}

_testSubDomainSmallerThanDomain("hour", "min");
_testSubDomainSmallerThanDomain("day", "min");
_testSubDomainSmallerThanDomain("day", "hour");
_testSubDomainSmallerThanDomain("week", "hour");
_testSubDomainSmallerThanDomain("week", "min");
_testSubDomainSmallerThanDomain("week", "day");
_testSubDomainSmallerThanDomain("month", "week");
_testSubDomainSmallerThanDomain("year", "month");
_testSubDomainSmallerThanDomain("year", "week");

function _testInvalidSubDomainForDomain(domain, subDomain) {
  QUnit.test(
    subDomain + " is not a valid subDomain for " + domain,
    function (assert) {
      assert.expect(1);

      assert.throws(function () {
        createCalendar({ domain, subDomain });
      });
    }
  );
}

_testInvalidSubDomainForDomain("hour", "day");
_testInvalidSubDomainForDomain("day", "week");
_testInvalidSubDomainForDomain("week", "month");
_testInvalidSubDomainForDomain("month", "year");

function _testDefaultSubDomain(domain, subDomain) {
  QUnit.test(
    subDomain + " is the default subDomain for " + domain,
    function (assert) {
      assert.expect(2);

      const cal = createCalendar({ domain });
      assert.strictEqual(cal.options.domain, domain);
      assert.strictEqual(cal.options.subDomain, subDomain);
    }
  );
}

_testDefaultSubDomain("hour", "min");
_testDefaultSubDomain("day", "hour");
_testDefaultSubDomain("week", "day");
_testDefaultSubDomain("month", "day");
_testDefaultSubDomain("year", "month");

/*
	-----------------------------------------------------------------
	SETTINGS
	Test domainLabelFormat setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(domainLabelFormat)");

QUnit.test("Passing an empty string", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ domainLabelFormat: "" });
  assert.strictEqual(cal.options.domainLabelFormat, "");
});

QUnit.test("Passing a non-empty string", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ domainLabelFormat: "R" });
  assert.strictEqual(cal.options.domainLabelFormat, "R");
});

QUnit.test("Passing a function", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ domainLabelFormat: function () {} });
  assert.ok(typeof cal.options.domainLabelFormat === "function");
});

function _testdomainLabelFormatWithInvalidInput(title, input) {
  QUnit.test("Passing a not-valid input (" + title + ")", function (assert) {
    assert.expect(1);

    const cal = createCalendar({ domainLabelFormat: input });
    assert.strictEqual(
      cal.options.domainLabelFormat,
      cal._domainType.hour.format.legend,
      "Invalid input should fallback to the domain default legend format"
    );
  });
}

_testdomainLabelFormatWithInvalidInput("number", 10);
_testdomainLabelFormatWithInvalidInput("undefined", undefined);
_testdomainLabelFormatWithInvalidInput("false", false);
_testdomainLabelFormatWithInvalidInput("null", null);
_testdomainLabelFormatWithInvalidInput("array", []);
_testdomainLabelFormatWithInvalidInput("object", {});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test domainMargin and legendMargin setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(domainMargin)");

function __testDomainMarginExpand(title, margin, expectedMargin) {
  QUnit.test("Test expanding " + title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ domainMargin: margin });
    assert.deepEqual(
      cal.options.domainMargin,
      expectedMargin,
      (Array.isArray(margin) ? "[" + margin.join(", ") + "]" : margin) +
        " is expanded to [" +
        expectedMargin.join(", ") +
        "]"
    );
  });
}

__testDomainMarginExpand("an empty integer", 0, [0, 0, 0, 0]);
__testDomainMarginExpand("a non-null integer", 10, [10, 10, 10, 10]);
__testDomainMarginExpand("a one-value (zero) array", [0], [0, 0, 0, 0]);
__testDomainMarginExpand("a one-value (five) array", [5], [5, 5, 5, 5]);
__testDomainMarginExpand("a two-value array", [5, 10], [5, 10, 5, 10]);
__testDomainMarginExpand("a three-value array", [5, 10, 15], [5, 10, 15, 10]);
__testDomainMarginExpand(
  "a four-value array",
  [5, 10, 15, 20],
  [5, 10, 15, 20]
);
__testDomainMarginExpand(
  "a six-value array",
  [5, 10, 15, 20, 30, 40],
  [5, 10, 15, 20]
);
__testDomainMarginExpand(
  "an invalid (string) value fallback to 0",
  "string",
  [0, 0, 0, 0]
);
__testDomainMarginExpand(
  "an invalid (empty string) value fallback to 0",
  "",
  [0, 0, 0, 0]
);

QUnit.module("API: init(legendMargin)");

function __testDomainLegendExpand(title, margin, expectedMargin) {
  QUnit.test("Test expanding " + title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ legendMargin: margin });
    assert.deepEqual(
      cal.options.legendMargin,
      expectedMargin,
      (Array.isArray(margin) ? "[" + margin.join(", ") + "]" : margin) +
        " is expanded to [" +
        expectedMargin.join(", ") +
        "]"
    );
  });
}

__testDomainLegendExpand("an empty integer", 0, [0, 0, 0, 0]);
__testDomainLegendExpand("a non-null integer", 10, [10, 10, 10, 10]);
__testDomainLegendExpand("a one-value (zero) array", [0], [0, 0, 0, 0]);
__testDomainLegendExpand("a one-value (five) array", [5], [5, 5, 5, 5]);
__testDomainLegendExpand("a two-value array", [5, 10], [5, 10, 5, 10]);
__testDomainLegendExpand("a three-value array", [5, 10, 15], [5, 10, 15, 10]);
__testDomainLegendExpand(
  "a four-value array",
  [5, 10, 15, 20],
  [5, 10, 15, 20]
);
__testDomainLegendExpand(
  "a six-value array",
  [5, 10, 15, 20, 30, 40],
  [5, 10, 15, 20]
);
__testDomainLegendExpand(
  "an invalid (string) value fallback to 0",
  "string",
  [0, 0, 0, 0]
);
__testDomainLegendExpand(
  "an invalid (empty string) value fallback to 0",
  "",
  [0, 0, 0, 0]
);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test highlight setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(highlight)");

function __testHighlightSetting(title, highlight, expected) {
  QUnit.test("Test expanding " + title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ highlight });
    assert.deepEqual(
      cal.options.highlight,
      expected,
      (Array.isArray(highlight)
        ? "[" + highlight.join(", ") + "]"
        : highlight) +
        " is expanded to [" +
        expected.join(", ") +
        "]"
    );
  });
}

__testHighlightSetting("a null string", "", []);
__testHighlightSetting("a non-valid string", "date", []);
__testHighlightSetting("an empty array", [], []);
__testHighlightSetting(
  "a non-empty array, with no valid data",
  ["date", 0],
  []
);
__testHighlightSetting(
  "a non-empty array, with one date object",
  [new Date(2000, 0)],
  [new Date(2000, 0)]
);
__testHighlightSetting(
  "a non-empty array, with multiple date objects",
  [new Date(2000, 0), new Date(2001, 0)],
  [new Date(2000, 0), new Date(2001, 0)]
);
__testHighlightSetting("null", null, []);
__testHighlightSetting("a boolean", false, []);

QUnit.test("Test expanding NOW string", function (assert) {
  assert.expect(3);

  const cal = createCalendar({ highlight: "now" });
  assert.ok(Array.isArray(cal.options.highlight));
  assert.equal(cal.options.highlight.length, 1);
  assert.ok(cal.options.highlight[0] instanceof Date);
});

QUnit.test(
  "Test expanding NOW string inside an array of valid dates",
  function (assert) {
    assert.expect(4);

    const cal = createCalendar({ highlight: ["now", new Date()] });
    assert.ok(Array.isArray(cal.options.highlight));
    assert.equal(cal.options.highlight.length, 2);
    assert.ok(cal.options.highlight[0] instanceof Date);
    assert.ok(cal.options.highlight[1] instanceof Date);
  }
);

QUnit.test(
  "Test expanding NOW string inside an array of invalid dates",
  function (assert) {
    assert.expect(3);

    const cal = createCalendar({ highlight: ["now", "tomorrow"] });
    assert.ok(Array.isArray(cal.options.highlight));
    assert.equal(cal.options.highlight.length, 1);
    assert.ok(cal.options.highlight[0] instanceof Date);
  }
);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemName setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(itemName)");

function __testItemNameSetting(title, value, expected) {
  QUnit.test("Set itemName from " + title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ itemName: value });
    assert.deepEqual(
      cal.options.itemName,
      expected,
      "itemName is set to " + expected
    );
  });
}

__testItemNameSetting("null will fallback to default itemName", null, [
  "item",
  "items",
]);
__testItemNameSetting("false will fallback to default itemName", false, [
  "item",
  "items",
]);
__testItemNameSetting(
  "an invalid value (number) will fallback to default itemName",
  0,
  ["item", "items"]
);
__testItemNameSetting(
  "an empty string will set an empty string for the singular and plural form",
  "",
  ["", ""]
);
__testItemNameSetting("a string will guess the plural form", "cat", [
  "cat",
  "cats",
]);
__testItemNameSetting(
  "a 1-value array will guess the plural form",
  ["cat"],
  ["cat", "cats"]
);
__testItemNameSetting(
  "a 2-value array will do nothing",
  ["child", "children"],
  ["child", "children"]
);
__testItemNameSetting(
  "a 3-value array will only keeps the first 2 values",
  ["child", "children", "bomb"],
  ["child", "children"]
);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemNamespace setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(itemNamespace)");

function __testItemNamespaceSetting(title, value, expected) {
  QUnit.test(title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ itemNamespace: value });
    assert.equal(
      cal.options.itemNamespace,
      expected,
      "itemNamespace is set to " + expected
    );
  });
}

__testItemNamespaceSetting(
  "null will fallback to default namespace",
  null,
  "cal-heatmap"
);
__testItemNamespaceSetting(
  "false will fallback to default namespace",
  false,
  "cal-heatmap"
);
__testItemNamespaceSetting(
  "empty string will fallback to default namespace",
  "",
  "cal-heatmap"
);
__testItemNamespaceSetting(
  "invalid value (array) will fallback to default namespace",
  [],
  "cal-heatmap"
);
__testItemNamespaceSetting(
  "invalid value (object) will fallback to default namespace",
  {},
  "cal-heatmap"
);
__testItemNamespaceSetting(
  "invalid value (number) will fallback to default namespace",
  126,
  "cal-heatmap"
);
__testItemNamespaceSetting(
  "Setting a valid namespace from a string",
  "test-namespace",
  "test-namespace"
);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemSelector options passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(itemSelector)");

QUnit.test(
  "itemSelector accept a valid document.querySelector or CSS3 string value",
  function (assert) {
    $("body").append(
      "<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>"
    );

    assert.expect(10);

    const cal = new CalHeatMap();
    assert.equal(
      cal.init({ itemSelector: "#a", paintOnLoad: false }),
      true,
      "#a is a valid itemSelector"
    );
    assert.equal(
      $("#a .cal-heatmap-container").length,
      1,
      "Calendar is appended to #a"
    );

    assert.equal(
      cal.init({ itemSelector: "#a + #b", paintOnLoad: false }),
      true,
      "#a + #b is a valid itemSelector"
    );
    assert.equal(
      $("#b .cal-heatmap-container").length,
      1,
      "Calendar is appended to #a + #b"
    );

    assert.equal(
      cal.init({ itemSelector: "div[data=y]", paintOnLoad: false }),
      true,
      "div[data=y] is a valid itemSelector"
    );
    assert.equal(
      $("div[data=y] .cal-heatmap-container").length,
      1,
      "Calendar is appended to div[data=y]"
    );

    assert.equal(
      cal.init({ itemSelector: ".u", paintOnLoad: false }),
      true,
      ".u is a valid itemSelector"
    );
    assert.equal(
      $(".u .cal-heatmap-container").length,
      1,
      "Calendar is appended to .u"
    );

    assert.equal(
      cal.init({ itemSelector: "#test > div:last-child", paintOnLoad: false }),
      true,
      "#test > div:last-child is a valid itemSelector"
    );
    assert.equal(
      $("#last .cal-heatmap-container").length,
      1,
      "Calendar is appended to #test > div:last-child"
    );

    $("#test").remove();
  }
);

QUnit.test("itemSelector accept a valid Element object", function (assert) {
  $("body").append(
    "<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>"
  );

  assert.expect(10);

  const cal = new CalHeatMap();
  assert.equal(
    cal.init({
      itemSelector: document.querySelector("#a"),
      paintOnLoad: false,
    }),
    true,
    'document.querySelector("#a") is a valid itemSelector'
  );
  assert.equal($("#a .graph").length, 1, "Graph is appended to #a");

  assert.equal(
    cal.init({ itemSelector: $("#b")[0], paintOnLoad: false }),
    true,
    '$("#b")[0] is a valid itemSelector'
  );
  assert.equal($("#b .graph").length, 1, "Graph is appended to #b");

  assert.equal(
    cal.init({
      itemSelector: document.getElementById("last"),
      paintOnLoad: false,
    }),
    true,
    'document.getElementById("last") is a valid itemSelector'
  );
  assert.equal($("#last .graph").length, 1, "Graph is appended to #last");

  assert.equal(
    cal.init({
      itemSelector: document.getElementsByClassName("u")[0],
      paintOnLoad: false,
    }),
    true,
    'document.getElementsByClassName(".u") is a valid itemSelector'
  );
  assert.equal($(".u .graph").length, 1, "Graph is appended to .u");

  assert.equal(
    cal.init({
      itemSelector: d3.select("[data=y]").node(),
      paintOnLoad: false,
    }),
    true,
    'd3.select("[data=y]").node() is a valid itemSelector'
  );
  assert.equal(
    $("div[data=y] .graph").length,
    1,
    "Graph is appended to div[data=y]"
  );

  $("#test").remove();
});

function _testInvalidItemSelector(name, input) {
  QUnit.test(
    "Invalid itemSelector (" + name + ") throws an Error",
    function (assert) {
      assert.expect(1);

      assert.throws(function () {
        createCalendar({ itemSelector: input });
      });
    }
  );
}

_testInvalidItemSelector("empty string", "");
_testInvalidItemSelector("array", []);
_testInvalidItemSelector("number", 15);
_testInvalidItemSelector("function", function () {});

QUnit.test("itemSelector target does not exist", function (assert) {
  assert.expect(1);

  assert.throws(function () {
    createCalendar({ itemSelector: "#test" });
  }, "Non-existent itemSelector raises an Error");
});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test subDomainDateFormat setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(subDomainDateFormat)");

QUnit.test("Passing an empty string", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ subDomainDateFormat: "" });
  assert.strictEqual(cal.options.subDomainDateFormat, "");
});

QUnit.test("Passing a non-empty string", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ subDomainDateFormat: "R" });
  assert.strictEqual(cal.options.subDomainDateFormat, "R");
});

QUnit.test("Passing a function", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ subDomainDateFormat: function (assert) {} });
  assert.ok(typeof cal.options.subDomainDateFormat === "function");
});

function _testsubDomainDateFormatWithInvalidInput(title, input) {
  QUnit.test("Passing a not-valid input (" + title + ")", function (assert) {
    assert.expect(1);

    const cal = createCalendar({ subDomainDateFormat: input });
    assert.strictEqual(
      cal.options.subDomainDateFormat,
      cal._domainType.min.format.date,
      "Invalid input should fallback to the subDomain default date format"
    );
  });
}

_testsubDomainDateFormatWithInvalidInput("number", 10);
_testsubDomainDateFormatWithInvalidInput("undefined", undefined);
_testsubDomainDateFormatWithInvalidInput("false", false);
_testsubDomainDateFormatWithInvalidInput("null", null);
_testsubDomainDateFormatWithInvalidInput("array", []);
_testsubDomainDateFormatWithInvalidInput("object", {});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test subDomainTextFormat setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(subDomainTextFormat)");

QUnit.test("Passing a non-empty string", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ subDomainTextFormat: "R" });
  assert.strictEqual(cal.options.subDomainTextFormat, "R");
});

QUnit.test("Passing a function", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ subDomainTextFormat: function () {} });
  assert.ok(typeof cal.options.subDomainTextFormat === "function");
});

function _testsubDomainTextFormatWithInvalidInput(title, input) {
  QUnit.test("Passing a not-valid input (" + title + ")", function (assert) {
    assert.expect(1);

    const cal = createCalendar({ subDomainTextFormat: input });
    assert.strictEqual(
      cal.options.subDomainTextFormat,
      null,
      "Invalid input should fallback to null"
    );
  });
}

_testsubDomainTextFormatWithInvalidInput("empty string", "");
_testsubDomainTextFormatWithInvalidInput("number", 10);
_testsubDomainTextFormatWithInvalidInput("undefined", undefined);
_testsubDomainTextFormatWithInvalidInput("false", false);
_testsubDomainTextFormatWithInvalidInput("null", null);
_testsubDomainTextFormatWithInvalidInput("array", []);
_testsubDomainTextFormatWithInvalidInput("object", {});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test options passed to init()
	-----------------------------------------------------------------
 */

QUnit.test("Auto align domain label horizontally", function (assert) {
  assert.expect(4);

  const cal = new CalHeatMap();

  cal.init({ label: { position: "top" }, paintOnLoad: false });
  assert.equal(
    cal.options.label.align,
    "center",
    "Auto center label when positioned on top"
  );

  cal.init({ label: { position: "bottom" }, paintOnLoad: false });
  assert.equal(
    cal.options.label.align,
    "center",
    "Auto center label when positioned on bottom"
  );

  cal.init({ label: { position: "left" }, paintOnLoad: false });
  assert.equal(
    cal.options.label.align,
    "right",
    "Auto align label on the right when positioned on the left"
  );

  cal.init({ label: { position: "right" }, paintOnLoad: false });
  assert.equal(
    cal.options.label.align,
    "left",
    "Auto align label on the right when positioned on the right"
  );
});

QUnit.test(
  "Auto align domain label horizontally when rotated",
  function (assert) {
    assert.expect(2);

    const cal = new CalHeatMap();

    cal.init({ label: { rotate: "left" }, paintOnLoad: false });
    assert.equal(
      cal.options.label.align,
      "right",
      "Auto align on the right when rotated to the left"
    );

    cal.init({ label: { rotate: "right" }, paintOnLoad: false });
    assert.equal(
      cal.options.label.align,
      "left",
      "Auto align on the left when rotated to the right"
    );
  }
);

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : jumpTo()");

function _testJumpTo(date, reset, expectedReturn, expectedStartDate, title) {
  if (arguments.length < 5) {
    title = "";
  }
  QUnit.test(
    "Jumping to " +
      date.toDateString() +
      " " +
      (reset ? "with" : "without") +
      " reset " +
      title,
    function (assert) {
      assert.expect(2);

      const cal = createCalendar({
        domain: "month",
        start: new Date(2000, 2), // March
        range: 4,
        minDate: new Date(1999, 11), // December
        maxDate: new Date(2000, 11), // December
      });

      assert.equal(
        cal.jumpTo(date, reset),
        expectedReturn,
        "jumpTo() should return " + expectedReturn
      );
      assert.equal(
        cal.getDomainKeys()[0],
        +expectedStartDate,
        "Calendar should start on " + expectedStartDate.toDateString()
      );
    }
  );
}

// Without reset --------------------

_testJumpTo(new Date(2000, 0), false, true, new Date(2000, 0));

_testJumpTo(new Date(2000, 0, 16, 23), false, true, new Date(2000, 0));

_testJumpTo(new Date(2000, 6), false, true, new Date(2000, 3));

_testJumpTo(new Date(2000, 6, 12, 8), false, true, new Date(2000, 3));

// Without reset, out-of-bound date

// Jump to minDate instead
_testJumpTo(
  new Date(1999, 0),
  false,
  true,
  new Date(1999, 11),
  "jump to minDate"
);

// Jump to maxDate - range instead
_testJumpTo(
  new Date(2001, 7),
  false,
  true,
  new Date(2000, 8),
  "jump to maxDate - range"
);

// Without reset, the wanted domain is already visible
// Don't jump at all

_testJumpTo(
  new Date(2000, 2),
  false,
  false,
  new Date(2000, 2),
  "already visible, no jump"
);

_testJumpTo(
  new Date(2000, 2, 25, 13, 18),
  false,
  false,
  new Date(2000, 2),
  "already visible, no jump"
);

_testJumpTo(
  new Date(2000, 3),
  false,
  false,
  new Date(2000, 2),
  "already visible, no jump"
);

_testJumpTo(
  new Date(2000, 4),
  false,
  false,
  new Date(2000, 2),
  "already visible, no jump"
);

_testJumpTo(
  new Date(2000, 5),
  false,
  false,
  new Date(2000, 2),
  "already visible, no jump"
);

_testJumpTo(
  new Date(2000, 5, 30, 23, 59),
  false,
  false,
  new Date(2000, 2),
  "already visible, no jump"
);

// With reset

_testJumpTo(new Date(2000, 0), true, true, new Date(2000, 0));

_testJumpTo(new Date(2000, 0, 6, 16), true, true, new Date(2000, 0));

_testJumpTo(new Date(2000, 6, 18), true, true, new Date(2000, 6));

// With reset, out-of-bound date

_testJumpTo(
  new Date(1999, 0),
  true,
  true,
  new Date(1999, 11),
  "jump to minDate"
);

_testJumpTo(
  new Date(2001, 7),
  true,
  true,
  new Date(2000, 8),
  "jump to maxDate - range"
);

// With reset, the wanted domain is already visible
// Set the calendar first domain to the jumped dated

_testJumpTo(new Date(2000, 2, 15), true, false, new Date(2000, 2));

_testJumpTo(new Date(2000, 3, 26), true, true, new Date(2000, 3));

_testJumpTo(new Date(2000, 4, 5), true, true, new Date(2000, 4));

_testJumpTo(new Date(2000, 5, 30), true, true, new Date(2000, 5));

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : next()");

function _testNext(
  title,
  count,
  expectedReturn,
  expectedStartDate,
  startDate,
  maxDate
) {
  if (arguments.length < 5) {
    startDate = new Date(2000, 0);
  }

  if (arguments.length < 6) {
    maxDate = new Date(2000, 11);
  }

  QUnit.test(title, function (assert) {
    assert.expect(2);

    const cal = createCalendar({
      domain: "month",
      start: startDate,
      range: 4,
      loadOnInit: true,
      paintOnLoad: true,
      maxDate,
    });

    assert.equal(
      count === null ? cal.next() : cal.next(count),
      expectedReturn,
      "next() should return " + expectedReturn
    );
    assert.equal(
      cal.getDomainKeys()[0],
      +expectedStartDate,
      "Calendar should start on " + expectedStartDate.toDateString()
    );
  });
}

/*

  Test:
	- Calling next() without any argument
	- Calling next(n) with n = 1
	- Calling next(1) with n > 1
	- Calling next() when maxDate is reached
 */

_testNext(
  "Shift one domain forward with next()",
  null,
  true,
  new Date(2000, 1)
);

_testNext(
  "Shift three domains forward with next(3)",
  3,
  true,
  new Date(2000, 3)
);

_testNext(
  "Shift eight domains forward with next(8)",
  8,
  true,
  new Date(2000, 8)
);

_testNext("Shifting does not go beyond maxDate", 11, true, new Date(2000, 8));

_testNext("Shifting does not go beyond maxDate", 25, true, new Date(2000, 8));

_testNext(
  "next() do nothing when maxDate === startDate",
  null,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 0)
);

_testNext(
  "next() do nothing when maxDate is 'inside' the calendar",
  null,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 2)
);

_testNext(
  "next() d nothing when maxDate is the last domain of the calendar",
  null,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 3)
);

_testNext(
  "next(10) do nothing when maxDate === startDate",
  10,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 0)
);

_testNext(
  "next(10) do nothing when maxDate is 'inside' the calendar",
  10,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 2)
);

_testNext(
  "next(10) d nothing when maxDate is the last domain of the calendar",
  10,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 3)
);

QUnit.test(
  "Calling next when minDate is reached remove the minDomainReached state",
  function (assert) {
    assert.expect(2);

    const cal = createCalendar({
      domain: "month",
      start: new Date(2000, 0),
      range: 4,
      loadOnInit: true,
      paintOnLoad: true,
      minDate: new Date(2000, 0),
    });

    assert.equal(
      true,
      cal._minDomainReached,
      "Min domain is reached on calendar init"
    );
    cal.next();
    assert.equal(
      false,
      cal._minDomainReached,
      "Min domain is not reached after next()"
    );
  }
);

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : previous()");

function _testPrevious(
  title,
  count,
  expectedReturn,
  expectedStartDate,
  startDate,
  minDate
) {
  if (arguments.length < 5) {
    startDate = new Date(2000, 0);
  }

  if (arguments.length < 6) {
    minDate = new Date(1999, 2);
  }

  QUnit.test(title, function (assert) {
    assert.expect(2);

    const cal = createCalendar({
      domain: "month",
      start: startDate,
      range: 4,
      loadOnInit: true,
      paintOnLoad: true,
      minDate,
      maxDate: new Date(2000, 3),
    });

    assert.equal(
      count === null ? cal.previous() : cal.previous(count),
      expectedReturn,
      "previous() should return " + expectedReturn
    );
    assert.equal(
      cal.getDomainKeys()[0],
      +expectedStartDate,
      "Calendar should start on " + expectedStartDate.toDateString()
    );
  });
}

/*

  Test:
	- Calling previous() without any argument
	- Calling previous(n) with n = 1
	- Calling previous(1) with n > 1
	- Calling previous() when minDate is reached
 */

_testPrevious(
  "Shift one domain backward with previous()",
  null,
  true,
  new Date(1999, 11)
);

_testPrevious(
  "Shift three domains backward with previous(3)",
  3,
  true,
  new Date(1999, 9)
);

_testPrevious(
  "Shift eight domains backward with previous(8)",
  8,
  true,
  new Date(1999, 4)
);

_testPrevious(
  "Shifting does not go beyond minDate",
  11,
  true,
  new Date(1999, 2)
);

_testPrevious(
  "Shifting does not go beyond minDate",
  25,
  true,
  new Date(1999, 2)
);

_testPrevious(
  "previous() do nothing when minDate === startDate",
  null,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 0)
);

_testPrevious(
  "previous() do nothing when minDate is 'inside' the calendar",
  null,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 2)
);

_testPrevious(
  "previous(10) do nothing when minDate === startDate",
  10,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 0)
);

_testPrevious(
  "previous(10) do nothing when minDate is 'inside' the calendar",
  10,
  false,
  new Date(2000, 0),
  new Date(2000, 0),
  new Date(2000, 2)
);

QUnit.test(
  "Calling previous when maxDate is reached remove the maxDomainReached state",
  function (assert) {
    assert.expect(2);

    const cal = createCalendar({
      domain: "month",
      start: new Date(2000, 0),
      range: 4,
      loadOnInit: true,
      paintOnLoad: true,
      maxDate: new Date(2000, 3),
    });

    assert.equal(
      true,
      cal._maxDomainReached,
      "Max domain is reached on calendar init"
    );
    cal.previous();
    assert.equal(
      false,
      cal._maxDomainReached,
      "Max domain is not reached after previous()"
    );
  }
);

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : removeLegend()");

QUnit.test("Removing not existing legend", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ displayLegend: false });

  assert.equal(
    cal.removeLegend(),
    false,
    "removeLegend() return false when legend does not exist"
  );
});

QUnit.test("Removing existing legend", function (assert) {
  assert.expect(5);

  const cal = createCalendar({ displayLegend: true, paintOnLoad: true });

  assert.equal(
    cal.options.displayLegend,
    true,
    "displayLegend setting is set to true"
  );
  assert.false(
    cal.root.select(".graph-legend").empty(),
    "Legend exists int DOM"
  );

  assert.equal(
    cal.removeLegend(),
    true,
    "removeLegend() return true when legend does exist"
  );
  assert.equal(
    cal.options.displayLegend,
    false,
    "displayLegend setting is now set to false"
  );
  assert.true(
    cal.root.select(".graph-legend").empty(),
    "Legend is now removed from the DOM"
  );
});

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : showLegend()");

QUnit.test("Show already existing legend", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ displayLegend: true });

  assert.equal(
    cal.showLegend(),
    false,
    "showLegend() return false when legend already exists"
  );
});

QUnit.test("Show not existing legend", function (assert) {
  assert.expect(5);

  const cal = createCalendar({ displayLegend: false });

  assert.equal(
    cal.options.displayLegend,
    false,
    "displayLegend setting is set to false"
  );
  assert.true(
    cal.root.select(".graph-legend").empty(),
    "There is no legend in the DOM"
  );

  assert.equal(
    cal.showLegend(),
    true,
    "showLegend() return true when legend does not exist yet"
  );
  assert.equal(
    cal.options.displayLegend,
    true,
    "displayLegend setting is now set to true"
  );
  assert.false(
    cal.root.select(".graph-legend").empty(),
    "Legend is now added into the DOM"
  );
});

/*
	-----------------------------------------------------------------
	DATA
	-----------------------------------------------------------------
 */

/*
QUnit.module("Unit Test: getDatas()", {
	before: function() {
		path = (window.parent.document.title === "Karma" ? "base/test/" : "") + "data/";
	},
	after: function() {
		path = null;
	}
});

QUnit.test("Invalid data (undefined) is ignore and treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({data: undefined});

	assert.deepEqual(cal.options.data, undefined);
	assert.ok(cal.getDatas(
		undefined,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "undefined is equivalent to an empty object"); }
	));
});

QUnit.test("Invalid data (null) is ignore and treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({data: null});

	assert.deepEqual(cal.options.data, null);
	assert.ok(cal.getDatas(
		null,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "null is equivalent to an empty object"); }
	));
});

QUnit.test("Invalid data (number) is ignore and treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({data: 8});

	assert.deepEqual(cal.options.data, 8);
	assert.ok(cal.getDatas(
		8,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "number is equivalent to an empty object"); }
	));
});

QUnit.test("Object is left untouched", function(assert) {
	assert.expect(4);

	var d = [0, 1];
	var cal = createCalendar({data: d});

	assert.deepEqual(cal.options.data, d);
	assert.equal(cal.getDatas(
		d,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, d); }
	), false);
});

QUnit.test("Empty string is treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({});

	assert.equal(cal.options.data, "");
	assert.ok(cal.getDatas(
		"",
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "empty string is equivalent to an empty object"); }
	));
});

QUnit.test("Passing directly an object", function(assert) {
	assert.expect(4);

	var dt = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	assert.deepEqual(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, dt, "The passed object is used directly"); }
	), false);
});

QUnit.test("Passing a non-empty string is interpreted as an URL, and parsed using JSON", function(assert) {
	assert.expect(3);

	var dt = path + "data.json";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() {},
		function(data) {
			done();
			assert.deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

QUnit.test("Parsing a CSV file", function(assert) {
	assert.expect(5);

	var dt = path + "data.csv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "csv"});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) {
			done();
			assert.deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the CSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			assert.deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

QUnit.test("Parsing a TSV file", function(assert) {
	assert.expect(5);

	var dt = path + "data.tsv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "tsv"});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) {
			done();
			assert.deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the TSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			assert.deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

QUnit.test("Parsing a TXT file", function(assert) {
	assert.expect(4);

	var dt = path + "data.txt";
	var fileContent = "{\n" +
		"\t\"946721039\":1,\n" +
		"\t\"946706853\":1,\n" +
		"\t\"946706340\":1\n" +
	"}";
	var cal = createCalendar({data: dt, dataType: "txt"});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) {
			done();
			assert.equal(data, fileContent, "The file is read as a plain text file");
		}
	), false);
});
*/

QUnit.module("Date computation : dateLessThan()");

const min = 60 * 1000; // one min millis
const hour = 60 * min; // one hour millis
const day = 24 * hour; // one hour millis
const month = 30 * day; // one (average month);

QUnit.test(
  "date is less than now in the domain hour, subdomain min",
  function (assert) {
    assert.expect(6);

    const cal = createCalendar({});

    const now = new Date(2013, 12, 9, 12, 30, 30, 0); // 12:30:30, 2013-12-9

    assert.ok(cal.dateIsLessThan(new Date(0), now));
    assert.ok(cal.dateIsLessThan(new Date(now.getTime() - min), now));
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * 1000), now)); // still within the min
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * 1000), now)); // still within the min
    assert.ok(!cal.dateIsLessThan(now, now));
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() + min), now));
  }
);

QUnit.test(
  "date is less than now in the domain day, subdomain hour",
  function (assert) {
    assert.expect(6);

    const cal = createCalendar({ domain: "day", subDomain: "hour" });

    const now = new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    assert.ok(cal.dateIsLessThan(new Date(0), now));
    assert.ok(cal.dateIsLessThan(new Date(now.getTime() - hour), now));
    assert.ok(
      !cal.dateIsLessThan(new Date(now.getTime() - 5 * 60 * 1000), now)
    ); // still within the hour
    assert.ok(
      !cal.dateIsLessThan(new Date(now.getTime() + 5 * 60 * 1000), now)
    ); // still within the hour
    assert.ok(!cal.dateIsLessThan(now, now));
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() + hour), now));
  }
);

QUnit.test(
  "date is less than now in the domain month, subdomain day",
  function (assert) {
    assert.expect(6);

    const cal = createCalendar({ domain: "month", subDomain: "day" });

    const now = new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    assert.ok(cal.dateIsLessThan(new Date(0), now));
    assert.ok(cal.dateIsLessThan(new Date(now.getTime() - day), now));
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * hour), now)); // still within the day
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * hour), now)); // still within the day
    assert.ok(!cal.dateIsLessThan(now, now));
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() + day), now));
  }
);

QUnit.test(
  "date is less than now in the domain month, subdomain day",
  function (assert) {
    assert.expect(6);

    const cal = createCalendar({ domain: "year", subDomain: "month" });

    const now = new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    assert.ok(cal.dateIsLessThan(new Date(0), now));
    assert.ok(cal.dateIsLessThan(new Date(now.getTime() - month), now));
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * day), now)); // still within the month
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * day), now)); // still within the month
    assert.ok(!cal.dateIsLessThan(now, now));
    assert.ok(!cal.dateIsLessThan(new Date(now.getTime() + month), now));
  }
);

/*
	-----------------------------------------------------------------
	DATE
	-----------------------------------------------------------------
 */

QUnit.module("Date computation : isNow()");

QUnit.test("Now is equal to now", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  assert.ok(cal.isNow(new Date()));
});

QUnit.test("Passed date is not equal to now", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  assert.equal(cal.isNow(new Date(2000, 0)), false);
});

/*
	-----------------------------------------------------------------
	DATE
	-----------------------------------------------------------------
 */

QUnit.module("Date computation : jump()");

function _testJump(date, expectedDate, count, step) {
  QUnit.test(
    "Jumping " +
      count +
      " " +
      step +
      "s " +
      (count > 0 ? "forward" : "backward"),
    function (assert) {
      assert.expect(1);

      const cal = createCalendar({});

      assert.deepEqual(
        cal.jumpDate(date, count, step),
        expectedDate,
        date +
          " " +
          (count < 0 ? "-" : "+") +
          " " +
          Math.abs(count) +
          " " +
          step +
          " should outpout " +
          expectedDate
      );
    }
  );
}

// HOUR ----------------------------------

// Jump one hour forward
_testJump(new Date(2000, 0, 1, 0, 0), new Date(2000, 0, 1, 1, 0), 1, "hour");

// Jump 5 hours forward with date change
_testJump(new Date(2000, 0, 1, 23, 0), new Date(2000, 0, 2, 4, 0), 5, "hour");

// Jump 5 hours forward with month change
_testJump(new Date(2000, 0, 31, 23, 0), new Date(2000, 1, 1, 4, 0), 5, "hour");

// Jump 30 hours forward with year change
_testJump(
  new Date(2000, 11, 31, 23, 0),
  new Date(2001, 0, 2, 5, 0),
  30,
  "hour"
);

// Jump one hour backward
_testJump(new Date(2000, 0, 1, 1, 0), new Date(2000, 0, 1, 0, 0), -1, "hour");

// Jump 5 hours backward with date change
_testJump(new Date(2000, 0, 2, 4, 0), new Date(2000, 0, 1, 23, 0), -5, "hour");

// Jump 5 hours backward with month change
_testJump(new Date(2000, 1, 1, 4, 0), new Date(2000, 0, 31, 23, 0), -5, "hour");

// Jump 30 hours backward with year change
_testJump(
  new Date(2001, 0, 2, 5, 0),
  new Date(2000, 11, 31, 23, 0),
  -30,
  "hour"
);

// DAY ----------------------------------

// Jump one day forward
_testJump(new Date(2000, 0, 1, 15, 0), new Date(2000, 0, 2, 15, 0), 1, "day");

// Jump 5 days forward with date change
_testJump(new Date(2000, 0, 1, 23, 35), new Date(2000, 0, 6, 23, 35), 5, "day");

// Jump 5 days forward with month change
_testJump(new Date(2000, 0, 31, 23, 0), new Date(2000, 1, 5, 23, 0), 5, "day");

// Jump 30 days forward with year change
_testJump(
  new Date(2000, 11, 31, 23, 0),
  new Date(2001, 0, 30, 23, 0),
  30,
  "day"
);

// Jump one day backward
_testJump(new Date(2000, 0, 2, 15, 0), new Date(2000, 0, 1, 15, 0), -1, "day");

// Jump 5 days backward with date change
_testJump(
  new Date(2000, 0, 6, 23, 35),
  new Date(2000, 0, 1, 23, 35),
  -5,
  "day"
);

// Jump 5 days backward with month change
_testJump(new Date(2000, 1, 5, 23, 0), new Date(2000, 0, 31, 23, 0), -5, "day");

// Jump 30 days backward with year change
_testJump(
  new Date(2001, 0, 30, 23, 0),
  new Date(2000, 11, 31, 23, 0),
  -30,
  "day"
);

// DST to Standard Time ----------------------------------
// Date jumping should be DST independent, and works normally
// without any artifact
_testJump(new Date(2013, 10, 4, 0), new Date(2013, 10, 4, 1), 1, "hour");

_testJump(new Date(2013, 10, 4, 0), new Date(2013, 10, 4, 2), 2, "hour");

_testJump(new Date(2013, 10, 4, 0), new Date(2013, 10, 4, 3), 3, "hour");

_testJump(new Date(2013, 10, 4, 1), new Date(2013, 10, 4, 2), 1, "hour");

_testJump(new Date(2013, 10, 4, 1), new Date(2013, 10, 4, 3), 2, "hour");

_testJump(new Date(2013, 10, 4, 3), new Date(2013, 10, 4, 2), -1, "hour");

_testJump(new Date(2013, 10, 4, 3), new Date(2013, 10, 4, 1), -2, "hour");

_testJump(new Date(2013, 10, 4, 3), new Date(2013, 10, 4, 0), -3, "hour");

_testJump(new Date(2013, 10, 4, 1), new Date(2013, 10, 4, 0), -1, "hour");

(function () {
  const startDate = new Date(2013, 10, 3, 0);

  // Skip the test if your DST change is not following the North American standard
  if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
    return true;
  }

  // Standard Time to DST ----------------------------------
  _testJump(new Date(2013, 2, 10, 0), new Date(2013, 2, 10, 1), 1, "hour");

  _testJump(new Date(2013, 2, 10, 0), new Date(2013, 2, 10, 2), 2, "hour");

  _testJump(new Date(2013, 2, 10, 0), new Date(2013, 2, 10, 3), 3, "hour");

  _testJump(new Date(2013, 2, 10, 1), new Date(2013, 2, 10, 2), 1, "hour");

  _testJump(new Date(2013, 2, 10, 1), new Date(2013, 2, 10, 0), -1, "hour");

  _testJump(
    new Date(2013, 2, 10, 2), // 2am => inexisting hour, considered 1am
    new Date(2013, 2, 9, 23),
    -2,
    "hour"
  );

  _testJump(new Date(2013, 2, 10, 3), new Date(2013, 2, 10, 0), -3, "hour");

  _testJump(
    new Date(2013, 2, 10, 2), // 2am => inexisting hour, considered 1am
    new Date(2013, 2, 10, 0),
    -1,
    "hour"
  );
})();

/*
	-----------------------------------------------------------------
	DST: Daylight Saving Time
	-----------------------------------------------------------------
 */

QUnit.module("DST: DST to Standard Time");

(function () {
  const startDate = new Date(2013, 10, 3, 0);

  // Skip the test if your DST change is not following the North American standard
  if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
    return true;
  }

  QUnit.test(
    "HOUR DOMAIN: the duplicate hour is compressed into a single hour",
    function (assert) {
      assert.expect(5);

      const cal = createCalendar({
        start: startDate,
        range: 4,
        paintOnLoad: true,
      });
      const labels = cal.root.selectAll(".graph-label").nodes();

      assert.strictEqual(labels.length, 4, "There is 4 graph labels");
      assert.equal(labels[0].firstChild.data, "00:00");
      assert.equal(labels[1].firstChild.data, "01:00");
      assert.equal(labels[2].firstChild.data, "02:00");
      assert.equal(labels[3].firstChild.data, "03:00");
    }
  );

  QUnit.test(
    "DAY DOMAIN: the duplicate hour is compressed into a single hour",
    function (assert) {
      assert.expect(4);

      const cal = createCalendar({
        start: startDate,
        range: 1,
        paintOnLoad: true,
        domain: "day",
      });
      const cells = cal.root.selectAll(".graph-rect").nodes();

      assert.strictEqual(cells.length, 24, "There is 24 subDomains cells");

      assert.equal(
        cells[0].__data__.t,
        startDate.getTime(),
        "The first cell is midnight"
      );
      assert.equal(
        cells[0].__data__.t,
        startDate.getTime() + 3600 * 1000 * 2,
        "The second cell is for the two 1am"
      );
      assert.equal(
        cells[0].__data__.t,
        startDate.getTime() + 3600 * 1000 * 3,
        "The third cell is for 2am"
      );
    }
  );
})();

QUnit.module("DST: Standard Time to DST");

(function () {
  const startDate = new Date(2013, 2, 10, 0);

  // Skip the test if your DST change is not following the North American standard
  if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
    return true;
  }

  QUnit.test("HOUR DOMAIN: the missing hour is skipped", function (assert) {
    assert.expect(5);

    const cal = createCalendar({
      start: startDate,
      range: 4,
      paintOnLoad: true,
    });
    const labels = cal.root.selectAll(".graph-label").nodes();

    assert.strictEqual(labels.length, 4, "There is 4 graph labels");
    assert.equal(labels[0].firstChild.data, "00:00");
    assert.equal(labels[1].firstChild.data, "01:00");
    assert.equal(
      labels[2].firstChild.data,
      "03:00",
      "3am is following 2am, there is no 2 am"
    );
    assert.equal(labels[3].firstChild.data, "04:00");
  });

  QUnit.test("DAY DOMAIN: the missing hour is skipped", function (assert) {
    assert.expect(4);

    const cal = createCalendar({
      start: startDate,
      range: 1,
      paintOnLoad: true,
      domain: "day",
    });
    const cells = cal.root.selectAll(".graph-rect").nodes();

    assert.strictEqual(cells.length, 23, "There is 23 subDomains cells");

    assert.equal(
      cells[0].__data__.t,
      startDate.getTime(),
      "The first cell is midnight"
    );
    assert.equal(
      cells[1].__data__.t,
      startDate.getTime() + 3600 * 1000,
      "The second cell is for 1am"
    );
    assert.equal(
      cells[2].__data__.t,
      startDate.getTime() + 3600 * 1000 * 2,
      "The third cell is for 3am, there is no 2am"
    );
  });
})();

/*
	-----------------------------------------------------------------
	Unit Test
	Test getHighlightClassName()
	-----------------------------------------------------------------
 */

QUnit.module("Unit Test: getHighlightClassName()");

QUnit.test(
  "Return the highlight classname if a date should be highlighted",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({
      highlight: [new Date(2000, 0, 1), new Date(2000, 0, 2)],
    });
    assert.strictEqual(
      cal.getHighlightClassName(new Date(2000, 0, 1)),
      " highlight"
    );
  }
);

QUnit.test(
  "Return the highlight and now classname if a date should be highlighted and is now",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({
      highlight: [new Date(2000, 0, 1), new Date()],
    });
    assert.strictEqual(cal.getHighlightClassName(new Date()), " highlight-now");
  }
);

QUnit.test(
  "Return an empty string if a date is not in the highlight list",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({ highlight: [new Date(2000, 0, 1)] });
    assert.strictEqual(cal.getHighlightClassName(new Date(2000, 0, 2)), "");
  }
);

QUnit.test(
  "Return an empty string if the highlight list is empty",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({});
    assert.strictEqual(cal.getHighlightClassName(new Date()), "");
  }
);

/*
	-----------------------------------------------------------------
	Callback
	-----------------------------------------------------------------
 */

QUnit.module("Callback");

QUnit.test("OnClick", function (assert) {
  assert.expect(2);

  const testFunction = function (date, itemNb) {
    return { d: date, i: itemNb };
  };

  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    onClick: testFunction,
  });

  const date = new Date(2012, 0, 1, 20, 35);

  const response = cal.onClick(date, 58);

  assert.equal(response.i, 58);
  assert.equal(response.d.getTime(), date.getTime());
});

QUnit.test("afterLoad", function (assert) {
  assert.expect(1);

  $("#cal-heatmap").data("test", "Dummy Data");
  const finalString = "Edited data";
  const testFunction = function () {
    $("#cal-heatmap").data("test", finalString);
  };

  createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    afterLoad: testFunction,
    paintOnLoad: true,
  });

  assert.equal($("#cal-heatmap").data("test"), finalString);
});

QUnit.test("onComplete", function (assert) {
  assert.expect(1);

  $("body").data("test", "Dummy Data");
  const finalString = "Edited data";
  const testFunction = function () {
    $("body").data("test", finalString);
  };

  createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    onComplete: testFunction,
    paintOnLoad: true,
    loadOnInit: true,
  });

  assert.equal($("body").data("test"), finalString);
});

QUnit.test("onComplete is ran even on loadOnInit = false", function (assert) {
  assert.expect(1);

  $("body").data("test", "Dummy Data");
  const finalString = "Edited data";
  const testFunction = function () {
    $("body").data("test", finalString);
  };

  createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    onComplete: testFunction,
    paintOnLoad: true,
    loadOnInit: false,
  });

  assert.equal($("body").data("test"), finalString);
});

QUnit.test(
  "onComplete does not run with paintOnLoad = false",
  function (assert) {
    assert.expect(1);

    $("body").data("test", "Dummy Data");
    const finalString = "Edited data";
    const testFunction = function () {
      $("body").data("test", finalString);
    };

    createCalendar({
      domain: "hour",
      subDomain: "min",
      range: 1,
      onComplete: testFunction,
      paintOnLoad: false,
    });

    assert.equal($("body").data("test"), "Dummy Data");
  }
);

QUnit.test("afterLoadPreviousDomain", function (assert) {
  assert.expect(2);

  const testFunction = function (start, end) {
    return { start, end };
  };

  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    afterLoadPreviousDomain: testFunction,
  });

  const date = new Date(2012, 0, 1, 20, 35);
  const previousDomainStart = new Date(2012, 0, 1, 20);
  const previousDomainEnd = new Date(2012, 0, 1, 20, 59);

  const response = cal.afterLoadPreviousDomain(date);

  assert.equal(
    response.start.getTime(),
    previousDomainStart.getTime(),
    "Callback return first subdomain of the date"
  );
  assert.equal(
    response.end.getTime(),
    previousDomainEnd.getTime(),
    "Callback return last subdomain of the date"
  );
});

QUnit.test("afterLoadNextDomain", function (assert) {
  assert.expect(2);

  const testFunction = function (start, end) {
    return { start, end };
  };

  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    afterLoadNextDomain: testFunction,
  });

  const date = new Date(2012, 0, 1, 20, 35);
  const nextDomainStart = new Date(2012, 0, 1, 20);
  const nextDomainEnd = new Date(2012, 0, 1, 20, 59);

  const response = cal.afterLoadNextDomain(date);

  assert.equal(
    response.start.getTime(),
    nextDomainStart.getTime(),
    "Callback return first subdomain of the date"
  );
  assert.equal(
    response.end.getTime(),
    nextDomainEnd.getTime(),
    "Callback return last subdomain of the date"
  );
});

QUnit.test("onClick is not a valid callback : object", function (assert) {
  assert.expect(1);
  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    onClick: {},
  });
  assert.equal(cal.onClick(), false);
});

QUnit.test("onClick is not a valid callback : string", function (assert) {
  assert.expect(1);
  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    onClick: "string",
  });
  assert.equal(cal.onClick(), false);
});

QUnit.test("afterLoad is not a valid callback : object", function (assert) {
  assert.expect(1);
  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    afterLoad: {},
  });
  assert.equal(cal.afterLoad(), false);
});

QUnit.test("afterLoad is not a valid callback : string", function (assert) {
  assert.expect(1);
  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    afterLoad: "null",
  });
  assert.equal(cal.afterLoad(), false);
});

QUnit.test(
  "afterLoadNextDomain is not a valid callback : string",
  function (assert) {
    assert.expect(1);
    const cal = createCalendar({
      domain: "hour",
      subDomain: "min",
      range: 1,
      afterLoadNextDomain: "null",
    });
    assert.equal(cal.afterLoadNextDomain(), false);
  }
);

QUnit.test(
  "afterLoadPreviousDomain is not a valid callback : string",
  function (assert) {
    assert.expect(1);
    const cal = createCalendar({
      domain: "hour",
      subDomain: "min",
      range: 1,
      afterLoadPreviousDomain: "null",
    });
    assert.equal(cal.afterLoadPreviousDomain(null), false);
  }
);

QUnit.test("onComplete is not a valid callback : object", function (assert) {
  assert.expect(1);
  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    onComplete: {},
    loadOnInit: true,
  });
  assert.equal(cal.onComplete(), false);
});

QUnit.test("onComplete is not a valid callback : string", function (assert) {
  assert.expect(1);
  const cal = createCalendar({
    domain: "hour",
    subDomain: "min",
    range: 1,
    onComplete: "null",
    loadOnInit: true,
  });
  assert.equal(cal.onComplete(), false);
});

QUnit.test("afterLoadData is not a valid callback", function (assert) {
  assert.expect(1);

  const date = new Date(2000, 0, 1);
  const date1 = date.getTime() / 1000;
  const date2 = date1 + 3600;
  const date3 = date2 + 60;

  const datas = [];
  datas.push({ date: date1, value: 15 }); // 15 events for 00:00
  datas.push({ date: date2, value: 25 }); // 25 events for 01:00
  datas.push({ date: date3, value: 1 }); // 01 events for 01:01

  const parser = "";
  const cal = createCalendar({
    data: datas,
    start: new Date(2000, 0, 1, 1),
    afterLoadData: parser,
    domain: "hour",
    subDomain: "min",
  });

  assert.equal(
    true,
    $.isEmptyObject(cal.parseDatas(datas)),
    "parseDatas return an empty object"
  );
});

/*
	-----------------------------------------------------------------
	DATA SOURCE PARSING
	-----------------------------------------------------------------
 */

QUnit.module("Interpreting Data source template");

/*
QUnit.test("Data Source is a regex string, replace by timestamp", function(assert) {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{t:start}}&end={{t:end}}";
	var domains = cal._domains.keys();

	var parsedUri = "get?start=" + (domains[0]/1000) + "&end=" + (domains[domains.length-1]/1000);

	assert.equal(cal.parseURI(uri, new Date(+domains[0]), new Date(+domains[domains.length-1])), parsedUri, "Start and end token was replaced by a timestamp : " + parsedUri);
});

QUnit.test("Data Source is a regex string, replace by ISO-8601 Date", function(assert) {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{d:start}}&end={{d:end}}";
	var domains = cal._domains.keys();

	var startDate = new Date(+domains[0]);
	var endDate = new Date(+domains[domains.length-1]);

	var parsedUri = "get?start=" + startDate.toISOString() + "&end=" + endDate.toISOString();

	assert.equal(cal.parseURI(uri, new Date(+domains[0]), new Date(+domains[domains.length-1])), parsedUri, "Start and end token was replaced by a string : " + parsedUri);
});
*/

/*
	-----------------------------------------------------------------
	DATA PARSING
	-----------------------------------------------------------------
 */
/*
QUnit.module( "Data processing" );

QUnit.test("Grouping datas by hour>min", function(assert) {
	assert.expect(6);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: date});

	var calDatas = cal.parseDatas(datas);

	assert.equal(Object.keys(calDatas).length, 2, "Only datas for 2 hours");
	assert.equal(Object.keys(calDatas[date1*1000]).length, 1, "First hour contains 1 event");
	assert.equal(Object.keys(calDatas[date2*1000]).length, 2, "Second hour contains 2 events");
	assert.equal(calDatas[date1*1000]["0"], 15);
	assert.equal(calDatas[date2*1000]["0"], 25);
	assert.equal(calDatas[date2*1000]["1"], 1);
});

QUnit.test("Grouping datas by day>hour", function(assert) {
	assert.expect(2);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: date, domain: "day", subDomain: "hour"});

	var calDatas = cal.parseDatas(datas);

	assert.equal(Object.keys(calDatas).length, 1, "Only datas for 1 day");
	assert.equal(Object.keys(calDatas[date1*1000]).length, 2, "Day contains datas for 2 hours");

});

QUnit.test("Filter out datas not relevant to calendar domain", function(assert) {
	assert.expect(4);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: new Date(2000, 0, 1, 1), domain: "hour", subDomain: "min"});

	var calDatas = cal.parseDatas(datas);

	assert.equal(Object.keys(calDatas).length, 1, "Only datas for 1 hour");
	assert.equal(calDatas.hasOwnProperty(date1*1000), false, "Datas for the first hour are filtered out");
	assert.equal(calDatas.hasOwnProperty(date2*1000), true, "Only datas for the second hours remains");
	assert.equal(Object.keys(calDatas[date2*1000]).length, 2, "Hours contains datas for 2 minutes");

}); */

/*
	-----------------------------------------------------------------
	BASIC DOMAIN TESTS
	-----------------------------------------------------------------
 */

QUnit.module("Domain equal 1");

QUnit.test("get domain when domain is 1 HOUR", function (assert) {
  assert.expect(6);

  const date = new Date(2003, 10, 31, 20, 26);

  const cal = createCalendar({ range: 1, start: date });
  const domain = cal.getDomain(date);

  assert.equal(domain.length, 1, "Domain size is 1 hour");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(
    domain[0].getHours(),
    date.getHours(),
    "Domain start hour is equal to date hour"
  );
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );
});

QUnit.test(
  "get domain when domain is 1 HOUR, from a timestamp",
  function (assert) {
    assert.expect(6);

    const date = new Date(2003, 10, 31, 20, 26);

    const cal = createCalendar({ range: 1, start: date });
    const domain = cal.getDomain(date.getTime());

    assert.equal(domain.length, 1, "Domain size is 1 hour");

    assert.equal(
      domain[0].getFullYear(),
      date.getFullYear(),
      "Domain start year is equal to date year"
    );
    assert.equal(
      domain[0].getMonth(),
      date.getMonth(),
      "Domain start month is equal to date month"
    );
    assert.equal(
      domain[0].getDate(),
      date.getDate(),
      "Domain start day is equal to date day"
    );
    assert.equal(
      domain[0].getHours(),
      date.getHours(),
      "Domain start hour is equal to date hour"
    );
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test("get domain when domain is 1 DAY", function (assert) {
  assert.expect(6);

  const date = new Date(2003, 10, 20, 23, 26);

  const cal = createCalendar({ domain: "day", range: 1, start: date });
  const domain = cal.getDomain(date);

  assert.equal(domain.length, 1, "Domain size is 1 day");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );
});

QUnit.test(
  "get domain when domain is 1 DAY, from a timestamp",
  function (assert) {
    assert.expect(6);

    const date = new Date(2003, 10, 20, 23, 26);

    const cal = createCalendar({ domain: "day", range: 1, start: date });
    const domain = cal.getDomain(date.getTime());

    assert.equal(domain.length, 1, "Domain size is 1 day");

    assert.equal(
      domain[0].getFullYear(),
      date.getFullYear(),
      "Domain start year is equal to date year"
    );
    assert.equal(
      domain[0].getMonth(),
      date.getMonth(),
      "Domain start month is equal to date month"
    );
    assert.equal(
      domain[0].getDate(),
      date.getDate(),
      "Domain start day is equal to date day"
    );
    assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test(
  "get domain when domain is 1 WEEK, from a date in the middle of the week",
  function (assert) {
    assert.expect(6);

    const date = new Date(2013, 1, 20, 20, 15); // Wednesday : February 20th, 2013
    const weekStart = new Date(2013, 1, 18); // Monday : February 18th, 2013

    const cal = createCalendar({ domain: "week", range: 1, start: date });
    const domain = cal.getDomain(date);

    assert.equal(domain.length, 1, "Domain size is 1 week");

    assert.equal(
      domain[0].getFullYear(),
      weekStart.getFullYear(),
      "Domain start year is equal to the weeks monday's year"
    );
    assert.equal(
      domain[0].getMonth(),
      weekStart.getMonth(),
      "Domain start month is equal to weeks monday's month"
    );
    assert.equal(
      domain[0].getDate(),
      weekStart.getDate(),
      "Domain start day is equal to the weeks monday date"
    );
    assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test(
  "get domain when domain is 1 WEEK, from a date right on beginning of the week",
  function (assert) {
    assert.expect(6);

    const date = new Date(2013, 1, 18, 20, 15); // Monday : February 18th, 2013
    const weekStart = new Date(2013, 1, 18); // Monday : February 18th, 2013

    const cal = createCalendar({ domain: "week", range: 1, start: date });
    const domain = cal.getDomain(date);

    assert.equal(domain.length, 1, "Domain size is 1 week");

    assert.equal(
      domain[0].getFullYear(),
      weekStart.getFullYear(),
      "Domain start year is equal to the weeks monday's year"
    );
    assert.equal(
      domain[0].getMonth(),
      weekStart.getMonth(),
      "Domain start month is equal to weeks monday's month"
    );
    assert.equal(
      domain[0].getDate(),
      weekStart.getDate(),
      "Domain start day is equal to the weeks monday date"
    );
    assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test(
  "get domain when domain is 1 WEEK, starting a monday",
  function (assert) {
    assert.expect(7);

    const date = new Date(2013, 1, 17, 20, 15); // Monday : February 18th, 2013
    const weekStart = new Date(2013, 1, 11); // Monday : February 18th, 2013

    const cal = createCalendar({ domain: "week", range: 1, start: date });
    const domain = cal.getDomain(date);

    assert.equal(domain.length, 1, "Domain size is 1 week");

    assert.equal(
      domain[0].getFullYear(),
      weekStart.getFullYear(),
      "Domain start year is equal to the weeks monday's year"
    );
    assert.equal(
      domain[0].getMonth(),
      weekStart.getMonth(),
      "Domain start month is equal to weeks monday's month"
    );
    assert.equal(
      domain[0].getDate(),
      weekStart.getDate(),
      "Domain start day is equal to the weeks monday date"
    );
    assert.equal(domain[0].getDay(), 1, "Domain start is a monday");
    assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test(
  "get domain when domain is 1 WEEK, starting a sunday",
  function (assert) {
    assert.expect(7);

    const date = new Date(2013, 1, 13, 20, 15); // Wednesday : February 13th, 2013
    const weekStart = new Date(2013, 1, 10); // Sunday : February 10th, 2013

    const cal = createCalendar({
      domain: "week",
      range: 1,
      start: date,
      weekStartOnMonday: false,
    });
    const domain = cal.getDomain(date);

    assert.equal(domain.length, 1, "Domain size is 1 week");

    assert.equal(
      domain[0].getFullYear(),
      weekStart.getFullYear(),
      "Domain start year is equal to the weeks monday's year"
    );
    assert.equal(
      domain[0].getMonth(),
      weekStart.getMonth(),
      "Domain start month is equal to weeks monday's month"
    );
    assert.equal(
      domain[0].getDate(),
      weekStart.getDate(),
      "Domain start day is equal to the weeks monday date"
    );
    assert.equal(domain[0].getDay(), 0, "Domain start is a sunday");
    assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test(
  "get domain when domain is 1 WEEK, from a timestamp",
  function (assert) {
    assert.expect(6);

    const date = new Date(2013, 1, 20, 20, 15); // Wednesday : February 20th, 2013
    const weekStart = new Date(2013, 1, 18); // Monday : February 18th, 2013

    const cal = createCalendar({ domain: "week", range: 1, start: date });
    const domain = cal.getDomain(date.getTime());

    assert.equal(domain.length, 1, "Domain size is 1 week");

    assert.equal(
      domain[0].getFullYear(),
      weekStart.getFullYear(),
      "Domain start year is equal to the weeks monday's year"
    );
    assert.equal(
      domain[0].getMonth(),
      weekStart.getMonth(),
      "Domain start month is equal to weeks monday's month"
    );
    assert.equal(
      domain[0].getDate(),
      weekStart.getDate(),
      "Domain start day is equal to the weeks monday date"
    );
    assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test("get domain when domain is 1 MONTH", function (assert) {
  assert.expect(6);

  const date = new Date(2003, 10, 25, 23, 26);

  const cal = createCalendar({ domain: "month", range: 1, start: date });
  const domain = cal.getDomain(date);

  assert.equal(domain.length, 1, "Domain size is 1 month");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    1,
    "Domain start day is equal to first day of month"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );
});

QUnit.test(
  "get domain when domain is 1 MONTH, from a timestamp",
  function (assert) {
    assert.expect(6);

    const date = new Date(2003, 10, 25, 23, 26);

    const cal = createCalendar({ domain: "month", range: 1, start: date });
    const domain = cal.getDomain(date.getTime());

    assert.equal(domain.length, 1, "Domain size is 1 month");

    assert.equal(
      domain[0].getFullYear(),
      date.getFullYear(),
      "Domain start year is equal to date year"
    );
    assert.equal(
      domain[0].getMonth(),
      date.getMonth(),
      "Domain start month is equal to date month"
    );
    assert.equal(
      domain[0].getDate(),
      1,
      "Domain start day is equal to first day of month"
    );
    assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      "0",
      "Domain start minutes is equal to 0"
    );
  }
);

QUnit.test("get domain when domain is 1 YEAR", function (assert) {
  assert.expect(6);

  const date = new Date(2004, 10, 20, 23, 26);

  const cal = createCalendar({ domain: "year", range: 1, start: date });
  const domain = cal.getDomain(date);

  assert.equal(domain.length, 1, "Domain size is 1 year");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    0,
    "Domain start month is equal to first month of year"
  );
  assert.equal(
    domain[0].getDate(),
    1,
    "Domain start day is equal to first day of month"
  );
  assert.equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
  assert.equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");
});

QUnit.test(
  "get domain when domain is 1 YEAR. from a timestamp",
  function (assert) {
    assert.expect(6);

    const date = new Date(2004, 10, 20, 23, 26);

    const cal = createCalendar({ domain: "year", range: 1, start: date });
    const domain = cal.getDomain(date.getTime());

    assert.equal(domain.length, 1, "Domain size is 1 year");

    assert.equal(
      domain[0].getFullYear(),
      date.getFullYear(),
      "Domain start year is equal to date year"
    );
    assert.equal(
      domain[0].getMonth(),
      0,
      "Domain start month is equal to first month of year"
    );
    assert.equal(
      domain[0].getDate(),
      1,
      "Domain start day is equal to first day of month"
    );
    assert.equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
    assert.equal(
      domain[0].getMinutes(),
      0,
      "Domain start minutes is equal to 0"
    );
  }
);

/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR GREATER DOMAIN RANGE
	-----------------------------------------------------------------
 */

QUnit.module("Domain greater than 1");

QUnit.test("get domain when domain is > 1 HOUR", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 10, 31, 20, 26);
  const nextHour = new Date(2003, 10, 31, 22);

  const cal = createCalendar({ range: 3, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 3, "Domain size is 3 hours");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(
    domain[0].getHours(),
    date.getHours(),
    "Domain start hour is equal to date hour"
  );
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(domainEnd.getFullYear(), nextHour.getFullYear());
  assert.equal(domainEnd.getMonth(), nextHour.getMonth());
  assert.equal(domainEnd.getDate(), nextHour.getDate());
  assert.equal(domainEnd.getHours(), nextHour.getHours());
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain is > 1 DAY", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 10, 10, 23, 26);
  const nextDay = new Date(2003, 10, 17);

  const cal = createCalendar({ domain: "day", range: 8, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 8, "Domain size is 8 days");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(domainEnd.getFullYear(), nextDay.getFullYear());
  assert.equal(domainEnd.getMonth(), nextDay.getMonth());
  assert.equal(domainEnd.getDate(), nextDay.getDate());
  assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain is > 1 WEEK", function (assert) {
  assert.expect(11);

  const date = new Date(2013, 1, 20, 20, 15); // Wednesday : February 20th, 2013
  const weekEnd = new Date(2013, 2, 4); // Sunday : March 4th, 2013

  const cal = createCalendar({ domain: "week", range: 3, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 3, "Domain size is 3 weeks");

  assert.equal(
    domain[0].getFullYear(),
    2013,
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    1,
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    18,
    "Domain start day is equal to first day of week"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(domainEnd.getFullYear(), weekEnd.getFullYear());
  assert.equal(domainEnd.getMonth(), weekEnd.getMonth());
  assert.equal(domainEnd.getDate(), weekEnd.getDate());
  assert.equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domainEnd.getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );
});

QUnit.test("get domain when domain is > 1 MONTH", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 6, 25, 23, 26);
  const nextMonth = new Date(2003, 7, 1, 0, 0);

  const cal = createCalendar({ domain: "month", range: 2, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 2, "Domain size is 2 months");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    1,
    "Domain start day is equal to first day of month"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(domainEnd.getFullYear(), nextMonth.getFullYear());
  assert.equal(domainEnd.getMonth(), nextMonth.getMonth());
  assert.equal(domainEnd.getDate(), nextMonth.getDate());
  assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain is > 1 YEAR", function (assert) {
  assert.expect(11);

  const date = new Date(2004, 10, 20, 23, 26);
  const nextYear = new Date(2005, 0, 1);

  const cal = createCalendar({ domain: "year", range: 2, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 2, "Domain size is 2 year");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    0,
    "Domain start month is equal to first month of year"
  );
  assert.equal(
    domain[0].getDate(),
    1,
    "Domain start day is equal to first day of month"
  );
  assert.equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
  assert.equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

  assert.equal(domainEnd.getFullYear(), nextYear.getFullYear());
  assert.equal(domainEnd.getMonth(), nextYear.getMonth());
  assert.equal(domainEnd.getDate(), nextYear.getDate());
  assert.equal(
    domainEnd.getHours(),
    nextYear.getHours(),
    "Domain end hour is equal to 0"
  );
  assert.equal(
    domainEnd.getMinutes(),
    nextYear.getMinutes(),
    "Domain end minutes is equal to 0"
  );
});

/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR DOMAIN OVERLAPING NEXT HOUR/DAY/MONTH/YEAR
	-----------------------------------------------------------------
 */

QUnit.module("Overlapping Domain");

QUnit.test("get domain when HOUR domain overlap next day", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 10, 20, 23, 26);
  const next = new Date(2003, 10, 21, 1);

  const cal = createCalendar({ domain: "hour", range: 3, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 3, "Domain size is 3 hours");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(
    domain[0].getHours(),
    date.getHours(),
    "Domain start hour is equal to date hour"
  );
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(
    domainEnd.getFullYear(),
    next.getFullYear(),
    "Domain end year is next year"
  );
  assert.equal(
    domainEnd.getMonth(),
    next.getMonth(),
    "Domain end month is next month"
  );
  assert.equal(
    domainEnd.getDate(),
    next.getDate(),
    "Domain end day is a day of next month"
  );
  assert.equal(
    domainEnd.getHours(),
    next.getHours(),
    "Domain end hour is equal to 0"
  );
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when HOUR domain overlap next month", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 10, 30, 23, 26); // 31 October
  const next = new Date(2003, 11, 1, 1); // 1st November

  const cal = createCalendar({ domain: "hour", range: 3, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 3, "Domain size is 3 hours");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(
    domain[0].getHours(),
    date.getHours(),
    "Domain start hour is equal to date hour"
  );
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(
    domainEnd.getFullYear(),
    next.getFullYear(),
    "Domain end year is next year"
  );
  assert.equal(
    domainEnd.getMonth(),
    next.getMonth(),
    "Domain end month is next month"
  );
  assert.equal(
    domainEnd.getDate(),
    next.getDate(),
    "Domain end day is a day of next month"
  );
  assert.equal(
    domainEnd.getHours(),
    next.getHours(),
    "Domain end hour is equal to 0"
  );
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when DAY domain overlap next month", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 0, 30, 23, 26);
  const nextDay = new Date(2003, 1, 1);

  const cal = createCalendar({ domain: "day", range: 3, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 3, "Domain size is 3 days");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(domainEnd.getFullYear(), nextDay.getFullYear());
  assert.equal(
    domainEnd.getMonth(),
    nextDay.getMonth(),
    "Domain end month is next month"
  );
  assert.equal(domainEnd.getDate(), nextDay.getDate());
  assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when DAY domain overlap next year", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 11, 30, 23, 26);
  const nextDay = new Date(2004, 0, 1);

  const cal = createCalendar({ domain: "day", range: 3, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 3, "Domain size is 3 days");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    date.getDate(),
    "Domain start day is equal to date day"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(
    domainEnd.getFullYear(),
    nextDay.getFullYear(),
    "Domain end year is next year"
  );
  assert.equal(
    domainEnd.getMonth(),
    nextDay.getMonth(),
    "Domain end month is next month"
  );
  assert.equal(domainEnd.getDate(), nextDay.getDate());
  assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain WEEK overlap next month", function (assert) {
  assert.expect(11);

  const date = new Date(2012, 9, 31, 20, 15);
  const weekStart = new Date(2012, 9, 29); // Monday of the first week of the domain
  const weekEnd = new Date(2012, 10, 5); // Monday of the last week of the domain

  const cal = createCalendar({ domain: "week", range: 2, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 2, "Domain size is 2 weeks");

  assert.equal(
    domain[0].getFullYear(),
    weekStart.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    weekStart.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    weekStart.getDate(),
    "Domain start day is equal to first day of week"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(domainEnd.getFullYear(), weekEnd.getFullYear());
  assert.equal(domainEnd.getMonth(), weekEnd.getMonth());
  assert.equal(domainEnd.getDate(), weekEnd.getDate());
  assert.equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domainEnd.getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );
});

QUnit.test("get domain when domain WEEK overlap next year", function (assert) {
  assert.expect(11);

  const date = new Date(2012, 11, 31, 20, 15);
  const weekStart = new Date(2012, 11, 31); // Monday of the first week of the domain
  const weekEnd = new Date(2013, 0, 7); // Monday of the last week of the domain

  const cal = createCalendar({ domain: "week", range: 2, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 2, "Domain size is 2 week");

  assert.equal(
    domain[0].getFullYear(),
    weekStart.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    weekStart.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    weekStart.getDate(),
    "Domain start day is equal to first day of week"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(domainEnd.getFullYear(), weekEnd.getFullYear());
  assert.equal(domainEnd.getMonth(), weekEnd.getMonth());
  assert.equal(domainEnd.getDate(), weekEnd.getDate());
  assert.equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domainEnd.getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );
});

QUnit.test("get domain when MONTH domain overlap next year", function (assert) {
  assert.expect(11);

  const date = new Date(2003, 11, 30, 23, 26);
  const nextDay = new Date(2004, 1, 1);

  const cal = createCalendar({ domain: "month", range: 3, start: date });
  const domain = cal.getDomain(date);
  const domainEnd = domain[domain.length - 1];

  assert.equal(domain.length, 3, "Domain size is 3 months");

  assert.equal(
    domain[0].getFullYear(),
    date.getFullYear(),
    "Domain start year is equal to date year"
  );
  assert.equal(
    domain[0].getMonth(),
    date.getMonth(),
    "Domain start month is equal to date month"
  );
  assert.equal(
    domain[0].getDate(),
    1,
    "Domain start day is first day of start month"
  );
  assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
  assert.equal(
    domain[0].getMinutes(),
    "0",
    "Domain start minutes is equal to 0"
  );

  assert.equal(
    domainEnd.getFullYear(),
    nextDay.getFullYear(),
    "Domain end year is next year"
  );
  assert.equal(
    domainEnd.getMonth(),
    nextDay.getMonth(),
    "Domain end month is after 3 month"
  );
  assert.equal(
    domainEnd.getDate(),
    nextDay.getDate(),
    "Domain end day is first day of month"
  );
  assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
  assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

/*
	-----------------------------------------------------------------
	BASIC SUBDOMAIN TESTS
	-----------------------------------------------------------------
 */

QUnit.module("SubDomain test");

QUnit.test("get subdomain when subdomain is MIN", function (assert) {
  assert.expect(3);

  const date = new Date(2012, 11, 25, 20, 26);

  const cal = createCalendar({ start: date });
  const domain = cal.getSubDomain(date);

  assert.equal(domain.length, 60, "SubDomain size is 60");

  const start = new Date(2012, 11, 25, 20);
  const end = new Date(2012, 11, 25, 20, 59);

  assert.equal(
    +domain[0],
    +start,
    "First element of subdomain is first minute of hour"
  );
  assert.equal(
    +domain[59],
    +end,
    "Last element of subdomain is last minute of hour"
  );
});

QUnit.test("get subdomain when subdomain is HOUR", function (assert) {
  assert.expect(4);

  const date = new Date(2013, 0, 25, 0, 26);

  const cal = createCalendar({
    start: date,
    domain: "day",
    subDomain: "hour",
    range: 1,
  });
  const domain = cal.getDomain(date);
  const subDomain = cal.getSubDomain(date);

  const startDate = new Date(2013, 0, 25, 0);
  const endDate = new Date(2013, 0, 25, 23);

  assert.equal(domain.length, 1, "Domain is equal to one day");
  assert.equal(subDomain.length, 24, "SubDomain size is equal to 24 hours");
  assert.equal(
    subDomain[0].getTime(),
    startDate.getTime(),
    "Subdomain start at first hour of day"
  );
  assert.equal(
    subDomain[23].getTime(),
    endDate.getTime(),
    "SubDomain end at last hour of the day"
  );
});

QUnit.test("get subdomain when subdomain is DAY", function (assert) {
  assert.expect(4);

  const date = new Date(2013, 1, 1, 20, 26);

  const cal = createCalendar({
    start: date,
    domain: "month",
    subDomain: "day",
    range: 1,
  });
  const domain = cal.getDomain(date);
  const subDomain = cal.getSubDomain(date);

  const startDate = new Date(2013, 1, 1);
  const endDate = new Date(2013, 2, 0);

  assert.equal(domain.length, 1, "Domain is equal to one month");
  assert.equal(
    subDomain.length,
    endDate.getDate(),
    "SubDomain size is equal to number of days in the current month"
  );
  assert.equal(
    subDomain[0].getTime(),
    startDate.getTime(),
    "Subdomain start at first day of month"
  );
  assert.equal(
    subDomain[subDomain.length - 1].getTime(),
    endDate.getTime(),
    "SubDomain end at last day of month"
  );
});

QUnit.test("get subdomain when subdomain is MONTH", function (assert) {
  assert.expect(4);

  const date = new Date(2013, 0, 1, 20, 26);

  const cal = createCalendar({
    start: date,
    domain: "year",
    subDomain: "month",
    range: 1,
  });
  const domain = cal.getDomain(date);
  const subDomain = cal.getSubDomain(date);

  const startDate = new Date(2013, 0, 1);
  const endDate = new Date(2013, 11, 1);

  assert.equal(domain.length, 1, "Domain is equal to 1 year");
  assert.equal(subDomain.length, 12, "SubDomain size is equal to 12 months");
  assert.equal(
    subDomain[0].getTime(),
    startDate.getTime(),
    "Subdomain start at first day of year"
  );
  assert.equal(
    subDomain[subDomain.length - 1].getTime(),
    endDate.getTime(),
    "SubDomain end at first day of last month"
  );
});

/*
	-----------------------------------------------------------------
	DOMAIN AND SUBDOMAIN TEST
	-----------------------------------------------------------------
 */

QUnit.module("Domain and subdomain test");

QUnit.test("HOUR -> MIN", function (assert) {
  assert.expect(12);

  const date = new Date(2013, 0, 1, 10, 26);

  const cal = createCalendar({
    start: date,
    domain: "hour",
    subDomain: "min",
    range: 3,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0, 1, 10);
  const endDate = new Date(2013, 0, 1, 12);

  assert.equal(domain.length, 3, "Domain is equal to 3 hours");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();
      assert.equal(
        subDomain.length,
        60,
        "The hour subdomain contains 60 minutes"
      );

      domainStartDate = new Date(domainStartDate);

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate(),
        domainStartDate.getHours(),
        0
      );
      const endDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate(),
        domainStartDate.getHours(),
        59
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The hour subdomain start is the first minute of hour"
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endDate.getTime(),
        "The hour subdomain start is the last minute of hour"
      );
    });
});

QUnit.test("DAY -> HOUR", function (assert) {
  assert.expect(12);

  const date = new Date(2013, 0, 1, 10, 26);

  const cal = createCalendar({
    start: date,
    domain: "day",
    subDomain: "hour",
    range: 3,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0, 1, 0);
  const endDate = new Date(2013, 0, 3, 0);

  assert.equal(domain.length, 3, "Domain is equal to 3 days");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();
      assert.equal(subDomain.length, 24, "The day subdomain contains 24 hours");

      domainStartDate = new Date(domainStartDate);

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate(),
        0
      );
      const endDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate(),
        23
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The hour subdomain start is the first hour of day"
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endDate.getTime(),
        "The hour subdomain start is the last hour of day"
      );
    });
});

QUnit.test("DAY -> MIN", function (assert) {
  assert.expect(12);

  const date = new Date(2013, 0, 1, 10, 26);

  const cal = createCalendar({
    start: date,
    domain: "day",
    subDomain: "min",
    range: 3,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0, 1, 0);
  const endDate = new Date(2013, 0, 3, 0);

  assert.equal(domain.length, 3, "Domain is equal to 3 days");
  assert.equal(
    domain[0].getTime(),
    startDate.getTime(),
    "First domain start is midnight of first day"
  );
  assert.equal(
    domain[domain.length - 1].getTime(),
    endDate.getTime(),
    "Last domain start is midnight of last day"
  );

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();
      assert.equal(
        subDomain.length,
        1440,
        "The day subdomain contains 1440 minutes"
      );

      domainStartDate = new Date(domainStartDate);

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate(),
        0
      );
      const endDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate(),
        23,
        59
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The hour subdomain start is the first minute of day"
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endDate.getTime(),
        "The hour subdomain start is the last minute of day"
      );
    });
});

QUnit.test("WEEK -> DAY", function (assert) {
  assert.expect(18);

  const date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

  const cal = createCalendar({
    start: date,
    domain: "week",
    subDomain: "day",
    range: 3,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2012, 11, 31);
  const endDate = new Date(2013, 0, 14);

  assert.equal(domain.length, 3, "Domain is equal to 3 weeks");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);

      const endWeek = new Date(domainStartDate);
      endWeek.setDate(endWeek.getDate() + 6);

      assert.equal(subDomain.length, 7, "The week contains 7 days");

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate()
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The week subdomain start is the first day of week : " + subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endWeek.getTime(),
        "The week subdomain end is the last day of week : " +
          subDomain[subDomain.length - 1]
      );
      assert.equal(
        new Date(subDomain[0].t).getDay(),
        1,
        "The week start a monday"
      );
      assert.equal(
        new Date(subDomain[subDomain.length - 1].t).getDay(),
        0,
        "The week end a sunday"
      );
    });
});

QUnit.test("WEEK -> HOUR", function (assert) {
  assert.expect(13);

  const date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

  const cal = createCalendar({
    start: date,
    domain: "week",
    subDomain: "hour",
    range: 2,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2012, 11, 31);
  const endDate = new Date(2013, 0, 7);

  assert.equal(domain.length, 2, "Domain is equal to 2 weeks");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);

      const endWeek = new Date(domainStartDate);
      endWeek.setDate(endWeek.getDate() + 6);
      endWeek.setHours(23);

      const hoursNb = 24 * 7;

      assert.equal(
        subDomain.length,
        hoursNb,
        "The week contains " + hoursNb + " hours"
      );

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate()
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The week subdomain start is the first hour of week : " + subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endWeek.getTime(),
        "The week subdomain end is the last hour of week : " +
          subDomain[subDomain.length - 1]
      );
      assert.equal(
        new Date(subDomain[0].t).getDay(),
        1,
        "The week start a monday"
      );
      assert.equal(
        new Date(subDomain[subDomain.length - 1].t).getDay(),
        0,
        "The week end a sunday"
      );
    });
});

QUnit.test("WEEK -> MIN", function (assert) {
  assert.expect(13);

  const date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

  const cal = createCalendar({
    start: date,
    domain: "week",
    subDomain: "min",
    range: 2,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2012, 11, 31);
  const endDate = new Date(2013, 0, 7);

  assert.equal(domain.length, 2, "Domain is equal to 2 weeks");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);

      const endWeek = new Date(domainStartDate);
      endWeek.setDate(endWeek.getDate() + 6);
      endWeek.setHours(23);
      endWeek.setMinutes(59);

      const minNb = 24 * 7 * 60;

      assert.equal(
        subDomain.length,
        minNb,
        "The week contains " + minNb + " minutes"
      );

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate()
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The week subdomain start is the first minutes of week : " +
          subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endWeek.getTime(),
        "The week subdomain end is the last minute of week : " +
          subDomain[subDomain.length - 1]
      );
      assert.equal(
        new Date(subDomain[0].t).getDay(),
        1,
        "The week start a monday"
      );
      assert.equal(
        new Date(subDomain[subDomain.length - 1].t).getDay(),
        0,
        "The week end a sunday"
      );
    });
});

QUnit.test("MONTH -> WEEK", function (assert) {
  assert.expect(9);

  const date = new Date(2013, 0, 1, 15, 26);

  const cal = createCalendar({
    start: date,
    domain: "month",
    subDomain: "week",
    range: 3,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0);
  const endDate = new Date(2013, 2);

  assert.equal(domain.length, 3, "Domain is equal to 3 months");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate()
      );
      if (startDate.getDay() > 1) {
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
      } else if (startDate.getDay() === 0) {
        startDate.seDate(startDate.getDate() - 6);
      }

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 28);

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The month subdomain start is the first day of first week : " +
          subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endDate.getTime(),
        "The month subdomain end is the first day of last week : " +
          subDomain[subDomain.length - 1]
      );
    });
});

QUnit.test("MONTH -> DAY", function (assert) {
  assert.expect(12);

  const date = new Date(2013, 0, 1, 15, 26);

  const cal = createCalendar({
    start: date,
    domain: "month",
    subDomain: "day",
    range: 3,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0);
  const endDate = new Date(2013, 2);

  assert.equal(domain.length, 3, "Domain is equal to 3 months");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);

      const endOfMonth = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth() + 1,
        0
      );

      assert.equal(
        subDomain.length,
        endOfMonth.getDate(),
        "The month contains " + endOfMonth.getDate() + " days"
      );

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate()
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The month subdomain start is the first day of month : " + subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endOfMonth.getTime(),
        "The month subdomain end is the last day of month : " +
          subDomain[subDomain.length - 1]
      );
    });
});

QUnit.test("MONTH -> HOUR", function (assert) {
  assert.expect(9);

  const date = new Date(2013, 0, 1, 15, 26);

  const cal = createCalendar({
    start: date,
    domain: "month",
    subDomain: "hour",
    range: 2,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0);
  const endDate = new Date(2013, 1);

  assert.equal(domain.length, 2, "Domain is equal to 2 months");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);

      const endOfMonth = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth() + 1,
        0,
        23
      );

      const monthsHoursNb = 24 * endOfMonth.getDate();

      assert.equal(
        subDomain.length,
        monthsHoursNb,
        "The month contains " + monthsHoursNb + " hours"
      );

      const startDate = new Date(
        domainStartDate.getFullYear(),
        domainStartDate.getMonth(),
        domainStartDate.getDate()
      );

      assert.equal(
        subDomain[0].t,
        startDate.getTime(),
        "The month subdomain start is the first hour of month : " + subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        endOfMonth.getTime(),
        "The month subdomain end is the last hour of month : " +
          subDomain[subDomain.length - 1]
      );
    });
});

QUnit.test("YEAR -> DAY", function (assert) {
  assert.expect(5);

  const date = new Date(2013, 6, 1, 15, 26);

  const cal = createCalendar({
    start: date,
    domain: "year",
    subDomain: "day",
    range: 1,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0);

  assert.equal(domain.length, 1, "Domain is equal to 1 year");
  assert.equal(domain[0].getTime(), startDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);
      const domainEndDate = new Date(domainStartDate.getFullYear(), 11, 31);

      const yearDaysNb = cal.getDayOfYear(domainEndDate);

      assert.equal(
        subDomain.length,
        yearDaysNb,
        "The year contains " + yearDaysNb + " days"
      );
      assert.equal(
        subDomain[0].t,
        domainStartDate.getTime(),
        "The year subdomain start is the first day of first month of year : " +
          subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        domainEndDate.getTime(),
        "The year subdomain end is the last day of last month of year : " +
          subDomain[subDomain.length - 1]
      );
    });
});

QUnit.test("YEAR -> MONTH", function (assert) {
  assert.expect(9);

  const date = new Date(2013, 6, 1, 15, 26);

  const cal = createCalendar({
    start: date,
    domain: "year",
    subDomain: "month",
    range: 2,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0);
  const endDate = new Date(2014, 0);

  assert.equal(domain.length, 2, "Domain is equal to 2 years");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);
      const domainEndDate = new Date(domainStartDate.getFullYear(), 11);

      assert.equal(subDomain.length, 12, "The year contains 12 months");
      assert.equal(
        subDomain[0].t,
        domainStartDate.getTime(),
        "The year subdomain start is the first month of year : " + subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        domainEndDate.getTime(),
        "The year subdomain end is the last month of year : " +
          subDomain[subDomain.length - 1]
      );
    });
});

QUnit.test("YEAR -> WEEK", function (assert) {
  assert.expect(4);

  const date = new Date(2005, 6, 1, 15, 26);

  const cal = createCalendar({
    start: date,
    domain: "year",
    subDomain: "week",
    range: 1,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(date.getFullYear(), 0);
  const endDate = new Date(date.getFullYear() + 1, 0, 0);

  assert.equal(domain.length, 1, "Domain is equal to 1 year");
  assert.equal(
    domain[0].getTime(),
    startDate.getTime(),
    "Domain start the monday of the first week of the week"
  );

  cal
    .svg()
    .selectAll("svg")
    .each(function (d) {
      const subDomain = d3.select(this).selectAll("rect").data();

      const domainStartDate = new Date(+d);
      const weekNb = cal.getWeekNumber(endDate);

      if (domainStartDate.getDay() > 1) {
        domainStartDate.setDate(domainStartDate.getDay() * -1 + 2);
      } else if (domainStartDate.getDay() === 0) {
        domainStartDate.setDate(-6);
      }

      assert.equal(
        subDomain.length,
        weekNb,
        "The year contains " + weekNb + " weeks"
      );
      assert.equal(
        subDomain[0].t,
        domainStartDate.getTime(),
        "The year subdomain start is the first week of year : " + subDomain[0].t
      );
      // assert.equal(subDomain[subDomain.length-1].getTime(), domainEndDate.getTime(), "The year subdomain end is the last week of year : " + subDomain[subDomain.length-1]);
    });
});

QUnit.test("YEAR -> DAY", function (assert) {
  assert.expect(9);

  const date = new Date(2013, 6, 1, 15, 26);

  const cal = createCalendar({
    start: date,
    domain: "year",
    subDomain: "day",
    range: 2,
    paintOnLoad: true,
  });
  const domain = cal.getDomain(date);

  const startDate = new Date(2013, 0);
  const endDate = new Date(2014, 0);

  assert.equal(domain.length, 2, "Domain is equal to 2 years");
  assert.equal(domain[0].getTime(), startDate.getTime());
  assert.equal(domain[domain.length - 1].getTime(), endDate.getTime());

  cal
    .svg()
    .selectAll("svg")
    .each(function (domainStartDate) {
      const subDomain = d3.select(this).selectAll("rect").data();

      domainStartDate = new Date(domainStartDate);
      const domainEndDate = new Date(domainStartDate.getFullYear(), 12, 0);
      const nbDaysInYear = cal.getDayOfYear(domainEndDate);

      assert.equal(
        subDomain.length,
        nbDaysInYear,
        "The year " +
          domainStartDate.getFullYear() +
          " contains " +
          nbDaysInYear +
          " days"
      );
      assert.equal(
        subDomain[0].t,
        domainStartDate.getTime(),
        "The year " +
          domainStartDate.getFullYear() +
          " subdomain start is the first day of year : " +
          subDomain[0]
      );
      assert.equal(
        subDomain[subDomain.length - 1].t,
        domainEndDate.getTime(),
        "The year " +
          domainStartDate.getFullYear() +
          " subdomain end is the last day of year : " +
          subDomain[subDomain.length - 1]
      );
    });
});

/*
	-----------------------------------------------------------------
	NEXT AND PREVIOUS DOMAIN
	-----------------------------------------------------------------
 */

QUnit.module("Next and previous domain");

QUnit.test("get next domain", function (assert) {
  assert.expect(3);

  const date = new Date(2000, 0, 1);

  const cal = createCalendar({ start: date });
  const domain = cal.getDomain(date.getTime());

  const nextDomain = cal.getNextDomain();

  const domainEnd = date.setHours(date.getHours() + 11);
  const expectedNextDomain = new Date(domainEnd);
  expectedNextDomain.setHours(expectedNextDomain.getHours() + 1);

  assert.equal(domain.length, 12, "Domain contains 12 hours");
  assert.equal(
    domain[domain.length - 1].getTime(),
    domainEnd,
    "Domain end at " + new Date(domainEnd)
  );
  assert.equal(
    nextDomain.getTime(),
    expectedNextDomain.getTime(),
    "Next domain is " + expectedNextDomain
  );
});

QUnit.test("get previous domain", function (assert) {
  assert.expect(3);

  const date = new Date(2000, 0, 1, 2);

  const cal = createCalendar({ start: date });
  const domain = cal.getDomain(date.getTime());

  const previousDomain = cal.getPreviousDomain();

  const domainStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours()
  );
  const expectedPreviousDomain = new Date(domain[0]);
  expectedPreviousDomain.setHours(expectedPreviousDomain.getHours() - 1);

  assert.equal(domain.length, 12, "Domain contains 12 hours");
  assert.equal(
    domain[0].getTime(),
    domainStart.getTime(),
    "Domain start at " + domainStart
  );
  assert.equal(
    previousDomain.getTime(),
    expectedPreviousDomain.getTime(),
    "previous domain is " + expectedPreviousDomain
  );
});

/*
	-----------------------------------------------------------------
	OTHER DATE COMPUTATION
	-----------------------------------------------------------------
 */

QUnit.module("Date computation");

QUnit.test("Get end of month, from a date", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  const date = new Date(2013, 0, 25);
  const endOfMonth = new Date(2013, 1, 0);

  assert.equal(cal.getEndOfMonth(date).getTime(), endOfMonth.getTime());
});

QUnit.test("Get end of month, from a timestamp", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  const date = new Date(2013, 0, 25);
  const endOfMonth = new Date(2013, 1, 0);

  assert.equal(
    cal.getEndOfMonth(date.getTime()).getTime(),
    endOfMonth.getTime()
  );
});

QUnit.test("Get the day of the year", function (assert) {
  assert.expect(4);

  const cal = createCalendar({});

  assert.equal(
    cal.getDayOfYear(new Date(2013, 0)),
    1,
    "Getting the first day of year 2013"
  );
  assert.equal(
    cal.getDayOfYear(new Date(2013, 11, 31)),
    365,
    "Getting the last day of year 2013"
  );
  assert.equal(
    cal.getDayOfYear(new Date(2016, 0)),
    1,
    "Getting the first day of (leap) year 2016"
  );
  assert.equal(
    cal.getDayOfYear(new Date(2016, 11, 31)),
    366,
    "Getting the last day of (leap) year 2016"
  );
});

QUnit.test("Week start on Monday", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ weekStartOnMonday: true });

  assert.equal(
    cal.getWeekDay(new Date(2012, 11, 31)),
    0,
    "Monday is first day of week"
  );
});

QUnit.test("Week start on Sunday", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ weekStartOnMonday: false });
  assert.equal(
    cal.getWeekDay(new Date(2012, 11, 31)),
    1,
    "Monday is second day of week"
  );
});

/*
	-----------------------------------------------------------------
	LEGEND
	-----------------------------------------------------------------
 */

QUnit.module("Legend class");

QUnit.test("Positive legend", function (assert) {
  assert.expect(9);

  const cal = createCalendar({ legend: [100, 200, 300, 400] });

  assert.equal(cal.Legend.getClass(0, false), "r1 r0");
  assert.equal(cal.Legend.getClass(50, false), "r1");
  assert.equal(cal.Legend.getClass(100, false), "r1");
  assert.equal(cal.Legend.getClass(150, false), "r2");
  assert.equal(cal.Legend.getClass(200, false), "r2");
  assert.equal(cal.Legend.getClass(250, false), "r3");
  assert.equal(cal.Legend.getClass(300, false), "r3");
  assert.equal(cal.Legend.getClass(350, false), "r4");
  assert.equal(cal.Legend.getClass(600, false), "r5");
});

QUnit.test("Positive and negative custom legend", function (assert) {
  assert.expect(9);

  const cal = createCalendar({ legend: [-100, 0, 100, 200, 300, 400] });

  assert.equal(cal.Legend.getClass(-200, false), "r1");
  assert.equal(cal.Legend.getClass(-100, false), "r1");
  assert.equal(cal.Legend.getClass(-50, false), "r2");
  assert.equal(cal.Legend.getClass(0, false), "r2 r0");
  assert.equal(cal.Legend.getClass(50, false), "r3");
  assert.equal(cal.Legend.getClass(100, false), "r3");
  assert.equal(cal.Legend.getClass(150, false), "r4");
  assert.equal(cal.Legend.getClass(200, false), "r4");
  assert.equal(cal.Legend.getClass(600, false), "r7");
});

QUnit.test("Float value custom legend", function (assert) {
  assert.expect(9);

  const cal = createCalendar({ legend: [0.1, 0.2, 0.3] });

  assert.equal(cal.Legend.getClass(-100, false), "r1 ri");
  assert.equal(cal.Legend.getClass(0, false), "r1 r0");
  assert.equal(cal.Legend.getClass(0.1, false), "r1");
  assert.equal(cal.Legend.getClass(0.15, false), "r2");
  assert.equal(cal.Legend.getClass(0.2, false), "r2");
  assert.equal(cal.Legend.getClass(0.25, false), "r3");
  assert.equal(cal.Legend.getClass(0.3, false), "r3");
  assert.equal(cal.Legend.getClass(0.35, false), "r4");
  assert.equal(cal.Legend.getClass(0.4, false), "r4");
});

QUnit.test("Empty value", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  assert.equal(
    cal.Legend.getClass(null, false),
    "",
    "Null value return empty string"
  );
});

QUnit.test("Invalid value", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  assert.equal(
    cal.Legend.getClass("foo", false),
    "",
    "NaN return empty string"
  );
});

QUnit.test("Also return the qn styling class", function (assert) {
  assert.expect(10);

  const cal = createCalendar({ legend: [100, 200, 300, 400] });

  assert.equal(cal.Legend.getClass(-100, true), "r1 ri q1 qi");
  assert.equal(cal.Legend.getClass(0, true), "r1 r0 q1 q0");
  assert.equal(cal.Legend.getClass(50, true), "r1 q1");
  assert.equal(cal.Legend.getClass(100, true), "r1 q1");
  assert.equal(cal.Legend.getClass(150, true), "r2 q2");
  assert.equal(cal.Legend.getClass(200, true), "r2 q2");
  assert.equal(cal.Legend.getClass(250, true), "r3 q3");
  assert.equal(cal.Legend.getClass(300, true), "r3 q3");
  assert.equal(cal.Legend.getClass(350, true), "r4 q4");
  assert.equal(cal.Legend.getClass(600, true), "r5 q5");
});

/*
	=================================================================
	LIMIT COLUMN AND ROWS COUNT
	---------------------------
	Test that rowLimit and colLimit setting are properly applied
	=================================================================

	All domains are tested on January 1st 2000, 00:00:00

	* Year 2000: 52 weeks
 */

// Whether to split each domain>subDomain test into their own module
const SPLIT_TEST = false;

function _test(domain, subDomain, config_h, config_v, skipped) {
  if (arguments.length < 5) {
    skipped = false;
  }

  if (SPLIT_TEST) {
    QUnit.module(
      "Test painting " + domain + " > " + subDomain + " columns/rows"
    );
  }

  for (var i = 0, total = config_h.length; i < total; i++) {
    testConfig(
      domain,
      subDomain,
      config_h[i][0],
      config_h[i][1],
      config_h[i][2],
      config_h[i][3],
      skipped
    );
    testConfig(
      domain,
      "x_" + subDomain,
      config_h[i][0],
      config_h[i][1],
      config_h[i][3],
      config_h[i][2],
      skipped
    );
  }

  // Cutting along the reading direction
  for (i = 0, total = config_v.length; i < total; i++) {
    testConfig(
      domain,
      subDomain,
      config_v[i][0],
      config_v[i][1],
      config_v[i][2],
      config_v[i][3],
      skipped
    );
    testConfig(
      domain,
      "x_" + subDomain,
      config_v[i][0],
      config_v[i][1],
      config_v[i][3],
      config_v[i][2],
      skipped
    );
  }
}

/**
 * Trigger the test for the columns and rows limit
 */
function testConfig(
  domain,
  subDomain,
  col,
  row,
  expectedCol,
  expectedRow,
  skipped
) {
  testColumnsAndRows(
    domain,
    subDomain,
    col,
    row,
    expectedCol,
    expectedRow,
    skipped
  );
}

/**
 * The test itself
 */
function testColumnsAndRows(
  domain,
  subDomain,
  col,
  row,
  expectedCol,
  expectedRow,
  skipped
) {
  testTitle = "Default splitting";

  if (col > 0) {
    testTitle = "Split into [" + col + "] columns";
  } else if (row > 0) {
    testTitle = "Split into [" + row + "] rows";
  }

  if (subDomain[0] === "x") {
    testTitle += " [vertical layout]";
  }

  testTitle =
    domain.toUpperCase() + " » " + subDomain.toUpperCase() + " : " + testTitle;

  if (skipped) {
    testSkip(testTitle, _t);
  } else {
    QUnit.test(testTitle, _t);
  }

  function _t(assert) {
    assert.expect(2);

    const cal = createCalendar({
      domain,
      subDomain,
      colLimit: col,
      rowLimit: row,
      start: new Date(2000, 0, 1),
      cellPadding: 0,
      paintOnLoad: true,
      range: 1,
    });

    const rect = $("#cal-heatmap").find(".graph-rect");

    const _count = {
      column: new Map(),
      row: new Map(),
    };

    rect.each(function () {
      _count.column.set($(this).attr("x"), 0);
      _count.row.set($(this).attr("y"), 0);
    });

    assert.equal(
      _count.column.size,
      expectedCol,
      "The domain was split into " + expectedCol + " columns"
    );
    assert.equal(
      _count.row.size,
      expectedRow,
      "The domain was split into " + expectedRow + " rows"
    );
  }
}

QUnit.module("Painting column and row count");
/*
	Each domain/subDomain couple will be tested with different configutations:
	- Default
	- Split into even number of columns
	- Split into uneven number of columns
	- Split into even number of rows
	- Split into uneven number of rows

	And the same set, but with the vertical layout (x_ prefixed subDomains)
 */

/*
	=================================================================
	HOUR > MIN
	=================================================================
 */

_test(
  "hour",
  "min",
  [
    [0, 0, 6, 10],
    [2, 0, 2, 30],
    [50, 0, 30, 2],
    [7, 0, 7, 9],
    [21, 0, 20, 3],
    [75, 0, 60, 1],
  ],
  [
    [0, 2, 30, 2],
    [0, 50, 2, 50],
    [0, 7, 9, 7],
    [0, 21, 3, 21],
    [0, 75, 1, 60],
  ]
);

/*
	=================================================================
	DAY > HOUR
	=================================================================
 */

_test(
  "day",
  "hour",
  [
    [0, 0, 4, 6],
    [2, 0, 2, 12],
    [10, 0, 8, 3],
    [5, 0, 5, 5],
    [29, 0, 24, 1],
  ],
  [
    [0, 2, 12, 2],
    [0, 10, 3, 10],
    [0, 5, 5, 5],
    [0, 29, 1, 24],
  ]
);

/*
	=================================================================
	WEEK > HOUR
	=================================================================
 */

// 1 week = 168 hours

_test(
  "week",
  "hour",
  [
    [0, 0, 28, 6],
    [12, 0, 12, 14],
    [100, 0, 84, 2],
    [27, 0, 24, 7],
    [41, 0, 34, 5],
    [170, 0, 168, 1],
  ],
  [
    [0, 12, 14, 12],
    [0, 100, 2, 100],
    [0, 27, 7, 27],
    [0, 41, 5, 41],
    [0, 170, 1, 168],
  ]
);

/*
	=================================================================
	WEEK > DAY
	=================================================================
 */

_test(
  "week",
  "day",
  [
    [0, 0, 1, 7],
    [2, 0, 2, 4],
    [6, 0, 4, 2],
    [3, 0, 3, 3],
    [5, 0, 4, 2],
    [10, 0, 7, 1],
  ],
  [
    [0, 2, 4, 2],
    [0, 6, 2, 6],
    [0, 3, 3, 3],
    [0, 5, 2, 5],
    [0, 10, 1, 7],
  ]
);

/*
	=================================================================
	MONTH > HOUR
	=================================================================
 */

// Tested month contains : 31 * 24 = 744 hours

_test(
  "month",
  "hour",
  [
    [0, 0, 124, 6],
    [2, 0, 2, 372],
    [100, 0, 93, 8],
    [7, 0, 7, 107],
    [551, 0, 372, 2],
    [800, 0, 744, 1],
  ],
  [
    [0, 2, 372, 2],
    [0, 100, 8, 100],
    [0, 7, 107, 7],
    [0, 551, 2, 551],
    [0, 800, 1, 744],
  ]
);

/*
	=================================================================
	MONTH > DAY
	=================================================================
 */

// Tested month contains 31 days

_test(
  "month",
  "day",
  [
    [0, 0, 6, 7],
    [2, 0, 2, 16],
    [10, 0, 8, 4],
    [7, 0, 7, 5],
    [19, 0, 16, 2],
    [40, 0, 31, 1],
  ],
  [
    [0, 2, 16, 2],
    [0, 10, 4, 10],
    [0, 7, 5, 7],
    [0, 19, 2, 19],
    [0, 40, 1, 31],
  ]
);

/*
	=================================================================
	MONTH > WEEK
	=================================================================
 */

// January 2000 contains 5 weeks

_test(
  "month",
  "week",
  [
    [0, 0, 5, 1],
    [2, 0, 2, 3],
    [3, 0, 3, 2],
    [8, 0, 5, 1],
  ],
  [
    [0, 2, 3, 2],
    [0, 3, 2, 3],
    [0, 8, 1, 8],
  ],
  true
);

/*
	=================================================================
	YEAR > DAY
	=================================================================
 */

_test(
  "year",
  "day",
  [
    [0, 0, 53, 7],
    [2, 0, 2, 183],
    [50, 0, 46, 8],
    [3, 0, 3, 122],
    [60, 0, 53, 7],
    [400, 0, 366, 1],
  ],
  [
    [0, 2, 183, 2],
    [0, 50, 8, 50],
    [0, 3, 122, 3],
    [0, 60, 7, 60],
    [0, 400, 1, 366],
  ]
);

/*
	=================================================================
	YEAR > WEEK
	=================================================================
 */

_test(
  "year",
  "week",
  [
    [0, 0, 52, 1],
    [2, 0, 2, 26],
    [30, 0, 26, 2],
    [3, 0, 3, 18],
    [49, 0, 2, 26],
  ],
  [
    [0, 2, 26, 2],
    [0, 30, 2, 30],
    [0, 3, 18, 3],
    [0, 49, 1, 49],
  ],
  true
);

/*
	=================================================================
	YEAR > MONTH
	=================================================================
 */

_test(
  "year",
  "month",
  [
    [0, 0, 12, 1],
    [2, 0, 2, 6],
    [10, 0, 6, 2],
    [5, 0, 4, 3],
    [11, 0, 6, 2],
    [15, 0, 12, 1],
  ],
  [
    [0, 2, 6, 2],
    [0, 10, 2, 10],
    [0, 5, 3, 5],
    [0, 11, 2, 11],
    [0, 15, 1, 12],
  ]
);

/*
	-----------------------------------------------------------------
	PAINTING
	-----------------------------------------------------------------
 */

QUnit.module("Painting");

QUnit.test("Display empty calendar", function (assert) {
  assert.expect(4);

  createCalendar({ paintOnLoad: true });

  assert.equal($("#cal-heatmap .graph").length, 1, "Calendar was created");
  assert.equal(
    $("#cal-heatmap .graph .graph-subdomain-group").length,
    12,
    "The graph contains 12 hours"
  );
  assert.equal(
    $("#cal-heatmap .graph .graph-subdomain-group rect").length,
    60 * 12,
    "The graph contains 720 minutes"
  );
  assert.equal(
    $("#cal-heatmap .graph-legend").length,
    1,
    "A legend is created"
  );
});

QUnit.test("Don't display legend", function (assert) {
  assert.expect(1);

  createCalendar({ displayLegend: false, paintOnLoad: true });

  assert.equal(
    $("#cal-heatmap .graph-legend").length,
    0,
    "The legend is not created"
  );
});

QUnit.test("Display domain according to range number", function (assert) {
  assert.expect(1);

  createCalendar({ range: 5, paintOnLoad: true });

  assert.equal(
    $("#cal-heatmap .graph .graph-subdomain-group").length,
    5,
    "The graph contains only 5 hours"
  );
});

QUnit.test("Append graph to the passed DOM ID", function (assert) {
  assert.expect(2);

  $("body").append("<div id=test-container style='display:hidden;'></div>");

  createCalendar({ itemSelector: "#test-container", paintOnLoad: true });

  assert.equal(
    $("#test-container .graph").length,
    1,
    "The graph is added to the specified ID"
  );
  assert.equal($("#cal-heatmap .graph").length, 0, "Default ID is empty");

  $("#test-container").remove();
});

QUnit.test(
  "Attach events to next and previous selector on default namespace",
  function (assert) {
    assert.expect(2);

    $("body").append("<a id='next'></a>");
    $("body").append("<a id='previous'></a>");

    const cal = createCalendar({
      paintOnLoad: true,
      nextSelector: "#next",
      previousSelector: "#previous",
    });

    assert.equal(
      typeof d3.select("#next").on("click." + cal.options.itemNamespace),
      "function",
      "loadNextDomain is attached to nextSelector"
    );
    assert.equal(
      typeof d3.select("#previous").on("click." + cal.options.itemNamespace),
      "function",
      "loadPreviousDomain is attached to previousSelector"
    );
  }
);

QUnit.test(
  "Attach events to next and previous selector on custom namespace",
  function (assert) {
    assert.expect(4);

    $("body").append("<a id='next'></a>");
    $("body").append("<a id='previous'></a>");

    const cal = createCalendar({
      paintOnLoad: true,
      nextSelector: "#next",
      previousSelector: "#previous",
    });

    createCalendar({
      paintOnLoad: true,
      nextSelector: "#next",
      previousSelector: "#previous",
      itemNamespace: "ns2",
    });

    assert.equal(
      typeof d3.select("#next").on("click." + cal.options.itemNamespace),
      "function",
      "loadNextDomain is attached to nextSelector on default namespace"
    );
    assert.equal(
      typeof d3.select("#previous").on("click." + cal.options.itemNamespace),
      "function",
      "loadPreviousDomain is attached to previousSelector on default namespace"
    );
    assert.equal(
      typeof d3.select("#next").on("click.ns2"),
      "function",
      "loadNextDomain is attached to nextSelector on custom namespace"
    );
    assert.equal(
      typeof d3.select("#previous").on("click.ns2"),
      "function",
      "loadPreviousDomain is attached to previousSelector on custom namespace"
    );
  }
);

QUnit.test(
  "Attach events to not-valid namespace fallback to default namespace",
  function (assert) {
    assert.expect(2);

    $("body").append("<a id='next'></a>");
    $("body").append("<a id='previous'></a>");

    createCalendar({
      paintOnLoad: true,
      nextSelector: "#next",
      previousSelector: "#previous",
    });

    assert.equal(
      typeof d3.select("#next").on("click.cal-heatmap"),
      "function",
      "loadNextDomain is attached to defaultNamespace"
    );
    assert.equal(
      typeof d3.select("#previous").on("click.cal-heatmap"),
      "function",
      "loadPreviousDomain is attached to defaultNamespace"
    );

    $("body").remove("#next");
    $("body").remove("#previous");
  }
);

QUnit.test(
  "Custom date formatting with d3.js internal formatter",
  function (assert) {
    assert.expect(1);

    const date = new Date(2000, 0, 5);

    createCalendar({
      start: date,
      loadOnInit: true,
      paintOnLoad: true,
      subDomainDateFormat: "==%B==",
    });

    assert.equal(
      $("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data,
      "==January=="
    );
  }
);

QUnit.test("Custom date formatting with custom function", function (assert) {
  assert.expect(1);

  const date = new Date(2000, 0, 5);

  createCalendar({
    start: date,
    loadOnInit: true,
    paintOnLoad: true,
    subDomainDateFormat: function (date) {
      return date.getTime();
    },
  });

  assert.equal(
    $("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data,
    date.getTime()
  );
});
/*
QUnit.test("Cell label have different title formatting depending on whether it's filled or not", function(assert) {

	assert.expect(2);

	var date = new Date(2000, 0, 1);
	var datas = {};
	datas[date.getTime()/1000] = 15;

	var title = {
		empty: "this is an empty cell",
		filled: "this is a filled cell"
	};

	var cal = createCalendar({data: datas, start: date, loadOnInit: true, paintOnLoad: true,
		domain: "year",
		subDomain: "month",
		range: 1,
		subDomainTitleFormat: title
	});

	assert.equal(d3.selectAll("#cal-heatmap title")[0].textContent, title.filled);
	assert.equal($("#cal-heatmap title")[1].textContent, title.empty);
}); */

QUnit.test("Cell radius is applied", function (assert) {
  assert.expect(2);

  const radius = 15;

  createCalendar({
    paintOnLoad: true,
    domain: "day",
    subDomain: "hour",
    cellRadius: radius,
  });

  assert.equal(
    $("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(
      null,
      "rx"
    ),
    radius,
    "Horizontal cellRadius applied"
  );
  assert.equal(
    $("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(
      null,
      "ry"
    ),
    radius,
    "Vertical cellRadius applied"
  );
});
