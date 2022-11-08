/*
	-----------------------------------------------------------------
	SETTINGS
	Test domainLabelFormat setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(domainLabelFormat)");

QUnit.test("Passing an empty string", function(assert) {
	assert.expect(1);

	var cal = createCalendar({ domainLabelFormat: "" });
	assert.strictEqual(cal.options.domainLabelFormat, "");
});

QUnit.test("Passing a non-empty string", function(assert) {
	assert.expect(1);

	var cal = createCalendar({ domainLabelFormat: "R" });
	assert.strictEqual(cal.options.domainLabelFormat, "R");
});

QUnit.test("Passing a function", function(assert) {
	assert.expect(1);

	var cal = createCalendar({ domainLabelFormat: function() {} });
	assert.ok(typeof cal.options.domainLabelFormat === "function");
});

function _testdomainLabelFormatWithInvalidInput(title, input) {
	QUnit.test("Passing a not-valid input (" + title + ")", function(assert) {
		assert.expect(1);

		var cal = createCalendar({ domainLabelFormat: input });
		assert.strictEqual(cal.options.domainLabelFormat, cal._domainType.hour.format.legend, "Invalid input should fallback to the domain default legend format");
	});
}

_testdomainLabelFormatWithInvalidInput("number", 10);
_testdomainLabelFormatWithInvalidInput("undefined", undefined);
_testdomainLabelFormatWithInvalidInput("false", false);
_testdomainLabelFormatWithInvalidInput("null", null);
_testdomainLabelFormatWithInvalidInput("array", []);
_testdomainLabelFormatWithInvalidInput("object", {});
