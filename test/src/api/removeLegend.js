/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : removeLegend()");

QUnit.test("Removing not existing legend", function(assert) {

	assert.expect(1);

	var cal = createCalendar({displayLegend: false});

	assert.equal(cal.removeLegend(), false, "removeLegend() return false when legend does not exist");
});

QUnit.test("Removing existing legend", function(assert) {

	assert.expect(5);

	var cal = createCalendar({displayLegend: true, paintOnLoad: true});

	assert.equal(cal.options.displayLegend, true, "displayLegend setting is set to true");
	assert.notEqual(cal.root.select(".graph-legend").node(), null, "Legend exists int DOM");

	assert.equal(cal.removeLegend(), true, "removeLegend() return true when legend does exist");
	assert.equal(cal.options.displayLegend, false, "displayLegend setting is now set to false");
	assert.equal(cal.root.select(".graph-legend").node(), null, "Legend is now removed from the DOM");
});
