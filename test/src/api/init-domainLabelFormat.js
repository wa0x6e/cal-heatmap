/*
	-----------------------------------------------------------------
	SETTINGS
	Test domainLabelFormat setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(domainLabelFormat)");

test("Passing an empty string", function() {
	expect(1);

	var cal = createCalendar({ domainLabelFormat: "" });
	strictEqual(cal.options.domainLabelFormat, "");
});

test("Passing a non-empty string", function() {
	expect(1);

	var cal = createCalendar({ domainLabelFormat: "R" });
	strictEqual(cal.options.domainLabelFormat, "R");
});

test("Passing a function", function() {
	expect(1);

	var cal = createCalendar({ domainLabelFormat: function() {} });
	ok(typeof cal.options.domainLabelFormat === "function");
});

function _testdomainLabelFormatWithInvalidInput(title, input) {
	test("Passing a not-valid input (" + title + ")", function() {
		expect(1);

		var cal = createCalendar({ domainLabelFormat: input });
		strictEqual(cal.options.domainLabelFormat, cal._domainType.hour.format.legend, "Invalid input should fallback to the domain default legend format");
	});
}

_testdomainLabelFormatWithInvalidInput("number", 10);
_testdomainLabelFormatWithInvalidInput("undefined", undefined);
_testdomainLabelFormatWithInvalidInput("false", false);
_testdomainLabelFormatWithInvalidInput("null", null);
_testdomainLabelFormatWithInvalidInput("array", []);
_testdomainLabelFormatWithInvalidInput("object", {});
