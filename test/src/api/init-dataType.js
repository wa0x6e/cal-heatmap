/*
	-----------------------------------------------------------------
	SETTINGS
	Test dataType options passed to init()
	-----------------------------------------------------------------
 */

module("API: init(dataType)");

test("Allow only valid data type", function() {
	var types = ["json", "txt", "csv", "tsv"];
	expect(types.length);
	var cal = new CalHeatMap();

	for(var i = 0, total = types.length; i < total; i++) {
		ok(cal.init({range:1, dataType: types[i], loadOnInit: false, paintOnLoad: false}), types[i] + " is a valid domain");
	}
});

function _testInvalidDataType(name, input) {
	test("Invalid dataType (" + name + ") throws an Error", function() {
		expect(1);
		var cal = new CalHeatMap();
		throws(function() { cal.init({dataType: input}); });
	});
}

_testInvalidDataType("not supported extension", "html");
_testInvalidDataType("empty string", "");
_testInvalidDataType("null", null);
_testInvalidDataType("false", false);
_testInvalidDataType("undefined", undefined);
_testInvalidDataType("random string", "random string");
_testInvalidDataType("number", 15);
