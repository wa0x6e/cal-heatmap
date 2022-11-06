/*
	-----------------------------------------------------------------
	SETTINGS
	Test domainMargin and legendMargin setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(domainMargin)");

function __testDomainMarginExpand(title, margin, expectedMargin) {
	QUnit.test("Test expanding " + title, function (assert) {
		assert.expect(1);

		var cal = createCalendar({ domainMargin: margin });
		assert.deepEqual(
			cal.options.domainMargin,
			expectedMargin,
			(Array.isArray(margin) ? "[" + margin.join(", ") + "]" : margin) +
				" is expanded to [" +
				expectedMargin.join(", ") +
				"]"
		);
	});
}

__testDomainMarginExpand("an empty integer", 0, [0, 0, 0, 0]);
__testDomainMarginExpand("a non-null integer", 10, [10, 10, 10, 10]);
__testDomainMarginExpand("a one-value (zero) array", [0], [0, 0, 0, 0]);
__testDomainMarginExpand("a one-value (five) array", [5], [5, 5, 5, 5]);
__testDomainMarginExpand("a two-value array", [5, 10], [5, 10, 5, 10]);
__testDomainMarginExpand("a three-value array", [5, 10, 15], [5, 10, 15, 10]);
__testDomainMarginExpand(
	"a four-value array",
	[5, 10, 15, 20],
	[5, 10, 15, 20]
);
__testDomainMarginExpand(
	"a six-value array",
	[5, 10, 15, 20, 30, 40],
	[5, 10, 15, 20]
);
__testDomainMarginExpand(
	"an invalid (string) value fallback to 0",
	"string",
	[0, 0, 0, 0]
);
__testDomainMarginExpand(
	"an invalid (empty string) value fallback to 0",
	"",
	[0, 0, 0, 0]
);

QUnit.module("API: init(legendMargin)");

function __testDomainLegendExpand(title, margin, expectedMargin) {
	QUnit.test("Test expanding " + title, function (assert) {
		assert.expect(1);

		var cal = createCalendar({ legendMargin: margin });
		assert.deepEqual(
			cal.options.legendMargin,
			expectedMargin,
			(Array.isArray(margin) ? "[" + margin.join(", ") + "]" : margin) +
				" is expanded to [" +
				expectedMargin.join(", ") +
				"]"
		);
	});
}

__testDomainLegendExpand("an empty integer", 0, [0, 0, 0, 0]);
__testDomainLegendExpand("a non-null integer", 10, [10, 10, 10, 10]);
__testDomainLegendExpand("a one-value (zero) array", [0], [0, 0, 0, 0]);
__testDomainLegendExpand("a one-value (five) array", [5], [5, 5, 5, 5]);
__testDomainLegendExpand("a two-value array", [5, 10], [5, 10, 5, 10]);
__testDomainLegendExpand("a three-value array", [5, 10, 15], [5, 10, 15, 10]);
__testDomainLegendExpand(
	"a four-value array",
	[5, 10, 15, 20],
	[5, 10, 15, 20]
);
__testDomainLegendExpand(
	"a six-value array",
	[5, 10, 15, 20, 30, 40],
	[5, 10, 15, 20]
);
__testDomainLegendExpand(
	"an invalid (string) value fallback to 0",
	"string",
	[0, 0, 0, 0]
);
__testDomainLegendExpand(
	"an invalid (empty string) value fallback to 0",
	"",
	[0, 0, 0, 0]
);
