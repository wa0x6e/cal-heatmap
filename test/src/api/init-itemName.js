/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemName setting passed to init()
	-----------------------------------------------------------------
 */

module("API: init(itemName)");

function __testItemNameSetting(title, value, expected) {
	test("Set itemName from " + title, function() {
		expect(1);

		var cal = createCalendar({ itemName: value });
		deepEqual(cal.options.itemName, expected, "itemName is set to " + expected);
	});
}

__testItemNameSetting("null will fallback to default itemName", null, ["item", "items"]);
__testItemNameSetting("false will fallback to default itemName", false, ["item", "items"]);
__testItemNameSetting("an invalid value (number) will fallback to default itemName", 0, ["item", "items"]);
__testItemNameSetting("an empty string will set an empty string for the singular and plural form", "", ["", ""]);
__testItemNameSetting("a string will guess the plural form", "cat", ["cat", "cats"]);
__testItemNameSetting("a 1-value array will guess the plural form", ["cat"], ["cat", "cats"]);
__testItemNameSetting("a 2-value array will do nothing", ["child", "children"], ["child", "children"]);
__testItemNameSetting("a 3-value array will only keeps the first 2 values", ["child", "children", "bomb"], ["child", "children"]);
