/*
	-----------------------------------------------------------------
	SETTINGS
	Test that when no legendMargin is set, margin are automatically
	computed from legend position and orientation
	-----------------------------------------------------------------
 */

QUnit.module("API: init(legendMargin)");

function __testAutoSetLegendMarginSetting(title, ver, hor, autoMarginIndex) {
  QUnit.test("Automatically add margin to " + title, function (assert) {
    assert.expect(1);

    const margin = [0, 0, 0, 0];
    const cal = createCalendar({
      legendVerticalPosition: ver,
      legendHorizontalPosition: hor,
    });
    margin[autoMarginIndex] = cal.DEFAULT_LEGEND_MARGIN;

    assert.deepEqual(
      cal.options.legendMargin,
      margin,
      "domainMargin is set to [" + margin.join(", ") + "]"
    );
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
