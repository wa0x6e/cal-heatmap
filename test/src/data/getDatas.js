/*
	-----------------------------------------------------------------
	DATA
	-----------------------------------------------------------------
 */

/*
QUnit.module("Unit Test: getDatas()", {
	before: function() {
		path = (window.parent.document.title === "Karma" ? "base/test/" : "") + "data/";
	},
	after: function() {
		path = null;
	}
});

QUnit.test("Invalid data (undefined) is ignore and treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({data: undefined});

	assert.deepEqual(cal.options.data, undefined);
	assert.ok(cal.getDatas(
		undefined,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "undefined is equivalent to an empty object"); }
	));
});

QUnit.test("Invalid data (null) is ignore and treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({data: null});

	assert.deepEqual(cal.options.data, null);
	assert.ok(cal.getDatas(
		null,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "null is equivalent to an empty object"); }
	));
});

QUnit.test("Invalid data (number) is ignore and treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({data: 8});

	assert.deepEqual(cal.options.data, 8);
	assert.ok(cal.getDatas(
		8,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "number is equivalent to an empty object"); }
	));
});

QUnit.test("Object is left untouched", function(assert) {
	assert.expect(4);

	var d = [0, 1];
	var cal = createCalendar({data: d});

	assert.deepEqual(cal.options.data, d);
	assert.equal(cal.getDatas(
		d,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, d); }
	), false);
});

QUnit.test("Empty string is treated as an empty object", function(assert) {
	assert.expect(4);

	var cal = createCalendar({});

	assert.equal(cal.options.data, "");
	assert.ok(cal.getDatas(
		"",
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, {}, "empty string is equivalent to an empty object"); }
	));
});

QUnit.test("Passing directly an object", function(assert) {
	assert.expect(4);

	var dt = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	assert.deepEqual(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) { assert.deepEqual(data, dt, "The passed object is used directly"); }
	), false);
});

QUnit.test("Passing a non-empty string is interpreted as an URL, and parsed using JSON", function(assert) {
	assert.expect(3);

	var dt = path + "data.json";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() {},
		function(data) {
			done();
			assert.deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

QUnit.test("Parsing a CSV file", function(assert) {
	assert.expect(5);

	var dt = path + "data.csv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "csv"});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) {
			done();
			assert.deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the CSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			assert.deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

QUnit.test("Parsing a TSV file", function(assert) {
	assert.expect(5);

	var dt = path + "data.tsv";
	var fileContent = {
		"946721039":1,
		"946706853":1,
		"946706340":1
	};
	var cal = createCalendar({data: dt, dataType: "tsv"});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) {
			done();
			assert.deepEqual(data[0], {
				"Date": "946721039",
				"Value" : "1"
			}, "The file content was interpreted by the TSV engine");

			// Call CSV interpreter manually, since afterLoad is redefined
			data = cal.interpretCSV(data);
			assert.deepEqual(data, fileContent, "The file is read, and converted to a json object");

		}
	), false);
});

QUnit.test("Parsing a TXT file", function(assert) {
	assert.expect(4);

	var dt = path + "data.txt";
	var fileContent = "{\n" +
		"\t\"946721039\":1,\n" +
		"\t\"946706853\":1,\n" +
		"\t\"946706340\":1\n" +
	"}";
	var cal = createCalendar({data: dt, dataType: "txt"});

	var done = assert.async();
	assert.equal(cal.options.data, dt);
	assert.equal(cal.getDatas(
		dt,
		new Date(),
		new Date(),
		function() { assert.ok(true, true, "Callback argument is called"); },
		function(data) {
			done();
			assert.equal(data, fileContent, "The file is read as a plain text file");
		}
	), false);
});
*/
