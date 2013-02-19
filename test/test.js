/*globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,
    notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test,CalHeatMap */

module( "Basic Date function" );

test("get subdomain when subdomain is MIN", function() {

	expect(3);

	var date = new Date(2012, 11, 25, 20, 26);

	CalHeatMap.init({loadOnInit: false, domain: "min", range: 1, start : date});
	var domain = CalHeatMap.getSubDomain(date);

	equal(domain.length, 60, "SubDomain size is 60");

	var start = new Date(2012, 11, 25, 20);
	var end = new Date(2012, 11, 25, 20, 59);

	equal(+domain[0], +start, "First element of subdomain is first minute of hour");
	equal(+domain[59], +end, "Last element of subdomain is last minute of hour");

});

test("get domain when domain is HOUR", function() {

	expect(10);

	var date = new Date(2003, 10, 31, 20, 26);
	var nextHour = new Date(2003, 10, 31, 21, 0);
	CalHeatMap.init({loadOnInit: false, domain: "hour", range: 1, start : date});
	var domain = CalHeatMap.getDomain(date);

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), date.getHours(), "Domain start hour is equal to date hour");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domain[1].getFullYear(), nextHour.getFullYear());
	equal(domain[1].getMonth(), nextHour.getMonth());
	equal(domain[1].getDate(), nextHour.getDate());
	equal(domain[1].getHours(), nextHour.getHours());
	equal(domain[1].getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is DAY", function() {

	expect(10);

	var date = new Date(2003, 11, 31, 23, 26);
	var nextDay = new Date(2004, 0, 1);
	CalHeatMap.init({loadOnInit: false, domain: "day", range: 1, start : date});
	var domain = CalHeatMap.getDomain(date);

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), date.getDate(), "Domain start day is equal to date day");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domain[1].getFullYear(), nextDay.getFullYear());
	equal(domain[1].getMonth(), nextDay.getMonth());
	equal(domain[1].getDate(), nextDay.getDate());
	equal(domain[1].getHours(), "0", "Domain end hour is equal to 0");
	equal(domain[1].getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is WEEK", function() {

	expect(10);

	var date = new Date(2013, 1, 20, 20, 15);
	var nextWeek = new Date(2013, 1, 25);
	CalHeatMap.init({loadOnInit: false, domain: "week", range: 1, start : date});
	var domain = CalHeatMap.getDomain(date);

	equal(domain[0].getFullYear(), 2013, "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 1, "Domain start month is equal to date month");
	equal(domain[0].getDate(), 18, "Domain start day is equal to first day of week");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domain[1].getFullYear(), 2013);
	equal(domain[1].getMonth(), 1);
	equal(domain[1].getDate(), 25, "Domain start day is equal to first day of next week");
	equal(domain[1].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[1].getMinutes(), "0", "Domain start minutes is equal to 0");

});

test("get domain when domain is MONTH", function() {

	expect(10);

	var date = new Date(2003, 10, 25, 23, 26);
	var nextMonth = new Date(2003, 11, 1, 0, 0);
	CalHeatMap.init({loadOnInit: false, domain: "month", range: 1, start : date});
	var domain = CalHeatMap.getDomain(date);

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), date.getMonth(), "Domain start month is equal to date month");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), "0", "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), "0", "Domain start minutes is equal to 0");

	equal(domain[1].getFullYear(), nextMonth.getFullYear());
	equal(domain[1].getMonth(), nextMonth.getMonth());
	equal(domain[1].getDate(), nextMonth.getDate());
	equal(domain[1].getHours(), "0", "Domain end hour is equal to 0");
	equal(domain[1].getMinutes(), "0", "Domain end minutes is equal to 0");
});

test("get domain when domain is YEAR", function() {

	expect(10);

	var date = new Date(2004, 11, 31, 23, 26);
	var nextYear = new Date(2005, 0, 1);
	CalHeatMap.init({loadOnInit: false, domain: "year", range: 1, start : date});
	var domain = CalHeatMap.getDomain(date);

	equal(domain[0].getFullYear(), date.getFullYear(), "Domain start year is equal to date year");
	equal(domain[0].getMonth(), 0, "Domain start month is equal to first month of year");
	equal(domain[0].getDate(), 1, "Domain start day is equal to first day of month");
	equal(domain[0].getHours(), 0, "Domain start hour is equal to 0");
	equal(domain[0].getMinutes(), 0, "Domain start minutes is equal to 0");

	equal(domain[1].getFullYear(), nextYear.getFullYear());
	equal(domain[1].getMonth(), nextYear.getMonth());
	equal(domain[1].getDate(), nextYear.getDate());
	equal(domain[1].getHours(), nextYear.getHours(), "Domain end hour is equal to 0");
	equal(domain[1].getMinutes(), nextYear.getMinutes(), "Domain end minutes is equal to 0");

});

module( "Settings" );

test("Allow only valid domain", function() {

	expect(8);

	ok(CalHeatMap.init({domain:"hour", loadOnInit: false}), "Hour is a valid domain");
	ok(CalHeatMap.init({domain:"day", loadOnInit: false}), "Day is a valid domain");
	ok(CalHeatMap.init({domain:"week", loadOnInit: false}), "Week is a valid domain");
	ok(CalHeatMap.init({domain:"month", loadOnInit: false}), "Month is a valid domain");
	ok(CalHeatMap.init({domain:"year", loadOnInit: false}), "Year is a valid domain");

	equal(CalHeatMap.init({domain:"min", loadOnInit: false}), false, "Min is a valid subdomain but not a valid domain");
	equal(CalHeatMap.init({domain:"notvalid", loadOnInit: false}), false, "Fail when domain is not valid");
	equal(CalHeatMap.init({domain:null, loadOnInit: false}), false, "Fail when domain is null");

});