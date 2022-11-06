/*
	-----------------------------------------------------------------
	DATE
	-----------------------------------------------------------------
 */

QUnit.module("Date computation : isNow()");

QUnit.test("Now is equal to now", function (assert) {
	assert.expect(1);

	var cal = createCalendar({});

	assert.ok(cal.isNow(new Date()));
});

QUnit.test("Passed date is not equal to now", function (assert) {
	assert.expect(1);

	var cal = createCalendar({});

	assert.equal(cal.isNow(new Date(2000, 0)), false);
});
