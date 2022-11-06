/*
    -----------------------------------------------------------------
    API
    -----------------------------------------------------------------
 */

QUnit.module("API : destroy()");

QUnit.test("Destroying the calendar", function (assert) {
	var ready = assert.async();
	assert.expect(3);

	var node = d3.select("body").append("div").attr("id", "test-destroy");
	var cal = createCalendar({
		itemSelector: node[0][0],
		animationDuration: 0,
		paintOnLoad: true
	});

	assert.ok(cal !== null, "the instance is created");

	cal = cal.destroy(function () {
		assert.ok("callback called");
		ready();
	});

	assert.ok(cal === null, "the instance is deleted");
});
