/*
	-----------------------------------------------------------------
	SETTINGS
	Test highlight setting passed to init()
	-----------------------------------------------------------------
 */

QUnit.module("API: init(highlight)");

function __testHighlightSetting(title, highlight, expected) {
  QUnit.test("Test expanding " + title, function (assert) {
    assert.expect(1);

    const cal = createCalendar({ highlight });
    assert.deepEqual(
      cal.options.highlight,
      expected,
      (Array.isArray(highlight)
        ? "[" + highlight.join(", ") + "]"
        : highlight) +
        " is expanded to [" +
        expected.join(", ") +
        "]"
    );
  });
}

__testHighlightSetting("a null string", "", []);
__testHighlightSetting("a non-valid string", "date", []);
__testHighlightSetting("an empty array", [], []);
__testHighlightSetting(
  "a non-empty array, with no valid data",
  ["date", 0],
  []
);
__testHighlightSetting(
  "a non-empty array, with one date object",
  [new Date(2000, 0)],
  [new Date(2000, 0)]
);
__testHighlightSetting(
  "a non-empty array, with multiple date objects",
  [new Date(2000, 0), new Date(2001, 0)],
  [new Date(2000, 0), new Date(2001, 0)]
);
__testHighlightSetting("null", null, []);
__testHighlightSetting("a boolean", false, []);

QUnit.test("Test expanding NOW string", function (assert) {
  assert.expect(3);

  const cal = createCalendar({ highlight: "now" });
  assert.ok(Array.isArray(cal.options.highlight));
  assert.equal(cal.options.highlight.length, 1);
  assert.ok(cal.options.highlight[0] instanceof Date);
});

QUnit.test(
  "Test expanding NOW string inside an array of valid dates",
  function (assert) {
    assert.expect(4);

    const cal = createCalendar({ highlight: ["now", new Date()] });
    assert.ok(Array.isArray(cal.options.highlight));
    assert.equal(cal.options.highlight.length, 2);
    assert.ok(cal.options.highlight[0] instanceof Date);
    assert.ok(cal.options.highlight[1] instanceof Date);
  }
);

QUnit.test(
  "Test expanding NOW string inside an array of invalid dates",
  function (assert) {
    assert.expect(3);

    const cal = createCalendar({ highlight: ["now", "tomorrow"] });
    assert.ok(Array.isArray(cal.options.highlight));
    assert.equal(cal.options.highlight.length, 1);
    assert.ok(cal.options.highlight[0] instanceof Date);
  }
);
