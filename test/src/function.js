CalHeatMap.prototype.svg = function() {
	return this.root.selectAll(".graph-domain");
};

function createCalendar(settings) {

	$("#cal-heatmap").remove();

	$("body").append("<div id='cal-heatmap' style='display:none;'></div>");

	var cal = new CalHeatMap();
	if (!settings.hasOwnProperty("loadOnInit")) {
		settings.loadOnInit = false;
	}

	settings.animationDuration = 0;

	if (!settings.hasOwnProperty("paintOnLoad")) {
		settings.paintOnLoad = false;
	}

	cal.init(settings);

	return cal;
}

/**
 * Mark a test as skipped
 *
 * @link http://stackoverflow.com/questions/13748129/skipping-a-test-in-qunit
 * @return {[type]} [description]
 */
QUnit.testSkip = function() {
	QUnit.test(arguments[0] + ' (SKIPPED)', function() {
		var li = document.getElementById(QUnit.config.current.id);
		QUnit.done(function() {
			if (li !== null) {
				li.style.background = '#FFFF99';
			}
		});
		ok(true);
	});
};
testSkip = QUnit.testSkip;
