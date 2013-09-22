/*
	-----------------------------------------------------------------
	Callback
	-----------------------------------------------------------------
 */

module( "Callback" );

test("OnClick", function() {

	expect(2);

	var testFunction = function(date, itemNb) { return {d:date, i:itemNb}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);

	var response = cal.onClick(date, 58);

	equal(response.i, 58);
	equal(response.d.getTime(), date.getTime());

});

test("afterLoad", function() {

	expect(1);

	$("#cal-heatmap").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("#cal-heatmap").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: testFunction, paintOnLoad: true});

	equal($("#cal-heatmap").data("test"), finalString);
});

test("onComplete", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: true});

	equal($("body").data("test"), finalString);
});

test("onComplete is ran even on loadOnInit = false", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: false});

	equal($("body").data("test"), finalString);
});

test("onComplete does not run with paintOnLoad = false", function() {

	expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: false});

	equal($("body").data("test"), "Dummy Data");
});

test("afterLoadPreviousDomain", function() {

	expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var previousDomainStart = new Date(2012, 0, 1, 20);
	var previousDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadPreviousDomain(date);

	equal(response.start.getTime(), previousDomainStart.getTime(), "Callback return first subdomain of the date");
	equal(response.end.getTime(), previousDomainEnd.getTime(), "Callback return last subdomain of the date");
});

test("afterLoadNextDomain", function() {

	expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var nextDomainStart = new Date(2012, 0, 1, 20);
	var nextDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadNextDomain(date);

	equal(response.start.getTime(), nextDomainStart.getTime(), "Callback return first subdomain of the date");
	equal(response.end.getTime(), nextDomainEnd.getTime(), "Callback return last subdomain of the date");
});

test("onClick is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: {}});
	equal(cal.onClick(), false);
});

test("onClick is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: "string"});
	equal(cal.onClick(), false);
});

test("afterLoad is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: {}});
	equal(cal.afterLoad(), false);
});

test("afterLoad is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: "null"});
	equal(cal.afterLoad(), false);
});

test("afterLoadNextDomain is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: "null"});
	equal(cal.afterLoadNextDomain(), false);
});

test("afterLoadPreviousDomain is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: "null"});
	equal(cal.afterLoadPreviousDomain(null), false);
});

test("onComplete is not a valid callback : object", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: {}, loadOnInit: true});
	equal(cal.onComplete(), false);
});

test("onComplete is not a valid callback : string", function() {
	expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: "null", loadOnInit: true});
	equal(cal.onComplete(), false);
});

test("afterLoadData is not a valid callback", function() {
	expect(1);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = [];
	datas.push({date: date1, value: 15});	// 15 events for 00:00
	datas.push({date: date2, value: 25});	// 25 events for 01:00
	datas.push({date: date3, value: 1});	// 01 events for 01:01

	var parser = "";
	var cal = createCalendar({data: datas, start: new Date(2000, 0, 1, 1), afterLoadData: parser, domain: "hour", subDomain: "min"});

	equal(true, $.isEmptyObject(cal.parseDatas(datas)), "parseDatas return an empty object");
});
