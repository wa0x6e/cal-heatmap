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
