/*
	-----------------------------------------------------------------
	PAINTING
	-----------------------------------------------------------------
 */


module( "Painting" );

test("Display empty calendar", function() {

	expect(4);

	createCalendar({paintOnLoad: true});

	equal($("#cal-heatmap .graph").length, 1, "Calendar was created");
	equal($("#cal-heatmap .graph .graph-subdomain-group").length, 12, "The graph contains 12 hours");
	equal($("#cal-heatmap .graph .graph-subdomain-group rect").length, 60*12, "The graph contains 720 minutes");
	equal($("#cal-heatmap .graph-legend").length, 1, "A legend is created");
});

test("Don't display legend", function() {

	expect(1);

	createCalendar({displayLegend: false, paintOnLoad: true});

	equal($("#cal-heatmap .graph-legend").length, 0, "The legend is not created");
});


test("Display domain according to range number", function() {

	expect(1);

	createCalendar({range: 5, paintOnLoad: true});

	equal($("#cal-heatmap .graph .graph-subdomain-group").length, 5, "The graph contains only 5 hours");

});

test("Append graph to the passed DOM ID", function() {

	expect(2);

	$("body").append("<div id=test-container style='display:hidden;'></div>");

	createCalendar({itemSelector: "#test-container", paintOnLoad: true});

	equal($("#test-container .graph").length, 1, "The graph is added to the specified ID");
	equal($("#cal-heatmap .graph").length, 0, "Default ID is empty");

	$("#test-container").remove();

});

test("Attach events to next and previous selector on default namespace", function() {

	expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	var cal = createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector");
	equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector");
});

test("Attach events to next and previous selector on custom namespace", function() {

	expect(4);

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

	equal(typeof d3.select("#next").on("click." + cal.options.itemNamespace), "function", "loadNextDomain is attached to nextSelector on default namespace");
	equal(typeof d3.select("#previous").on("click." + cal.options.itemNamespace), "function", "loadPreviousDomain is attached to previousSelector on default namespace");
	equal(typeof d3.select("#next").on("click.ns2"), "function", "loadNextDomain is attached to nextSelector on custom namespace");
	equal(typeof d3.select("#previous").on("click.ns2"), "function", "loadPreviousDomain is attached to previousSelector on custom namespace");
});

test("Attach events to not-valid namespace fallback to default namespace", function() {

	expect(2);

	$("body").append("<a id='next'></a>");
	$("body").append("<a id='previous'></a>");

	createCalendar({
		paintOnLoad: true,
		nextSelector: "#next",
		previousSelector: "#previous"
	});

	equal(typeof d3.select("#next").on("click.cal-heatmap"), "function", "loadNextDomain is attached to defaultNamespace");
	equal(typeof d3.select("#previous").on("click.cal-heatmap"), "function", "loadPreviousDomain is attached to defaultNamespace");

	$("body").remove("#next");
	$("body").remove("#previous");
});



test("Custom date formatting with d3.js internal formatter", function() {

	expect(1);

	var date = new Date(2000, 0, 5);

	createCalendar({start: date, loadOnInit: true, paintOnLoad: true, subDomainDateFormat: "==%B=="});

	equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, "==January==");

});

test("Custom date formatting with custom function", function() {

	expect(1);

	var date = new Date(2000, 0, 5);

	createCalendar({start: date, loadOnInit: true, paintOnLoad: true, subDomainDateFormat: function(date) { return date.getTime();}});

	equal($("#cal-heatmap .graph .graph-subdomain-group title")[0].firstChild.data, date.getTime());
});
/*
test("Cell label have different title formatting depending on whether it's filled or not", function() {

	expect(2);

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

	equal(d3.selectAll("#cal-heatmap title")[0].textContent, title.filled);
	equal($("#cal-heatmap title")[1].textContent, title.empty);
});*/

test("Cell radius is applied", function() {

	expect(2);

	var radius = 15;

	createCalendar({paintOnLoad: true, domain: "day", subDomain: "hour", cellRadius: radius});

	equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "rx"), radius, "Horizontal cellRadius applied");
	equal($("#cal-heatmap .graph .graph-subdomain-group rect")[0].getAttributeNS(null, "ry"), radius, "Vertical cellRadius applied");
});
