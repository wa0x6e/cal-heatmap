/*
	-----------------------------------------------------------------
	SETTINGS
	Test subDomainDateFormat setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(subDomainDateFormat)");

test("Passing an empty string", function() {
	expect(1);

	var cal = createCalendar({ subDomainDateFormat: "" });
	strictEqual(cal.options.subDomainDateFormat, "");
});

test("Passing a non-empty string", function() {
	expect(1);

	var cal = createCalendar({ subDomainDateFormat: "R" });
	strictEqual(cal.options.subDomainDateFormat, "R");
});

test("Passing a function", function() {
	expect(1);

	var cal = createCalendar({ subDomainDateFormat: function() {} });
	ok(typeof cal.options.subDomainDateFormat === "function");
});

function _testsubDomainDateFormatWithInvalidInput(title, input) {
	test("Passing a not-valid input (" + title + ")", function() {
		expect(1);

		var cal = createCalendar({ subDomainDateFormat: input });
		strictEqual(cal.options.subDomainDateFormat, cal._domainType.min.format.date, "Invalid input should fallback to the subDomain default date format");
	});
}

_testsubDomainDateFormatWithInvalidInput("number", 10);
_testsubDomainDateFormatWithInvalidInput("undefined", undefined);
_testsubDomainDateFormatWithInvalidInput("false", false);
_testsubDomainDateFormatWithInvalidInput("null", null);
_testsubDomainDateFormatWithInvalidInput("array", []);
_testsubDomainDateFormatWithInvalidInput("object", {});
