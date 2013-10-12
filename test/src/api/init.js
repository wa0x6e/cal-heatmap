/*
	-----------------------------------------------------------------
	SETTINGS
	Test options passed to init()
	-----------------------------------------------------------------
 */

module("API: init()");

test("Allow only valid domain", function() {

	expect(9);

	var domains = ["hour", "day", "week", "month", "year"];

	for(var i = 0, total = domains.length; i < total; i++) {
		var cal = createCalendar({range:1});
		ok(cal.init({domain:domains[i]}), domains[i] + " is a valid domain");
	}

	var c = createCalendar({});

	equal(c.init({domain:"min"}), false, "Min is a valid subdomain but not a valid domain");
	equal(c.init({domain:"x_hour"}), false, "x_hour is a valid subdomain but not a valid domain");
	equal(c.init({domain:"notvalid"}), false, "Fail when domain is not valid");
	equal(c.init({domain:null}), false, "Fail when domain is null");

});

test("Allow only known subDomain", function() {

	expect(13);

	var subDomains = ["min", "x_min", "hour", "x_hour", "day", "x_day", "week", "x_week", "month", "x_month"];

	for(var i = 0, total = subDomains.length; i < total; i++) {
		var cal = createCalendar({range:1});
		ok(cal.init({subDomain:subDomains[i], domain: "year"}), subDomains[i] + " is a valid subDomain");
	}

	var c = createCalendar({});

	equal(c.init({subDomain:"year", domain: "year"}), false, "Min is a valid domain but not a valid subdomain");
	equal(c.init({subDomain:"notvalid", domain: "month"}), false, "Fail when subdomain is not valid");
	equal(c.init({subDomain:null, domain: "month"}), false, "Fail when subdomain is null");

});

test("SubDomain must be smaller than domain", function() {

	expect(3);

	var c = createCalendar({});

	equal(c.init({subDomain:"min", domain: "month"}), true, "VALID : subdomain is lower level than domain");
	equal(c.init({subDomain:"month", domain: "month"}), false, "NOT VALID : subdomain is same level than domain");
	equal(c.init({subDomain:"year", domain: "month"}), false, "NOT VALID : subdomain is greater level than domain");


});

test("Set default domain and subDomain", function() {
	expect(2);

	var cal = createCalendar({});

	equal(cal.options.domain, "hour", "Default domain is HOUR");
	equal(cal.options.subDomain, "min", "Default subDomain is MIN");
});

test("Set default subDomain according to domain", function() {
	expect(5);

	var cal = createCalendar({domain: "hour"});
	equal(cal.options.subDomain, "min", "HOUR default subDomain is MIN");

	cal = createCalendar({domain: "day"});
	equal(cal.options.subDomain, "hour", "DAY default subDomain is HOUR");

	cal = createCalendar({domain: "week"});
	equal(cal.options.subDomain, "day", "WEEK default subDomain is DAY");

	cal = createCalendar({domain: "month"});
	equal(cal.options.subDomain, "day", "MONTH default subDomain is DAY");

	cal = createCalendar({domain: "year"});
	equal(cal.options.subDomain, "month", "YEAR default subDomain is MONTH");
});

test("Allow only valid data type", function() {
	var types = ["json", "txt", "csv"];
	expect(types.length);
	var cal = new CalHeatMap();

	for(var i = 0, total = types.length; i < total; i++) {
		ok(cal.init({range:1, dataType: types[i], loadOnInit: false, paintOnLoad: false}), types[i] + " is a valid domain");
	}
});

test("Don't allow not valid data type", function() {
	var types = ["min", "html", "jpg"];
	expect(types.length);
	var cal = new CalHeatMap();

	for(var i = 0, total = types.length; i < total; i++) {
		equal(cal.init({dataType: types[i]}), false, types[i] + " is not a valid domain");
	}
});

test("itemSelector accept a valid document.querySelector or CSS3 string value", function() {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	expect(10);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: "#a", paintOnLoad: false}), true, "#a is a valid itemSelector");
	equal($("#a .cal-heatmap-container").length, 1, "Calendar is appended to #a");

	equal(cal.init({itemSelector: "#a + #b", paintOnLoad: false}), true, "#a + #b is a valid itemSelector");
	equal($("#b .cal-heatmap-container").length, 1, "Calendar is appended to #a + #b");

	equal(cal.init({itemSelector: "div[data=y]", paintOnLoad: false}), true, "div[data=y] is a valid itemSelector");
	equal($("div[data=y] .cal-heatmap-container").length, 1, "Calendar is appended to div[data=y]");

	equal(cal.init({itemSelector: ".u", paintOnLoad: false}), true, ".u is a valid itemSelector");
	equal($(".u .cal-heatmap-container").length, 1, "Calendar is appended to .u");

	equal(cal.init({itemSelector: "#test > div:last-child", paintOnLoad: false}), true, "#test > div:last-child is a valid itemSelector");
	equal($("#last .cal-heatmap-container").length, 1, "Calendar is appended to #test > div:last-child");

	$("#test").remove();
});

test("itemSelector accept a valid Element object", function() {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	expect(10);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: document.querySelector("#a"), paintOnLoad: false}), true, "document.querySelector(\"#a\") is a valid itemSelector");
	equal($("#a .graph").length, 1, "Graph is appended to #a");

	equal(cal.init({itemSelector: $("#b")[0], paintOnLoad: false}), true, "$(\"#b\")[0] is a valid itemSelector");
	equal($("#b .graph").length, 1, "Graph is appended to #b");

	equal(cal.init({itemSelector: document.getElementById("last"), paintOnLoad: false}), true, "document.getElementById(\"last\") is a valid itemSelector");
	equal($("#last .graph").length, 1, "Graph is appended to #last");

	equal(cal.init({itemSelector: document.getElementsByClassName("u")[0], paintOnLoad: false}), true, "document.getElementsByClassName(\".u\") is a valid itemSelector");
	equal($(".u .graph").length, 1, "Graph is appended to .u");

	equal(cal.init({itemSelector: d3.select("[data=y]")[0][0], paintOnLoad: false}), true, "d3.select(\"[data=y]\")[0][0] is a valid itemSelector");
	equal($("div[data=y] .graph").length, 1, "Graph is appended to div[data=y]");

	$("#test").remove();
});

test("itemSelector does not accept invalid values", function() {
	expect(6);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: "", paintOnLoad: false}), false, "Empty string is not a valid itemSelector");
	equal(cal.init({itemSelector: [], paintOnLoad: false}), false, "Empty array is not a valid itemSelector");
	equal(cal.init({itemSelector: 125.69, paintOnLoad: false}), false, "Float is not a valid itemSelector");
	equal(cal.init({itemSelector: 125, paintOnLoad: false}), false, "Integer is not a valid itemSelector");
	equal(cal.init({itemSelector: {}, paintOnLoad: false}), false, "Empty object is not a valid itemSelector");
	equal(cal.init({itemSelector: function() {}, paintOnLoad: false}), false, "Function is not a valid itemSelector");
});

test("itemSelector target does not exists", function() {
	expect(1);

	var cal = new CalHeatMap();
	equal(cal.init({itemSelector: "#test", paintOnLoad: false}), false, "Die when target itemSelector does not exists");
});

test("Domain Margin can takes various format", function() {
	expect(7);

	var a = [0, 2, 3, 4];

	var cal = createCalendar({domainMargin: a});
	equal(cal.options.domainMargin, a, "Array of 4");

	cal.init({domainMargin: 5, paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,5,5,5].toString(), "Fill the array with the specified values");

	cal.init({domainMargin: [], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [0,0,0,0].toString(), "Fill array with 0");

	cal.init({domainMargin: [5], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,5,5,5].toString(), "Copy first values of array to the other 3");

	cal.init({domainMargin: [5, 10], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,10,5,10].toString(), "Array of 2 values is expanded to 4");

	cal.init({domainMargin: [5, 10, 15], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [5,10,15,10].toString(), "Array of 3 values is expanded to 4");

	cal.init({domainMargin: [0,0,0,0,0], paintOnLoad: false});
	equal(cal.options.domainMargin.toString(), [0,0,0,0].toString(), "Values in array length greater than 4 are ignored");
});

test("Auto align domain label horizontally", function() {
	expect(4);

	var cal = new CalHeatMap();

	cal.init({label: {position: "top"}, paintOnLoad: false});
	equal(cal.options.label.align, "center", "Auto center label when positioned on top");

	cal.init({label: {position: "bottom"}, paintOnLoad: false});
	equal(cal.options.label.align, "center", "Auto center label when positioned on bottom");

	cal.init({label: {position: "left"}, paintOnLoad: false});
	equal(cal.options.label.align, "right", "Auto align label on the right when positioned on the left");

	cal.init({label: {position: "right"}, paintOnLoad: false});
	equal(cal.options.label.align, "left", "Auto align label on the right when positioned on the right");
});

test("Auto align domain label horizontally when rotated", function() {
	expect(2);

	var cal = new CalHeatMap();

	cal.init({label: {rotate: "left"}, paintOnLoad: false});
	equal(cal.options.label.align, "right", "Auto align on the right when rotated to the left");

	cal.init({label: {rotate: "right"}, paintOnLoad: false});
	equal(cal.options.label.align, "left", "Auto align on the left when rotated to the right");

});

test("Setting namespace", function() {
	expect(6);

	var cal = new CalHeatMap();

	cal.init({paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not specified");

	cal.init({itemNamespace: "test", paintOnLoad: false});
	equal(cal.options.itemNamespace, "test", "Namespace can be set via init()");

	cal.init({itemNamespace: "", paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not empty");

	cal.init({itemNamespace: [], paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not valid (array)");

	cal.init({itemNamespace: {}, paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not valid (object)");

	cal.init({itemNamespace: 100, paintOnLoad: false});
	equal(cal.options.itemNamespace, "cal-heatmap", "Namespace fallback to default when not valid (number)");
});

test("Set itemName from a string", function() {
	expect(3);

	var cal = new CalHeatMap();

	cal.init({paintOnLoad: false});
	equal(cal.options.itemName.toString(), ["item", "items"].toString(), "Setting default itemName");

	cal.init({itemName: "car", paintOnLoad: false});
	equal(cal.options.itemName.toString(), ["car", "cars"].toString(), "Expanding itemName from a string");

	cal.init({itemName: ["car"], paintOnLoad: false});
	equal(cal.options.itemName.toString(), ["car", "cars"].toString(), "Expanding itemName from an array");
});


test("Highlight consider 'now' string as now", function() {
	expect(6);

	var cal = new CalHeatMap();

	cal.init({paintOnLoad: false, highlight: "now"});
	var arr = cal.options.highlight;
	equal(arr.length, 1, "Convert the string 'now' into an array");
	equal(arr[0] instanceof Date, true, "'now' is converted to a Date");

	var now = new Date();
	cal.init({paintOnLoad: false, highlight: ["now", now]});
	arr = cal.options.highlight;
	equal(arr.length, 2, "Convert the string 'now' into an array");
	equal(arr[0] instanceof Date, true, "Date 1 is a Date");
	equal(arr[1] instanceof Date, true, "Date 2 is a Date");
	equal(arr[0].getTime(), now.getTime());
});
