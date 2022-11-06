/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : highlight()");

QUnit.test("Highlighting one date", function (assert) {
	var ready = assert.async();
	assert.expect(4);

	var highlightedDate = new Date(2000, 0, 1);
	var cal = createCalendar({
		animationDuration: 0,
		paintOnLoad: true,
		start: new Date(2000, 0),
		domain: "month"
	});
	assert.ok(cal.highlight(highlightedDate));
	assert.strictEqual(d3.selectAll("#cal-heatmap .highlight")[0].length, 0);

	setTimeout(function () {
		assert.strictEqual(
			d3.selectAll("#cal-heatmap .highlight")[0].length,
			1
		);
		assert.strictEqual(
			d3.selectAll("#cal-heatmap .highlight")[0][0].__data__.t,
			+highlightedDate
		);

		ready();
	}, 50);
});

QUnit.test("Highlighting multiple dates", function (assert) {
	var ready = assert.async();
	assert.expect(7);

	$("body").append('<div id="hglt2"></div>');

	var highlightedDate = [
		new Date(2000, 0, 1),
		new Date(2000, 0, 2),
		new Date(2001, 0, 1)
	];
	var cal = createCalendar({
		itemSelector: "#hglt2",
		highlight: [new Date(2000, 0, 3)],
		animationDuration: 0,
		paintOnLoad: true,
		start: new Date(2000, 0),
		domain: "month",
		range: 1
	});
	assert.ok(cal.highlight(highlightedDate));
	assert.strictEqual(
		d3.selectAll("#hglt2 .highlight")[0].length,
		1,
		"There is already one highlighted date, defined in init()"
	);

	setTimeout(function () {
		var highlightedCells = d3.selectAll("#hglt2 .highlight")[0];
		assert.strictEqual(
			highlightedCells.length,
			2,
			"There is 2 highlighted dates"
		);
		assert.strictEqual(highlightedCells[0].__data__.t, +highlightedDate[0]);
		assert.strictEqual(highlightedCells[1].__data__.t, +highlightedDate[1]);

		var d = d3.selectAll("#hglt2 .m_1 .graph-rect")[0][2];
		assert.strictEqual(
			d.getAttribute("class").trim(),
			"graph-rect",
			"The initial highlighted date is not highlighted anymore"
		);
		assert.strictEqual(d.__data__.t, new Date(2000, 0, 3).getTime());

		ready();

		$("#hglt2").remove();
	}, 50);
});

function _testInvalidHighlight(input) {
	QUnit.test("Testing invalid values", function (assert) {
		assert.expect(1);

		var cal = createCalendar({});
		assert.strictEqual(cal.highlight(input), false);
	});
}

_testInvalidHighlight("");
_testInvalidHighlight([]);
_testInvalidHighlight("tomorrow");
_testInvalidHighlight(2000);
