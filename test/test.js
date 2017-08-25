/*! cal-heatmap v3.6.2 (Mon Oct 10 2016 01:36:20)
 *  ---------------------------------------------
 *  Cal-Heatmap is a javascript module to create calendar heatmap to visualize time series data
 *  https://github.com/wa0x6e/cal-heatmap
 *  Licensed under the MIT license
 *  Copyright 2014 Wan Qi Chen
 */

CalHeatMap.prototype.svg = function() {
	return this.root.selectAll(".graph-domain");
};

QUnit.testStart(function( details ) {
	$("body").append("<div id='cal-heatmap' style='display:none;'></div>");
});

QUnit.testDone(function( details ) {
	$("#cal-heatmap").remove();
});

function createCalendar(settings) {

	var cal = new CalHeatMap();
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
QUnit.testSkip = function() {
	QUnit.test(arguments[0] + ' (SKIPPED)', function() {
		var li = document.getElementById(QUnit.config.current.id);
		QUnit.done(function() {
			if (li !== null) {
				li.style.background = '#FFFF99';
			}
		});
		ok(true);
	});
};
testSkip = QUnit.testSkip;

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : destroy()");

asyncTest("Destroying the calendar", function() {
	expect(3);

	var node = d3.select("body").append("div").attr("id", "test-destroy");
	var cal = createCalendar({itemSelector: node[0][0], animationDuration: 0, paintOnLoad: true});

	ok(cal !== null, "the instance is created");

	cal = cal.destroy(function() {
		ok("callback called");
		start();
	});

	ok(cal === null, "the instance is deleted");
});

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : highlight()");

asyncTest("Highlighting one date", function() {
	expect(4);

	var highlightedDate = new Date(2000, 0, 1);
	var cal = createCalendar({ animationDuration: 0, paintOnLoad: true, start: new Date(2000, 0), domain: "month" });
	ok(cal.highlight(highlightedDate));
	strictEqual(d3.selectAll("#cal-heatmap .highlight")[0].length, 0);

	setTimeout(function() {
		strictEqual(d3.selectAll("#cal-heatmap .highlight")[0].length, 1);
		strictEqual(d3.selectAll("#cal-heatmap .highlight")[0][0].__data__.t, +highlightedDate);

		start();
	}, 50);

});

asyncTest("Highlighting multiple dates", function() {
	expect(7);

	$("body").append("<div id=\"hglt2\"></div>");

	var highlightedDate = [new Date(2000, 0, 1), new Date(2000, 0, 2), new Date(2001, 0, 1)];
	var cal = createCalendar({ itemSelector: "#hglt2", highlight: [new Date(2000, 0, 3)], animationDuration: 0, paintOnLoad: true, start: new Date(2000, 0), domain: "month", range: 1 });
	ok(cal.highlight(highlightedDate));
	strictEqual(d3.selectAll("#hglt2 .highlight")[0].length, 1, "There is already one highlighted date, defined in init()");

	setTimeout(function() {
		var highlightedCells = d3.selectAll("#hglt2 .highlight")[0];
		strictEqual(highlightedCells.length, 2, "There is 2 highlighted dates");
		strictEqual(highlightedCells[0].__data__.t, +highlightedDate[0]);
		strictEqual(highlightedCells[1].__data__.t, +highlightedDate[1]);

		var d = d3.selectAll("#hglt2 .m_1 .graph-rect")[0][2];
		strictEqual(d.getAttribute("class").trim(), "graph-rect", "The initial highlighted date is not highlighted anymore");
		strictEqual(d.__data__.t, new Date(2000, 0, 3).getTime());

		start();

		$("#hglt2").remove();
	}, 50);

});


function _testInvalidHighlight(input) {
	test("Testing invalid values", function() {
		expect(1);

		var cal = createCalendar({});
		strictEqual(cal.highlight(input), false);
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

module("API: init(legendMargin)");

function __testAutoSetLegendMarginSetting(title, ver, hor, autoMarginIndex) {
	test("Automatically add margin to " + title, function() {
		expect(1);

		var margin = [0, 0, 0, 0];
		var cal = createCalendar({ legendVerticalPosition: ver, legendHorizontalPosition: hor });
		margin[autoMarginIndex] = cal.DEFAULT_LEGEND_MARGIN;

		deepEqual(cal.options.legendMargin, margin, "domainMargin is set to [" + margin.join(", ") + "]");
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

module("API: init(colLimit)");

function __testcolLimitSetting(title, value, expected) {
	test("Set colLimit from " + title, function() {
		expect(1);

		var cal = createCalendar({ colLimit: value });
		deepEqual(cal.options.colLimit, expected, "colLimit is set to " + expected);
	});
}

__testcolLimitSetting("null will disable colLimit", null, null);
__testcolLimitSetting("false will disable colLimit", false, null);
__testcolLimitSetting("an invalid value (string) will disable colLimit", false, null);
__testcolLimitSetting("a valid empty integer will disable colLimit", 0, null);
__testcolLimitSetting("a valid non-empty integer will set colLimit", 2, 2);


module("API: init(rowLimit)");

function __testRowLimitSetting(title, value, expected) {
	test("Set rowLimit from " + title, function() {
		expect(1);

		var cal = createCalendar({ rowLimit: value });
		deepEqual(cal.options.rowLimit, expected, "rowLimit is set to " + expected);
	});
}

__testRowLimitSetting("null will disable rowLimit", null, null);
__testRowLimitSetting("false will disable rowLimit", false, null);
__testRowLimitSetting("an invalid value (string) will disable rowLimit", false, null);
__testRowLimitSetting("a valid empty integer will disable rowLimit", 0, null);
__testRowLimitSetting("a valid non-integer will set rowLimit", 2, 2);

test("RowLimit is disabled when colLimit is set", function() {
	expect(1);

	var cal = createCalendar({ colLimit: 5, rowLimit: 5 });
	deepEqual(cal.options.rowLimit, null, "rowLimit is disabled");
});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test dataType options passed to init()
	-----------------------------------------------------------------
 */

module("API: init(dataType)");

test("Allow only valid data type", function() {
	var types = ["json", "txt", "csv", "tsv"];
	expect(types.length);
	var cal = new CalHeatMap();

	for(var i = 0, total = types.length; i < total; i++) {
		ok(cal.init({range:1, dataType: types[i], loadOnInit: false, paintOnLoad: false}), types[i] + " is a valid domain");
	}
});

function _testInvalidDataType(name, input) {
	test("Invalid dataType (" + name + ") throws an Error", function() {
		expect(1);
		var cal = new CalHeatMap();
		throws(function() { cal.init({dataType: input}); });
	});
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

module("API: init(domain)");

(function() {
	function _testValidDomain(d) {
		test("Testing that " + d + " is a valid domain", function() {
			expect(1);

			var cal = createCalendar({domain: d});
			strictEqual(cal.options.domain, d);
		});
	}

	var domains = ["hour", "day", "week", "month", "year"];
	for(var i = 0, total = domains.length; i < total; i++) {
		_testValidDomain(domains[i]);
	}
}());

function _testInvalidDomain(name, input) {
	test("Invalid domain (" + name + ") throws an Error", function() {
		expect(1);

		throws(function() { createCalendar({domain: input}); });
	});
}

_testInvalidDomain("empty string", "");
_testInvalidDomain("null", null);
_testInvalidDomain("false", false);
_testInvalidDomain("not-valid domain type", "random-value");
_testInvalidDomain("min", "min"); // Min is a valid subDomain but not domain

test("Set default domain and subDomain", function() {
	expect(2);

	var cal = createCalendar({});

	strictEqual(cal.options.domain, "hour", "Default domain is HOUR");
	strictEqual(cal.options.subDomain, "min", "Default subDomain is MIN");
});


module("API: init(subDomain)");

(function() {
	function _testValidSubDomain(d) {
		test("Testing that " + d + " is a valid subDomains", function() {
			expect(1);

			var cal = createCalendar({subDomains: d});
			strictEqual(cal.options.subDomains, d);
		});
	}

	var subDomains = ["min", "x_min", "hour", "x_hour", "day", "x_day", "week", "x_week", "month", "x_month"];
	for(var i = 0, total = subDomains.length; i < total; i++) {
		_testValidSubDomain(subDomains[i]);
	}
}());

function _testInvalidSubDomain(name, input) {
	test("Invalid subDomain (" + name + ") throws an Error", function() {
		expect(1);

		throws(function() { createCalendar({subDomain: input}); });
	});
}

_testInvalidSubDomain("empty string", "");
_testInvalidSubDomain("null", null);
_testInvalidSubDomain("false", false);
_testInvalidSubDomain("not-valid subDomain type", "random-value");
_testInvalidSubDomain("year", "year"); // Year is a valid domain but not subDomain

function _testSubDomainSmallerThanDomain(domain, subDomain) {
	test(subDomain + " is a valid subDomain for " + domain, function() {
		expect(2);

		var cal = createCalendar({domain: domain, subDomain: subDomain});
		strictEqual(cal.options.domain, domain);
		strictEqual(cal.options.subDomain, subDomain);
	});
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
	test(subDomain + " is not a valid subDomain for " + domain, function() {
		expect(1);

		throws(function() { createCalendar({domain: domain, subDomain: subDomain}); });
	});
}

_testInvalidSubDomainForDomain("hour", "day");
_testInvalidSubDomainForDomain("day", "week");
_testInvalidSubDomainForDomain("week", "month");
_testInvalidSubDomainForDomain("month", "year");

function _testDefaultSubDomain(domain, subDomain) {
	test(subDomain + " is the default subDomain for " + domain, function() {
		expect(2);

		var cal = createCalendar({domain: domain});
		strictEqual(cal.options.domain, domain);
		strictEqual(cal.options.subDomain, subDomain);
	});
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

module("API: init(domainLabelFormat)");

test("Passing an empty string", function() {
	expect(1);

	var cal = createCalendar({ domainLabelFormat: "" });
	strictEqual(cal.options.domainLabelFormat, "");
});

test("Passing a non-empty string", function() {
	expect(1);

	var cal = createCalendar({ domainLabelFormat: "R" });
	strictEqual(cal.options.domainLabelFormat, "R");
});

test("Passing a function", function() {
	expect(1);

	var cal = createCalendar({ domainLabelFormat: function() {} });
	ok(typeof cal.options.domainLabelFormat === "function");
});

function _testdomainLabelFormatWithInvalidInput(title, input) {
	test("Passing a not-valid input (" + title + ")", function() {
		expect(1);

		var cal = createCalendar({ domainLabelFormat: input });
		strictEqual(cal.options.domainLabelFormat, cal._domainType.hour.format.legend, "Invalid input should fallback to the domain default legend format");
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

module("API: init(domainMargin)");

function __testDomainMarginExpand(title, margin, expectedMargin) {
	test("Test expanding " + title, function() {
		expect(1);

		var cal = createCalendar({ domainMargin: margin });
		deepEqual(cal.options.domainMargin, expectedMargin, (Array.isArray(margin) ? "["+margin.join(", ")+"]" : margin) + " is expanded to [" + expectedMargin.join(", ") + "]");
	});
}

__testDomainMarginExpand("an empty integer", 0, [0,0,0,0]);
__testDomainMarginExpand("a non-null integer", 10, [10,10,10,10]);
__testDomainMarginExpand("a one-value (zero) array", [0], [0,0,0,0]);
__testDomainMarginExpand("a one-value (five) array", [5], [5,5,5,5]);
__testDomainMarginExpand("a two-value array", [5, 10], [5,10,5,10]);
__testDomainMarginExpand("a three-value array", [5, 10, 15], [5,10,15,10]);
__testDomainMarginExpand("a four-value array", [5, 10, 15, 20], [5,10,15,20]);
__testDomainMarginExpand("a six-value array", [5, 10, 15, 20, 30, 40], [5,10,15,20]);
__testDomainMarginExpand("an invalid (string) value fallback to 0", "string", [0,0,0,0]);
__testDomainMarginExpand("an invalid (empty string) value fallback to 0", "", [0,0,0,0]);



module("API: init(legendMargin)");

function __testDomainLegendExpand(title, margin, expectedMargin) {
	test("Test expanding " + title, function() {
		expect(1);

		var cal = createCalendar({ legendMargin: margin });
		deepEqual(cal.options.legendMargin, expectedMargin, (Array.isArray(margin) ? "["+margin.join(", ")+"]" : margin) + " is expanded to [" + expectedMargin.join(", ") + "]");
	});
}

__testDomainLegendExpand("an empty integer", 0, [0,0,0,0]);
__testDomainLegendExpand("a non-null integer", 10, [10,10,10,10]);
__testDomainLegendExpand("a one-value (zero) array", [0], [0,0,0,0]);
__testDomainLegendExpand("a one-value (five) array", [5], [5,5,5,5]);
__testDomainLegendExpand("a two-value array", [5, 10], [5,10,5,10]);
__testDomainLegendExpand("a three-value array", [5, 10, 15], [5,10,15,10]);
__testDomainLegendExpand("a four-value array", [5, 10, 15, 20], [5,10,15,20]);
__testDomainLegendExpand("a six-value array", [5, 10, 15, 20, 30, 40], [5,10,15,20]);
__testDomainLegendExpand("an invalid (string) value fallback to 0", "string", [0,0,0,0]);
__testDomainLegendExpand("an invalid (empty string) value fallback to 0", "", [0,0,0,0]);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test highlight setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(highlight)");

function __testHighlightSetting(title, highlight, expected) {
	test("Test expanding " + title, function() {
		expect(1);

		var cal = createCalendar({ highlight: highlight });
		deepEqual(cal.options.highlight, expected, (Array.isArray(highlight) ? "["+highlight.join(", ")+"]" : highlight) + " is expanded to [" + expected.join(", ") + "]");
	});
}

__testHighlightSetting("a null string", "", []);
__testHighlightSetting("a non-valid string", "date", []);
__testHighlightSetting("an empty array", [], []);
__testHighlightSetting("a non-empty array, with no valid data", ["date", 0], []);
__testHighlightSetting("a non-empty array, with one date object", [new Date(2000, 0)], [new Date(2000, 0)]);
__testHighlightSetting("a non-empty array, with multiple date objects", [new Date(2000, 0), new Date(2001, 0)], [new Date(2000, 0), new Date(2001, 0)]);
__testHighlightSetting("null", null, []);
__testHighlightSetting("a boolean", false, []);

test("Test expanding NOW string", function() {
	expect(3);

	var cal = createCalendar({ highlight: "now" });
	ok(Array.isArray(cal.options.highlight));
	equal(cal.options.highlight.length, 1);
	ok(cal.options.highlight[0] instanceof Date);
});

test("Test expanding NOW string inside an array of valid dates", function() {
	expect(4);

	var cal = createCalendar({ highlight: ["now", new Date()] });
	ok(Array.isArray(cal.options.highlight));
	equal(cal.options.highlight.length, 2);
	ok(cal.options.highlight[0] instanceof Date);
	ok(cal.options.highlight[1] instanceof Date);
});

test("Test expanding NOW string inside an array of invalid dates", function() {
	expect(3);

	var cal = createCalendar({ highlight: ["now", "tomorrow"] });
	ok(Array.isArray(cal.options.highlight));
	equal(cal.options.highlight.length, 1);
	ok(cal.options.highlight[0] instanceof Date);
});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemName setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(itemName)");

function __testItemNameSetting(title, value, expected) {
	test("Set itemName from " + title, function() {
		expect(1);

		var cal = createCalendar({ itemName: value });
		deepEqual(cal.options.itemName, expected, "itemName is set to " + expected);
	});
}

__testItemNameSetting("null will fallback to default itemName", null, ["item", "items"]);
__testItemNameSetting("false will fallback to default itemName", false, ["item", "items"]);
__testItemNameSetting("an invalid value (number) will fallback to default itemName", 0, ["item", "items"]);
__testItemNameSetting("an empty string will set an empty string for the singular and plural form", "", ["", ""]);
__testItemNameSetting("a string will guess the plural form", "cat", ["cat", "cats"]);
__testItemNameSetting("a 1-value array will guess the plural form", ["cat"], ["cat", "cats"]);
__testItemNameSetting("a 2-value array will do nothing", ["child", "children"], ["child", "children"]);
__testItemNameSetting("a 3-value array will only keeps the first 2 values", ["child", "children", "bomb"], ["child", "children"]);

/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemNamespace setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(itemNamespace)");

function __testItemNamespaceSetting(title, value, expected) {
	test(title, function() {
		expect(1);

		var cal = createCalendar({ itemNamespace: value });
		equal(cal.options.itemNamespace, expected, "itemNamespace is set to " + expected);
	});
}

__testItemNamespaceSetting("null will fallback to default namespace", null, "cal-heatmap");
__testItemNamespaceSetting("false will fallback to default namespace", false, "cal-heatmap");
__testItemNamespaceSetting("empty string will fallback to default namespace", "", "cal-heatmap");
__testItemNamespaceSetting("invalid value (array) will fallback to default namespace", [], "cal-heatmap");
__testItemNamespaceSetting("invalid value (object) will fallback to default namespace", {}, "cal-heatmap");
__testItemNamespaceSetting("invalid value (number) will fallback to default namespace", 126, "cal-heatmap");
__testItemNamespaceSetting("Setting a valid namespace from a string", "test-namespace", "test-namespace");

/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemSelector options passed to init()
	-----------------------------------------------------------------
 */

module("API: init(itemSelector)");

test("itemSelector accept a valid document.querySelector or CSS3 string value", function() {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	expect(10);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: "#a", paintOnLoad: false}), true, "#a is a valid itemSelector");
	equal($("#a .cal-heatmap-container").length, 1, "Calendar is appended to #a");

	equal(cal.init({itemSelector: "#a + #b", paintOnLoad: false}), true, "#a + #b is a valid itemSelector");
	equal($("#b .cal-heatmap-container").length, 1, "Calendar is appended to #a + #b");

	equal(cal.init({itemSelector: "div[data=y]", paintOnLoad: false}), true, "div[data=y] is a valid itemSelector");
	equal($("div[data=y] .cal-heatmap-container").length, 1, "Calendar is appended to div[data=y]");

	equal(cal.init({itemSelector: ".u", paintOnLoad: false}), true, ".u is a valid itemSelector");
	equal($(".u .cal-heatmap-container").length, 1, "Calendar is appended to .u");

	equal(cal.init({itemSelector: "#test > div:last-child", paintOnLoad: false}), true, "#test > div:last-child is a valid itemSelector");
	equal($("#last .cal-heatmap-container").length, 1, "Calendar is appended to #test > div:last-child");

	$("#test").remove();
});

test("itemSelector accept a valid Element object", function() {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	expect(10);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: document.querySelector("#a"), paintOnLoad: false}), true, "document.querySelector(\"#a\") is a valid itemSelector");
	equal($("#a .graph").length, 1, "Graph is appended to #a");

	equal(cal.init({itemSelector: $("#b")[0], paintOnLoad: false}), true, "$(\"#b\")[0] is a valid itemSelector");
	equal($("#b .graph").length, 1, "Graph is appended to #b");

	equal(cal.init({itemSelector: document.getElementById("last"), paintOnLoad: false}), true, "document.getElementById(\"last\") is a valid itemSelector");
	equal($("#last .graph").length, 1, "Graph is appended to #last");

	equal(cal.init({itemSelector: document.getElementsByClassName("u")[0], paintOnLoad: false}), true, "document.getElementsByClassName(\".u\") is a valid itemSelector");
	equal($(".u .graph").length, 1, "Graph is appended to .u");

	equal(cal.init({itemSelector: d3.select("[data=y]")[0][0], paintOnLoad: false}), true, "d3.select(\"[data=y]\")[0][0] is a valid itemSelector");
	equal($("div[data=y] .graph").length, 1, "Graph is appended to div[data=y]");

	$("#test").remove();
});

function _testInvalidItemSelector(name, input) {
	test("Invalid itemSelector (" + name + ") throws an Error", function() {
		expect(1);

		throws(function() { createCalendar({itemSelector: input}); });
	});
}

_testInvalidItemSelector("empty string", "");
_testInvalidItemSelector("array", []);
_testInvalidItemSelector("number", 15);
_testInvalidItemSelector("function", function() {});

test("itemSelector target does not exist", function() {
	expect(1);

	throws(function() { createCalendar({itemSelector: "#test"}); }, "Non-existent itemSelector raises an Error");
});

/*
	-----------------------------------------------------------------
	SETTINGS
	Test subDomainDateFormat setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(subDomainDateFormat)");

test("Passing an empty string", function() {
	expect(1);

	var cal = createCalendar({ subDomainDateFormat: "" });
	strictEqual(cal.options.subDomainDateFormat, "");
});

test("Passing a non-empty string", function() {
	expect(1);

	var cal = createCalendar({ subDomainDateFormat: "R" });
	strictEqual(cal.options.subDomainDateFormat, "R");
});

test("Passing a function", function() {
	expect(1);

	var cal = createCalendar({ subDomainDateFormat: function() {} });
	ok(typeof cal.options.subDomainDateFormat === "function");
});

function _testsubDomainDateFormatWithInvalidInput(title, input) {
	test("Passing a not-valid input (" + title + ")", function() {
		expect(1);

		var cal = createCalendar({ subDomainDateFormat: input });
		strictEqual(cal.options.subDomainDateFormat, cal._domainType.min.format.date, "Invalid input should fallback to the subDomain default date format");
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

module("API: init(subDomainTextFormat)");

test("Passing a non-empty string", function() {
	expect(1);

	var cal = createCalendar({ subDomainTextFormat: "R" });
	strictEqual(cal.options.subDomainTextFormat, "R");
});

test("Passing a function", function() {
	expect(1);

	var cal = createCalendar({ subDomainTextFormat: function() {} });
	ok(typeof cal.options.subDomainTextFormat === "function");
});

function _testsubDomainTextFormatWithInvalidInput(title, input) {
	test("Passing a not-valid input (" + title + ")", function() {
		expect(1);

		var cal = createCalendar({ subDomainTextFormat: input });
		strictEqual(cal.options.subDomainTextFormat, null, "Invalid input should fallback to null");
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

test("Auto align domain label horizontally", function() {
	expect(4);

	var cal = new CalHeatMap();

	cal.init({label: {position: "top"}, paintOnLoad: false});
	equal(cal.options.label.align, "center", "Auto center label when positioned on top");

	cal.init({label: {position: "bottom"}, paintOnLoad: false});
	equal(cal.options.label.align, "center", "Auto center label when positioned on bottom");

	cal.init({label: {position: "left"}, paintOnLoad: false});
	equal(cal.options.label.align, "right", "Auto align label on the right when positioned on the left");

	cal.init({label: {position: "right"}, paintOnLoad: false});
	equal(cal.options.label.align, "left", "Auto align label on the right when positioned on the right");
});

test("Auto align domain label horizontally when rotated", function() {
	expect(2);

	var cal = new CalHeatMap();

	cal.init({label: {rotate: "left"}, paintOnLoad: false});
	equal(cal.options.label.align, "right", "Auto align on the right when rotated to the left");

	cal.init({label: {rotate: "right"}, paintOnLoad: false});
	equal(cal.options.label.align, "left", "Auto align on the left when rotated to the right");

});



/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : jumpTo()");

function _testJumpTo(date, reset, expectedReturn, expectedStartDate, title) {
	if (arguments.length < 5) {
		title = "";
	}
	test("Jumping to " + date.toDateString() + " " + (reset ? "with" : "without") + " reset " + title, function() {
		expect(2);

		var cal = createCalendar({
			domain: "month",
			start: new Date(2000, 2), // March
			range: 4,
			minDate: new Date(1999, 11), // December
			maxDate: new Date(2000, 11) // December
		});

		equal(cal.jumpTo(date, reset), expectedReturn, "jumpTo() should return " + expectedReturn);
		equal(cal.getDomainKeys()[0], +expectedStartDate, "Calendar should start on " + expectedStartDate.toDateString());
	});
}

// Without reset --------------------

_testJumpTo(
	new Date(2000, 0),
	false,
	true,
	new Date(2000, 0)
);

_testJumpTo(
	new Date(2000, 0, 16, 23),
	false,
	true,
	new Date(2000, 0)
);

_testJumpTo(
	new Date(2000, 6),
	false,
	true,
	new Date(2000, 3)
);

_testJumpTo(
	new Date(2000, 6, 12, 8),
	false,
	true,
	new Date(2000, 3)
);

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

_testJumpTo(
	new Date(2000, 0),
	true,
	true,
	new Date(2000, 0)
);

_testJumpTo(
	new Date(2000, 0, 6, 16),
	true,
	true,
	new Date(2000, 0)
);

_testJumpTo(
	new Date(2000, 6, 18),
	true,
	true,
	new Date(2000, 6)
);

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

_testJumpTo(
	new Date(2000, 2, 15),
	true,
	false,
	new Date(2000, 2)
);

_testJumpTo(
	new Date(2000, 3, 26),
	true,
	true,
	new Date(2000, 3)
);

_testJumpTo(
	new Date(2000, 4, 5),
	true,
	true,
	new Date(2000, 4)
);

_testJumpTo(
	new Date(2000, 5, 30),
	true,
	true,
	new Date(2000, 5)
);

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : next()");

function _testNext(title, count, expectedReturn, expectedStartDate, startDate, maxDate) {

	if (arguments.length < 5) {
		startDate = new Date(2000, 0);
	}

	if (arguments.length < 6) {
		maxDate = new Date(2000, 11);
	}

	test(title, function() {
		expect(2);

		var cal = createCalendar( {
			domain: "month",
			start: startDate,
			range: 4,
			loadOnInit: true,
			paintOnLoad: true,
			maxDate: maxDate
		});

		equal((count === null ? cal.next() : cal.next(count)), expectedReturn, "next() should return " + expectedReturn);
		equal(cal.getDomainKeys()[0], +expectedStartDate, "Calendar should start on " + expectedStartDate.toDateString());
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

_testNext(
	"Shifting does not go beyond maxDate",
	11,
	true,
	new Date(2000, 8)
);

_testNext(
	"Shifting does not go beyond maxDate",
	25,
	true,
	new Date(2000, 8)
);

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

test("Calling next when minDate is reached remove the minDomainReached state", function() {
	expect(2);

	var cal = createCalendar( {
		domain: "month",
		start: new Date(2000, 0),
		range: 4,
		loadOnInit: true,
		paintOnLoad: true,
		minDate: new Date(2000, 0)
	});

	equal(true, cal._minDomainReached, "Min domain is reached on calendar init");
	cal.next();
	equal(false, cal._minDomainReached, "Min domain is not reached after next()");
});

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : previous()");

function _testPrevious(title, count, expectedReturn, expectedStartDate, startDate, minDate) {

	if (arguments.length < 5) {
		startDate = new Date(2000, 0);
	}

	if (arguments.length < 6) {
		minDate = new Date(1999, 2);
	}

	test(title, function() {
		expect(2);

		var cal = createCalendar( {
			domain: "month",
			start: startDate,
			range: 4,
			loadOnInit: true,
			paintOnLoad: true,
			minDate: minDate,
			maxDate: new Date(2000, 3)
		});

		equal((count === null ? cal.previous() : cal.previous(count)), expectedReturn, "previous() should return " + expectedReturn);
		equal(cal.getDomainKeys()[0], +expectedStartDate, "Calendar should start on " + expectedStartDate.toDateString());
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

test("Calling previous when maxDate is reached remove the maxDomainReached state", function() {
	expect(2);

	var cal = createCalendar( {
		domain: "month",
		start: new Date(2000, 0),
		range: 4,
		loadOnInit: true,
		paintOnLoad: true,
		maxDate: new Date(2000, 3)
	});

	equal(true, cal._maxDomainReached, "Max domain is reached on calendar init");
	cal.previous();
	equal(false, cal._maxDomainReached, "Max domain is not reached after previous()");
});


/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : removeLegend()");

test("Removing not existing legend", function() {

	expect(1);

	var cal = createCalendar({displayLegend: false});

	equal(cal.removeLegend(), false, "removeLegend() return false when legend does not exist");
});

test("Removing existing legend", function() {

	expect(5);

	var cal = createCalendar({displayLegend: true, paintOnLoad: true});

	equal(cal.options.displayLegend, true, "displayLegend setting is set to true");
	notEqual(cal.root.select(".graph-legend")[0][0], null, "Legend exists int DOM");

	equal(cal.removeLegend(), true, "removeLegend() return true when legend does exist");
	equal(cal.options.displayLegend, false, "displayLegend setting is now set to false");
	equal(cal.root.select(".graph-legend")[0][0], null, "Legend is now removed from the DOM");
});

/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : showLegend()");

test("Show already existing legend", function() {

	expect(1);

	var cal = createCalendar({displayLegend: true});

	equal(cal.showLegend(), false, "showLegend() return false when legend already exists");
});

test("Show not existing legend", function() {

	expect(5);

	var cal = createCalendar({displayLegend: false});

	equal(cal.options.displayLegend, false, "displayLegend setting is set to false");
	equal(cal.root.select(".graph-legend")[0][0], null, "There is no legend in the DOM");

	equal(cal.showLegend(), true, "showLegend() return true when legend does not exist yet");
	equal(cal.options.displayLegend, true, "displayLegend setting is now set to true");
	notEqual(cal.root.select(".graph-legend")[0][0], null, "Legend is now added into the DOM");
});


/*
	-----------------------------------------------------------------
	DATA
	-----------------------------------------------------------------
 */

module("Unit Test: getDatas()", {
	setup: function() {
		path = (window.parent.document.title === "Karma" ? "base/test/" : "") + "data/";
	},
	teardown: function() {
		path = null;
	}
});

test("Invalid data (undefined) is ignore and treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({data: undefined});

	deepEqual(cal.options.data, undefined);
	ok(cal.getDatas(
		undefined,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "undefined is equivalent to an empty object"); }
	));
});

test("Invalid data (null) is ignore and treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({data: null});

	deepEqual(cal.options.data, null);
	ok(cal.getDatas(
		null,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "null is equivalent to an empty object"); }
	));
});

test("Invalid data (number) is ignore and treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({data: 8});

	deepEqual(cal.options.data, 8);
	ok(cal.getDatas(
		8,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "number is equivalent to an empty object"); }
	));
});

test("Object is left untouched", function() {
	expect(4);

	var d = [0, 1];
	var cal = createCalendar({data: d});

	deepEqual(cal.options.data, d);
	equal(cal.getDatas(
		d,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, d); }
	), false);
});

test("Empty string is treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({});

	equal(cal.options.data, "");
	ok(cal.getDatas(
		"",
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "empty string is equivalent to an empty object"); }
	));
});

test("Passing directly an object", function() {
	expect(4);

	var dt = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	deepEqual(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, dt, "The passed object is used directly"); }
	), false);
});

asyncTest("Passing a non-empty string is interpreted as an URL, and parsed using JSON", function() {
	expect(3);

	var dt = path + "data.json";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() {},
		function(data) {
			start();
			deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

asyncTest("Parsing a CSV file", function() {
	expect(5);

	var dt = path + "data.csv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "csv"});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) {
			start();
			deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the CSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

asyncTest("Parsing a TSV file", function() {
	expect(5);

	var dt = path + "data.tsv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "tsv"});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) {
			start();
			deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the TSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

asyncTest("Parsing a TXT file", function() {
	expect(4);

	var dt = path + "data.txt";
	var fileContent = "{\n" +
		"\t\"946721039\":1,\n" +
		"\t\"946706853\":1,\n" +
		"\t\"946706340\":1\n" +
	"}";
	var cal = createCalendar({data: dt, dataType: "txt"});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) {
			start();
			equal(data, fileContent, "The file is read as a plain text file");
		}
	), false);
});


module("Date computation : dateLessThan()");


var min = 60 * 1000; // one min millis  
var hour = 60 * min; // one hour millis 
var day = 24 * hour; // one hour millis
var month = 30 * day; // one (average month);


test("date is less than now in the domain hour, subdomain min", function() {
    expect(6);

    var cal = createCalendar({});

    var now =  new Date(2013, 12, 9, 12, 30, 30, 0); // 12:30:30, 2013-12-9


    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - min), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5  * 1000), now)); // still within the min
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5  * 1000), now)); // still within the min
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + min), now));
});

test("date is less than now in the domain day, subdomain hour", function() {
    expect(6);

    var cal = createCalendar({domain: "day", subDomain: "hour"});

    var now =  new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - hour), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * 60 * 1000), now)); // still within the hour
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * 60 * 1000), now)); // still within the hour
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + hour), now));
});

test("date is less than now in the domain month, subdomain day", function() {
    expect(6);

    var cal = createCalendar({domain: "month", subDomain: "day"});

    var now =  new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - day), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * hour), now)); // still within the day
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * hour), now)); // still within the day
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + day), now));
});


test("date is less than now in the domain month, subdomain day", function() {
    expect(6);

    var cal = createCalendar({domain: "year", subDomain: "month"});

    var now =  new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - month), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * day), now)); // still within the month
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * day), now)); // still within the month
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + month), now));
});

/*
	-----------------------------------------------------------------
	DATE
	-----------------------------------------------------------------
 */

module("Date computation : isNow()");

test("Now is equal to now", function() {
	expect(1);

	var cal = createCalendar({});

	ok(cal.isNow(new Date()));
});

test("Passed date is not equal to now", function() {
	expect(1);

	var cal = createCalendar({});

	equal(cal.isNow(new Date(2000, 0)), false);
});

/*
	-----------------------------------------------------------------
	DATE
	-----------------------------------------------------------------
 */

module("Date computation : jump()");

function _testJump(date, expectedDate, count, step) {
	test("Jumping " + count + " " + step + "s " + (count > 0 ? "forward" : "backward"), function() {
		expect(1);

		var cal = createCalendar({});

		deepEqual(cal.jumpDate(date, count, step), expectedDate, date + " " + (count < 0 ? "-" : "+") + " " + Math.abs(count) + " " + step +  " should outpout " + expectedDate);
	});
}

// HOUR ----------------------------------

// Jump one hour forward
_testJump(
	new Date(2000, 0, 1, 0, 0),
	new Date(2000, 0, 1, 1, 0),
	1, "hour"
);

// Jump 5 hours forward with date change
_testJump(
	new Date(2000, 0, 1, 23, 0),
	new Date(2000, 0, 2, 4, 0),
	5, "hour"
);

// Jump 5 hours forward with month change
_testJump(
	new Date(2000, 0, 31, 23, 0),
	new Date(2000, 1, 1, 4, 0),
	5, "hour"
);

// Jump 30 hours forward with year change
_testJump(
	new Date(2000, 11, 31, 23, 0),
	new Date(2001, 0, 2, 5, 0),
	30, "hour"
);

// Jump one hour backward
_testJump(
	new Date(2000, 0, 1, 1, 0),
	new Date(2000, 0, 1, 0, 0),
	-1, "hour"
);

// Jump 5 hours backward with date change
_testJump(
	new Date(2000, 0, 2, 4, 0),
	new Date(2000, 0, 1, 23, 0),
	-5, "hour"
);

// Jump 5 hours backward with month change
_testJump(
	new Date(2000, 1, 1, 4, 0),
	new Date(2000, 0, 31, 23, 0),
	-5, "hour"
);

// Jump 30 hours backward with year change
_testJump(
	new Date(2001, 0, 2, 5, 0),
	new Date(2000, 11, 31, 23, 0),
	-30, "hour"
);

// DAY ----------------------------------

// Jump one day forward
_testJump(
	new Date(2000, 0, 1, 15, 0),
	new Date(2000, 0, 2, 15, 0),
	1, "day"
);

// Jump 5 days forward with date change
_testJump(
	new Date(2000, 0, 1, 23, 35),
	new Date(2000, 0, 6, 23, 35),
	5, "day"
);

// Jump 5 days forward with month change
_testJump(
	new Date(2000, 0, 31, 23, 0),
	new Date(2000, 1, 5, 23, 0),
	5, "day"
);

// Jump 30 days forward with year change
_testJump(
	new Date(2000, 11, 31, 23, 0),
	new Date(2001, 0, 30, 23, 0),
	30, "day"
);

// Jump one day backward
_testJump(
	new Date(2000, 0, 2, 15, 0),
	new Date(2000, 0, 1, 15, 0),
	-1, "day"
);

// Jump 5 days backward with date change
_testJump(
	new Date(2000, 0, 6, 23, 35),
	new Date(2000, 0, 1, 23, 35),
	-5, "day"
);

// Jump 5 days backward with month change
_testJump(
	new Date(2000, 1, 5, 23, 0),
	new Date(2000, 0, 31, 23, 0),
	-5, "day"
);

// Jump 30 days backward with year change
_testJump(
	new Date(2001, 0, 30, 23, 0),
	new Date(2000, 11, 31, 23, 0),
	-30, "day"
);

// DST to Standard Time ----------------------------------
// Date jumping should be DST independent, and works normally
// without any artifact
_testJump(
	new Date(2013, 10, 4, 0),
	new Date(2013, 10, 4, 1),
	1, "hour"
);

_testJump(
	new Date(2013, 10, 4, 0),
	new Date(2013, 10, 4, 2),
	2, "hour"
);

_testJump(
	new Date(2013, 10, 4, 0),
	new Date(2013, 10, 4, 3),
	3, "hour"
);

_testJump(
	new Date(2013, 10, 4, 1),
	new Date(2013, 10, 4, 2),
	1, "hour"
);

_testJump(
	new Date(2013, 10, 4, 1),
	new Date(2013, 10, 4, 3),
	2, "hour"
);

_testJump(
	new Date(2013, 10, 4, 3),
	new Date(2013, 10, 4, 2),
	-1, "hour"
);

_testJump(
	new Date(2013, 10, 4, 3),
	new Date(2013, 10, 4, 1),
	-2, "hour"
);

_testJump(
	new Date(2013, 10, 4, 3),
	new Date(2013, 10, 4, 0),
	-3, "hour"
);

_testJump(
	new Date(2013, 10, 4, 1),
	new Date(2013, 10, 4, 0),
	-1, "hour"
);

(function() {

	var startDate = new Date(2013, 10, 3, 0);

	// Skip the test if your DST change is not following the North American standard
	if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
		return true;
	}

	// Standard Time to DST ----------------------------------
	_testJump(
		new Date(2013, 2, 10, 0),
		new Date(2013, 2, 10, 1),
		1, "hour"
	);

	_testJump(
		new Date(2013, 2, 10, 0),
		new Date(2013, 2, 10, 2),
		2, "hour"
	);

	_testJump(
		new Date(2013, 2, 10, 0),
		new Date(2013, 2, 10, 3),
		3, "hour"
	);

	_testJump(
		new Date(2013, 2, 10, 1),
		new Date(2013, 2, 10, 2),
		1, "hour"
	);

	_testJump(
		new Date(2013, 2, 10, 1),
		new Date(2013, 2, 10, 0),
		-1, "hour"
	);

	_testJump(
		new Date(2013, 2, 10, 2), // 2am => inexisting hour, considered 1am
		new Date(2013, 2, 9, 23),
		-2, "hour"
	);

	_testJump(
		new Date(2013, 2, 10, 3),
		new Date(2013, 2, 10, 0),
		-3, "hour"
	);

	_testJump(
		new Date(2013, 2, 10, 2), // 2am => inexisting hour, considered 1am
		new Date(2013, 2, 10, 0),
		-1, "hour"
	);
})();

/*
	-----------------------------------------------------------------
	DST: Daylight Saving Time
	-----------------------------------------------------------------
 */

module("DST: DST to Standard Time");

(function() {

	var startDate = new Date(2013, 10, 3, 0);

	// Skip the test if your DST change is not following the North American standard
	if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
		return true;
	}

	test("HOUR DOMAIN: the duplicate hour is compressed into a single hour", function() {
		expect(5);

		var cal = createCalendar({start: startDate, range: 4, paintOnLoad: true});
		var labels = cal.root.selectAll(".graph-label");

		strictEqual(labels[0].length, 4, "There is 4 graph labels");
		equal(labels[0][0].firstChild.data, "00:00");
		equal(labels[0][1].firstChild.data, "01:00");
		equal(labels[0][2].firstChild.data, "02:00");
		equal(labels[0][3].firstChild.data, "03:00");
	});

	test("DAY DOMAIN: the duplicate hour is compressed into a single hour", function() {
		expect(4);

		var cal = createCalendar({start: startDate, range: 1, paintOnLoad: true, domain: "day"});
		var cells = cal.root.selectAll(".graph-rect");

		strictEqual(cells[0].length, 24, "There is 24 subDomains cells");

		equal(cells[0][0].__data__.t, startDate.getTime(), "The first cell is midnight");
		equal(cells[0][1].__data__.t, startDate.getTime() + 3600 * 1000 * 2, "The second cell is for the two 1am");
		equal(cells[0][2].__data__.t, startDate.getTime() + 3600 * 1000 * 3, "The third cell is for 2am");
	});
})();


module("DST: Standard Time to DST");

(function() {

	var startDate = new Date(2013, 2, 10, 0);

	// Skip the test if your DST change is not following the North American standard
	if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
		return true;
	}

	test("HOUR DOMAIN: the missing hour is skipped", function() {
		expect(5);

		var cal = createCalendar({start: startDate, range: 4, paintOnLoad: true});
		var labels = cal.root.selectAll(".graph-label");

		strictEqual(labels[0].length, 4, "There is 4 graph labels");
		equal(labels[0][0].firstChild.data, "00:00");
		equal(labels[0][1].firstChild.data, "01:00");
		equal(labels[0][2].firstChild.data, "03:00", "3am is following 2am, there is no 2 am");
		equal(labels[0][3].firstChild.data, "04:00");
	});

	test("DAY DOMAIN: the missing hour is skipped", function() {
		expect(4);

		var cal = createCalendar({start: startDate, range: 1, paintOnLoad: true, domain: "day"});
		var cells = cal.root.selectAll(".graph-rect");

		strictEqual(cells[0].length, 23, "There is 23 subDomains cells");

		equal(cells[0][0].__data__.t, startDate.getTime(), "The first cell is midnight");
		equal(cells[0][1].__data__.t, startDate.getTime() + 3600 * 1000, "The second cell is for 1am");
		equal(cells[0][2].__data__.t, startDate.getTime() + 3600 * 1000 * 2, "The third cell is for 3am, there is no 2am");
	});
})();

/*
	-----------------------------------------------------------------
	Unit Test
	Test getHighlightClassName()
	-----------------------------------------------------------------
 */

module("Unit Test: getHighlightClassName()");

test("Return the highlight classname if a date should be highlighted", function() {
	expect(1);

	var cal = createCalendar({highlight: [new Date(2000, 0, 1), new Date(2000, 0, 2)]});
	strictEqual(cal.getHighlightClassName(new Date(2000, 0, 1)), " highlight");
});

test("Return the highlight and now classname if a date should be highlighted and is now", function() {
	expect(1);

	var cal = createCalendar({highlight: [new Date(2000, 0, 1), new Date()]});
	strictEqual(cal.getHighlightClassName(new Date()), " highlight-now");
});

test("Return an empty string if a date is not in the highlight list", function() {
	expect(1);

	var cal = createCalendar({highlight: [new Date(2000, 0, 1)]});
	strictEqual(cal.getHighlightClassName(new Date(2000, 0, 2)), "");
});

test("Return an empty string if the highlight list is empty", function() {
	expect(1);

	var cal = createCalendar({});
	strictEqual(cal.getHighlightClassName(new Date()), "");
});

/*
	-----------------------------------------------------------------
	Callback
	-----------------------------------------------------------------
 */

module( "Callback" );

test("OnClick", function() {

	expect(2);

	var testFunction = function(date, itemNb) { return {d:date, i:itemNb}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);

	var response = cal.onClick(date, 58);

	equal(response.i, 58);
	equal(response.d.getTime(), date.getTime());

});

test("afterLoad", function() {

	expect(1);

	$("#cal-heatmap").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("#cal-heatmap").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: testFunction, paintOnLoad: true});

	equal($("#cal-heatmap").data("test"), finalString);
});

test("onComplete", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: true});

	equal($("body").data("test"), finalString);
});

test("onComplete is ran even on loadOnInit = false", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: false});

	equal($("body").data("test"), finalString);
});

test("onComplete does not run with paintOnLoad = false", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: false});

	equal($("body").data("test"), "Dummy Data");
});

test("afterLoadPreviousDomain", function() {

	expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var previousDomainStart = new Date(2012, 0, 1, 20);
	var previousDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadPreviousDomain(date);

	equal(response.start.getTime(), previousDomainStart.getTime(), "Callback return first subdomain of the date");
	equal(response.end.getTime(), previousDomainEnd.getTime(), "Callback return last subdomain of the date");
});

test("afterLoadNextDomain", function() {

	expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var nextDomainStart = new Date(2012, 0, 1, 20);
	var nextDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadNextDomain(date);

	equal(response.start.getTime(), nextDomainStart.getTime(), "Callback return first subdomain of the date");
	equal(response.end.getTime(), nextDomainEnd.getTime(), "Callback return last subdomain of the date");
});

test("onClick is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: {}});
	equal(cal.onClick(), false);
});

test("onClick is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: "string"});
	equal(cal.onClick(), false);
});

test("afterLoad is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: {}});
	equal(cal.afterLoad(), false);
});

test("afterLoad is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: "null"});
	equal(cal.afterLoad(), false);
});

test("afterLoadNextDomain is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: "null"});
	equal(cal.afterLoadNextDomain(), false);
});

test("afterLoadPreviousDomain is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: "null"});
	equal(cal.afterLoadPreviousDomain(null), false);
});

test("onComplete is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: {}, loadOnInit: true});
	equal(cal.onComplete(), false);
});

test("onComplete is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: "null", loadOnInit: true});
	equal(cal.onComplete(), false);
});

test("afterLoadData is not a valid callback", function() {
	expect(1);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = [];
	datas.push({date: date1, value: 15});	// 15 events for 00:00
	datas.push({date: date2, value: 25});	// 25 events for 01:00
	datas.push({date: date3, value: 1});	// 01 events for 01:01

	var parser = "";
	var cal = createCalendar({data: datas, start: new Date(2000, 0, 1, 1), afterLoadData: parser, domain: "hour", subDomain: "min"});

	equal(true, $.isEmptyObject(cal.parseDatas(datas)), "parseDatas return an empty object");
});

/*
	-----------------------------------------------------------------
	DATA SOURCE PARSING
	-----------------------------------------------------------------
 */

module( "Interpreting Data source template" );

test("Data Source is a regex string, replace by timestamp", function() {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{t:start}}&end={{t:end}}";
	var domains = cal._domains.keys();

	var parsedUri = "get?start=" + (domains[0]/1000) + "&end=" + (domains[domains.length-1]/1000);

	equal(cal.parseURI(uri, new Date(+domains[0]), new Date(+domains[domains.length-1])), parsedUri, "Start and end token was replaced by a timestamp : " + parsedUri);
});

test("Data Source is a regex string, replace by ISO-8601 Date", function() {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{d:start}}&end={{d:end}}";
	var domains = cal._domains.keys();

	var startDate = new Date(+domains[0]);
	var endDate = new Date(+domains[domains.length-1]);

	var parsedUri = "get?start=" + startDate.toISOString() + "&end=" + endDate.toISOString();

	equal(cal.parseURI(uri, new Date(+domains[0]), new Date(+domains[domains.length-1])), parsedUri, "Start and end token was replaced by a string : " + parsedUri);
});

/*
	-----------------------------------------------------------------
	DATA PARSING
	-----------------------------------------------------------------
 */
/*
module( "Data processing" );

test("Grouping datas by hour>min", function() {
	expect(6);

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

	equal(Object.keys(calDatas).length, 2, "Only datas for 2 hours");
	equal(Object.keys(calDatas[date1*1000]).length, 1, "First hour contains 1 event");
	equal(Object.keys(calDatas[date2*1000]).length, 2, "Second hour contains 2 events");
	equal(calDatas[date1*1000]["0"], 15);
	equal(calDatas[date2*1000]["0"], 25);
	equal(calDatas[date2*1000]["1"], 1);
});

test("Grouping datas by day>hour", function() {
	expect(2);

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

	equal(Object.keys(calDatas).length, 1, "Only datas for 1 day");
	equal(Object.keys(calDatas[date1*1000]).length, 2, "Day contains datas for 2 hours");

});

test("Filter out datas not relevant to calendar domain", function() {
	expect(4);

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

	equal(Object.keys(calDatas).length, 1, "Only datas for 1 hour");
	equal(calDatas.hasOwnProperty(date1*1000), false, "Datas for the first hour are filtered out");
	equal(calDatas.hasOwnProperty(date2*1000), true, "Only datas for the second hours remains");
	equal(Object.keys(calDatas[date2*1000]).length, 2, "Hours contains datas for 2 minutes");

});*/

/*
	-----------------------------------------------------------------
	BASIC DOMAIN TESTS
	-----------------------------------------------------------------
 */

module( "Domain equal 1" );

test("get domain when domain is 1 HOUR", function() {

	expect(6);

	var date     = new Date(2003, 10, 31, 20, 26);

	var cal = createCalendar({range: 1, start: date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 hour");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

test("get domain when domain is 1 HOUR, from a timestamp", function() {

	expect(6);

	var date     = new Date(2003, 10, 31, 20, 26);


	var cal = createCalendar({range: 1, start: date});
	var domain = cal.getDomain(date.getTime());


	equal(domain.length, 1, "Domain size is 1 hour");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

test("get domain when domain is 1 DAY", function() {

	expect(6);

	var date    = new Date(2003, 10, 20, 23, 26);

	var cal = createCalendar({domain: "day", range:1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 day");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

test("get domain when domain is 1 DAY, from a timestamp", function() {

	expect(6);

	var date    = new Date(2003, 10, 20, 23, 26);

	var cal = createCalendar({domain: "day", range:1, start : date});
	var domain = cal.getDomain(date.getTime());

	equal(domain.length, 1, "Domain size is 1 day");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});


test("get domain when domain is 1 WEEK, from a date in the middle of the week", function() {

	expect(6);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, from a date right on beginning of the week", function() {

	expect(6);

	var date      = new Date(2013, 1, 18, 20, 15);	// Monday : February 18th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, starting a monday", function() {

	expect(7);

	var date      = new Date(2013, 1, 17, 20, 15);	// Monday : February 18th, 2013
	var weekStart = new Date(2013, 1, 11);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getDay(), 1, "Domain start is a monday");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, starting a sunday", function() {

	expect(7);

	var date      = new Date(2013, 1, 13, 20, 15);	// Wednesday : February 13th, 2013
	var weekStart = new Date(2013, 1, 10);			// Sunday : February 10th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date, weekStartOnMonday: false});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getDay(), 0, "Domain start is a sunday");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, from a timestamp", function() {

	expect(6);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 MONTH", function() {

	expect(6);

	var date      = new Date(2003, 10, 25, 23, 26);

	var cal = createCalendar({domain: "month", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 month");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 MONTH, from a timestamp", function() {

	expect(6);

	var date      = new Date(2003, 10, 25, 23, 26);

	var cal = createCalendar({domain: "month", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());

	equal(domain.length, 1, "Domain size is 1 month");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 YEAR", function() {

	expect(6);

	var date     = new Date(2004, 10, 20, 23, 26);

	var cal = createCalendar({domain: "year", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 year");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 YEAR. from a timestamp", function() {

	expect(6);

	var date     = new Date(2004, 10, 20, 23, 26);

	var cal = createCalendar({domain: "year", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());

	equal(domain.length, 1, "Domain size is 1 year");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

});




/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR GREATER DOMAIN RANGE
	-----------------------------------------------------------------
 */

module( "Domain greater than 1" );

test("get domain when domain is > 1 HOUR", function() {

	expect(11);

	var date     = new Date(2003, 10, 31, 20, 26);
	var nextHour = new Date(2003, 10, 31, 22);

	var cal = createCalendar({range: 3, start: date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 hours");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextHour.getFullYear());
	equal(domainEnd.getMonth(), nextHour.getMonth());
	equal(domainEnd.getDate(), nextHour.getDate());
	equal(domainEnd.getHours(), nextHour.getHours());
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is > 1 DAY", function() {

	expect(11);

	var date    = new Date(2003, 10, 10, 23, 26);
	var nextDay = new Date(2003, 10, 17);

	var cal = createCalendar({domain: "day", range: 8, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 8, "Domain size is 8 days");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear());
	equal(domainEnd.getMonth(), nextDay.getMonth());
	equal(domainEnd.getDate(), nextDay.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is > 1 WEEK", function() {

	expect(11);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekEnd   = new Date(2013, 2, 4);			// Sunday : March 4th, 2013

	var cal = createCalendar({domain: "week", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 weeks");

	equal(domain[0].getFullYear(), 2013, "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 1, "Domain start month is equal to date month");
	equal(domain[0].getDate(), 18, "Domain start day is equal to first day of week");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	equal(domainEnd.getMonth(), weekEnd.getMonth());
	equal(domainEnd.getDate(), weekEnd.getDate());
	equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});



test("get domain when domain is > 1 MONTH", function() {

	expect(11);

	var date      = new Date(2003, 6, 25, 23, 26);
	var nextMonth = new Date(2003, 7, 1, 0, 0);

	var cal = createCalendar({domain: "month", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 months");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextMonth.getFullYear());
	equal(domainEnd.getMonth(), nextMonth.getMonth());
	equal(domainEnd.getDate(), nextMonth.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is > 1 YEAR", function() {

	expect(11);

	var date     = new Date(2004, 10, 20, 23, 26);
	var nextYear = new Date(2005, 0, 1);

	var cal = createCalendar({domain: "year", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 year");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextYear.getFullYear());
	equal(domainEnd.getMonth(), nextYear.getMonth());
	equal(domainEnd.getDate(), nextYear.getDate());
	equal(domainEnd.getHours(), nextYear.getHours(), "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), nextYear.getMinutes(), "Domain end minutes is equal to 0");

});

/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR DOMAIN OVERLAPING NEXT HOUR/DAY/MONTH/YEAR
	-----------------------------------------------------------------
 */

module( "Overlapping Domain" );

test("get domain when HOUR domain overlap next day", function() {

	expect(11);

	var date = new Date(2003, 10, 20, 23, 26);
	var next = new Date(2003, 10, 21, 1);

	var cal = createCalendar({domain: "hour", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 hours");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), next.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), next.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), next.getDate(), "Domain end day is a day of next month");
	equal(domainEnd.getHours(), next.getHours(), "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when HOUR domain overlap next month", function() {

	expect(11);

	var date    = new Date(2003, 10, 30, 23, 26);	// 31 October
	var next = new Date(2003, 11, 1, 1);			// 1st November

	var cal = createCalendar({domain: "hour", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 hours");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), next.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), next.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), next.getDate(), "Domain end day is a day of next month");
	equal(domainEnd.getHours(), next.getHours(), "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when DAY domain overlap next month", function() {

	expect(11);

	var date    = new Date(2003, 0, 30, 23, 26);
	var nextDay = new Date(2003, 1, 1);

	var cal = createCalendar({domain: "day", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 days");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear());
	equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), nextDay.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when DAY domain overlap next year", function() {

	expect(11);

	var date    = new Date(2003, 11, 30, 23, 26);
	var nextDay = new Date(2004, 0, 1);

	var cal = createCalendar({domain: "day", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 days");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), nextDay.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain WEEK overlap next month", function() {

	expect(11);

	var date      = new Date(2012, 9, 31, 20, 15);
	var weekStart = new Date(2012, 9, 29);		// Monday of the first week of the domain
	var weekEnd   = new Date(2012, 10, 5);		// Monday of the last week of the domain

	var cal = createCalendar({domain: "week", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 weeks");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to first day of week");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	equal(domainEnd.getMonth(), weekEnd.getMonth());
	equal(domainEnd.getDate(), weekEnd.getDate());
	equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain WEEK overlap next year", function() {

	expect(11);

	var date      = new Date(2012, 11, 31, 20, 15);
	var weekStart = new Date(2012, 11, 31);		// Monday of the first week of the domain
	var weekEnd   = new Date(2013, 0, 7);		// Monday of the last week of the domain

	var cal = createCalendar({domain: "week", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to first day of week");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	equal(domainEnd.getMonth(), weekEnd.getMonth());
	equal(domainEnd.getDate(), weekEnd.getDate());
	equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when MONTH domain overlap next year", function() {

	expect(11);

	var date    = new Date(2003, 11, 30, 23, 26);
	var nextDay = new Date(2004, 1, 1);

	var cal = createCalendar({domain: "month", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 months");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is first day of start month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is after 3 month");
	equal(domainEnd.getDate(), nextDay.getDate(), "Domain end day is first day of month");
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});


/*
	-----------------------------------------------------------------
	BASIC SUBDOMAIN TESTS
	-----------------------------------------------------------------
 */

module( "SubDomain test" );

test("get subdomain when subdomain is MIN", function() {

	expect(3);

	var date = new Date(2012, 11, 25, 20, 26);

	var cal = createCalendar({start : date});
	var domain = cal.getSubDomain(date);

	equal(domain.length, 60, "SubDomain size is 60");

	var start = new Date(2012, 11, 25, 20);
	var end = new Date(2012, 11, 25, 20, 59);

	equal(+domain[0], +start, "First element of subdomain is first minute of hour");
	equal(+domain[59], +end, "Last element of subdomain is last minute of hour");

});

test("get subdomain when subdomain is HOUR", function() {

	expect(4);

	var date = new Date(2013, 0, 25, 0, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "hour", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 25, 0);
	var endDate = new Date(2013, 0, 25, 23);

	equal(domain.length, 1, "Domain is equal to one day");
	equal(subDomain.length, 24, "SubDomain size is equal to 24 hours");
	equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first hour of day");
	equal(subDomain[23].getTime(), endDate.getTime(), "SubDomain end at last hour of the day");

});

test("get subdomain when subdomain is DAY", function() {

	expect(4);

	var date = new Date(2013, 1, 1, 20, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "day", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 1, 1);
	var endDate = new Date(2013, 2, 0);

	equal(domain.length, 1, "Domain is equal to one month");
	equal(subDomain.length, endDate.getDate(), "SubDomain size is equal to number of days in the current month");
	equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first day of month");
	equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "SubDomain end at last day of month");

});




test("get subdomain when subdomain is MONTH", function() {

	expect(4);

	var date = new Date(2013, 0, 1, 20, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "month", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1);
	var endDate = new Date(2013, 11, 1);

	equal(domain.length, 1, "Domain is equal to 1 year");
	equal(subDomain.length, 12, "SubDomain size is equal to 12 months");
	equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first day of year");
	equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "SubDomain end at first day of last month");

});

/*
	-----------------------------------------------------------------
	DOMAIN AND SUBDOMAIN TEST
	-----------------------------------------------------------------
 */

module( "Domain and subdomain test" );

test("HOUR -> MIN", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "hour", subDomain: "min", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0, 1, 10);
	var endDate = new Date(2013, 0, 1, 12);

	equal(domain.length, 3, "Domain is equal to 3 hours");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		equal(subDomain.length, 60, "The hour subdomain contains 60 minutes");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), domainStartDate.getHours(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), domainStartDate.getHours(), 59);

		equal(subDomain[0].t, startDate.getTime(), "The hour subdomain start is the first minute of hour");
		equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The hour subdomain start is the last minute of hour");
	});

});

test("DAY -> HOUR", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "hour", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	equal(domain.length, 3, "Domain is equal to 3 days");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		equal(subDomain.length, 24, "The day subdomain contains 24 hours");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 23);

		equal(subDomain[0].t, startDate.getTime(), "The hour subdomain start is the first hour of day");
		equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The hour subdomain start is the last hour of day");
	});

});


test("DAY -> MIN", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "min", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	equal(domain.length, 3, "Domain is equal to 3 days");
	equal(domain[0].getTime(), startDate.getTime(), "First domain start is midnight of first day");
	equal(domain[domain.length-1].getTime(), endDate.getTime(), "Last domain start is midnight of last day");

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		equal(subDomain.length, 1440, "The day subdomain contains 1440 minutes");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 23, 59);

		equal(subDomain[0].t, startDate.getTime(), "The hour subdomain start is the first minute of day");
		equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The hour subdomain start is the last minute of day");
	});

});

test("WEEK -> DAY", function() {

	expect(18);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "day", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 14);

	equal(domain.length, 3, "Domain is equal to 3 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);

		equal(subDomain.length, 7, "The week contains 7 days");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].t, startDate.getTime(), "The week subdomain start is the first day of week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, endWeek.getTime(), "The week subdomain end is the last day of week : " + subDomain[subDomain.length-1]);
		equal(new Date(subDomain[0].t).getDay(), 1, "The week start a monday");
		equal(new Date(subDomain[subDomain.length-1].t).getDay(), 0, "The week end a sunday");
	});

});

test("WEEK -> HOUR", function() {

	expect(13);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "hour", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 7);

	equal(domain.length, 2, "Domain is equal to 2 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);
		endWeek.setHours(23);

		var hoursNb = 24 * 7;

		equal(subDomain.length, hoursNb, "The week contains " + hoursNb + " hours");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].t, startDate.getTime(), "The week subdomain start is the first hour of week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, endWeek.getTime(), "The week subdomain end is the last hour of week : " + subDomain[subDomain.length-1]);
		equal(new Date(subDomain[0].t).getDay(), 1, "The week start a monday");
		equal(new Date(subDomain[subDomain.length-1].t).getDay(), 0, "The week end a sunday");
	});
});

test("WEEK -> MIN", function() {

	expect(13);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "min", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 7);

	equal(domain.length, 2, "Domain is equal to 2 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);
		endWeek.setHours(23);
		endWeek.setMinutes(59);

		var minNb = 24 * 7 * 60;

		equal(subDomain.length, minNb, "The week contains " + minNb + " minutes");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].t, startDate.getTime(), "The week subdomain start is the first minutes of week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, endWeek.getTime(), "The week subdomain end is the last minute of week : " + subDomain[subDomain.length-1]);
		equal(new Date(subDomain[0].t).getDay(), 1, "The week start a monday");
		equal(new Date(subDomain[subDomain.length-1].t).getDay(), 0, "The week end a sunday");
	});
});


test("MONTH -> WEEK", function() {

	expect(9);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "week", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	equal(domain.length, 3, "Domain is equal to 3 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());
		if (startDate.getDay() > 1) {
			startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
		} else if (startDate.getDay() === 0) {
			startDate.seDate(startDate.getDate() - 6);
		}

		var endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 28);

		equal(subDomain[0].t, startDate.getTime(), "The month subdomain start is the first day of first week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The month subdomain end is the first day of last week : " + subDomain[subDomain.length-1]);
	});

});

test("MONTH -> DAY", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "day", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	equal(domain.length, 3, "Domain is equal to 3 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endOfMonth = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth()+1, 0);

		equal(subDomain.length, endOfMonth.getDate(), "The month contains " + endOfMonth.getDate() + " days");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].t, startDate.getTime(), "The month subdomain start is the first day of month : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, endOfMonth.getTime(), "The month subdomain end is the last day of month : " + subDomain[subDomain.length-1]);
	});

});

test("MONTH -> HOUR", function() {

	expect(9);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "hour", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 1);

	equal(domain.length, 2, "Domain is equal to 2 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endOfMonth = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth()+1, 0, 23);

		var monthsHoursNb = 24 * endOfMonth.getDate();

		equal(subDomain.length, monthsHoursNb, "The month contains " + monthsHoursNb + " hours");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].t, startDate.getTime(), "The month subdomain start is the first hour of month : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, endOfMonth.getTime(), "The month subdomain end is the last hour of month : " + subDomain[subDomain.length-1]);
	});

});

test("YEAR -> DAY", function() {

	expect(5);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "day", range: 1, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);

	equal(domain.length, 1, "Domain is equal to 1 year");
	equal(domain[0].getTime(), startDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 11, 31);

		var yearDaysNb = cal.getDayOfYear(domainEndDate);

		equal(subDomain.length, yearDaysNb, "The year contains " + yearDaysNb + " days");
		equal(subDomain[0].t, domainStartDate.getTime(), "The year subdomain start is the first day of first month of year : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, domainEndDate.getTime(), "The year subdomain end is the last day of last month of year : " + subDomain[subDomain.length-1]);
	});

});

test("YEAR -> MONTH", function() {

	expect(9);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "month", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	equal(domain.length, 2, "Domain is equal to 2 years");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 11);

		equal(subDomain.length, 12, "The year contains 12 months");
		equal(subDomain[0].t, domainStartDate.getTime(), "The year subdomain start is the first month of year : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, domainEndDate.getTime(), "The year subdomain end is the last month of year : " + subDomain[subDomain.length-1]);
	});

});

test("YEAR -> WEEK", function() {

	expect(4);

	var date = new Date(2005, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "week", range: 1, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(date.getFullYear(), 0);
	var endDate = new Date(date.getFullYear()+1, 0, 0);

	equal(domain.length, 1, "Domain is equal to 1 year");
	equal(domain[0].getTime(), startDate.getTime(), "Domain start the monday of the first week of the week");

	cal.svg().selectAll("svg").each(function(d){
		var subDomain = d3.select(this).selectAll("rect").data();

		var domainStartDate = new Date(+d);
		var weekNb = cal.getWeekNumber(endDate);


		if (domainStartDate.getDay() > 1) {
			domainStartDate.setDate(domainStartDate.getDay()*-1+2);
		} else if (domainStartDate.getDay() === 0) {
			domainStartDate.setDate(-6);
		}

		equal(subDomain.length, weekNb, "The year contains " + weekNb + " weeks");
		equal(subDomain[0].t, domainStartDate.getTime(), "The year subdomain start is the first week of year : " + subDomain[0].t);
		//equal(subDomain[subDomain.length-1].getTime(), domainEndDate.getTime(), "The year subdomain end is the last week of year : " + subDomain[subDomain.length-1]);
	});

});


test("YEAR -> DAY", function() {

	expect(9);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "day", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	equal(domain.length, 2, "Domain is equal to 2 years");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 12, 0);
		var nbDaysInYear = cal.getDayOfYear(domainEndDate);

		equal(subDomain.length, nbDaysInYear, "The year " + domainStartDate.getFullYear() + " contains " + nbDaysInYear + " days");
		equal(subDomain[0].t, domainStartDate.getTime(), "The year " + domainStartDate.getFullYear() + " subdomain start is the first day of year : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].t, domainEndDate.getTime(), "The year " + domainStartDate.getFullYear() + " subdomain end is the last day of year : " + subDomain[subDomain.length-1]);
	});

});

/*
	-----------------------------------------------------------------
	NEXT AND PREVIOUS DOMAIN
	-----------------------------------------------------------------
 */

module( "Next and previous domain" );

test("get next domain", function() {

	expect(3);

	var date = new Date(2000, 0, 1);

	var cal = createCalendar({start: date});
	var domain = cal.getDomain(date.getTime());

	var nextDomain = cal.getNextDomain();

	var domainEnd = date.setHours(date.getHours() + 11);
	var expectedNextDomain = new Date(domainEnd);
	expectedNextDomain.setHours(expectedNextDomain.getHours() + 1);

	equal(domain.length, 12, "Domain contains 12 hours");
	equal(domain[domain.length-1].getTime(), domainEnd, "Domain end at " + new Date(domainEnd));
	equal(nextDomain.getTime(), expectedNextDomain.getTime(), "Next domain is " + expectedNextDomain);
});

test("get previous domain", function() {

	expect(3);

	var date = new Date(2000, 0, 1, 2);

	var cal = createCalendar({start: date});
	var domain = cal.getDomain(date.getTime());

	var previousDomain = cal.getPreviousDomain();

	var domainStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
	var expectedPreviousDomain = new Date(domain[0]);
	expectedPreviousDomain.setHours(expectedPreviousDomain.getHours() - 1);

	equal(domain.length, 12, "Domain contains 12 hours");
	equal(domain[0].getTime(), domainStart.getTime(), "Domain start at " + domainStart);
	equal(previousDomain.getTime(), expectedPreviousDomain.getTime(), "previous domain is " + expectedPreviousDomain);
});


/*
	-----------------------------------------------------------------
	OTHER DATE COMPUTATION
	-----------------------------------------------------------------
 */

module( "Date computation" );

test("Get end of month, from a date", function() {

	expect(1);

	var cal = createCalendar({});

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	equal(cal.getEndOfMonth(date).getTime(), endOfMonth.getTime());
});


test("Get end of month, from a timestamp", function() {

	expect(1);

	var cal = createCalendar({});

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	equal(cal.getEndOfMonth(date.getTime()).getTime(), endOfMonth.getTime());
});

test("Get the day of the year", function() {

	expect(4);

	var cal = createCalendar({});

	equal(cal.getDayOfYear(new Date(2013, 0)), 1, "Getting the first day of year 2013");
	equal(cal.getDayOfYear(new Date(2013, 11, 31)), 365, "Getting the last day of year 2013");
	equal(cal.getDayOfYear(new Date(2016, 0)), 1, "Getting the first day of (leap) year 2016");
	equal(cal.getDayOfYear(new Date(2016, 11, 31)), 366, "Getting the last day of (leap) year 2016");
});


test("Week start on Monday", function() {

	expect(1);

	var cal = createCalendar({weekStartOnMonday: true});

	equal(cal.getWeekDay(new Date(2012, 11, 31)), 0, "Monday is first day of week");
});

test("Week start on Sunday", function() {

	expect(1);

	var cal = createCalendar({weekStartOnMonday: false});
	equal(cal.getWeekDay(new Date(2012, 11, 31)), 1, "Monday is second day of week");
});

/*
	-----------------------------------------------------------------
	LEGEND
	-----------------------------------------------------------------
 */

module( "Legend class" );

test("Positive legend", function() {

	expect(9);

	var cal = createCalendar({legend: [100, 200, 300, 400]});

	equal(cal.Legend.getClass(0, false), "r1 r0");
	equal(cal.Legend.getClass(50, false), "r1");
	equal(cal.Legend.getClass(100, false), "r1");
	equal(cal.Legend.getClass(150, false), "r2");
	equal(cal.Legend.getClass(200, false), "r2");
	equal(cal.Legend.getClass(250, false), "r3");
	equal(cal.Legend.getClass(300, false), "r3");
	equal(cal.Legend.getClass(350, false), "r4");
	equal(cal.Legend.getClass(600, false), "r5");
});

test("Positive and negative custom legend", function() {

	expect(9);

	var cal = createCalendar({legend: [-100, 0, 100, 200, 300, 400]});

	equal(cal.Legend.getClass(-200, false), "r1");
	equal(cal.Legend.getClass(-100, false), "r1");
	equal(cal.Legend.getClass(-50, false), "r2");
	equal(cal.Legend.getClass(0, false), "r2 r0");
	equal(cal.Legend.getClass(50, false), "r3");
	equal(cal.Legend.getClass(100, false), "r3");
	equal(cal.Legend.getClass(150, false), "r4");
	equal(cal.Legend.getClass(200, false), "r4");
	equal(cal.Legend.getClass(600, false), "r7");
});

test("Float value custom legend", function() {

	expect(9);

	var cal = createCalendar({legend: [0.1, 0.2, 0.3]});

	equal(cal.Legend.getClass(-100, false), "r1 ri");
	equal(cal.Legend.getClass(0, false), "r1 r0");
	equal(cal.Legend.getClass(0.1, false), "r1");
	equal(cal.Legend.getClass(0.15, false), "r2");
	equal(cal.Legend.getClass(0.2, false), "r2");
	equal(cal.Legend.getClass(0.25, false), "r3");
	equal(cal.Legend.getClass(0.3, false), "r3");
	equal(cal.Legend.getClass(0.35, false), "r4");
	equal(cal.Legend.getClass(0.4, false), "r4");
});

test("Empty value", function() {

	expect(1);

	var cal = createCalendar({});

	equal(cal.Legend.getClass(null, false), "", "Null value return empty string");
});

test("Invalid value", function() {

	expect(1);

	var cal = createCalendar({});

	equal(cal.Legend.getClass("foo", false), "", "NaN return empty string");
});

test("Also return the qn styling class", function() {

	expect(10);

	var cal = createCalendar({legend: [100, 200, 300, 400]});

	equal(cal.Legend.getClass(-100, true), "r1 ri q1 qi");
	equal(cal.Legend.getClass(0, true), "r1 r0 q1 q0");
	equal(cal.Legend.getClass(50, true), "r1 q1");
	equal(cal.Legend.getClass(100, true), "r1 q1");
	equal(cal.Legend.getClass(150, true), "r2 q2");
	equal(cal.Legend.getClass(200, true), "r2 q2");
	equal(cal.Legend.getClass(250, true), "r3 q3");
	equal(cal.Legend.getClass(300, true), "r3 q3");
	equal(cal.Legend.getClass(350, true), "r4 q4");
	equal(cal.Legend.getClass(600, true), "r5 q5");
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
var SPLIT_TEST = false;

// Count the number of keys in an array
function count(array) {
	return d3.keys(array).length;
}

function _test(domain, subDomain, config_h, config_v, skipped) {

	if (arguments.length < 5) {
		skipped = false;
	}

	if (SPLIT_TEST) {
		module("Test painting " + domain + " > " + subDomain + " columns/rows");
	}

	for(var i = 0, total = config_h.length; i < total; i++) {
		testConfig(domain, subDomain, config_h[i][0], config_h[i][1], config_h[i][2], config_h[i][3], skipped);
		testConfig(domain, "x_" + subDomain, config_h[i][0], config_h[i][1], config_h[i][3], config_h[i][2], skipped);
	}

	// Cutting along the reading direction
	for(i = 0, total = config_v.length; i < total; i++) {
		testConfig(domain, subDomain, config_v[i][0], config_v[i][1], config_v[i][2], config_v[i][3], skipped);
		testConfig(domain, "x_" + subDomain, config_v[i][0], config_v[i][1], config_v[i][3], config_v[i][2], skipped);
	}
}

/**
 * Trigger the test for the columns and rows limit
 */
function testConfig(domain, subDomain, col, row, expectedCol, expectedRow, skipped) {
	testColumnsAndRows(domain, subDomain, col, row, expectedCol, expectedRow, skipped);
}

/**
 * The test itself
 */
function testColumnsAndRows(domain, subDomain, col, row, expectedCol, expectedRow, skipped) {

	testTitle = "Default splitting";

	if (col > 0) {
		testTitle = "Split into [" + col + "] columns";
	} else if (row > 0) {
		testTitle = "Split into [" + row + "] rows";
	}

	if (subDomain[0] === "x") {
		testTitle += " [vertical layout]";
	}

	testTitle = domain.toUpperCase() + " » " + subDomain.toUpperCase() + " : " + testTitle;

	if (skipped) {
		testSkip(testTitle, _t);
	} else {
		test(testTitle, _t);
	}

	function _t() {
		expect(2);

		var cal = createCalendar({domain: domain, subDomain: subDomain, colLimit: col, rowLimit: row,
			start: new Date(2000, 0, 1), cellPadding: 0, paintOnLoad: true, range: 1});

		var rect = $("#cal-heatmap").find(".graph-rect");

		var _count = {
			column: [],
			row: []
		};

		rect.each(function() {
			_count.column[$(this).attr("x")] = 0;
			_count.row[$(this).attr("y")] = 0;
		});

		equal(count(_count.column), expectedCol, "The domain was split into " + expectedCol + " columns");
		equal(count(_count.row), expectedRow, "The domain was split into " + expectedRow + " rows");
	}
}


module("Painting column and row count");
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

_test("hour", "min", [
	[0, 0, 6, 10],
	[2, 0, 2, 30],
	[50, 0, 30, 2],
	[7, 0, 7, 9],
	[21, 0, 20, 3],
	[75, 0, 60, 1]
], [
	[0, 2, 30, 2],
	[0, 50, 2, 50],
	[0, 7, 9, 7],
	[0, 21, 3, 21],
	[0, 75, 1, 60]
]);

/*
	=================================================================
	DAY > HOUR
	=================================================================
 */

_test("day", "hour", [
	[0, 0, 4, 6],
	[2, 0, 2, 12],
	[10, 0, 8, 3],
	[5, 0, 5, 5],
	[29, 0, 24, 1]
], [
	[0, 2, 12, 2],
	[0, 10, 3, 10],
	[0, 5, 5, 5],
	[0, 29, 1, 24]
]);

/*
	=================================================================
	WEEK > HOUR
	=================================================================
 */

// 1 week = 168 hours

_test("week", "hour", [
	[0, 0, 28, 6],
	[12, 0, 12, 14],
	[100, 0, 84, 2],
	[27, 0, 24, 7],
	[41, 0, 34, 5],
	[170, 0, 168, 1]
], [
	[0, 12, 14, 12],
	[0, 100, 2, 100],
	[0, 27, 7, 27],
	[0, 41, 5, 41],
	[0, 170, 1, 168]
]);

/*
	=================================================================
	WEEK > DAY
	=================================================================
 */

_test("week", "day", [
	[0, 0, 1, 7],
	[2, 0, 2, 4],
	[6, 0, 4, 2],
	[3, 0, 3, 3],
	[5, 0, 4, 2],
	[10, 0, 7, 1]
], [
	[0, 2, 4, 2],
	[0, 6, 2, 6],
	[0, 3, 3, 3],
	[0, 5, 2, 5],
	[0, 10, 1, 7]
]);

/*
	=================================================================
	MONTH > HOUR
	=================================================================
 */

// Tested month contains : 31 * 24 = 744 hours

_test("month", "hour", [
	[0, 0, 124, 6],
	[2, 0, 2, 372],
	[100, 0, 93, 8],
	[7, 0, 7, 107],
	[551, 0, 372, 2],
	[800, 0, 744, 1]
], [
	[0, 2, 372, 2],
	[0, 100, 8, 100],
	[0, 7, 107, 7],
	[0, 551, 2, 551],
	[0, 800, 1, 744]
]);


/*
	=================================================================
	MONTH > DAY
	=================================================================
 */

// Tested month contains 31 days

_test("month", "day", [
	[0, 0, 6, 7],
	[2, 0, 2, 16],
	[10, 0, 8, 4],
	[7, 0, 7, 5],
	[19, 0, 16, 2],
	[40, 0, 31, 1]
], [
	[0, 2, 16, 2],
	[0, 10, 4, 10],
	[0, 7, 5, 7],
	[0, 19, 2, 19],
	[0, 40, 1, 31]
]);

/*
	=================================================================
	MONTH > WEEK
	=================================================================
 */

// January 2000 contains 5 weeks

_test("month", "week", [
	[0, 0, 5, 1],
	[2, 0, 2, 3],
	[3, 0, 3, 2],
	[8, 0, 5, 1]
], [
	[0, 2, 3, 2],
	[0, 3, 2, 3],
	[0, 8, 1, 8]
], true);

/*
	=================================================================
	YEAR > DAY
	=================================================================
 */

_test("year", "day", [
	[0, 0, 53, 7],
	[2, 0, 2, 183],
	[50, 0, 46, 8],
	[3, 0, 3, 122],
	[60, 0, 53, 7],
	[400, 0, 366, 1]
], [
	[0, 2, 183, 2],
	[0, 50, 8, 50],
	[0, 3, 122, 3],
	[0, 60, 7, 60],
	[0, 400, 1, 366]
]);

/*
	=================================================================
	YEAR > WEEK
	=================================================================
 */

_test("year", "week", [
	[0, 0, 52, 1],
	[2, 0, 2, 26],
	[30, 0, 26, 2],
	[3, 0, 3, 18],
	[49, 0, 2, 26]
], [
	[0, 2, 26, 2],
	[0, 30, 2, 30],
	[0, 3, 18, 3],
	[0, 49, 1, 49]
], true);


/*
	=================================================================
	YEAR > MONTH
	=================================================================
 */

_test("year", "month", [
	[0, 0, 12, 1],
	[2, 0, 2, 6],
	[10, 0, 6, 2],
	[5, 0, 4, 3],
	[11, 0, 6, 2],
	[15, 0, 12, 1]
], [
	[0, 2, 6, 2],
	[0, 10, 2, 10],
	[0, 5, 3, 5],
	[0, 11, 2, 11],
	[0, 15, 1, 12]
]);

/*
	-----------------------------------------------------------------
	PAINTING
	-----------------------------------------------------------------
 */


module( "Painting" );

test("Display empty calendar", function() {

	expect(4);

	createCalendar({paintOnLoad: true});

	equal($("#cal-heatmap .graph").length, 1, "Calendar was created");
	equal($("#cal-heatmap .graph .graph-subdomain-group").length, 12, "The graph contains 12 hours");
	equal($("#cal-heatmap .graph .graph-subdomain-group rect").length, 60*12, "The graph contains 720 minutes");
	equal($("#cal-heatmap .graph-legend").length, 1, "A legend is created");
});

test("Don't display legend", function() {

	expect(1);

	createCalendar({displayLegend: false, paintOnLoad: true});

	equal($("#cal-heatmap .graph-legend").length, 0, "The legend is not created");
});


test("Display domain according to range number", function() {

	expect(1);

	createCalendar({range: 5, paintOnLoad: true});

	equal($("#cal-heatmap .graph .graph-subdomain-group").length, 5, "The graph contains only 5 hours");

});

test("Append graph to the passed DOM ID", function() {

	expect(2);

	$("body").append("<div id=test-container style='display:hidden;'></div>");

	createCalendar({itemSelector: "#test-container", paintOnLoad: true});

	equal($("#test-container .graph").length, 1, "The graph is added to the specified ID");
	equal($("#cal-heatmap .graph").length, 0, "Default ID is empty");

	$("#test-container").remove();

});

test("Attach events to next and previous selector on default namespace", function() {

	expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector");
	equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector");
});

test("Attach events to next and previous selector on custom namespace", function() {

	expect(4);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous",
		itemNamespace: "ns2"
	});

	equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector on default namespace");
	equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector on default namespace");
	equal(typeof d3.select("#next").on("click.ns2"), "function", "loadNextDomain is attached to nextSelector on custom namespace");
	equal(typeof d3.select("#previous").on("click.ns2"), "function", "loadPreviousDomain is attached to previousSelector on custom namespace");
});

test("Attach events to not-valid namespace fallback to default namespace", function() {

	expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	equal(typeof d3.select("#next").on("click.cal-heatmap"), "function", "loadNextDomain is attached to defaultNamespace");
	equal(typeof d3.select("#previous").on("click.cal-heatmap"), "function", "loadPreviousDomain is attached to defaultNamespace");

	$("body").remove("#next");
	$("body").remove("#previous");
});



test("Custom date formatting with d3.js internal formatter", function() {

	expect(1);

	var date = new Date(2000, 0, 5);

	createCalendar({start: date, loadOnInit: true, paintOnLoad: true, subDomainDateFormat: "==%B=="});

	equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, "==January==");

});

test("Custom date formatting with custom function", function() {

	expect(1);

	var date = new Date(2000, 0, 5);

	createCalendar({start: date, loadOnInit: true, paintOnLoad: true, subDomainDateFormat: function(date) { return date.getTime();}});

	equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, date.getTime());
});
/*
test("Cell label have different title formatting depending on whether it's filled or not", function() {

	expect(2);

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

	equal(d3.selectAll("#cal-heatmap title")[0].textContent, title.filled);
	equal($("#cal-heatmap title")[1].textContent, title.empty);
});*/

test("Cell radius is applied", function() {

	expect(2);

	var radius = 15;

	createCalendar({paintOnLoad: true, domain: "day", subDomain: "hour", cellRadius: radius});

	equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "rx"), radius, "Horizontal cellRadius applied");
	equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "ry"), radius, "Vertical cellRadius applied");
});
