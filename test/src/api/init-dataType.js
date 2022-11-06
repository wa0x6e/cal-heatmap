/*
	-----------------------------------------------------------------
	SETTINGS
	Test dataType options passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(dataType)");

QUnit.test("Allow only valid data type", function (assert) {
	var types = ["json", "txt", "csv", "tsv"];
	assert.expect(types.length);
	var cal = new CalHeatMap();

	for (var i = 0, total = types.length; i < total; i++) {
		assert.ok(
			cal.init({
				range: 1,
				dataType: types[i],
				loadOnInit: false,
				paintOnLoad: false
			}),
			types[i] + " is a valid domain"
		);
	}
});

function _testInvalidDataType(name, input) {
	QUnit.test(
		"Invalid dataType (" + name + ") throws an Error",
		function (assert) {
			assert.expect(1);
			var cal = new CalHeatMap();
			assert.throws(function () {
				cal.init({ dataType: input });
			});
		}
	);
}

_testInvalidDataType("not supported extension", "html");
_testInvalidDataType("empty string", "");
_testInvalidDataType("null", null);
_testInvalidDataType("false", false);
_testInvalidDataType("undefined", undefined);
_testInvalidDataType("random string", "random string");
_testInvalidDataType("number", 15);
