/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : showLegend()");

QUnit.test("Show already existing legend", function (assert) {
	assert.expect(1);

	var cal = createCalendar({ displayLegend: true });

	assert.equal(
		cal.showLegend(),
		false,
		"showLegend() return false when legend already exists"
	);
});

QUnit.test("Show not existing legend", function (assert) {
	assert.expect(5);

	var cal = createCalendar({ displayLegend: false });

	assert.equal(
		cal.options.displayLegend,
		false,
		"displayLegend setting is set to false"
	);
	assert.equal(
		cal.root.select(".graph-legend")[0][0],
		null,
		"There is no legend in the DOM"
	);

	assert.equal(
		cal.showLegend(),
		true,
		"showLegend() return true when legend does not exist yet"
	);
	assert.equal(
		cal.options.displayLegend,
		true,
		"displayLegend setting is now set to true"
	);
	assert.notEqual(
		cal.root.select(".graph-legend")[0][0],
		null,
		"Legend is now added into the DOM"
	);
});
