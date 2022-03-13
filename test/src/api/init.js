/*
	-----------------------------------------------------------------
	SETTINGS
	Test options passed to init()
	-----------------------------------------------------------------
 */

QUnit.test("Auto align domain label horizontally", function(assert) {
	assert.expect(4);

	var cal = new CalHeatMap();

	cal.init({label: {position: "top"}, paintOnLoad: false});
	assert.equal(cal.options.label.align, "center", "Auto center label when positioned on top");

	cal.init({label: {position: "bottom"}, paintOnLoad: false});
	assert.equal(cal.options.label.align, "center", "Auto center label when positioned on bottom");

	cal.init({label: {position: "left"}, paintOnLoad: false});
	assert.equal(cal.options.label.align, "right", "Auto align label on the right when positioned on the left");

	cal.init({label: {position: "right"}, paintOnLoad: false});
	assert.equal(cal.options.label.align, "left", "Auto align label on the right when positioned on the right");
});

QUnit.test("Auto align domain label horizontally when rotated", function(assert) {
	assert.expect(2);

	var cal = new CalHeatMap();

	cal.init({label: {rotate: "left"}, paintOnLoad: false});
	assert.equal(cal.options.label.align, "right", "Auto align on the right when rotated to the left");

	cal.init({label: {rotate: "right"}, paintOnLoad: false});
	assert.equal(cal.options.label.align, "left", "Auto align on the left when rotated to the right");

});


