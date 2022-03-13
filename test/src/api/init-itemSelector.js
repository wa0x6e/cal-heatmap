/*
	-----------------------------------------------------------------
	SETTINGS
	Test itemSelector options passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(itemSelector)");

QUnit.test("itemSelector accept a valid document.querySelector or CSS3 string value", function(assert) {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	assert.expect(10);

	var cal = new CalHeatMap();
	assert.equal(cal.init({itemSelector: "#a", paintOnLoad: false}), true, "#a is a valid itemSelector");
	assert.equal($("#a .cal-heatmap-container").length, 1, "Calendar is appended to #a");

	assert.equal(cal.init({itemSelector: "#a + #b", paintOnLoad: false}), true, "#a + #b is a valid itemSelector");
	assert.equal($("#b .cal-heatmap-container").length, 1, "Calendar is appended to #a + #b");

	assert.equal(cal.init({itemSelector: "div[data=y]", paintOnLoad: false}), true, "div[data=y] is a valid itemSelector");
	assert.equal($("div[data=y] .cal-heatmap-container").length, 1, "Calendar is appended to div[data=y]");

	assert.equal(cal.init({itemSelector: ".u", paintOnLoad: false}), true, ".u is a valid itemSelector");
	assert.equal($(".u .cal-heatmap-container").length, 1, "Calendar is appended to .u");

	assert.equal(cal.init({itemSelector: "#test > div:last-child", paintOnLoad: false}), true, "#test > div:last-child is a valid itemSelector");
	assert.equal($("#last .cal-heatmap-container").length, 1, "Calendar is appended to #test > div:last-child");

	$("#test").remove();
});

QUnit.test("itemSelector accept a valid Element object", function(assert) {

	$("body").append("<div id=test><div id=a></div><div id=b></div><div data=y></div><div class=u></div><div id=last></div></div>");

	assert.expect(10);

	var cal = new CalHeatMap();
	assert.equal(cal.init({itemSelector: document.querySelector("#a"), paintOnLoad: false}), true, "document.querySelector(\"#a\") is a valid itemSelector");
	assert.equal($("#a .graph").length, 1, "Graph is appended to #a");

	assert.equal(cal.init({itemSelector: $("#b")[0], paintOnLoad: false}), true, "$(\"#b\")[0] is a valid itemSelector");
	assert.equal($("#b .graph").length, 1, "Graph is appended to #b");

	assert.equal(cal.init({itemSelector: document.getElementById("last"), paintOnLoad: false}), true, "document.getElementById(\"last\") is a valid itemSelector");
	assert.equal($("#last .graph").length, 1, "Graph is appended to #last");

	assert.equal(cal.init({itemSelector: document.getElementsByClassName("u")[0], paintOnLoad: false}), true, "document.getElementsByClassName(\".u\") is a valid itemSelector");
	assert.equal($(".u .graph").length, 1, "Graph is appended to .u");

	assert.equal(cal.init({itemSelector: d3.select("[data=y]")[0][0], paintOnLoad: false}), true, "d3.select(\"[data=y]\")[0][0] is a valid itemSelector");
	assert.equal($("div[data=y] .graph").length, 1, "Graph is appended to div[data=y]");

	$("#test").remove();
});

function _testInvalidItemSelector(name, input) {
	QUnit.test("Invalid itemSelector (" + name + ") throws an Error", function(assert) {
		assert.expect(1);

		assert.throws(function() { createCalendar({itemSelector: input}); });
	});
}

_testInvalidItemSelector("empty string", "");
_testInvalidItemSelector("array", []);
_testInvalidItemSelector("number", 15);
_testInvalidItemSelector("function", function() {});

QUnit.test("itemSelector target does not exist", function(assert) {
	assert.expect(1);

	assert.throws(function() { createCalendar({itemSelector: "#test"}); }, "Non-existent itemSelector raises an Error");
});
