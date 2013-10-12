/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : removeLegend()");

test("Removing not existing legend", function() {

	expect(1);

	var cal = createCalendar({displayLegend: false});

	equal(cal.removeLegend(), false, "removeLegend() return false when legend does not exist");
});

test("Removing existing legend", function() {

	expect(5);

	var cal = createCalendar({displayLegend: true, paintOnLoad: true});

	equal(cal.options.displayLegend, true, "displayLegend setting is set to true");
	notEqual(cal.root.select(".graph-legend")[0][0], null, "Legend exists int DOM");

	equal(cal.removeLegend(), true, "removeLegend() return true when legend does exist");
	equal(cal.options.displayLegend, false, "displayLegend setting is now set to false");
	equal(cal.root.select(".graph-legend")[0][0], null, "Legend is now removed from the DOM");
});
