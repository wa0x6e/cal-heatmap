window.addEvent('domready', function() {
	new Request.HTML({
		url: '/gh/get/response.json/kamisama/cal-heatmap/tree/gh-pages/demo/',
		onSuccess: function(data) {

			var calendar = new CalHeatMap();
			calendar.init({
				data: data,
				start: new Date(2000, 0, 15),
				range : 15,			// Number of days to display
				domain : "day",		// Display days
				subDomain : "hour",	// Split each day by hours
				browsing : true,	// Enable browsing
				afterLoadNextDomain : function(start, end) {
					alert("You just loaded a new domain starting on " + start + " and ending on " + end);
				}
			});

        }
	}).send();
})