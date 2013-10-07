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
	new Date(2000, 7),
	false,
	true,
	new Date(2000, 4)
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
	new Date(2000, 2),
	true,
	false,
	new Date(2000, 2)
);

_testJumpTo(
	new Date(2000, 3),
	true,
	true,
	new Date(2000, 3)
);

_testJumpTo(
	new Date(2000, 4),
	true,
	true,
	new Date(2000, 4)
);

_testJumpTo(
	new Date(2000, 5),
	true,
	true,
	new Date(2000, 5)
);
