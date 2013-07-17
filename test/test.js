/*globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,
    notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test,CalHeatMap */


/*
	-----------------------------------------------------------------
	BASIC DOMAIN TESTS
	-----------------------------------------------------------------
 */

module( "Domain equal 1" );

test("get domain when domain is 1 HOUR", function() {

	expect(6);

	var date     = new Date(2003, 10, 31, 20, 26);
	var nextHour = new Date(2003, 10, 31, 21);

	var cal = createCalendar({range: 1, start: date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 hour");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

test("get domain when domain is 1 HOUR, from a timestamp", function() {

	expect(6);

	var date     = new Date(2003, 10, 31, 20, 26);
	var nextHour = new Date(2003, 10, 31, 21);

	var cal = createCalendar({range: 1, start: date});
	var domain = cal.getDomain(date.getTime());
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 hour");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

test("get domain when domain is 1 DAY", function() {

	expect(6);

	var date    = new Date(2003, 10, 20, 23, 26);
	var nextDay = new Date(2003, 10, 21);

	var cal = createCalendar({domain: "day", range:1, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 day");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

test("get domain when domain is 1 DAY, from a timestamp", function() {

	expect(6);

	var date    = new Date(2003, 10, 20, 23, 26);
	var nextDay = new Date(2003, 10, 21);

	var cal = createCalendar({domain: "day", range:1, start : date});
	var domain = cal.getDomain(date.getTime());
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 day");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});


test("get domain when domain is 1 WEEK, from a date in the middle of the week", function() {

	expect(6);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, from a date right on beginning of the week", function() {

	expect(6);

	var date      = new Date(2013, 1, 18, 20, 15);	// Monday : February 18th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, starting a monday", function() {

	expect(7);

	var date      = new Date(2013, 1, 17, 20, 15);	// Monday : February 18th, 2013
	var weekStart = new Date(2013, 1, 11);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getDay(), 1, "Domain start is a monday");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, starting a sunday", function() {

	expect(7);

	var date      = new Date(2013, 1, 13, 20, 15);	// Wednesday : February 13th, 2013
	var weekStart = new Date(2013, 1, 10);			// Sunday : February 10th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date, weekStartOnMonday: 0});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getDay(), 0, "Domain start is a sunday");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, from a timestamp", function() {

	expect(6);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 MONTH", function() {

	expect(6);

	var date      = new Date(2003, 10, 25, 23, 26);
	var nextMonth = new Date(2003, 11, 1, 0, 0);

	var cal = createCalendar({domain: "month", range: 1, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 month");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 MONTH, from a timestamp", function() {

	expect(6);

	var date      = new Date(2003, 10, 25, 23, 26);
	var nextMonth = new Date(2003, 11, 1, 0, 0);

	var cal = createCalendar({domain: "month", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 month");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 YEAR", function() {

	expect(6);

	var date     = new Date(2004, 10, 20, 23, 26);
	var nextYear = new Date(2005, 0, 1);

	var cal = createCalendar({domain: "year", range: 1, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 year");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 YEAR. from a timestamp", function() {

	expect(6);

	var date     = new Date(2004, 10, 20, 23, 26);
	var nextYear = new Date(2005, 0, 1);

	var cal = createCalendar({domain: "year", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 1, "Domain size is 1 year");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

});




/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR GREATER DOMAIN RANGE
	-----------------------------------------------------------------
 */

module( "Domain greater than 1" );

test("get domain when domain is > 1 HOUR", function() {

	expect(11);

	var date     = new Date(2003, 10, 31, 20, 26);
	var nextHour = new Date(2003, 10, 31, 22);

	var cal = createCalendar({range: 3, start: date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 hours");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextHour.getFullYear());
	equal(domainEnd.getMonth(), nextHour.getMonth());
	equal(domainEnd.getDate(), nextHour.getDate());
	equal(domainEnd.getHours(), nextHour.getHours());
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is > 1 DAY", function() {

	expect(11);

	var date    = new Date(2003, 10, 10, 23, 26);
	var nextDay = new Date(2003, 10, 17);

	var cal = createCalendar({domain: "day", range: 8, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 8, "Domain size is 8 days");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear());
	equal(domainEnd.getMonth(), nextDay.getMonth());
	equal(domainEnd.getDate(), nextDay.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is > 1 WEEK", function() {

	expect(11);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013
	var weekEnd   = new Date(2013, 2, 4);			// Sunday : March 4th, 2013

	var cal = createCalendar({domain: "week", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 weeks");

	equal(domain[0].getFullYear(), 2013, "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 1, "Domain start month is equal to date month");
	equal(domain[0].getDate(), 18, "Domain start day is equal to first day of week");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	equal(domainEnd.getMonth(), weekEnd.getMonth());
	equal(domainEnd.getDate(), weekEnd.getDate());
	equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});



test("get domain when domain is > 1 MONTH", function() {

	expect(11);

	var date      = new Date(2003, 6, 25, 23, 26);
	var nextMonth = new Date(2003, 7, 1, 0, 0);

	var cal = createCalendar({domain: "month", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 months");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextMonth.getFullYear());
	equal(domainEnd.getMonth(), nextMonth.getMonth());
	equal(domainEnd.getDate(), nextMonth.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is > 1 YEAR", function() {

	expect(11);

	var date     = new Date(2004, 10, 20, 23, 26);
	var nextYear = new Date(2005, 0, 1);

	var cal = createCalendar({domain: "year", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 year");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextYear.getFullYear());
	equal(domainEnd.getMonth(), nextYear.getMonth());
	equal(domainEnd.getDate(), nextYear.getDate());
	equal(domainEnd.getHours(), nextYear.getHours(), "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), nextYear.getMinutes(), "Domain end minutes is equal to 0");

});

/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR DOMAIN OVERLAPING NEXT HOUR/DAY/MONTH/YEAR
	-----------------------------------------------------------------
 */

module( "Overlapping Domain" );

test("get domain when HOUR domain overlap next day", function() {

	expect(11);

	var date = new Date(2003, 10, 20, 23, 26);
	var next = new Date(2003, 10, 21, 1);

	var cal = createCalendar({domain: "hour", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 hours");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), next.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), next.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), next.getDate(), "Domain end day is a day of next month");
	equal(domainEnd.getHours(), next.getHours(), "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when HOUR domain overlap next month", function() {

	expect(11);

	var date    = new Date(2003, 10, 30, 23, 26);	// 31 October
	var next = new Date(2003, 11, 1, 1);			// 1st November

	var cal = createCalendar({domain: "hour", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 hours");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), next.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), next.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), next.getDate(), "Domain end day is a day of next month");
	equal(domainEnd.getHours(), next.getHours(), "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when DAY domain overlap next month", function() {

	expect(11);

	var date    = new Date(2003, 0, 30, 23, 26);
	var nextDay = new Date(2003, 1, 1);

	var cal = createCalendar({domain: "day", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 days");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear());
	equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), nextDay.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when DAY domain overlap next year", function() {

	expect(11);

	var date    = new Date(2003, 11, 30, 23, 26);
	var nextDay = new Date(2004, 0, 1);

	var cal = createCalendar({domain: "day", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 days");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is next month");
	equal(domainEnd.getDate(), nextDay.getDate());
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain WEEK overlap next month", function() {

	expect(11);

	var date      = new Date(2012, 9, 31, 20, 15);
	var weekStart = new Date(2012, 9, 29);		// Monday of the first week of the domain
	var weekEnd   = new Date(2012, 10, 5);		// Monday of the last week of the domain

	var cal = createCalendar({domain: "week", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 weeks");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to first day of week");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	equal(domainEnd.getMonth(), weekEnd.getMonth());
	equal(domainEnd.getDate(), weekEnd.getDate());
	equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain WEEK overlap next year", function() {

	expect(11);

	var date      = new Date(2012, 11, 31, 20, 15);
	var weekStart = new Date(2012, 11, 31);		// Monday of the first week of the domain
	var weekEnd   = new Date(2013, 0, 7);		// Monday of the last week of the domain

	var cal = createCalendar({domain: "week", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 2, "Domain size is 2 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to first day of week");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	equal(domainEnd.getMonth(), weekEnd.getMonth());
	equal(domainEnd.getDate(), weekEnd.getDate());
	equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when MONTH domain overlap next year", function() {

	expect(11);

	var date    = new Date(2003, 11, 30, 23, 26);
	var nextDay = new Date(2004, 1, 1);

	var cal = createCalendar({domain: "month", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 3, "Domain size is 3 months");

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is first day of start month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domainEnd.getFullYear(), nextDay.getFullYear(), "Domain end year is next year");
	equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is after 3 month");
	equal(domainEnd.getDate(), nextDay.getDate(), "Domain end day is first day of month");
	equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});


/*
	-----------------------------------------------------------------
	BASIC SUBDOMAIN TESTS
	-----------------------------------------------------------------
 */

module( "SubDomain test" );

test("get subdomain when subdomain is MIN", function() {

	expect(3);

	var date = new Date(2012, 11, 25, 20, 26);

	var cal = createCalendar({start : date});
	var domain = cal.getSubDomain(date);

	equal(domain.length, 60, "SubDomain size is 60");

	var start = new Date(2012, 11, 25, 20);
	var end = new Date(2012, 11, 25, 20, 59);

	equal(+domain[0], +start, "First element of subdomain is first minute of hour");
	equal(+domain[59], +end, "Last element of subdomain is last minute of hour");

});

test("get subdomain when subdomain is HOUR", function() {

	expect(4);

	var date = new Date(2013, 0, 25, 0, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "hour", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 25, 0);
	var endDate = new Date(2013, 0, 25, 23);

	equal(domain.length, 1, "Domain is equal to one day");
	equal(subDomain.length, 24, "SubDomain size is equal to 24 hours");
	equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first hour of day");
	equal(subDomain[23].getTime(), endDate.getTime(), "SubDomain end at last hour of the day");

});

test("get subdomain when subdomain is DAY", function() {

	expect(4);

	var date = new Date(2013, 1, 1, 20, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "day", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 1, 1);
	var endDate = new Date(2013, 2, 0);

	equal(domain.length, 1, "Domain is equal to one month");
	equal(subDomain.length, endDate.getDate(), "SubDomain size is equal to number of days in the current month");
	equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first day of month");
	equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "SubDomain end at last day of month");

});




test("get subdomain when subdomain is MONTH", function() {

	expect(4);

	var date = new Date(2013, 0, 1, 20, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "month", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1);
	var endDate = new Date(2013, 11, 1);

	equal(domain.length, 1, "Domain is equal to 1 year");
	equal(subDomain.length, 12, "SubDomain size is equal to 12 months");
	equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first day of year");
	equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "SubDomain end at first day of last month");

});

/*
	-----------------------------------------------------------------
	DOMAIN AND SUBDOMAIN TEST
	-----------------------------------------------------------------
 */

module( "Domain and subdomain test" );

test("HOUR -> MIN", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "hour", subDomain: "min", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1, 10);
	var endDate = new Date(2013, 0, 1, 12);

	equal(domain.length, 3, "Domain is equal to 3 hours");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		equal(subDomain.length, 60, "The hour subdomain contains 60 minutes");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), domainStartDate.getHours(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), domainStartDate.getHours(), 59);

		equal(subDomain[0].getTime(), startDate.getTime(), "The hour subdomain start is the first minute of hour");
		equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "The hour subdomain start is the last minute of hour");
	});

});

test("DAY -> HOUR", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "hour", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	equal(domain.length, 3, "Domain is equal to 3 days");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		equal(subDomain.length, 24, "The day subdomain contains 24 hours");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 23);

		equal(subDomain[0].getTime(), startDate.getTime(), "The hour subdomain start is the first hour of day");
		equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "The hour subdomain start is the last hour of day");
	});

});


test("DAY -> MIN", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "min", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	equal(domain.length, 3, "Domain is equal to 3 days");
	equal(domain[0].getTime(), startDate.getTime(), "First domain start is midnight of first day");
	equal(domain[domain.length-1].getTime(), endDate.getTime(), "Last domain start is midnight of last day");

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		equal(subDomain.length, 1440, "The day subdomain contains 1440 minutes");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 23, 59);

		equal(subDomain[0].getTime(), startDate.getTime(), "The hour subdomain start is the first minute of day");
		equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "The hour subdomain start is the last minute of day");
	});

});

test("WEEK -> DAY", function() {

	expect(18);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "day", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 14);

	equal(domain.length, 3, "Domain is equal to 3 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);

		equal(subDomain.length, 7, "The week contains 7 days");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].getTime(), startDate.getTime(), "The week subdomain start is the first day of week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), endWeek.getTime(), "The week subdomain end is the last day of week : " + subDomain[subDomain.length-1]);
		equal(subDomain[0].getDay(), 1, "The week start a monday");
		equal(subDomain[subDomain.length-1].getDay(), 0, "The week end a sunday");
	});

});

test("WEEK -> HOUR", function() {

	expect(13);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "hour", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 7);

	equal(domain.length, 2, "Domain is equal to 2 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);
		endWeek.setHours(23);

		var hoursNb = 24 * 7;

		equal(subDomain.length, hoursNb, "The week contains " + hoursNb + " hours");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].getTime(), startDate.getTime(), "The week subdomain start is the first hour of week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), endWeek.getTime(), "The week subdomain end is the last hour of week : " + subDomain[subDomain.length-1]);
		equal(subDomain[0].getDay(), 1, "The week start a monday");
		equal(subDomain[subDomain.length-1].getDay(), 0, "The week end a sunday");
	});
});

test("WEEK -> MIN", function() {

	expect(13);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "min", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 7);

	equal(domain.length, 2, "Domain is equal to 2 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);
		endWeek.setHours(23);
		endWeek.setMinutes(59);

		var minNb = 24 * 7 * 60;

		equal(subDomain.length, minNb, "The week contains " + minNb + " minutes");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].getTime(), startDate.getTime(), "The week subdomain start is the first minutes of week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), endWeek.getTime(), "The week subdomain end is the last minute of week : " + subDomain[subDomain.length-1]);
		equal(subDomain[0].getDay(), 1, "The week start a monday");
		equal(subDomain[subDomain.length-1].getDay(), 0, "The week end a sunday");
	});
});


test("MONTH -> WEEK", function() {

	expect(9);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "week", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	equal(domain.length, 3, "Domain is equal to 3 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endOfMonth = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth()+1, 0);
		var weekNb = Math.ceil(endOfMonth.getDate() / 7);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());
		if (startDate.getDay() > 1) {
			startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
		} else if (startDate.getDay() === 0) {
			startDate.seDate(startDate.getDate() - 6);
		}

		var endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 28);

		equal(subDomain[0].getTime(), startDate.getTime(), "The month subdomain start is the first day of first week : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "The month subdomain end is the first day of last week : " + subDomain[subDomain.length-1]);
	});

});

test("MONTH -> DAY", function() {

	expect(12);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "day", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	equal(domain.length, 3, "Domain is equal to 3 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endOfMonth = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth()+1, 0);

		equal(subDomain.length, endOfMonth.getDate(), "The month contains " + endOfMonth.getDate() + " days");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].getTime(), startDate.getTime(), "The month subdomain start is the first day of month : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), endOfMonth.getTime(), "The month subdomain end is the last day of month : " + subDomain[subDomain.length-1]);
	});

});

test("MONTH -> HOUR", function() {

	expect(9);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "hour", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 1);

	equal(domain.length, 2, "Domain is equal to 2 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endOfMonth = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth()+1, 0, 23);

		var monthsHoursNb = 24 * endOfMonth.getDate();

		equal(subDomain.length, monthsHoursNb, "The month contains " + monthsHoursNb + " hours");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		equal(subDomain[0].getTime(), startDate.getTime(), "The month subdomain start is the first hour of month : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), endOfMonth.getTime(), "The month subdomain end is the last hour of month : " + subDomain[subDomain.length-1]);
	});

});

test("YEAR -> DAY", function() {

	expect(5);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "day", range: 1, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0, 0);

	equal(domain.length, 1, "Domain is equal to 1 year");
	equal(domain[0].getTime(), startDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 11, 31);

		var yearDaysNb = cal.getDayOfYear(domainEndDate);

		equal(subDomain.length, yearDaysNb, "The year contains " + yearDaysNb + " days");
		equal(subDomain[0].getTime(), domainStartDate.getTime(), "The year subdomain start is the first day of first month of year : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), domainEndDate.getTime(), "The year subdomain end is the last day of last month of year : " + subDomain[subDomain.length-1]);
	});

});

test("YEAR -> MONTH", function() {

	expect(9);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "month", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	equal(domain.length, 2, "Domain is equal to 2 years");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 11);

		equal(subDomain.length, 12, "The year contains 12 months");
		equal(subDomain[0].getTime(), domainStartDate.getTime(), "The year subdomain start is the first month of year : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), domainEndDate.getTime(), "The year subdomain end is the last month of year : " + subDomain[subDomain.length-1]);
	});

});

test("YEAR -> WEEK", function() {

	expect(4);

	var date = new Date(2005, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "week", range: 1, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(date.getFullYear(), 0);
	var endDate = new Date(date.getFullYear()+1, 0, 0);

	equal(domain.length, 1, "Domain is equal to 1 year");
	equal(domain[0].getTime(), startDate.getTime(), "Domain start the monday of the first week of the week");

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var weekNb = cal.getWeekNumber(endDate);


		if (domainStartDate.getDay() > 1) {
			domainStartDate.setDate(domainStartDate.getDay()*-1+2);
		} else if (domainStartDate.getDay() === 0) {
			domainStartDate.setDate(-6);
		}

		equal(subDomain.length, weekNb, "The year contains " + weekNb + " weeks");
		equal(subDomain[0].getTime(), domainStartDate.getTime(), "The year subdomain start is the first week of year : " + subDomain[0]);
		//equal(subDomain[subDomain.length-1].getTime(), domainEndDate.getTime(), "The year subdomain end is the last week of year : " + subDomain[subDomain.length-1]);
	});

});


test("YEAR -> DAY", function() {

	expect(9);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "day", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	equal(domain.length, 2, "Domain is equal to 2 years");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 12, 0);
		var nbDaysInYear = cal.getDayOfYear(domainEndDate);

		equal(subDomain.length, nbDaysInYear, "The year " + domainStartDate.getFullYear() + " contains " + nbDaysInYear + " days");
		equal(subDomain[0].getTime(), domainStartDate.getTime(), "The year " + domainStartDate.getFullYear() + " subdomain start is the first day of year : " + subDomain[0]);
		equal(subDomain[subDomain.length-1].getTime(), domainEndDate.getTime(), "The year " + domainStartDate.getFullYear() + " subdomain end is the last day of year : " + subDomain[subDomain.length-1]);
	});

});

/*
	-----------------------------------------------------------------
	NEXT AND PREVIOUS DOMAIN
	-----------------------------------------------------------------
 */

module( "Next and previous domain" );

test("get next domain", function() {

	expect(3);

	var date = new Date(2000, 0, 1);

	var cal = createCalendar({start: date});
	var domain = cal.getDomain(date.getTime());

	var nextDomain = cal.getNextDomain();

	var domainEnd = date.setHours(date.getHours() + 11);
	var expectedNextDomain = new Date(domainEnd);
	expectedNextDomain.setHours(expectedNextDomain.getHours() + 1);

	equal(domain.length, 12, "Domain contains 12 hours");
	equal(domain[domain.length-1].getTime(), domainEnd, "Domain end at " + new Date(domainEnd));
	equal(nextDomain.getTime(), expectedNextDomain.getTime(), "Next domain is " + expectedNextDomain);
});

test("get previous domain", function() {

	expect(3);

	var date = new Date(2000, 0, 1, 2);

	var cal = createCalendar({start: date});
	var domain = cal.getDomain(date.getTime());

	var previousDomain = cal.getPreviousDomain();

	var domainStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
	var expectedPreviousDomain = new Date(domain[0]);
	expectedPreviousDomain.setHours(expectedPreviousDomain.getHours() - 1);

	equal(domain.length, 12, "Domain contains 12 hours");
	equal(domain[0].getTime(), domainStart.getTime(), "Domain start at " + domainStart);
	equal(previousDomain.getTime(), expectedPreviousDomain.getTime(), "previous domain is " + expectedPreviousDomain);
});


/*
	-----------------------------------------------------------------
	OTHER DATE COMPUTATION
	-----------------------------------------------------------------
 */

module( "Date computation" );

test("Get end of month, from a date", function() {

	expect(1);

	var cal = createCalendar({});

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	equal(cal.getEndOfMonth(date).getTime(), endOfMonth.getTime());
});


test("Get end of month, from a timestamp", function() {

	expect(1);

	var cal = createCalendar({});

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	equal(cal.getEndOfMonth(date.getTime()).getTime(), endOfMonth.getTime());
});

test("Get the day of the year", function() {

	expect(4);

	var cal = createCalendar({});

	equal(cal.getDayOfYear(new Date(2013, 0)), 1, "Getting the first day of year 2013");
	equal(cal.getDayOfYear(new Date(2013, 11, 31)), 365, "Getting the last day of year 2013");
	equal(cal.getDayOfYear(new Date(2016, 0)), 1, "Getting the first day of (leap) year 2016");
	equal(cal.getDayOfYear(new Date(2016, 11, 31)), 366, "Getting the last day of (leap) year 2016");
});


test("Week start on Monday", function() {

	expect(1);

	var cal = createCalendar({weekStartOnMonday:1});

	equal(cal.getWeekDay(new Date(2012, 11, 31)), 0, "Monday is first day of week");
});

test("Week start on Sunday", function() {

	expect(1);

	var cal = createCalendar({weekStartOnMonday:0});
	equal(cal.getWeekDay(new Date(2012, 11, 31)), 1, "Monday is second day of week");
});

/*
	-----------------------------------------------------------------
	SETTINGS
	-----------------------------------------------------------------
 */

module( "Settings" );

test("Allow only valid domain", function() {

	expect(9);

	var domains = ["hour", "day", "week", "month", "year"];

	for(var i = 0, total = domains.length; i < total; i++) {
		var cal = createCalendar({range:1});
		ok(cal.init({domain:domains[i]}), domains[i] + " is a valid domain");
	}

	var c = createCalendar({});

	equal(c.init({domain:"min"}), false, "Min is a valid subdomain but not a valid domain");
	equal(c.init({domain:"x_hour"}), false, "x_hour is a valid subdomain but not a valid domain");
	equal(c.init({domain:"notvalid"}), false, "Fail when domain is not valid");
	equal(c.init({domain:null}), false, "Fail when domain is null");

});

test("Allow only known subDomain", function() {

	expect(13);

	var subDomains = ["min", "x_min", "hour", "x_hour", "day", "x_day", "week", "x_week", "month", "x_month"];

	for(var i = 0, total = subDomains.length; i < total; i++) {
		var cal = createCalendar({range:1});
		ok(cal.init({subDomain:subDomains[i], domain: "year"}), subDomains[i] + " is a valid subDomain");
	}

	var c = createCalendar({});

	equal(c.init({subDomain:"year", domain: "year"}), false, "Min is a valid domain but not a valid subdomain");
	equal(c.init({subDomain:"notvalid", domain: "month"}), false, "Fail when subdomain is not valid");
	equal(c.init({subDomain:null, domain: "month"}), false, "Fail when subdomain is null");

});

test("SubDomain must be smaller than domain", function() {

	expect(3);

	var c = createCalendar({});

	equal(c.init({subDomain:"min", domain: "month"}), true, "VALID : subdomain is lower level than domain");
	equal(c.init({subDomain:"month", domain: "month"}), false, "NOT VALID : subdomain is same level than domain");
	equal(c.init({subDomain:"year", domain: "month"}), false, "NOT VALID : subdomain is greater level than domain");


});

test("Set default domain and subDomain", function() {
	expect(2);

	var cal = createCalendar({});

	equal(cal.options.domain, "hour", "Default domain is HOUR");
	equal(cal.options.subDomain, "min", "Default subDomain is MIN");
});

test("Set default subDomain according to domain", function() {
	expect(5);

	var cal = createCalendar({domain: "hour"});
	equal(cal.options.subDomain, "min", "HOUR default subDomain is MIN");

	cal = createCalendar({domain: "day"});
	equal(cal.options.subDomain, "hour", "DAY default subDomain is HOUR");

	cal = createCalendar({domain: "week"});
	equal(cal.options.subDomain, "day", "WEEK default subDomain is DAY");

	cal = createCalendar({domain: "month"});
	equal(cal.options.subDomain, "day", "MONTH default subDomain is DAY");

	cal = createCalendar({domain: "year"});
	equal(cal.options.subDomain, "month", "YEAR default subDomain is MONTH");
});

test("Allow only valid data type", function() {
	var types = ["json", "txt", "csv"];
	expect(types.length);
	var cal = new CalHeatMap();

	for(var i = 0, total = types.length; i < total; i++) {
		ok(cal.init({range:1, dataType: types[i], loadOnInit: false, paintOnLoad: false}), types[i] + " is a valid domain");
	}
});

test("Don't allow not valid data type", function() {
	var types = ["min", "html", "jpg"];
	expect(types.length);
	var cal = new CalHeatMap();

	for(var i = 0, total = types.length; i < total; i++) {
		equal(cal.init({dataType: types[i]}), false, types[i] + " is not a valid domain");
	}
});

test("itemSelector accept a valid document.querySelector or CSS3 string value", function() {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	expect(10);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: "#a", paintOnLoad: false}), true, "#a is a valid itemSelector");
	equal($("#a .graph").length, 1, "Graph is appended to #a");

	equal(cal.init({itemSelector: "#a + #b", paintOnLoad: false}), true, "#a + #b is a valid itemSelector");
	equal($("#b .graph").length, 1, "Graph is appended to #a + #b");

	equal(cal.init({itemSelector: "div[data=y]", paintOnLoad: false}), true, "div[data=y] is a valid itemSelector");
	equal($("div[data=y] .graph").length, 1, "Graph is appended to div[data=y]");

	equal(cal.init({itemSelector: ".u", paintOnLoad: false}), true, ".u is a valid itemSelector");
	equal($(".u .graph").length, 1, "Graph is appended to .u");

	equal(cal.init({itemSelector: "#test div:last-child", paintOnLoad: false}), true, "#test div:last-child is a valid itemSelector");
	equal($("#last .graph").length, 1, "Graph is appended to #test div:last-child");

	$("#test").remove();
});

test("itemSelector accept a valid Element object", function() {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	expect(10);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: document.querySelector("#a"), paintOnLoad: false}), true, "document.querySelector(\"#a\") is a valid itemSelector");
	equal($("#a .graph").length, 1, "Graph is appended to #a");

	equal(cal.init({itemSelector: $("#b")[0], paintOnLoad: false}), true, "$(\"#b\")[0] is a valid itemSelector");
	equal($("#b .graph").length, 1, "Graph is appended to #b");

	equal(cal.init({itemSelector: document.getElementById("last"), paintOnLoad: false}), true, "document.getElementById(\"last\") is a valid itemSelector");
	equal($("#last .graph").length, 1, "Graph is appended to #last");

	equal(cal.init({itemSelector: document.getElementsByClassName("u")[0], paintOnLoad: false}), true, "document.getElementsByClassName(\".u\") is a valid itemSelector");
	equal($(".u .graph").length, 1, "Graph is appended to .u");

	equal(cal.init({itemSelector: d3.select("[data=y]")[0][0], paintOnLoad: false}), true, "d3.select(\"[data=y]\")[0][0] is a valid itemSelector");
	equal($("div[data=y] .graph").length, 1, "Graph is appended to div[data=y]");

	$("#test").remove();
});

test("itemSelector does not accept invalid values", function() {
	expect(6);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: "", paintOnLoad: false}), false, "Empty string is not a valid itemSelector");
	equal(cal.init({itemSelector: [], paintOnLoad: false}), false, "Empty array is not a valid itemSelector");
	equal(cal.init({itemSelector: 125.69, paintOnLoad: false}), false, "Float is not a valid itemSelector");
	equal(cal.init({itemSelector: 125, paintOnLoad: false}), false, "Integer is not a valid itemSelector");
	equal(cal.init({itemSelector: {}, paintOnLoad: false}), false, "Empty object is not a valid itemSelector");
	equal(cal.init({itemSelector: function() {}, paintOnLoad: false}), false, "Function is not a valid itemSelector");
});

test("itemSelector target does not exists", function() {
	expect(1);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: "#test", paintOnLoad: false}), false, "Die when target itemSelector does not exists");
});

test("Domain Margin can takes various format", function() {
	expect(7);

	var a = [0, 2, 3, 4];

	var cal = createCalendar({domainMargin: a});
	equal(cal.options.domainMargin, a, "Array of 4");

	cal.init({domainMargin: 5, paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,5,5,5].toString(), "Fill the array with the specified values");

	cal.init({domainMargin: [], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [0,0,0,0].toString(), "Fill array with 0");

	cal.init({domainMargin: [5], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,5,5,5].toString(), "Copy first values of array to the other 3");

	cal.init({domainMargin: [5, 10], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,10,5,10].toString(), "Array of 2 values is expanded to 4");

	cal.init({domainMargin: [5, 10, 15], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,10,15,10].toString(), "Array of 3 values is expanded to 4");

	cal.init({domainMargin: [0,0,0,0,0], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [0,0,0,0].toString(), "Values in array length greater than 4 are ignored");
});

test("Auto align domain label horizontally", function() {
	expect(4);

	var cal = new CalHeatMap();

	cal.init({label: {position: "top"}, paintOnLoad: false});
	equal(cal.options.label.align, "center", "Auto center label when positioned on top");

	cal.init({label: {position: "bottom"}, paintOnLoad: false});
	equal(cal.options.label.align, "center", "Auto center label when positioned on bottom");

	cal.init({label: {position: "left"}, paintOnLoad: false});
	equal(cal.options.label.align, "right", "Auto align label on the right when positioned on the left");

	cal.init({label: {position: "right"}, paintOnLoad: false});
	equal(cal.options.label.align, "left", "Auto align label on the right when positioned on the right");
});

test("Auto align domain label horizontally when rotated", function() {
	expect(2);

	var cal = new CalHeatMap();

	cal.init({label: {rotate: "left"}, paintOnLoad: false});
	equal(cal.options.label.align, "right", "Auto align on the right when rotated to the left");

	cal.init({label: {rotate: "right"}, paintOnLoad: false});
	equal(cal.options.label.align, "left", "Auto align on the left when rotated to the right");

});

test("Setting namespace", function() {
	expect(6);

	var cal = new CalHeatMap();

	cal.init({paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not specified");

	cal.init({itemNamespace: "test", paintOnLoad: false});
	equal(cal.options.itemNamespace, "test", "Namespace can be set via init()");

	cal.init({itemNamespace: "", paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not empty");

	cal.init({itemNamespace: [], paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not valid (array)");

	cal.init({itemNamespace: {}, paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not valid (object)");

	cal.init({itemNamespace: 100, paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not valid (number)");
});

test("Set itemName from a string", function() {
	expect(3);

	var cal = new CalHeatMap();

	cal.init({paintOnLoad: false});
	equal(cal.options.itemName.toString(), ["item", "items"].toString(), "Setting default itemName");

	cal.init({itemName: "car", paintOnLoad: false});
	equal(cal.options.itemName.toString(), ["car", "cars"].toString(), "Expanding itemName from a string");

	cal.init({itemName: ["car"], paintOnLoad: false});
	equal(cal.options.itemName.toString(), ["car", "cars"].toString(), "Expanding itemName from an array");
});



/*
	-----------------------------------------------------------------
	LEGEND
	-----------------------------------------------------------------
 */

module( "Legend" );

test("Basic default legend", function() {

	expect(8);

	var cal = createCalendar({});

	equal(cal.legend(0), "");
	equal(cal.legend(5), "q1");
	equal(cal.legend(10), "q1");
	equal(cal.legend(15), "q2");
	equal(cal.legend(20), "q2");
	equal(cal.legend(25), "q3");
	equal(cal.legend(30), "q3");
	equal(cal.legend(35), "q4");

});

test("Positive custom legend", function() {

	expect(8);

	var cal = createCalendar({legend: [100, 200, 300, 400]});

	equal(cal.legend(0), "");
	equal(cal.legend(50), "q1");
	equal(cal.legend(100), "q1");
	equal(cal.legend(150), "q2");
	equal(cal.legend(200), "q2");
	equal(cal.legend(250), "q3");
	equal(cal.legend(300), "q3");
	equal(cal.legend(350), "q4");

});

test("Positive and negative custom legend", function() {

	expect(8);

	var cal = createCalendar({legend: [-100, 0, 100, 200, 300, 400]});

	equal(cal.legend(-200), "q1");
	equal(cal.legend(-100), "q1");
	equal(cal.legend(-50), "q2");
	equal(cal.legend(0), "q2");
	equal(cal.legend(50), "q3");
	equal(cal.legend(100), "q3");
	equal(cal.legend(150), "q4");
	equal(cal.legend(200), "q4");

});

test("Float value custom legend", function() {

	expect(9);

	var cal = createCalendar({legend: [0.1, 0.2, 0.3]});

	equal(cal.legend(-100), "qi");
	equal(cal.legend(0), "");
	equal(cal.legend(0.1), "q1");
	equal(cal.legend(0.15), "q2");
	equal(cal.legend(0.2), "q2");
	equal(cal.legend(0.25), "q3");
	equal(cal.legend(0.3), "q3");
	equal(cal.legend(0.35), "q4", "Classes top at q3, since legend contains only 3 items");
	equal(cal.legend(0.4), "q4", "Classes top at q3, since legend contains only 3 items");

});

test("Null value", function() {

	expect(3);

	var cal = createCalendar({});

	equal(cal.legend(null), "");
	equal(cal.legend(0), "");
	equal(cal.legend(1), "q1");

});

test("Not a number", function() {

	expect(4);

	var cal = createCalendar({});

	equal(cal.legend("Hello"), "qi");
	equal(cal.legend({}), "qi");
	equal(cal.legend(0), "");
	equal(cal.legend(1), "q1");

});

/*
	-----------------------------------------------------------------
	Callback
	-----------------------------------------------------------------
 */

module( "Callback" );

test("OnClick", function() {

	expect(2);

	var testFunction = function(date, itemNb) { return {d:date, i:itemNb}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);

	var response = cal.onClick(date, 58);

	equal(response.i, 58);
	equal(response.d.getTime(), date.getTime());

});

test("afterLoad", function() {

	expect(1);

	$("#cal-heatmap").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("#cal-heatmap").data("test", finalString); };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: testFunction, paintOnLoad: true});

	equal($("#cal-heatmap").data("test"), finalString);
});

test("onComplete", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: true});

	equal($("body").data("test"), finalString);
});

test("onComplete is ran even on loadOnInit = false", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: false});

	equal($("body").data("test"), finalString);
});

test("onComplete does not run with paintOnLoad = false", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: false});

	equal($("body").data("test"), "Dummy Data");
});

test("afterLoadPreviousDomain", function() {

	expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var previousDomainStart = new Date(2012, 0, 1, 20);
	var previousDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadPreviousDomain(date);

	equal(response.start.getTime(), previousDomainStart.getTime(), "Callback return first subdomain of the date");
	equal(response.end.getTime(), previousDomainEnd.getTime(), "Callback return last subdomain of the date");
});

test("afterLoadNextDomain", function() {

	expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var nextDomainStart = new Date(2012, 0, 1, 20);
	var nextDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadNextDomain(date);

	equal(response.start.getTime(), nextDomainStart.getTime(), "Callback return first subdomain of the date");
	equal(response.end.getTime(), nextDomainEnd.getTime(), "Callback return last subdomain of the date");
});

test("onClick is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: {}});
	equal(cal.onClick(), false);
});

test("onClick is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: "string"});
	equal(cal.onClick(), false);
});

test("afterLoad is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: {}});
	equal(cal.afterLoad(), false);
});

test("afterLoad is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: "null"});
	equal(cal.afterLoad(), false);
});

test("afterLoadNextDomain is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: "null"});
	equal(cal.afterLoadNextDomain(), false);
});

test("afterLoadPreviousDomain is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: "null"});
	equal(cal.afterLoadPreviousDomain(null), false);
});

test("onComplete is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: {}, loadOnInit: true});
	equal(cal.onComplete(), false);
});

test("onComplete is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: "null", loadOnInit: true});
	equal(cal.onComplete(), false);
});

test("afterLoadData callback", function() {
	expect(4);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = [];
	datas.push({date: date1, value: 15});	// 15 events for 00:00
	datas.push({date: date2, value: 25});	// 25 events for 01:00
	datas.push({date: date3, value: 1});	// 01 events for 01:01

	var parser = function(data) {
		var stats = {};
		for (var d in data) {
			stats[data[d].date] = data[d].value;
		}
		return stats;
	};

	var cal = createCalendar({data: datas, start: new Date(2000, 0, 1, 1), afterLoadData: parser, domain: "hour", subDomain: "min"});

	var calDatas = cal.parseDatas(datas);

	equal(Object.keys(calDatas).length, 1, "Only datas for 1 hour");
	equal(calDatas.hasOwnProperty(date1*1000), false, "Datas for the first hour are filtered out");
	equal(calDatas.hasOwnProperty(date2*1000), true, "Only datas for the second hours remains");
	equal(Object.keys(calDatas[date2*1000]).length, 2, "Hours contains datas for 2 minutes");
});

test("afterLoadData is not a valid callback", function() {
	expect(1);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = [];
	datas.push({date: date1, value: 15});	// 15 events for 00:00
	datas.push({date: date2, value: 25});	// 25 events for 01:00
	datas.push({date: date3, value: 1});	// 01 events for 01:01

	var parser = "";
	var cal = createCalendar({data: datas, start: new Date(2000, 0, 1, 1), afterLoadData: parser, domain: "hour", subDomain: "min"});

	equal(true, $.isEmptyObject(cal.parseDatas(datas)), "parseDatas return an empty object");
});


/*
	-----------------------------------------------------------------
	PAINTING
	-----------------------------------------------------------------
 */


module( "Painting" );

test("Display empty calendar", function() {

	expect(4);

	var cal = createCalendar({paintOnLoad: true});

	equal($("#cal-heatmap .graph").length, 1, "Calendar was created");
	equal($("#cal-heatmap .graph .graph-subdomain-group").length, 12, "The graph contains 12 hours");
	equal($("#cal-heatmap .graph .graph-subdomain-group rect").length, 60*12, "The graph contains 720 minutes");
	equal($("#cal-heatmap .graph-legend").length, 1, "A legend is created");
});

test("Don't display legend", function() {

	expect(1);

	var cal = createCalendar({displayLegend: false, paintOnLoad: true});

	equal($("#cal-heatmap .graph-legend").length, 0, "The legend is not created");
});


test("Display domain according to range number", function() {

	expect(1);

	var cal = createCalendar({range: 5, paintOnLoad: true});

	equal($("#cal-heatmap .graph .graph-subdomain-group").length, 5, "The graph contains only 5 hours");

});

test("Append graph to the passed DOM ID", function() {

	expect(2);

	$("body").append("<div id=test-container style='display:hidden;'></div>");

	var cal = createCalendar({itemSelector: "#test-container", paintOnLoad: true});

	equal($("#test-container .graph").length, 1, "The graph is added to the specified ID");
	equal($("#cal-heatmap .graph").length, 0, "Default ID is empty");

	$("#test-container").remove();

});

test("Attach events to next and previous selector on default namespace", function() {

	expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector");
	equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector");
});

test("Attach events to next and previous selector on custom namespace", function() {

	expect(4);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	var cal2 = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous",
		itemNamespace: "ns2"
	});

	equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector on default namespace");
	equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector on default namespace");
	equal(typeof d3.select("#next").on("click.ns2"), "function", "loadNextDomain is attached to nextSelector on custom namespace");
	equal(typeof d3.select("#previous").on("click.ns2"), "function", "loadPreviousDomain is attached to previousSelector on custom namespace");
});

test("Attach events to not-valid namespace fallback to default namespace", function() {

	expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous",
		itemSelector: ""
	});

	equal(typeof d3.select("#next").on("click.cal-heatmap"), "function", "loadNextDomain is attached to defaultNamespace");
	equal(typeof d3.select("#previous").on("click.cal-heatmap"), "function", "loadPreviousDomain is attached to defaultNamespace");
});

test("Fill subdomain only if there is data", function() {

	expect(1);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, paintOnLoad: true});
	var response = cal.fill(datas, cal.svg);

	equal(response, true);
});

test("Don't fill subdomain if data equal to false", function() {

	expect(1);

	var cal = createCalendar({data: false});
	var response = cal.fill(false, cal.svg);

	equal(response, false);
});

test("Custom date formatting with d3.js internal formatter", function() {

	expect(1);

	var date = new Date(2000, 0, 5);
	var datas = {};
	datas[date.getTime()/1000] = 15;

	var cal = createCalendar({data: datas, start: date, loadOnInit: true, paintOnLoad: true, format: {title: "==%B==", label: "", date: ""}});

	equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, "==January==");

});

test("Custom date formatting with custom function", function() {

	expect(1);

	var date = new Date(2000, 0, 5);
	var datas = {};
	datas[date.getTime()/1000] = 15;

	var cal = createCalendar({data: datas, start: date, loadOnInit: true, paintOnLoad: true, format: {title: function(date) { return date.getTime();}, label: "", date: ""}});

	equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, date.getTime());
});

test("Cell radius is applied", function() {

	expect(2);

	var radius = 15;

	var cal = createCalendar({paintOnLoad: true, domain: "day", subDomain: "hour", cellRadius: radius});

	equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "rx"), radius, "Horizontal cellRadius applied");
	equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "ry"), radius, "Vertical cellRadius applied");
});

/*
	-----------------------------------------------------------------
	DATA SOURCE
	-----------------------------------------------------------------
 */

module( "Data Source property parsing" );

test("Data Source is undefined", function() {
	expect(1);

	var datas;
	var cal = createCalendar({data: datas});

	equal(cal.getDatas(datas), false);
});

test("Data Source is invalid : number", function() {
	expect(1);

	var datas = 2560;
	var cal = createCalendar({data: datas});
	equal(cal.getDatas(datas), false);
});



test("Data Source is a regular string", function() {
	expect(1);

	var datas = "regular string";
	var cal = createCalendar({data: datas});

	equal(cal.getDatas(datas, new Date(), new Date()), true, "True is returned, datas is loaded via d3.json callback");
});

test("Data Source is a en empty string", function() {
	expect(1);

	var datas = "";
	var cal = createCalendar({data: datas});

	equal(cal.getDatas(datas), false);
});

/*
	-----------------------------------------------------------------
	DATA SOURCE PARSING
	-----------------------------------------------------------------
 */

module( "Interpreting Data source template" );

test("Data Source is a string", function() {
	expect(1);

	var filePath = "path/to/file.html";

	var cal = createCalendar({data: filePath});
	equal(
		cal.parseURI(filePath, new Date(cal._domains[0]), new Date(cal._domains[cal._domains.length-1])),
		filePath,
		"Data source is left as is"
	);
});


test("Data Source is a regex string, replace by timestamp", function() {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{t:start}}&end={{t:end}}";

	var parsedUri = "get?start=" + cal._domains[0]/1000 + "&end=" + cal._domains[cal._domains.length-1]/1000;

	equal(cal.parseURI(uri, new Date(cal._domains[0]), new Date(cal._domains[cal._domains.length-1])), parsedUri, "Start and end token was replaced by a timestamp : " + parsedUri);
});

test("Data Source is a regex string, replace by ISO-8601 Date", function() {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{d:start}}&end={{d:end}}";

	var startDate = new Date(cal._domains[0]);
	var endDate = new Date(cal._domains[cal._domains.length-1]);

	var parsedUri = "get?start=" + startDate.toISOString() + "&end=" + endDate.toISOString();

	equal(cal.parseURI(uri, new Date(cal._domains[0]), new Date(cal._domains[cal._domains.length-1])), parsedUri, "Start and end token was replaced by a string : " + parsedUri);
});

/*
	-----------------------------------------------------------------
	DATA PARSING
	-----------------------------------------------------------------
 */

module( "Data processing" );

test("Grouping datas by hour>min", function() {
	expect(6);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: date});

	var calDatas = cal.parseDatas(datas);

	equal(Object.keys(calDatas).length, 2, "Only datas for 2 hours");
	equal(Object.keys(calDatas[date1*1000]).length, 1, "First hour contains 1 event");
	equal(Object.keys(calDatas[date2*1000]).length, 2, "Second hour contains 2 events");
	equal(calDatas[date1*1000]["0"], 15);
	equal(calDatas[date2*1000]["0"], 25);
	equal(calDatas[date2*1000]["1"], 1);
});

test("Grouping datas by day>hour", function() {
	expect(2);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: date, domain: "day", subDomain: "hour"});

	var calDatas = cal.parseDatas(datas);

	equal(Object.keys(calDatas).length, 1, "Only datas for 1 day");
	equal(Object.keys(calDatas[date1*1000]).length, 2, "Day contains datas for 2 hours");

});

test("Filter out datas not relevant to calendar domain", function() {
	expect(4);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: new Date(2000, 0, 1, 1), domain: "hour", subDomain: "min"});

	var calDatas = cal.parseDatas(datas);

	equal(Object.keys(calDatas).length, 1, "Only datas for 1 hour");
	equal(calDatas.hasOwnProperty(date1*1000), false, "Datas for the first hour are filtered out");
	equal(calDatas.hasOwnProperty(date2*1000), true, "Only datas for the second hours remains");
	equal(Object.keys(calDatas[date2*1000]).length, 2, "Hours contains datas for 2 minutes");

});

function createCalendar(settings) {

	$("#cal-heatmap").remove();

	$("body").append("<div id='cal-heatmap' style='display:none;'></div>");

	var cal = new CalHeatMap();
	settings.loadOnInit = false;
	settings.animationDuration = 0;

	if (!settings.hasOwnProperty("paintOnLoad")) {
		settings.paintOnLoad = false;
	}

	cal.init(settings);

	return cal;
}
