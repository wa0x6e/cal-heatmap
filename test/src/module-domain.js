/*
	-----------------------------------------------------------------
	BASIC DOMAIN TESTS
	-----------------------------------------------------------------
 */

QUnit.module( "Domain equal 1" );

QUnit.test("get domain when domain is 1 HOUR", function(assert) {

	assert.expect(6);

	var date     = new Date(2003, 10, 31, 20, 26);

	var cal = createCalendar({range: 1, start: date});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 hour");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

QUnit.test("get domain when domain is 1 HOUR, from a timestamp", function(assert) {

	assert.expect(6);

	var date     = new Date(2003, 10, 31, 20, 26);


	var cal = createCalendar({range: 1, start: date});
	var domain = cal.getDomain(date.getTime());


	assert.equal(domain.length, 1, "Domain size is 1 hour");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

QUnit.test("get domain when domain is 1 DAY", function(assert) {

	assert.expect(6);

	var date    = new Date(2003, 10, 20, 23, 26);

	var cal = createCalendar({domain: "day", range:1, start : date});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 day");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});

QUnit.test("get domain when domain is 1 DAY, from a timestamp", function(assert) {

	assert.expect(6);

	var date    = new Date(2003, 10, 20, 23, 26);

	var cal = createCalendar({domain: "day", range:1, start : date});
	var domain = cal.getDomain(date.getTime());

	assert.equal(domain.length, 1, "Domain size is 1 day");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");
});


QUnit.test("get domain when domain is 1 WEEK, from a date in the middle of the week", function(assert) {

	assert.expect(6);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 week");

	assert.equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	assert.equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	assert.equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 WEEK, from a date right on beginning of the week", function(assert) {

	assert.expect(6);

	var date      = new Date(2013, 1, 18, 20, 15);	// Monday : February 18th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 week");

	assert.equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	assert.equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	assert.equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 WEEK, starting a monday", function(assert) {

	assert.expect(7);

	var date      = new Date(2013, 1, 17, 20, 15);	// Monday : February 18th, 2013
	var weekStart = new Date(2013, 1, 11);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 week");

	assert.equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	assert.equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	assert.equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	assert.equal(domain[0].getDay(), 1, "Domain start is a monday");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 WEEK, starting a sunday", function(assert) {

	assert.expect(7);

	var date      = new Date(2013, 1, 13, 20, 15);	// Wednesday : February 13th, 2013
	var weekStart = new Date(2013, 1, 10);			// Sunday : February 10th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date, weekStartOnMonday: false});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 week");

	assert.equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	assert.equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	assert.equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	assert.equal(domain[0].getDay(), 0, "Domain start is a sunday");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 WEEK, from a timestamp", function(assert) {

	assert.expect(6);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = createCalendar({domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());

	assert.equal(domain.length, 1, "Domain size is 1 week");

	assert.equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	assert.equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	assert.equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 MONTH", function(assert) {

	assert.expect(6);

	var date      = new Date(2003, 10, 25, 23, 26);

	var cal = createCalendar({domain: "month", range: 1, start : date});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 month");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 MONTH, from a timestamp", function(assert) {

	assert.expect(6);

	var date      = new Date(2003, 10, 25, 23, 26);

	var cal = createCalendar({domain: "month", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());

	assert.equal(domain.length, 1, "Domain size is 1 month");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 YEAR", function(assert) {

	assert.expect(6);

	var date     = new Date(2004, 10, 20, 23, 26);

	var cal = createCalendar({domain: "year", range: 1, start : date});
	var domain = cal.getDomain(date);

	assert.equal(domain.length, 1, "Domain size is 1 year");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	assert.equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	assert.equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain is 1 YEAR. from a timestamp", function(assert) {

	assert.expect(6);

	var date     = new Date(2004, 10, 20, 23, 26);

	var cal = createCalendar({domain: "year", range: 1, start : date});
	var domain = cal.getDomain(date.getTime());

	assert.equal(domain.length, 1, "Domain size is 1 year");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	assert.equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	assert.equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

});




/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR GREATER DOMAIN RANGE
	-----------------------------------------------------------------
 */

QUnit.module( "Domain greater than 1" );

QUnit.test("get domain when domain is > 1 HOUR", function(assert) {

	assert.expect(11);

	var date     = new Date(2003, 10, 31, 20, 26);
	var nextHour = new Date(2003, 10, 31, 22);

	var cal = createCalendar({range: 3, start: date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 3, "Domain size is 3 hours");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), nextHour.getFullYear());
	assert.equal(domainEnd.getMonth(), nextHour.getMonth());
	assert.equal(domainEnd.getDate(), nextHour.getDate());
	assert.equal(domainEnd.getHours(), nextHour.getHours());
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain is > 1 DAY", function(assert) {

	assert.expect(11);

	var date    = new Date(2003, 10, 10, 23, 26);
	var nextDay = new Date(2003, 10, 17);

	var cal = createCalendar({domain: "day", range: 8, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 8, "Domain size is 8 days");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), nextDay.getFullYear());
	assert.equal(domainEnd.getMonth(), nextDay.getMonth());
	assert.equal(domainEnd.getDate(), nextDay.getDate());
	assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain is > 1 WEEK", function(assert) {

	assert.expect(11);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekEnd   = new Date(2013, 2, 4);			// Sunday : March 4th, 2013

	var cal = createCalendar({domain: "week", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 3, "Domain size is 3 weeks");

	assert.equal(domain[0].getFullYear(), 2013, "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), 1, "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), 18, "Domain start day is equal to first day of week");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	assert.equal(domainEnd.getMonth(), weekEnd.getMonth());
	assert.equal(domainEnd.getDate(), weekEnd.getDate());
	assert.equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});



QUnit.test("get domain when domain is > 1 MONTH", function(assert) {

	assert.expect(11);

	var date      = new Date(2003, 6, 25, 23, 26);
	var nextMonth = new Date(2003, 7, 1, 0, 0);

	var cal = createCalendar({domain: "month", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 2, "Domain size is 2 months");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), nextMonth.getFullYear());
	assert.equal(domainEnd.getMonth(), nextMonth.getMonth());
	assert.equal(domainEnd.getDate(), nextMonth.getDate());
	assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain is > 1 YEAR", function(assert) {

	assert.expect(11);

	var date     = new Date(2004, 10, 20, 23, 26);
	var nextYear = new Date(2005, 0, 1);

	var cal = createCalendar({domain: "year", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 2, "Domain size is 2 year");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	assert.equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	assert.equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), nextYear.getFullYear());
	assert.equal(domainEnd.getMonth(), nextYear.getMonth());
	assert.equal(domainEnd.getDate(), nextYear.getDate());
	assert.equal(domainEnd.getHours(), nextYear.getHours(), "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), nextYear.getMinutes(), "Domain end minutes is equal to 0");

});

/*
	-----------------------------------------------------------------
	DOMAIN TESTS FOR DOMAIN OVERLAPING NEXT HOUR/DAY/MONTH/YEAR
	-----------------------------------------------------------------
 */

QUnit.module( "Overlapping Domain" );

QUnit.test("get domain when HOUR domain overlap next day", function(assert) {

	assert.expect(11);

	var date = new Date(2003, 10, 20, 23, 26);
	var next = new Date(2003, 10, 21, 1);

	var cal = createCalendar({domain: "hour", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 3, "Domain size is 3 hours");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), next.getFullYear(), "Domain end year is next year");
	assert.equal(domainEnd.getMonth(), next.getMonth(), "Domain end month is next month");
	assert.equal(domainEnd.getDate(), next.getDate(), "Domain end day is a day of next month");
	assert.equal(domainEnd.getHours(), next.getHours(), "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when HOUR domain overlap next month", function(assert) {

	assert.expect(11);

	var date    = new Date(2003, 10, 30, 23, 26);	// 31 October
	var next = new Date(2003, 11, 1, 1);			// 1st November

	var cal = createCalendar({domain: "hour", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 3, "Domain size is 3 hours");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), next.getFullYear(), "Domain end year is next year");
	assert.equal(domainEnd.getMonth(), next.getMonth(), "Domain end month is next month");
	assert.equal(domainEnd.getDate(), next.getDate(), "Domain end day is a day of next month");
	assert.equal(domainEnd.getHours(), next.getHours(), "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when DAY domain overlap next month", function(assert) {

	assert.expect(11);

	var date    = new Date(2003, 0, 30, 23, 26);
	var nextDay = new Date(2003, 1, 1);

	var cal = createCalendar({domain: "day", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 3, "Domain size is 3 days");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), nextDay.getFullYear());
	assert.equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is next month");
	assert.equal(domainEnd.getDate(), nextDay.getDate());
	assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when DAY domain overlap next year", function(assert) {

	assert.expect(11);

	var date    = new Date(2003, 11, 30, 23, 26);
	var nextDay = new Date(2004, 0, 1);

	var cal = createCalendar({domain: "day", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 3, "Domain size is 3 days");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), nextDay.getFullYear(), "Domain end year is next year");
	assert.equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is next month");
	assert.equal(domainEnd.getDate(), nextDay.getDate());
	assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});

QUnit.test("get domain when domain WEEK overlap next month", function(assert) {

	assert.expect(11);

	var date      = new Date(2012, 9, 31, 20, 15);
	var weekStart = new Date(2012, 9, 29);		// Monday of the first week of the domain
	var weekEnd   = new Date(2012, 10, 5);		// Monday of the last week of the domain

	var cal = createCalendar({domain: "week", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 2, "Domain size is 2 weeks");

	assert.equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to first day of week");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	assert.equal(domainEnd.getMonth(), weekEnd.getMonth());
	assert.equal(domainEnd.getDate(), weekEnd.getDate());
	assert.equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when domain WEEK overlap next year", function(assert) {

	assert.expect(11);

	var date      = new Date(2012, 11, 31, 20, 15);
	var weekStart = new Date(2012, 11, 31);		// Monday of the first week of the domain
	var weekEnd   = new Date(2013, 0, 7);		// Monday of the last week of the domain

	var cal = createCalendar({domain: "week", range: 2, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 2, "Domain size is 2 week");

	assert.equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to first day of week");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), weekEnd.getFullYear());
	assert.equal(domainEnd.getMonth(), weekEnd.getMonth());
	assert.equal(domainEnd.getDate(), weekEnd.getDate());
	assert.equal(domainEnd.getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain start minutes is equal to 0");

});

QUnit.test("get domain when MONTH domain overlap next year", function(assert) {

	assert.expect(11);

	var date    = new Date(2003, 11, 30, 23, 26);
	var nextDay = new Date(2004, 1, 1);

	var cal = createCalendar({domain: "month", range: 3, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	assert.equal(domain.length, 3, "Domain size is 3 months");

	assert.equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	assert.equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	assert.equal(domain[0].getDate(), 1, "Domain start day is first day of start month");
	assert.equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	assert.equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	assert.equal(domainEnd.getFullYear(), nextDay.getFullYear(), "Domain end year is next year");
	assert.equal(domainEnd.getMonth(), nextDay.getMonth(), "Domain end month is after 3 month");
	assert.equal(domainEnd.getDate(), nextDay.getDate(), "Domain end day is first day of month");
	assert.equal(domainEnd.getHours(), "0", "Domain end hour is equal to 0");
	assert.equal(domainEnd.getMinutes(), "0", "Domain end minutes is equal to 0");
});


/*
	-----------------------------------------------------------------
	BASIC SUBDOMAIN TESTS
	-----------------------------------------------------------------
 */

QUnit.module( "SubDomain test" );

QUnit.test("get subdomain when subdomain is MIN", function(assert) {

	assert.expect(3);

	var date = new Date(2012, 11, 25, 20, 26);

	var cal = createCalendar({start : date});
	var domain = cal.getSubDomain(date);

	assert.equal(domain.length, 60, "SubDomain size is 60");

	var start = new Date(2012, 11, 25, 20);
	var end = new Date(2012, 11, 25, 20, 59);

	assert.equal(+domain[0], +start, "First element of subdomain is first minute of hour");
	assert.equal(+domain[59], +end, "Last element of subdomain is last minute of hour");

});

QUnit.test("get subdomain when subdomain is HOUR", function(assert) {

	assert.expect(4);

	var date = new Date(2013, 0, 25, 0, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "hour", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 25, 0);
	var endDate = new Date(2013, 0, 25, 23);

	assert.equal(domain.length, 1, "Domain is equal to one day");
	assert.equal(subDomain.length, 24, "SubDomain size is equal to 24 hours");
	assert.equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first hour of day");
	assert.equal(subDomain[23].getTime(), endDate.getTime(), "SubDomain end at last hour of the day");

});

QUnit.test("get subdomain when subdomain is DAY", function(assert) {

	assert.expect(4);

	var date = new Date(2013, 1, 1, 20, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "day", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 1, 1);
	var endDate = new Date(2013, 2, 0);

	assert.equal(domain.length, 1, "Domain is equal to one month");
	assert.equal(subDomain.length, endDate.getDate(), "SubDomain size is equal to number of days in the current month");
	assert.equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first day of month");
	assert.equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "SubDomain end at last day of month");

});




QUnit.test("get subdomain when subdomain is MONTH", function(assert) {

	assert.expect(4);

	var date = new Date(2013, 0, 1, 20, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "month", range: 1});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1);
	var endDate = new Date(2013, 11, 1);

	assert.equal(domain.length, 1, "Domain is equal to 1 year");
	assert.equal(subDomain.length, 12, "SubDomain size is equal to 12 months");
	assert.equal(subDomain[0].getTime(), startDate.getTime(), "Subdomain start at first day of year");
	assert.equal(subDomain[subDomain.length-1].getTime(), endDate.getTime(), "SubDomain end at first day of last month");

});

/*
	-----------------------------------------------------------------
	DOMAIN AND SUBDOMAIN TEST
	-----------------------------------------------------------------
 */

QUnit.module( "Domain and subdomain test" );

QUnit.test("HOUR -> MIN", function(assert) {

	assert.expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "hour", subDomain: "min", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0, 1, 10);
	var endDate = new Date(2013, 0, 1, 12);

	assert.equal(domain.length, 3, "Domain is equal to 3 hours");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		assert.equal(subDomain.length, 60, "The hour subdomain contains 60 minutes");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), domainStartDate.getHours(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), domainStartDate.getHours(), 59);

		assert.equal(subDomain[0].t, startDate.getTime(), "The hour subdomain start is the first minute of hour");
		assert.equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The hour subdomain start is the last minute of hour");
	});

});

QUnit.test("DAY -> HOUR", function(assert) {

	assert.expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "hour", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	assert.equal(domain.length, 3, "Domain is equal to 3 days");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		assert.equal(subDomain.length, 24, "The day subdomain contains 24 hours");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 23);

		assert.equal(subDomain[0].t, startDate.getTime(), "The hour subdomain start is the first hour of day");
		assert.equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The hour subdomain start is the last hour of day");
	});

});


QUnit.test("DAY -> MIN", function(assert) {

	assert.expect(12);

	var date = new Date(2013, 0, 1, 10, 26);

	var cal = createCalendar({start : date, domain: "day", subDomain: "min", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	assert.equal(domain.length, 3, "Domain is equal to 3 days");
	assert.equal(domain[0].getTime(), startDate.getTime(), "First domain start is midnight of first day");
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime(), "Last domain start is midnight of last day");

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();
		assert.equal(subDomain.length, 1440, "The day subdomain contains 1440 minutes");

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 0);
		var endDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate(), 23, 59);

		assert.equal(subDomain[0].t, startDate.getTime(), "The hour subdomain start is the first minute of day");
		assert.equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The hour subdomain start is the last minute of day");
	});

});

QUnit.test("WEEK -> DAY", function(assert) {

	assert.expect(18);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "day", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 14);

	assert.equal(domain.length, 3, "Domain is equal to 3 weeks");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);

		assert.equal(subDomain.length, 7, "The week contains 7 days");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		assert.equal(subDomain[0].t, startDate.getTime(), "The week subdomain start is the first day of week : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, endWeek.getTime(), "The week subdomain end is the last day of week : " + subDomain[subDomain.length-1]);
		assert.equal(new Date(subDomain[0].t).getDay(), 1, "The week start a monday");
		assert.equal(new Date(subDomain[subDomain.length-1].t).getDay(), 0, "The week end a sunday");
	});

});

QUnit.test("WEEK -> HOUR", function(assert) {

	assert.expect(13);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "hour", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 7);

	assert.equal(domain.length, 2, "Domain is equal to 2 weeks");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);
		endWeek.setHours(23);

		var hoursNb = 24 * 7;

		assert.equal(subDomain.length, hoursNb, "The week contains " + hoursNb + " hours");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		assert.equal(subDomain[0].t, startDate.getTime(), "The week subdomain start is the first hour of week : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, endWeek.getTime(), "The week subdomain end is the last hour of week : " + subDomain[subDomain.length-1]);
		assert.equal(new Date(subDomain[0].t).getDay(), 1, "The week start a monday");
		assert.equal(new Date(subDomain[subDomain.length-1].t).getDay(), 0, "The week end a sunday");
	});
});

QUnit.test("WEEK -> MIN", function(assert) {

	assert.expect(13);

	var date = new Date(2013, 0, 2, 15, 26); // Wednesday January 2nd, 2013

	var cal = createCalendar({start : date, domain: "week", subDomain: "min", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 7);

	assert.equal(domain.length, 2, "Domain is equal to 2 weeks");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endWeek = new Date(domainStartDate);
		endWeek.setDate(endWeek.getDate()+6);
		endWeek.setHours(23);
		endWeek.setMinutes(59);

		var minNb = 24 * 7 * 60;

		assert.equal(subDomain.length, minNb, "The week contains " + minNb + " minutes");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		assert.equal(subDomain[0].t, startDate.getTime(), "The week subdomain start is the first minutes of week : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, endWeek.getTime(), "The week subdomain end is the last minute of week : " + subDomain[subDomain.length-1]);
		assert.equal(new Date(subDomain[0].t).getDay(), 1, "The week start a monday");
		assert.equal(new Date(subDomain[subDomain.length-1].t).getDay(), 0, "The week end a sunday");
	});
});


QUnit.test("MONTH -> WEEK", function(assert) {

	assert.expect(9);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "week", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	assert.equal(domain.length, 3, "Domain is equal to 3 months");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());
		if (startDate.getDay() > 1) {
			startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
		} else if (startDate.getDay() === 0) {
			startDate.seDate(startDate.getDate() - 6);
		}

		var endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 28);

		assert.equal(subDomain[0].t, startDate.getTime(), "The month subdomain start is the first day of first week : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, endDate.getTime(), "The month subdomain end is the first day of last week : " + subDomain[subDomain.length-1]);
	});

});

QUnit.test("MONTH -> DAY", function(assert) {

	assert.expect(12);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "day", range: 3, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	assert.equal(domain.length, 3, "Domain is equal to 3 months");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endOfMonth = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth()+1, 0);

		assert.equal(subDomain.length, endOfMonth.getDate(), "The month contains " + endOfMonth.getDate() + " days");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		assert.equal(subDomain[0].t, startDate.getTime(), "The month subdomain start is the first day of month : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, endOfMonth.getTime(), "The month subdomain end is the last day of month : " + subDomain[subDomain.length-1]);
	});

});

QUnit.test("MONTH -> HOUR", function(assert) {

	assert.expect(9);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "month", subDomain: "hour", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 1);

	assert.equal(domain.length, 2, "Domain is equal to 2 months");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);

		var endOfMonth = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth()+1, 0, 23);

		var monthsHoursNb = 24 * endOfMonth.getDate();

		assert.equal(subDomain.length, monthsHoursNb, "The month contains " + monthsHoursNb + " hours");

		var startDate = new Date(domainStartDate.getFullYear(), domainStartDate.getMonth(), domainStartDate.getDate());

		assert.equal(subDomain[0].t, startDate.getTime(), "The month subdomain start is the first hour of month : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, endOfMonth.getTime(), "The month subdomain end is the last hour of month : " + subDomain[subDomain.length-1]);
	});

});

QUnit.test("YEAR -> DAY", function(assert) {

	assert.expect(5);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "day", range: 1, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);

	assert.equal(domain.length, 1, "Domain is equal to 1 year");
	assert.equal(domain[0].getTime(), startDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 11, 31);

		var yearDaysNb = cal.getDayOfYear(domainEndDate);

		assert.equal(subDomain.length, yearDaysNb, "The year contains " + yearDaysNb + " days");
		assert.equal(subDomain[0].t, domainStartDate.getTime(), "The year subdomain start is the first day of first month of year : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, domainEndDate.getTime(), "The year subdomain end is the last day of last month of year : " + subDomain[subDomain.length-1]);
	});

});

QUnit.test("YEAR -> MONTH", function(assert) {

	assert.expect(9);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "month", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	assert.equal(domain.length, 2, "Domain is equal to 2 years");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 11);

		assert.equal(subDomain.length, 12, "The year contains 12 months");
		assert.equal(subDomain[0].t, domainStartDate.getTime(), "The year subdomain start is the first month of year : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, domainEndDate.getTime(), "The year subdomain end is the last month of year : " + subDomain[subDomain.length-1]);
	});

});

QUnit.test("YEAR -> WEEK", function(assert) {

	assert.expect(4);

	var date = new Date(2005, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "week", range: 1, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(date.getFullYear(), 0);
	var endDate = new Date(date.getFullYear()+1, 0, 0);

	assert.equal(domain.length, 1, "Domain is equal to 1 year");
	assert.equal(domain[0].getTime(), startDate.getTime(), "Domain start the monday of the first week of the week");

	cal.svg().selectAll("svg").each(function(d){
		var subDomain = d3.select(this).selectAll("rect").data();

		var domainStartDate = new Date(+d);
		var weekNb = cal.getWeekNumber(endDate);


		if (domainStartDate.getDay() > 1) {
			domainStartDate.setDate(domainStartDate.getDay()*-1+2);
		} else if (domainStartDate.getDay() === 0) {
			domainStartDate.setDate(-6);
		}

		assert.equal(subDomain.length, weekNb, "The year contains " + weekNb + " weeks");
		assert.equal(subDomain[0].t, domainStartDate.getTime(), "The year subdomain start is the first week of year : " + subDomain[0].t);
		//assert.equal(subDomain[subDomain.length-1].getTime(), domainEndDate.getTime(), "The year subdomain end is the last week of year : " + subDomain[subDomain.length-1]);
	});

});


QUnit.test("YEAR -> DAY", function(assert) {

	assert.expect(9);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = createCalendar({start : date, domain: "year", subDomain: "day", range: 2, paintOnLoad: true});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	assert.equal(domain.length, 2, "Domain is equal to 2 years");
	assert.equal(domain[0].getTime(), startDate.getTime());
	assert.equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg().selectAll("svg").each(function(domainStartDate){
		var subDomain = d3.select(this).selectAll("rect").data();

		domainStartDate = new Date(domainStartDate);
		var domainEndDate = new Date(domainStartDate.getFullYear(), 12, 0);
		var nbDaysInYear = cal.getDayOfYear(domainEndDate);

		assert.equal(subDomain.length, nbDaysInYear, "The year " + domainStartDate.getFullYear() + " contains " + nbDaysInYear + " days");
		assert.equal(subDomain[0].t, domainStartDate.getTime(), "The year " + domainStartDate.getFullYear() + " subdomain start is the first day of year : " + subDomain[0]);
		assert.equal(subDomain[subDomain.length-1].t, domainEndDate.getTime(), "The year " + domainStartDate.getFullYear() + " subdomain end is the last day of year : " + subDomain[subDomain.length-1]);
	});

});

/*
	-----------------------------------------------------------------
	NEXT AND PREVIOUS DOMAIN
	-----------------------------------------------------------------
 */

QUnit.module( "Next and previous domain" );

QUnit.test("get next domain", function(assert) {

	assert.expect(3);

	var date = new Date(2000, 0, 1);

	var cal = createCalendar({start: date});
	var domain = cal.getDomain(date.getTime());

	var nextDomain = cal.getNextDomain();

	var domainEnd = date.setHours(date.getHours() + 11);
	var expectedNextDomain = new Date(domainEnd);
	expectedNextDomain.setHours(expectedNextDomain.getHours() + 1);

	assert.equal(domain.length, 12, "Domain contains 12 hours");
	assert.equal(domain[domain.length-1].getTime(), domainEnd, "Domain end at " + new Date(domainEnd));
	assert.equal(nextDomain.getTime(), expectedNextDomain.getTime(), "Next domain is " + expectedNextDomain);
});

QUnit.test("get previous domain", function(assert) {

	assert.expect(3);

	var date = new Date(2000, 0, 1, 2);

	var cal = createCalendar({start: date});
	var domain = cal.getDomain(date.getTime());

	var previousDomain = cal.getPreviousDomain();

	var domainStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
	var expectedPreviousDomain = new Date(domain[0]);
	expectedPreviousDomain.setHours(expectedPreviousDomain.getHours() - 1);

	assert.equal(domain.length, 12, "Domain contains 12 hours");
	assert.equal(domain[0].getTime(), domainStart.getTime(), "Domain start at " + domainStart);
	assert.equal(previousDomain.getTime(), expectedPreviousDomain.getTime(), "previous domain is " + expectedPreviousDomain);
});


/*
	-----------------------------------------------------------------
	OTHER DATE COMPUTATION
	-----------------------------------------------------------------
 */

QUnit.module( "Date computation" );

QUnit.test("Get end of month, from a date", function(assert) {

	assert.expect(1);

	var cal = createCalendar({});

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	assert.equal(cal.getEndOfMonth(date).getTime(), endOfMonth.getTime());
});


QUnit.test("Get end of month, from a timestamp", function(assert) {

	assert.expect(1);

	var cal = createCalendar({});

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	assert.equal(cal.getEndOfMonth(date.getTime()).getTime(), endOfMonth.getTime());
});

QUnit.test("Get the day of the year", function(assert) {

	assert.expect(4);

	var cal = createCalendar({});

	assert.equal(cal.getDayOfYear(new Date(2013, 0)), 1, "Getting the first day of year 2013");
	assert.equal(cal.getDayOfYear(new Date(2013, 11, 31)), 365, "Getting the last day of year 2013");
	assert.equal(cal.getDayOfYear(new Date(2016, 0)), 1, "Getting the first day of (leap) year 2016");
	assert.equal(cal.getDayOfYear(new Date(2016, 11, 31)), 366, "Getting the last day of (leap) year 2016");
});


QUnit.test("Week start on Monday", function(assert) {

	assert.expect(1);

	var cal = createCalendar({weekStartOnMonday: true});

	assert.equal(cal.getWeekDay(new Date(2012, 11, 31)), 0, "Monday is first day of week");
});

QUnit.test("Week start on Sunday", function(assert) {

	assert.expect(1);

	var cal = createCalendar({weekStartOnMonday: false});
	assert.equal(cal.getWeekDay(new Date(2012, 11, 31)), 1, "Monday is second day of week");
});
