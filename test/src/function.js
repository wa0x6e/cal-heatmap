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
