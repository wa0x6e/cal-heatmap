/*
	-----------------------------------------------------------------
	SETTINGS
	Test subDomainDateFormat setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(subDomainDateFormat)");

QUnit.test("Passing an empty string", function (assert) {
	assert.expect(1);

	var cal = createCalendar({ subDomainDateFormat: "" });
	assert.strictEqual(cal.options.subDomainDateFormat, "");
});

QUnit.test("Passing a non-empty string", function (assert) {
	assert.expect(1);

	var cal = createCalendar({ subDomainDateFormat: "R" });
	assert.strictEqual(cal.options.subDomainDateFormat, "R");
});

QUnit.test("Passing a function", function (assert) {
	assert.expect(1);

	var cal = createCalendar({ subDomainDateFormat: function () {} });
	assert.ok(typeof cal.options.subDomainDateFormat === "function");
});

function _testsubDomainDateFormatWithInvalidInput(title, input) {
	QUnit.test("Passing a not-valid input (" + title + ")", function (assert) {
		assert.expect(1);

		var cal = createCalendar({ subDomainDateFormat: input });
		assert.strictEqual(
			cal.options.subDomainDateFormat,
			cal._domainType.min.format.date,
			"Invalid input should fallback to the subDomain default date format"
		);
	});
}

_testsubDomainDateFormatWithInvalidInput("number", 10);
_testsubDomainDateFormatWithInvalidInput("undefined", undefined);
_testsubDomainDateFormatWithInvalidInput("false", false);
_testsubDomainDateFormatWithInvalidInput("null", null);
_testsubDomainDateFormatWithInvalidInput("array", []);
_testsubDomainDateFormatWithInvalidInput("object", {});
