/*global equal,expect,test,require */

require.config({
	paths: {
		"jquery": "jquery-1.9.1",
		"d3": "d3.min",
		"cal-heatmap": "../src/cal-heatmap"
	}
});

require(["d3", "jquery", "cal-heatmap"], function(d3, $, CalHeatMap) {

	test("Module is loaded via RequireJS", function() {
		$("body").append("<div id=cal-heatmap style=\"display:none;\"></div>");

		expect(3);
		strictEqual(typeof CalHeatMap, "function", "CalHeatMap was loaded with RequireJS");
		var cal = new CalHeatMap();
		ok(cal instanceof CalHeatMap, "CalHeatMap can be initialized");

		cal.init({});
		ok($(".graph").length > 0, "The graph was added into the DOM");
	});

});
