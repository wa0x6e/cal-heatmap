/*globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,
    notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test,CalHeatMap,require */

require.config({
	paths: {
		"jquery": "jquery-1.9.1",
		"d3": "d3.min",
		"cal-heatmap": "../src/cal-heatmap"
	}
});

require(["d3", "jquery", "cal-heatmap"], function(d3, $, CalHeatMap) {

	test("Module is loaded via RequireJS", function() {
		expect(2);
		equal(typeof CalHeatMap, "function", "CalHeatMap was loaded with RequireJS");
		var cal = new CalHeatMap();
		equal(typeof cal, "object", "CalHeatMap can be initialized");
	});

});