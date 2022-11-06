/*
	-----------------------------------------------------------------
	SETTINGS
	Test subDomainTextFormat setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(subDomainTextFormat)");

QUnit.test("Passing a non-empty string", function (assert) {
	assert.expect(1);

	var cal = createCalendar({ subDomainTextFormat: "R" });
	assert.strictEqual(cal.options.subDomainTextFormat, "R");
});

QUnit.test("Passing a function", function (assert) {
	assert.expect(1);

	var cal = createCalendar({ subDomainTextFormat: function () {} });
	assert.ok(typeof cal.options.subDomainTextFormat === "function");
});

function _testsubDomainTextFormatWithInvalidInput(title, input) {
	QUnit.test("Passing a not-valid input (" + title + ")", function (assert) {
		assert.expect(1);

		var cal = createCalendar({ subDomainTextFormat: input });
		assert.strictEqual(
			cal.options.subDomainTextFormat,
			null,
			"Invalid input should fallback to null"
		);
	});
}

_testsubDomainTextFormatWithInvalidInput("empty string", "");
_testsubDomainTextFormatWithInvalidInput("number", 10);
_testsubDomainTextFormatWithInvalidInput("undefined", undefined);
_testsubDomainTextFormatWithInvalidInput("false", false);
_testsubDomainTextFormatWithInvalidInput("null", null);
_testsubDomainTextFormatWithInvalidInput("array", []);
_testsubDomainTextFormatWithInvalidInput("object", {});
