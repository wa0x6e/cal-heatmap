/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : removeLegend()");

QUnit.test("Removing not existing legend", function (assert) {
  assert.expect(1);

  const cal = createCalendar({ displayLegend: false });

  assert.equal(
    cal.removeLegend(),
    false,
    "removeLegend() return false when legend does not exist"
  );
});

QUnit.test("Removing existing legend", function (assert) {
  assert.expect(5);

  const cal = createCalendar({ displayLegend: true, paintOnLoad: true });

  assert.equal(
    cal.options.displayLegend,
    true,
    "displayLegend setting is set to true"
  );
  assert.false(
    cal.root.select(".graph-legend").empty(),
    "Legend exists int DOM"
  );

  assert.equal(
    cal.removeLegend(),
    true,
    "removeLegend() return true when legend does exist"
  );
  assert.equal(
    cal.options.displayLegend,
    false,
    "displayLegend setting is now set to false"
  );
  assert.true(
    cal.root.select(".graph-legend").empty(),
    "Legend is now removed from the DOM"
  );
});
