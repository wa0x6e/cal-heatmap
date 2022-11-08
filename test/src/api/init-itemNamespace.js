/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemNamespace setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(itemNamespace)");

function __testItemNamespaceSetting(title, value, expected) {
	QUnit.test(title, function(assert) {
		assert.expect(1);

		var cal = createCalendar({ itemNamespace: value });
		assert.equal(cal.options.itemNamespace, expected, "itemNamespace is set to " + expected);
	});
}

__testItemNamespaceSetting("null will fallback to default namespace", null, "cal-heatmap");
__testItemNamespaceSetting("false will fallback to default namespace", false, "cal-heatmap");
__testItemNamespaceSetting("empty string will fallback to default namespace", "", "cal-heatmap");
__testItemNamespaceSetting("invalid value (array) will fallback to default namespace", [], "cal-heatmap");
__testItemNamespaceSetting("invalid value (object) will fallback to default namespace", {}, "cal-heatmap");
__testItemNamespaceSetting("invalid value (number) will fallback to default namespace", 126, "cal-heatmap");
__testItemNamespaceSetting("Setting a valid namespace from a string", "test-namespace", "test-namespace");
