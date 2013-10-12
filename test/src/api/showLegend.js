/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : showLegend()");

test("Show already existing legend", function() {

	expect(1);

	var cal = createCalendar({displayLegend: true});

	equal(cal.showLegend(), false, "showLegend() return false when legend already exists");
});

test("Show not existing legend", function() {

	expect(5);

	var cal = createCalendar({displayLegend: false});

	equal(cal.options.displayLegend, false, "displayLegend setting is set to false");
	equal(cal.root.select(".graph-legend")[0][0], null, "There is no legend in the DOM");

	equal(cal.showLegend(), true, "showLegend() return true when legend does not exist yet");
	equal(cal.options.displayLegend, true, "displayLegend setting is now set to true");
	notEqual(cal.root.select(".graph-legend")[0][0], null, "Legend is now added into the DOM");
});

