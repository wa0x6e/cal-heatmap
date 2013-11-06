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
