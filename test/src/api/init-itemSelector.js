/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemSelector options passed to init()
	-----------------------------------------------------------------
 */

module("API: init(itemSelector)");

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

function _testInvalidItemSelector(name, input) {
	test("Invalid itemSelector (" + name + ") throws an Error", function() {
		expect(1);

		throws(function() { createCalendar({itemSelector: input}); });
	});
}

_testInvalidItemSelector("empty string", "");
_testInvalidItemSelector("array", []);
_testInvalidItemSelector("number", 15);
_testInvalidItemSelector("function", function() {});

test("itemSelector target does not exist", function() {
	expect(1);

	throws(function() { createCalendar({itemSelector: "#test"}); }, "Non-existent itemSelector raises an Error");
});
