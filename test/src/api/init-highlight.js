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
