/*
	-----------------------------------------------------------------
	DST: Daylight Saving Time
	-----------------------------------------------------------------
 */

module("DST: DST to Standard Time");

(function() {

	var startDate = new Date(2013, 10, 3, 0);

	// Skip the test if your DST change is not following the North American standard
	if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
		return true;
	}

	test("HOUR DOMAIN: the duplicate hour is compressed into a single hour", function() {
		expect(5);

		var cal = createCalendar({start: startDate, range: 4, paintOnLoad: true});
		var labels = cal.root.selectAll(".graph-label");

		strictEqual(labels[0].length, 4, "There is 4 graph labels");
		equal(labels[0][0].firstChild.data, "00:00");
		equal(labels[0][1].firstChild.data, "01:00");
		equal(labels[0][2].firstChild.data, "02:00");
		equal(labels[0][3].firstChild.data, "03:00");
	});

	test("DAY DOMAIN: the duplicate hour is compressed into a single hour", function() {
		expect(4);

		var cal = createCalendar({start: startDate, range: 1, paintOnLoad: true, domain: "day"});
		var cells = cal.root.selectAll(".graph-rect");

		strictEqual(cells[0].length, 24, "There is 24 subDomains cells");

		equal(cells[0][0].__data__.t, startDate.getTime(), "The first cell is midnight");
		equal(cells[0][1].__data__.t, startDate.getTime() + 3600 * 1000 * 2, "The second cell is for the two 1am");
		equal(cells[0][2].__data__.t, startDate.getTime() + 3600 * 1000 * 3, "The third cell is for 2am");
	});
})();


module("DST: Standard Time to DST");

(function() {

	var startDate = new Date(2013, 2, 10, 0);

	// Skip the test if your DST change is not following the North American standard
	if (new Date(+startDate + 3600 * 1000 * 2).getHours() === 2) {
		return true;
	}

	test("HOUR DOMAIN: the missing hour is skipped", function() {
		expect(5);

		var cal = createCalendar({start: startDate, range: 4, paintOnLoad: true});
		var labels = cal.root.selectAll(".graph-label");

		strictEqual(labels[0].length, 4, "There is 4 graph labels");
		equal(labels[0][0].firstChild.data, "00:00");
		equal(labels[0][1].firstChild.data, "01:00");
		equal(labels[0][2].firstChild.data, "03:00", "3am is following 2am, there is no 2 am");
		equal(labels[0][3].firstChild.data, "04:00");
	});

	test("DAY DOMAIN: the missing hour is skipped", function() {
		expect(4);

		var cal = createCalendar({start: startDate, range: 1, paintOnLoad: true, domain: "day"});
		var cells = cal.root.selectAll(".graph-rect");

		strictEqual(cells[0].length, 23, "There is 23 subDomains cells");

		equal(cells[0][0].__data__.t, startDate.getTime(), "The first cell is midnight");
		equal(cells[0][1].__data__.t, startDate.getTime() + 3600 * 1000, "The second cell is for 1am");
		equal(cells[0][2].__data__.t, startDate.getTime() + 3600 * 1000 * 2, "The third cell is for 3am, there is no 2am");
	});
})();
