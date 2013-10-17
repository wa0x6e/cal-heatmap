/*
	-----------------------------------------------------------------
	SETTINGS
	Test domain and subDomain options passed to init()
	-----------------------------------------------------------------
 */

module("API: init(domain)");

(function() {
	function _testValidDomain(d) {
		test("Testing that " + d + " is a valid domain", function() {
			expect(1);

			var cal = createCalendar({domain: d});
			strictEqual(cal.options.domain, d);
		});
	}

	var domains = ["hour", "day", "week", "month", "year"];
	for(var i = 0, total = domains.length; i < total; i++) {
		_testValidDomain(domains[i]);
	}
}());

function _testInvalidDomain(name, input) {
	test("Invalid domain (" + name + ") throws an Error", function() {
		expect(1);

		throws(function() { createCalendar({domain: input}); });
	});
}

_testInvalidDomain("empty string", "");
_testInvalidDomain("null", null);
_testInvalidDomain("false", false);
_testInvalidDomain("not-valid domain type", "random-value");
_testInvalidDomain("min", "min"); // Min is a valid subDomain but not domain

test("Set default domain and subDomain", function() {
	expect(2);

	var cal = createCalendar({});

	strictEqual(cal.options.domain, "hour", "Default domain is HOUR");
	strictEqual(cal.options.subDomain, "min", "Default subDomain is MIN");
});


module("API: init(subDomain)");

(function() {
	function _testValidSubDomain(d) {
		test("Testing that " + d + " is a valid subDomains", function() {
			expect(1);

			var cal = createCalendar({subDomains: d});
			strictEqual(cal.options.subDomains, d);
		});
	}

	var subDomains = ["min", "x_min", "hour", "x_hour", "day", "x_day", "week", "x_week", "month", "x_month"];
	for(var i = 0, total = subDomains.length; i < total; i++) {
		_testValidSubDomain(subDomains[i]);
	}
}());

function _testInvalidSubDomain(name, input) {
	test("Invalid subDomain (" + name + ") throws an Error", function() {
		expect(1);

		throws(function() { createCalendar({subDomain: input}); });
	});
}

_testInvalidSubDomain("empty string", "");
_testInvalidSubDomain("null", null);
_testInvalidSubDomain("false", false);
_testInvalidSubDomain("not-valid subDomain type", "random-value");
_testInvalidSubDomain("year", "year"); // Year is a valid domain but not subDomain

function _testSubDomainSmallerThanDomain(domain, subDomain) {
	test(subDomain + " is a valid subDomain for " + domain, function() {
		expect(2);

		var cal = createCalendar({domain: domain, subDomain: subDomain});
		strictEqual(cal.options.domain, domain);
		strictEqual(cal.options.subDomain, subDomain);
	});
}

_testSubDomainSmallerThanDomain("hour", "min");
_testSubDomainSmallerThanDomain("day", "min");
_testSubDomainSmallerThanDomain("day", "hour");
_testSubDomainSmallerThanDomain("week", "hour");
_testSubDomainSmallerThanDomain("week", "min");
_testSubDomainSmallerThanDomain("week", "day");
_testSubDomainSmallerThanDomain("month", "week");
_testSubDomainSmallerThanDomain("year", "month");
_testSubDomainSmallerThanDomain("year", "week");

function _testInvalidSubDomainForDomain(domain, subDomain) {
	test(subDomain + " is not a valid subDomain for " + domain, function() {
		expect(1);

		throws(function() { createCalendar({domain: domain, subDomain: subDomain}); });
	});
}

_testInvalidSubDomainForDomain("hour", "day");
_testInvalidSubDomainForDomain("day", "week");
_testInvalidSubDomainForDomain("week", "month");
_testInvalidSubDomainForDomain("month", "year");

function _testDefaultSubDomain(domain, subDomain) {
	test(subDomain + " is the default subDomain for " + domain, function() {
		expect(2);

		var cal = createCalendar({domain: domain});
		strictEqual(cal.options.domain, domain);
		strictEqual(cal.options.subDomain, subDomain);
	});
}

_testDefaultSubDomain("hour", "min");
_testDefaultSubDomain("day", "hour");
_testDefaultSubDomain("week", "day");
_testDefaultSubDomain("month", "day");
_testDefaultSubDomain("year", "month");
