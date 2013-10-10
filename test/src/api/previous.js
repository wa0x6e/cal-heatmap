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

