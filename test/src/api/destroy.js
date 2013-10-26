/*
	-----------------------------------------------------------------
	API
	-----------------------------------------------------------------
 */

module("API : destroy()");

test("Destroying the calendar", function() {
	expect(3);

	var node = d3.select("body").append("div").attr("id", "test-destroy");
	var cal = createCalendar({itemSelector: node[0][0], animationDuration: 0, paintOnLoad: true});

	ok(cal !== null, "the instance is created");

	cal = cal.destroy(function() {
		ok("callback called");
	});

	ok(cal === null, "the instance is deleted");
});
