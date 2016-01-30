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
