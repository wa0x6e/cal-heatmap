
module("Date computation : dateLessThan()");


var min = 60 * 1000; // one min millis  
var hour = 60 * min; // one hour millis 
var day = 24 * hour; // one hour millis
var month = 30 * day; // one (average month);


test("date is less than now in the domain hour, subdomain min", function() {
    expect(6);

    var cal = createCalendar({});

    var now =  new Date(2013, 12, 9, 12, 30, 30, 0); // 12:30:30, 2013-12-9


    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - min), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5  * 1000), now)); // still within the min
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5  * 1000), now)); // still within the min
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + min), now));
});

test("date is less than now in the domain day, subdomain hour", function() {
    expect(6);

    var cal = createCalendar({domain: "day", subDomain: "hour"});

    var now =  new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - hour), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * 60 * 1000), now)); // still within the hour
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * 60 * 1000), now)); // still within the hour
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + hour), now));
});

test("date is less than now in the domain month, subdomain day", function() {
    expect(6);

    var cal = createCalendar({domain: "month", subDomain: "day"});

    var now =  new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - day), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * hour), now)); // still within the day
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * hour), now)); // still within the day
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + day), now));
});


test("date is less than now in the domain month, subdomain day", function() {
    expect(6);

    var cal = createCalendar({domain: "year", subDomain: "month"});

    var now =  new Date(2013, 12, 9, 12, 30, 0, 0); // 12:30, 2013-12-9

    ok(cal.dateIsLessThan(new Date(0), now));
    ok(cal.dateIsLessThan(new Date(now.getTime() - month), now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() - 5 * day), now)); // still within the month
    ok(!cal.dateIsLessThan(new Date(now.getTime() + 5 * day), now)); // still within the month
    ok(!cal.dateIsLessThan(now, now));
    ok(!cal.dateIsLessThan(new Date(now.getTime() + month), now));
});
