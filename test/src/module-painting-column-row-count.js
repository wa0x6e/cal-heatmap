/*
	=================================================================
	LIMIT COLUMN AND ROWS COUNT
	---------------------------
	Test that rowLimit and colLimit setting are properly applied
	=================================================================

	All domains are tested on January 1st 2000, 00:00:00

	* Year 2000: 52 weeks
 */

function count(array) {
	return d3.keys(array).length - 1;
}

/**
 * Trigger the test for the columns and rows limit
 */
function _test(domain, subDomain, col, row, expectedCol, expectedRow) {
	if (col === 0 && row === 0) {
		testColumnsAndRows(domain, subDomain, col, row, expectedCol, expectedRow);
		testColumnsAndRows(domain, "x_" + subDomain, row, col, expectedRow, expectedCol);
		return;
	}

	testColumnsAndRows(domain, subDomain, col, row, expectedCol, expectedRow);
	testColumnsAndRows(domain, subDomain, row, col, expectedRow, expectedCol);

	testColumnsAndRows(domain, "x_" + subDomain, row, col, expectedCol, expectedRow);
	testColumnsAndRows(domain, "x_" + subDomain, col, row, expectedRow, expectedCol);

}

function testColumnsAndRows(domain, subDomain, col, row, expectedCol, expectedRow) {

	testTitle = "Default splitting";

	if (col > 0) {
		testTitle = "Split into ";
		if (col % 2 === 0) {
			testTitle += "even";
		} else {
			testTitle += "uneven";
		}
		testTitle += " columns [" + col + "]";
	} else if (row > 0) {
		testTitle = "Split into ";
		if (row % 2 === 0) {
			testTitle += "even";
		} else {
			testTitle += "uneven";
		}
		testTitle += " rows [" + row + "]";
	}

	if (subDomain[0] === "x") {
		testTitle += " [vertical layout]";
	}

	test(domain.toUpperCase() + " » " + subDomain.toUpperCase() + " : " + testTitle, function() {
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
	});
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

_test("hour", "min", 0, 0, 6, 10);

_test("hour", "min", 2, 0, 2, 30);
_test("hour", "min", 50, 0, 50, 2);
_test("hour", "min", 7, 0, 7, 9);
_test("hour", "min", 21, 0, 21, 3);

/*
	=================================================================
	DAY > HOUR
	=================================================================
 */

_test("day", "hour", 0, 0, 4, 6);

_test("day", "hour", 2, 0, 2, 12);
_test("day", "hour", 10, 0, 10, 2);
_test("day", "hour", 5, 0, 5, 5);
_test("day", "hour", 29, 0, 29, 3);

/*
	=================================================================
	WEEK > HOUR
	=================================================================
 */

// 1 week = 168 hours

_test("week", "hour", 0, 0, 28, 6);

_test("week", "hour", 12, 0, 12, 14);
_test("week", "hour", 100, 0, 100, 2);
_test("week", "hour", 27, 0, 27, 7);
_test("week", "hour", 41, 0, 41, 5);

/*
	=================================================================
	WEEK > DAY
	=================================================================
 */

_test("week", "day", 0, 0, 1, 7);

_test("week", "day", 2, 0, 2, 4);
_test("week", "day", 6, 0, 6, 2);
_test("week", "day", 3, 0, 3, 3);
_test("week", "day", 5, 0, 5, 2);

/*
	=================================================================
	MONTH > DAY
	=================================================================
 */

_test("month", "hour", 0, 0, 124, 4);


/*
	=================================================================
	MONTH > DAY
	=================================================================
 */

_test("month", "day", 0, 0, 6, 7);

/*
	=================================================================
	MONTH > WEEK
	=================================================================
 */

_test("month", "week", 0, 0, 6, 1);

/*
	=================================================================
	YEAR > DAY
	=================================================================
 */

_test("year", "day", 0, 0, 52, 7);

/*
	=================================================================
	YEAR > WEEK
	=================================================================
 */

_test("year", "week", 0, 0, 52, 1);


/*
	=================================================================
	YEAR > MONTH
	=================================================================
 */

_test("year", "month", 0, 0, 12, 1);

_test("year", "month", 2, 0, 2, 6);
_test("year", "month", 10, 0, 10, 2);
_test("year", "month", 5, 0, 5, 3);
_test("year", "month", 11, 0, 11, 2);
