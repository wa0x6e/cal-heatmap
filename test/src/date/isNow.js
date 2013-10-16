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
