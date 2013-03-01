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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, range: 1, start: date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, range: 1, start: date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "day", range:1, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "day", range:1, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "week", range: 1, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "week", range: 1, start : date});
	var domain = cal.getDomain(date);

	equal(domain.length, 1, "Domain size is 1 week");

	equal(domain[0].getFullYear(), weekStart.getFullYear(), "Domain start year is equal to the weeks monday's year");
	equal(domain[0].getMonth(), weekStart.getMonth(), "Domain start month is equal to weeks monday's month");
	equal(domain[0].getDate(), weekStart.getDate(), "Domain start day is equal to the weeks monday date");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is 1 WEEK, from a timestamp", function() {

	expect(6);

	var date      = new Date(2013, 1, 20, 20, 15);	// Wednesday : February 20th, 2013
	var weekStart = new Date(2013, 1, 18);			// Monday : February 18th, 2013

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "week", range: 1, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "month", range: 1, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "month", range: 1, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "year", range: 1, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "year", range: 1, start : date});
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
	DOMAIN TESTS WHEN FOR GREATER DOMAIN RANGE
	-----------------------------------------------------------------
 */

module( "Domain greater than 1" );

test("get domain when domain is > 1 HOUR", function() {

	expect(11);

	var date     = new Date(2003, 10, 31, 20, 26);
	var nextHour = new Date(2003, 10, 31, 22);

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, range: 3, start: date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "day", range: 8, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "week", range: 3, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "month", range: 2, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "year", range: 2, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "hour", range: 3, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "hour", range: 3, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "day", range: 3, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "day", range: 3, start : date});
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
	var weekEnd   = new Date(2012, 11, 3);		// Monday of the last week of the domain

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "week", range: 6, start : date});
	var domain = cal.getDomain(date);
	var domainEnd = domain[domain.length-1];

	equal(domain.length, 6, "Domain size is 6 weeks");

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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "week", range: 2, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "month", range: 3, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "day", subDomain: "hour", range: 1});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "month", subDomain: "day", range: 1});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "year", subDomain: "month", range: 1});
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "hour", subDomain: "min", range: 3});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1, 10);
	var endDate = new Date(2013, 0, 1, 12);

	equal(domain.length, 3, "Domain is equal to 3 hours");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "day", subDomain: "hour", range: 3});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	equal(domain.length, 3, "Domain is equal to 3 days");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "day", subDomain: "min", range: 3});
	var domain = cal.getDomain(date);
	var subDomain = cal.getSubDomain(date);

	var startDate = new Date(2013, 0, 1, 0);
	var endDate = new Date(2013, 0, 3, 0);

	equal(domain.length, 3, "Domain is equal to 3 days");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "week", subDomain: "day", range: 3});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 14);

	equal(domain.length, 3, "Domain is equal to 3 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "week", subDomain: "hour", range: 2});
	var domain = cal.getDomain(date);

	var startDate = new Date(2012, 11, 31);
	var endDate = new Date(2013, 0, 7);

	equal(domain.length, 2, "Domain is equal to 2 weeks");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

test("MONTH -> WEEK", function() {

	expect(9);

	var date = new Date(2013, 0, 1, 15, 26);

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "month", subDomain: "week", range: 3});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	equal(domain.length, 3, "Domain is equal to 3 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "month", subDomain: "day", range: 3});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 2);

	equal(domain.length, 3, "Domain is equal to 3 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "month", subDomain: "hour", range: 2});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2013, 1);

	equal(domain.length, 2, "Domain is equal to 2 months");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

test("YEAR -> MONTH", function() {

	expect(9);

	var date = new Date(2013, 6, 1, 15, 26);

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "year", subDomain: "month", range: 2});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	equal(domain.length, 2, "Domain is equal to 2 years");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "year", subDomain: "week", range: 1});
	var domain = cal.getDomain(date);

	var startDate = new Date(date.getFullYear(), 0);
	var endDate = new Date(date.getFullYear()+1, 0, 0);

	equal(domain.length, 1, "Domain is equal to 1 year");
	equal(domain[0].getTime(), startDate.getTime(), "Domain start the monday of the first week of the week");

	cal.svg.each(function(domainStartDate){
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

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, start : date, domain: "year", subDomain: "day", range: 2});
	var domain = cal.getDomain(date);

	var startDate = new Date(2013, 0);
	var endDate = new Date(2014, 0);

	equal(domain.length, 2, "Domain is equal to 2 years");
	equal(domain[0].getTime(), startDate.getTime());
	equal(domain[domain.length-1].getTime(), endDate.getTime());

	cal.svg.each(function(domainStartDate){
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
	OTHER DATE COMPUTATION
	-----------------------------------------------------------------
 */

module( "Date computation" );

test("Get end of month, from a date", function() {

	expect(1);

	var cal = new CalHeatMap();

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	equal(cal.getEndOfMonth(date).getTime(), endOfMonth.getTime());
});


test("Get end of month, from a timestamp", function() {

	expect(1);

	var cal = new CalHeatMap();

	var date = new Date(2013, 0, 25);
	var endOfMonth = new Date(2013, 1, 0);

	equal(cal.getEndOfMonth(date.getTime()).getTime(), endOfMonth.getTime());
});

/*
	-----------------------------------------------------------------
	SETTINGS
	-----------------------------------------------------------------
 */

module( "Settings" );

test("Allow only valid domain", function() {

	expect(8);

	var cal = new CalHeatMap();

	ok(cal.init({domain:"hour", loadOnInit: false}), "Hour is a valid domain");
	ok(cal.init({domain:"day", loadOnInit: false}), "Day is a valid domain");
	ok(cal.init({domain:"week", loadOnInit: false}), "Week is a valid domain");
	ok(cal.init({domain:"month", loadOnInit: false}), "Month is a valid domain");
	ok(cal.init({domain:"year", loadOnInit: false}), "Year is a valid domain");

	equal(cal.init({domain:"min", loadOnInit: false}), false, "Min is a valid subdomain but not a valid domain");
	equal(cal.init({domain:"notvalid", loadOnInit: false}), false, "Fail when domain is not valid");
	equal(cal.init({domain:null, loadOnInit: false}), false, "Fail when domain is null");

});

/*
	-----------------------------------------------------------------
	SCALE
	-----------------------------------------------------------------
 */

module( "Scale" );

test("Basic default scale", function() {

	expect(8);

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false});

	equal(cal.scale(0), "");
	equal(cal.scale(5), "q1");
	equal(cal.scale(10), "q1");
	equal(cal.scale(15), "q2");
	equal(cal.scale(20), "q2");
	equal(cal.scale(25), "q3");
	equal(cal.scale(30), "q3");
	equal(cal.scale(35), "q4");

});

test("Positive custom scale", function() {

	expect(8);

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, scales: [100, 200, 300, 400]});

	equal(cal.scale(0), "");
	equal(cal.scale(50), "q1");
	equal(cal.scale(100), "q1");
	equal(cal.scale(150), "q2");
	equal(cal.scale(200), "q2");
	equal(cal.scale(250), "q3");
	equal(cal.scale(300), "q3");
	equal(cal.scale(350), "q4");

});

test("Positive and negative custom scale", function() {

	expect(8);

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, scales: [-100, 0, 100, 200, 300, 400]});

	equal(cal.scale(-200), "q1");
	equal(cal.scale(-100), "q1");
	equal(cal.scale(-50), "q2");
	equal(cal.scale(0), "q2");
	equal(cal.scale(50), "q3");
	equal(cal.scale(100), "q3");
	equal(cal.scale(150), "q4");
	equal(cal.scale(200), "q4");

});

test("Float value custom scale", function() {

	expect(9);

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, scales: [0.1, 0.2, 0.3]});

	equal(cal.scale(-100), "qi");
	equal(cal.scale(0), "");
	equal(cal.scale(0.1), "q1");
	equal(cal.scale(0.15), "q2");
	equal(cal.scale(0.2), "q2");
	equal(cal.scale(0.25), "q3");
	equal(cal.scale(0.3), "q3");
	equal(cal.scale(0.35), "q3", "Classes top at q3, since scales contains only 3 items");
	equal(cal.scale(0.4), "q3", "Classes top at q3, since scales contains only 3 items");

});

/*
	-----------------------------------------------------------------
	SVG POSITIONNING
	-----------------------------------------------------------------
 */

module( "Event" );

test("OnClick", function() {

	expect(2);

	var testFunction = function(date, itemNb) { return {d:date, i:itemNb}; };

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, domain: "hour", subDomain: "min", range:1, onClick: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);

	var response = cal.onClick(date, 58);

	equal(response.i, 58);
	equal(response.d.getTime(), date.getTime());

});

/*
	-----------------------------------------------------------------
	PAINTING
	-----------------------------------------------------------------
 */


module( "Painting" );

test("Display empty calendar", function() {

	expect(4);

	// Cleaning the dom
	$("#cal-heatmap").empty();
	$("#test-container").empty();

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false});

	equal($("#cal-heatmap .graph").length, 1, "Calendar was created");
	equal($("#cal-heatmap .graph-domain").length, 12, "The graph contains 12 hours");
	equal($("#cal-heatmap .graph-domain rect").length, 60*12, "The graph contains 720 minutes");
	equal($("#cal-heatmap .graph-scale").length, 1, "A scale is created");
});

test("Don't display scale", function() {

	expect(1);

	// Cleaning the dom
	$("#cal-heatmap").empty();
	$("#test-container").empty();

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, displayScale: false});

	equal($("#cal-heatmap .graph-scale").length, 0, "The scale is not created");
});


test("Display domain according to range number", function() {

	expect(1);

	// Cleaning the dom
	$("#cal-heatmap").empty();
	$("#test-container").empty();

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, range: 5});

	equal($("#cal-heatmap .graph-domain").length, 5, "The graph contains only 5 hours");

});

test("Append graph to the passed DOM ID", function() {

	expect(2);

	// Cleaning the dom
	$("#cal-heatmap").empty();
	$("#test-container").empty();

	var cal = new CalHeatMap();
	cal.init({loadOnInit: false, id: "test-container"});

	equal($("#test-container .graph").length, 1, "The graph is added to the specified ID");
	equal($("#cal-heatmap .graph").length, 0, "Default ID is empty");

});

/*
	-----------------------------------------------------------------
	DATA SOURCE
	-----------------------------------------------------------------
 */

module( "Data Source property parsing" );

test("Data Source is undefined", function() {
	expect(1);

	var cal = new CalHeatMap();
	var datas;

	cal.init({data: datas, loadOnInit: false});
	equal(cal.getDatas(datas), false);
});

test("Data Source is invalid : number", function() {
	expect(1);

	var cal = new CalHeatMap();
	var datas = 2560;

	cal.init({data: datas, loadOnInit: false});
	equal(cal.getDatas(datas), false);
});


test("Data Source is a JSON object", function() {
	expect(1);

	var cal = new CalHeatMap();
	var datas = {test: 5};

	cal.init({data: datas, loadOnInit: false});
	equal(cal.getDatas(datas), datas);
});

test("Data Source is a regular string", function() {
	expect(1);

	var cal = new CalHeatMap();
	var datas = "regular string";

	cal.init({data: datas, loadOnInit: false});
	equal(cal.getDatas(datas, new Date(), new Date()), true, "True is returned, datas is loaded via d3.json callback");
});

test("Data Source is a en empty string", function() {
	expect(1);

	var cal = new CalHeatMap();
	var datas = "";

	cal.init({data: datas, loadOnInit: false});
	equal(cal.getDatas(datas), false);
});

/*
	-----------------------------------------------------------------

	-----------------------------------------------------------------
 */

module( "Interpreting Data source template" );

test("Data Source is an URI", function() {
	expect(1);

	var cal = new CalHeatMap();
	var filePath = "path/to/file.json";

	cal.init({data: filePath, loadOnInit: false});
	equal(
		cal.parseURI(filePath, new Date(cal._domains[0]), new Date(cal._domains[cal._domains.length-1])),
		filePath
	);
});


test("Data Source is a regex string, replace by timestamp", function() {

	var cal = new CalHeatMap();
	cal.init({start: new Date(), loadOnInit: false});
	var uri = "get?start={{t:start}}&end={{t:end}}";

	var parsedUri = "get?start=" + cal._domains[0]/1000 + "&end=" + cal._domains[cal._domains.length-1]/1000;

	equal(cal.parseURI(uri, new Date(cal._domains[0]), new Date(cal._domains[cal._domains.length-1])), parsedUri, "Start and end token was replaced by a timestamp : " + parsedUri);
});

test("Data Source is a regex string, replace by ISO-8601 Date", function() {

	var cal = new CalHeatMap();
	cal.init({start: new Date(), loadOnInit: false});
	var uri = "get?start={{d:start}}&end={{d:end}}";

	var startDate = new Date(cal._domains[0]);
	var endDate = new Date(cal._domains[cal._domains.length-1]);

	var parsedUri = "get?start=" + startDate.toISOString() + "&end=" + endDate.toISOString();

	equal(cal.parseURI(uri, new Date(cal._domains[0]), new Date(cal._domains[cal._domains.length-1])), parsedUri, "Start and end token was replaced by a string : " + parsedUri);
});


/*
	-----------------------------------------------------------------
	DATA SOURCE PARSING
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

	var cal = new CalHeatMap();
	cal.init({data: datas, loadOnInit: false, start: date});

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

	var cal = new CalHeatMap();
	cal.init({data: datas, loadOnInit: false, start: date, domain: "day", subDomain: "hour"});

	var calDatas = cal.parseDatas(datas);
	console.log(calDatas);

	equal(Object.keys(calDatas).length, 1, "Only datas for 1 day");
	equal(Object.keys(calDatas[date1*1000]).length, 2, "Day contains datas for 2 hours");

});