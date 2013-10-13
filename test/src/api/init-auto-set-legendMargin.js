/*
	-----------------------------------------------------------------
	SETTINGS
	Test that when no legendMargin is set, margin are automatically
	computed from legend position and orientation
	-----------------------------------------------------------------
 */

module("API: init(legendMargin)");

function __testAutoSetLegendMarginSetting(title, ver, hor, autoMarginIndex) {
	test("Automatically add margin to " + title, function() {
		expect(1);

		var margin = [0, 0, 0, 0];
		var cal = createCalendar({ legendVerticalPosition: ver, legendHorizontalPosition: hor });
		margin[autoMarginIndex] = cal.DEFAULT_LEGEND_MARGIN;

		deepEqual(cal.options.legendMargin, margin, "domainMargin is set to [" + margin.join(", ") + "]");
	});
}

__testAutoSetLegendMarginSetting("bottom", "top", "left", 2);
__testAutoSetLegendMarginSetting("bottom", "top", "center", 2);
__testAutoSetLegendMarginSetting("bottom", "top", "right", 2);
__testAutoSetLegendMarginSetting("top", "bottom", "left", 0);
__testAutoSetLegendMarginSetting("top", "bottom", "center", 0);
__testAutoSetLegendMarginSetting("top", "bottom", "right", 0);
__testAutoSetLegendMarginSetting("right", "middle", "left", 1);
__testAutoSetLegendMarginSetting("left", "middle", "right", 3);
