/*
	-----------------------------------------------------------------
	PAINTING
	-----------------------------------------------------------------
 */


QUnit.module( "Painting" );

QUnit.test("Display empty calendar", function(assert) {

	assert.expect(4);

	createCalendar({paintOnLoad: true});

	assert.equal($("#cal-heatmap .graph").length, 1, "Calendar was created");
	assert.equal($("#cal-heatmap .graph .graph-subdomain-group").length, 12, "The graph contains 12 hours");
	assert.equal($("#cal-heatmap .graph .graph-subdomain-group rect").length, 60*12, "The graph contains 720 minutes");
	assert.equal($("#cal-heatmap .graph-legend").length, 1, "A legend is created");
});

QUnit.test("Don't display legend", function(assert) {

	assert.expect(1);

	createCalendar({displayLegend: false, paintOnLoad: true});

	assert.equal($("#cal-heatmap .graph-legend").length, 0, "The legend is not created");
});


QUnit.test("Display domain according to range number", function(assert) {

	assert.expect(1);

	createCalendar({range: 5, paintOnLoad: true});

	assert.equal($("#cal-heatmap .graph .graph-subdomain-group").length, 5, "The graph contains only 5 hours");

});

QUnit.test("Append graph to the passed DOM ID", function(assert) {

	assert.expect(2);

	$("body").append("<div id=test-container style='display:hidden;'></div>");

	createCalendar({itemSelector: "#test-container", paintOnLoad: true});

	assert.equal($("#test-container .graph").length, 1, "The graph is added to the specified ID");
	assert.equal($("#cal-heatmap .graph").length, 0, "Default ID is empty");

	$("#test-container").remove();

});

QUnit.test("Attach events to next and previous selector on default namespace", function(assert) {

	assert.expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	assert.equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector");
	assert.equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector");
});

QUnit.test("Attach events to next and previous selector on custom namespace", function(assert) {

	assert.expect(4);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous",
		itemNamespace: "ns2"
	});

	assert.equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector on default namespace");
	assert.equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector on default namespace");
	assert.equal(typeof d3.select("#next").on("click.ns2"), "function", "loadNextDomain is attached to nextSelector on custom namespace");
	assert.equal(typeof d3.select("#previous").on("click.ns2"), "function", "loadPreviousDomain is attached to previousSelector on custom namespace");
});

QUnit.test("Attach events to not-valid namespace fallback to default namespace", function(assert) {

	assert.expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	assert.equal(typeof d3.select("#next").on("click.cal-heatmap"), "function", "loadNextDomain is attached to defaultNamespace");
	assert.equal(typeof d3.select("#previous").on("click.cal-heatmap"), "function", "loadPreviousDomain is attached to defaultNamespace");

	$("body").remove("#next");
	$("body").remove("#previous");
});



QUnit.test("Custom date formatting with d3.js internal formatter", function(assert) {

	assert.expect(1);

	var date = new Date(2000, 0, 5);

	createCalendar({start: date, loadOnInit: true, paintOnLoad: true, subDomainDateFormat: "==%B=="});

	assert.equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, "==January==");

});

QUnit.test("Custom date formatting with custom function", function(assert) {

	assert.expect(1);

	var date = new Date(2000, 0, 5);

	createCalendar({start: date, loadOnInit: true, paintOnLoad: true, subDomainDateFormat: function(date) { return date.getTime();}});

	assert.equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, date.getTime());
});
/*
QUnit.test("Cell label have different title formatting depending on whether it's filled or not", function(assert) {

	assert.expect(2);

	var date = new Date(2000, 0, 1);
	var datas = {};
	datas[date.getTime()/1000] = 15;

	var title = {
		empty: "this is an empty cell",
		filled: "this is a filled cell"
	};

	var cal = createCalendar({data: datas, start: date, loadOnInit: true, paintOnLoad: true,
		domain: "year",
		subDomain: "month",
		range: 1,
		subDomainTitleFormat: title
	});

	assert.equal(d3.selectAll("#cal-heatmap title")[0].textContent, title.filled);
	assert.equal($("#cal-heatmap title")[1].textContent, title.empty);
});*/

QUnit.test("Cell radius is applied", function(assert) {

	assert.expect(2);

	var radius = 15;

	createCalendar({paintOnLoad: true, domain: "day", subDomain: "hour", cellRadius: radius});

	assert.equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "rx"), radius, "Horizontal cellRadius applied");
	assert.equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "ry"), radius, "Vertical cellRadius applied");
});
