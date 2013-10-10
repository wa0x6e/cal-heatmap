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
