/*
	-----------------------------------------------------------------
	SETTINGS
	Test subDomainTextFormat setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(subDomainTextFormat)");

test("Passing a non-empty string", function() {
	expect(1);

	var cal = createCalendar({ subDomainTextFormat: "R" });
	strictEqual(cal.options.subDomainTextFormat, "R");
});

test("Passing a function", function() {
	expect(1);

	var cal = createCalendar({ subDomainTextFormat: function() {} });
	ok(typeof cal.options.subDomainTextFormat === "function");
});

function _testsubDomainTextFormatWithInvalidInput(title, input) {
	test("Passing a not-valid input (" + title + ")", function() {
		expect(1);

		var cal = createCalendar({ subDomainTextFormat: input });
		strictEqual(cal.options.subDomainTextFormat, null, "Invalid input should fallback to null");
	});
}

_testsubDomainTextFormatWithInvalidInput("empty string", "");
_testsubDomainTextFormatWithInvalidInput("number", 10);
_testsubDomainTextFormatWithInvalidInput("undefined", undefined);
_testsubDomainTextFormatWithInvalidInput("false", false);
_testsubDomainTextFormatWithInvalidInput("null", null);
_testsubDomainTextFormatWithInvalidInput("array", []);
_testsubDomainTextFormatWithInvalidInput("object", {});
