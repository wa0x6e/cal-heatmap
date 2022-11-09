/*
	-----------------------------------------------------------------
	LEGEND
	-----------------------------------------------------------------
 */

QUnit.module("Legend class");

QUnit.test("Positive legend", function (assert) {
  assert.expect(9);

  const cal = createCalendar({ legend: [100, 200, 300, 400] });

  assert.equal(cal.Legend.getClass(0, false), "r1 r0");
  assert.equal(cal.Legend.getClass(50, false), "r1");
  assert.equal(cal.Legend.getClass(100, false), "r1");
  assert.equal(cal.Legend.getClass(150, false), "r2");
  assert.equal(cal.Legend.getClass(200, false), "r2");
  assert.equal(cal.Legend.getClass(250, false), "r3");
  assert.equal(cal.Legend.getClass(300, false), "r3");
  assert.equal(cal.Legend.getClass(350, false), "r4");
  assert.equal(cal.Legend.getClass(600, false), "r5");
});

QUnit.test("Positive and negative custom legend", function (assert) {
  assert.expect(9);

  const cal = createCalendar({ legend: [-100, 0, 100, 200, 300, 400] });

  assert.equal(cal.Legend.getClass(-200, false), "r1");
  assert.equal(cal.Legend.getClass(-100, false), "r1");
  assert.equal(cal.Legend.getClass(-50, false), "r2");
  assert.equal(cal.Legend.getClass(0, false), "r2 r0");
  assert.equal(cal.Legend.getClass(50, false), "r3");
  assert.equal(cal.Legend.getClass(100, false), "r3");
  assert.equal(cal.Legend.getClass(150, false), "r4");
  assert.equal(cal.Legend.getClass(200, false), "r4");
  assert.equal(cal.Legend.getClass(600, false), "r7");
});

QUnit.test("Float value custom legend", function (assert) {
  assert.expect(9);

  const cal = createCalendar({ legend: [0.1, 0.2, 0.3] });

  assert.equal(cal.Legend.getClass(-100, false), "r1 ri");
  assert.equal(cal.Legend.getClass(0, false), "r1 r0");
  assert.equal(cal.Legend.getClass(0.1, false), "r1");
  assert.equal(cal.Legend.getClass(0.15, false), "r2");
  assert.equal(cal.Legend.getClass(0.2, false), "r2");
  assert.equal(cal.Legend.getClass(0.25, false), "r3");
  assert.equal(cal.Legend.getClass(0.3, false), "r3");
  assert.equal(cal.Legend.getClass(0.35, false), "r4");
  assert.equal(cal.Legend.getClass(0.4, false), "r4");
});

QUnit.test("Empty value", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  assert.equal(
    cal.Legend.getClass(null, false),
    "",
    "Null value return empty string"
  );
});

QUnit.test("Invalid value", function (assert) {
  assert.expect(1);

  const cal = createCalendar({});

  assert.equal(
    cal.Legend.getClass("foo", false),
    "",
    "NaN return empty string"
  );
});

QUnit.test("Also return the qn styling class", function (assert) {
  assert.expect(10);

  const cal = createCalendar({ legend: [100, 200, 300, 400] });

  assert.equal(cal.Legend.getClass(-100, true), "r1 ri q1 qi");
  assert.equal(cal.Legend.getClass(0, true), "r1 r0 q1 q0");
  assert.equal(cal.Legend.getClass(50, true), "r1 q1");
  assert.equal(cal.Legend.getClass(100, true), "r1 q1");
  assert.equal(cal.Legend.getClass(150, true), "r2 q2");
  assert.equal(cal.Legend.getClass(200, true), "r2 q2");
  assert.equal(cal.Legend.getClass(250, true), "r3 q3");
  assert.equal(cal.Legend.getClass(300, true), "r3 q3");
  assert.equal(cal.Legend.getClass(350, true), "r4 q4");
  assert.equal(cal.Legend.getClass(600, true), "r5 q5");
});
