/*
	-----------------------------------------------------------------
	DATA SOURCE PARSING
	-----------------------------------------------------------------
 */

QUnit.module( "Interpreting Data source template" );

/*
QUnit.test("Data Source is a regex string, replace by timestamp", function(assert) {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{t:start}}&end={{t:end}}";
	var domains = cal._domains.keys();

	var parsedUri = "get?start=" + (domains[0]/1000) + "&end=" + (domains[domains.length-1]/1000);

	assert.equal(cal.parseURI(uri, new Date(+domains[0]), new Date(+domains[domains.length-1])), parsedUri, "Start and end token was replaced by a timestamp : " + parsedUri);
});

QUnit.test("Data Source is a regex string, replace by ISO-8601 Date", function(assert) {

	var cal = createCalendar({start: new Date()});
	var uri = "get?start={{d:start}}&end={{d:end}}";
	var domains = cal._domains.keys();

	var startDate = new Date(+domains[0]);
	var endDate = new Date(+domains[domains.length-1]);

	var parsedUri = "get?start=" + startDate.toISOString() + "&end=" + endDate.toISOString();

	assert.equal(cal.parseURI(uri, new Date(+domains[0]), new Date(+domains[domains.length-1])), parsedUri, "Start and end token was replaced by a string : " + parsedUri);
});
*/

/*
	-----------------------------------------------------------------
	DATA PARSING
	-----------------------------------------------------------------
 */
/*
QUnit.module( "Data processing" );

QUnit.test("Grouping datas by hour>min", function(assert) {
	assert.expect(6);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: date});

	var calDatas = cal.parseDatas(datas);

	assert.equal(Object.keys(calDatas).length, 2, "Only datas for 2 hours");
	assert.equal(Object.keys(calDatas[date1*1000]).length, 1, "First hour contains 1 event");
	assert.equal(Object.keys(calDatas[date2*1000]).length, 2, "Second hour contains 2 events");
	assert.equal(calDatas[date1*1000]["0"], 15);
	assert.equal(calDatas[date2*1000]["0"], 25);
	assert.equal(calDatas[date2*1000]["1"], 1);
});

QUnit.test("Grouping datas by day>hour", function(assert) {
	assert.expect(2);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: date, domain: "day", subDomain: "hour"});

	var calDatas = cal.parseDatas(datas);

	assert.equal(Object.keys(calDatas).length, 1, "Only datas for 1 day");
	assert.equal(Object.keys(calDatas[date1*1000]).length, 2, "Day contains datas for 2 hours");

});

QUnit.test("Filter out datas not relevant to calendar domain", function(assert) {
	assert.expect(4);

	var date = new Date(2000, 0, 1);
	var date1 = date.getTime()/1000;
	var date2 = date1+3600;
	var date3 = date2+60;

	var datas = {};
	datas[date1] = 15;	// 15 events for 00:00
	datas[date2] = 25;	// 25 events for 01:00
	datas[date3] = 1;	// 01 events for 01:01

	var cal = createCalendar({data: datas, start: new Date(2000, 0, 1, 1), domain: "hour", subDomain: "min"});

	var calDatas = cal.parseDatas(datas);

	assert.equal(Object.keys(calDatas).length, 1, "Only datas for 1 hour");
	assert.equal(calDatas.hasOwnProperty(date1*1000), false, "Datas for the first hour are filtered out");
	assert.equal(calDatas.hasOwnProperty(date2*1000), true, "Only datas for the second hours remains");
	assert.equal(Object.keys(calDatas[date2*1000]).length, 2, "Hours contains datas for 2 minutes");

});*/
