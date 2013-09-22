/*
	-----------------------------------------------------------------
	LEGEND
	-----------------------------------------------------------------
 */

module( "Legend" );

test("Basic default legend", function() {

	expect(8);

	var cal = createCalendar({});

	equal(cal.legend(0), "");
	equal(cal.legend(5), "q1");
	equal(cal.legend(10), "q1");
	equal(cal.legend(15), "q2");
	equal(cal.legend(20), "q2");
	equal(cal.legend(25), "q3");
	equal(cal.legend(30), "q3");
	equal(cal.legend(35), "q4");

});

test("Positive custom legend", function() {

	expect(8);

	var cal = createCalendar({legend: [100, 200, 300, 400]});

	equal(cal.legend(0), "");
	equal(cal.legend(50), "q1");
	equal(cal.legend(100), "q1");
	equal(cal.legend(150), "q2");
	equal(cal.legend(200), "q2");
	equal(cal.legend(250), "q3");
	equal(cal.legend(300), "q3");
	equal(cal.legend(350), "q4");

});

test("Positive and negative custom legend", function() {

	expect(8);

	var cal = createCalendar({legend: [-100, 0, 100, 200, 300, 400]});

	equal(cal.legend(-200), "q1");
	equal(cal.legend(-100), "q1");
	equal(cal.legend(-50), "q2");
	equal(cal.legend(0), "q2");
	equal(cal.legend(50), "q3");
	equal(cal.legend(100), "q3");
	equal(cal.legend(150), "q4");
	equal(cal.legend(200), "q4");

});

test("Float value custom legend", function() {

	expect(9);

	var cal = createCalendar({legend: [0.1, 0.2, 0.3]});

	equal(cal.legend(-100), "qi");
	equal(cal.legend(0), "");
	equal(cal.legend(0.1), "q1");
	equal(cal.legend(0.15), "q2");
	equal(cal.legend(0.2), "q2");
	equal(cal.legend(0.25), "q3");
	equal(cal.legend(0.3), "q3");
	equal(cal.legend(0.35), "q4", "Classes top at q3, since legend contains only 3 items");
	equal(cal.legend(0.4), "q4", "Classes top at q3, since legend contains only 3 items");

});

test("Null value", function() {

	expect(3);

	var cal = createCalendar({});

	equal(cal.legend(null), "");
	equal(cal.legend(0), "");
	equal(cal.legend(1), "q1");

});

test("Not a number", function() {

	expect(4);

	var cal = createCalendar({});

	equal(cal.legend("Hello"), "qi");
	equal(cal.legend({}), "qi");
	equal(cal.legend(0), "");
	equal(cal.legend(1), "q1");

});
