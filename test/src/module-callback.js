/*
	-----------------------------------------------------------------
	Callback
	-----------------------------------------------------------------
 */

QUnit.module( "Callback" );

QUnit.test("OnClick", function(assert) {

	assert.expect(2);

	var testFunction = function(date, itemNb) { return {d:date, i:itemNb}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);

	var response = cal.onClick(date, 58);

	assert.equal(response.i, 58);
	assert.equal(response.d.getTime(), date.getTime());

});

QUnit.test("afterLoad", function(assert) {

	assert.expect(1);

	$("#cal-heatmap").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("#cal-heatmap").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: testFunction, paintOnLoad: true});

	assert.equal($("#cal-heatmap").data("test"), finalString);
});

QUnit.test("onComplete", function(assert) {

	assert.expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: true});

	assert.equal($("body").data("test"), finalString);
});

QUnit.test("onComplete is ran even on loadOnInit = false", function(assert) {

	assert.expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: true, loadOnInit: false});

	assert.equal($("body").data("test"), finalString);
});

QUnit.test("onComplete does not run with paintOnLoad = false", function(assert) {

	assert.expect(1);

	$("body").data("test", "Dummy Data");
	var finalString = "Edited data";
	var testFunction = function() { $("body").data("test", finalString); };

	createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: testFunction, paintOnLoad: false});

	assert.equal($("body").data("test"), "Dummy Data");
});

QUnit.test("afterLoadPreviousDomain", function(assert) {

	assert.expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var previousDomainStart = new Date(2012, 0, 1, 20);
	var previousDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadPreviousDomain(date);

	assert.equal(response.start.getTime(), previousDomainStart.getTime(), "Callback return first subdomain of the date");
	assert.equal(response.end.getTime(), previousDomainEnd.getTime(), "Callback return last subdomain of the date");
});

QUnit.test("afterLoadNextDomain", function(assert) {

	assert.expect(2);

	var testFunction = function(start, end) { return {start:start, end:end}; };

	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: testFunction});

	var date = new Date(2012, 0, 1, 20, 35);
	var nextDomainStart = new Date(2012, 0, 1, 20);
	var nextDomainEnd = new Date(2012, 0, 1, 20, 59);

	var response = cal.afterLoadNextDomain(date);

	assert.equal(response.start.getTime(), nextDomainStart.getTime(), "Callback return first subdomain of the date");
	assert.equal(response.end.getTime(), nextDomainEnd.getTime(), "Callback return last subdomain of the date");
});

QUnit.test("onClick is not a valid callback : object", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: {}});
	assert.equal(cal.onClick(), false);
});

QUnit.test("onClick is not a valid callback : string", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onClick: "string"});
	assert.equal(cal.onClick(), false);
});

QUnit.test("afterLoad is not a valid callback : object", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: {}});
	assert.equal(cal.afterLoad(), false);
});

QUnit.test("afterLoad is not a valid callback : string", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoad: "null"});
	assert.equal(cal.afterLoad(), false);
});

QUnit.test("afterLoadNextDomain is not a valid callback : string", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadNextDomain: "null"});
	assert.equal(cal.afterLoadNextDomain(), false);
});

QUnit.test("afterLoadPreviousDomain is not a valid callback : string", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, afterLoadPreviousDomain: "null"});
	assert.equal(cal.afterLoadPreviousDomain(null), false);
});

QUnit.test("onComplete is not a valid callback : object", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: {}, loadOnInit: true});
	assert.equal(cal.onComplete(), false);
});

QUnit.test("onComplete is not a valid callback : string", function(assert) {
	assert.expect(1);
	var cal = createCalendar({domain: "hour", subDomain: "min", range:1, onComplete: "null", loadOnInit: true});
	assert.equal(cal.onComplete(), false);
});

QUnit.test("afterLoadData is not a valid callback", function(assert) {
	assert.expect(1);

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

	assert.equal(true, $.isEmptyObject(cal.parseDatas(datas)), "parseDatas return an empty object");
});
