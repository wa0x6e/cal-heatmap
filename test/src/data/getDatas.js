/*
	-----------------------------------------------------------------
	DATA
	-----------------------------------------------------------------
 */

module("Unit Test: getDatas()", {
	setup: function() {
		path = (window.parent.document.title === "Karma" ? "base/test/" : "") + "data/";
	},
	teardown: function() {
		path = null;
	}
});

test("Invalid data (undefined) is ignore and treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({data: undefined});

	deepEqual(cal.options.data, undefined);
	ok(cal.getDatas(
		undefined,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "undefined is equivalent to an empty object"); }
	));
});

test("Invalid data (null) is ignore and treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({data: null});

	deepEqual(cal.options.data, null);
	ok(cal.getDatas(
		null,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "null is equivalent to an empty object"); }
	));
});

test("Invalid data (number) is ignore and treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({data: 8});

	deepEqual(cal.options.data, 8);
	ok(cal.getDatas(
		8,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "number is equivalent to an empty object"); }
	));
});

test("Object is left untouched", function() {
	expect(4);

	var d = [0, 1];
	var cal = createCalendar({data: d});

	deepEqual(cal.options.data, d);
	equal(cal.getDatas(
		d,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, d); }
	), false);
});

test("Empty string is treated as an empty object", function() {
	expect(4);

	var cal = createCalendar({});

	equal(cal.options.data, "");
	ok(cal.getDatas(
		"",
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, {}, "empty string is equivalent to an empty object"); }
	));
});

test("Passing directly an object", function() {
	expect(4);

	var dt = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	deepEqual(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) { deepEqual(data, dt, "The passed object is used directly"); }
	), false);
});

asyncTest("Passing a non-empty string is interpreted as an URL, and parsed using JSON", function() {
	expect(3);

	var dt = path + "data.json";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() {},
		function(data) {
			start();
			deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

asyncTest("Parsing a CSV file", function() {
	expect(5);

	var dt = path + "data.csv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "csv"});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) {
			start();
			deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the CSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

asyncTest("Parsing a TSV file", function() {
	expect(5);

	var dt = path + "data.tsv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "tsv"});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) {
			start();
			deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the TSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

asyncTest("Parsing a TXT file", function() {
	expect(4);

	var dt = path + "data.txt";
	var fileContent = "{\n" +
		"\t\"946721039\":1,\n" +
		"\t\"946706853\":1,\n" +
		"\t\"946706340\":1\n" +
	"}";
	var cal = createCalendar({data: dt, dataType: "txt"});

	equal(cal.options.data, dt);
	equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { ok(true, true, "Callback argument is called"); },
		function(data) {
			start();
			equal(data, fileContent, "The file is read as a plain text file");
		}
	), false);
});
