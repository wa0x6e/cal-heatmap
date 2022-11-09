/*
	-----------------------------------------------------------------
	Unit Test
	Test getHighlightClassName()
	-----------------------------------------------------------------
 */

QUnit.module("Unit Test: getHighlightClassName()");

QUnit.test(
  "Return the highlight classname if a date should be highlighted",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({
      highlight: [new Date(2000, 0, 1), new Date(2000, 0, 2)],
    });
    assert.strictEqual(
      cal.getHighlightClassName(new Date(2000, 0, 1)),
      " highlight"
    );
  }
);

QUnit.test(
  "Return the highlight and now classname if a date should be highlighted and is now",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({
      highlight: [new Date(2000, 0, 1), new Date()],
    });
    assert.strictEqual(cal.getHighlightClassName(new Date()), " highlight-now");
  }
);

QUnit.test(
  "Return an empty string if a date is not in the highlight list",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({ highlight: [new Date(2000, 0, 1)] });
    assert.strictEqual(cal.getHighlightClassName(new Date(2000, 0, 2)), "");
  }
);

QUnit.test(
  "Return an empty string if the highlight list is empty",
  function (assert) {
    assert.expect(1);

    const cal = createCalendar({});
    assert.strictEqual(cal.getHighlightClassName(new Date()), "");
  }
);
