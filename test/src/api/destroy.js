/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

QUnit.module("API : destroy()");

QUnit.test("Destroying the calendar", function (assert) {
  assert.expect(3);

  const node = d3
    .select("body")
    .append("div")
    .attr("id", "test-destroy")
    .node();
  let cal = createCalendar({
    itemSelector: node,
    animationDuration: 0,
    paintOnLoad: true,
  });

  assert.ok(cal !== null, "the instance is created");

  const done = assert.async();
  cal = cal.destroy(function () {
    assert.ok("callback called");
    done();
  });

  assert.ok(cal === null, "the instance is deleted");
});
