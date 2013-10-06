/*
	-----------------------------------------------------------------
	DATE
	-----------------------------------------------------------------
 */

module("Date computation : jump()");

function _testJump(date, expectedDate, count, step) {
	test("Jumping " + count + " " + step + "s " + (count > 0 ? "forward" : "backward"), function() {
		expect(2);

		var cal = createCalendar({});

		equal(cal.jumpDate(date, count, step).getTime(), expectedDate.getTime());
		notEqual(date.getTime(), expectedDate.getTime());
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
