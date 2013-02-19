var CalHeatMap = function() {

	var options = {
		// DOM ID of the container to append the graph to
		id : "cal-heatmap",

		// Threshold for each scale
		scales : [10,20,30,40],

		// Number of hours to display on the graph
		range : 12,

		// Size of each cell, in pixel
		cellsize : 10,

		// Padding between each cell, in pixel
		cellpadding : 2,

		dateFormat : "%H:%M, %A %B %e %Y",

		// Callback when clicking on a time block
		onClick : function(start, end, itemNb) {},

		// Whether to display the scale
		displayScale : true,


		itemName : ["item", "items"],

		// Start of the graph
		start : new Date(),

		uri : "",

		loadOnInit : true,

		domain : "hour",

		subDomain : "min"
	};

	var allowedDomains = {
		"hour" : {},
		"day" : {},
		"week" : {},
		"month" : {},
		"year" : {}
	};

	var domain = getDomain(options.start);

	var
		graphStartDate = domain[0],
		dataEndDate = domain[1],
		graphEndDate = dataEndDate;

	var w, h, m = [0, 0, 25, 0]; // top right bottom left margin

	var formatDate = d3.time.format(options.dateFormat),
		formatNumber = d3.format(",d");

	var svg = null;
	var rect = null;

	var _onClick = function(d, itemNb) {
		options.onClick(
			new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0),
			new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 59),
			itemNb
		);
	};




	/**
	 * Display the graph for the first time
	 */
	function init() {

		var graphLegendHeight = options.cellsize*2;

		w = options.cellsize*6 + options.cellpadding*6 + options.cellpadding;
		h = options.cellsize*10 + options.cellpadding*9 + options.cellpadding;

		svg = d3.select("#" + options.id + " .graph")
			.selectAll()
			.data(d3.time.hours(graphStartDate, graphEndDate).map(function(d) {
				return d.getTime();
			}))
			.enter().append("div")
			.attr("class", "hour")
			.style("width", w + "px")
			.style("height", h + graphLegendHeight + "px")
			.style("display", "inline-block")
			.append("svg:svg")
			.attr("width", w)
			.attr("height", h + graphLegendHeight)
			.append("svg:g")
			.attr("transform", "translate(0, 1)");

		svg.append("svg:text")
			.attr("y", h + graphLegendHeight/1.5)
			.attr("class", "graph-label")
			.attr("text-anchor", "middle")
			.attr("vertical-align", "middle")
			.attr("x", w/2)
			.text(function(d) { var date = new Date(d); return date.getHours() + ":00"; });

		rect = svg.selectAll("rect")
			.data(function(d) { return getSubDomain(d); })
			.enter().append("svg:rect")
			.attr("class", "graph-rect")
			.attr("width", options.cellsize)
			.attr("height", options.cellsize)
			.attr("x", function(d) { var p = Math.floor(d.getMinutes()/10); return p * options.cellsize + p * options.cellpadding; })
			.attr("y", function(d) { var p = d.getMinutes() % 10; return p * options.cellsize + p * options.cellpadding; });

		rect.append("svg:title");

		if (options.displayScale) {
			displayScale();
		}

		// Get datas from remote, parse them to expected format, then display them in the graph
		if (options.loadOnInit) {
			d3.json(options.uri, function(data) {
				display(parseDatas(data));
			});
		}

		return true;
	}

	function displayScale() {

		var scaleIndex = d3.range(0, options.scales.length);

		var scale = d3.select("#" + options.id).append("svg:svg")
		.attr("class", "graph-scale")
		.attr("height", options.cellsize + (options.cellpadding*2))
		;

		scale.selectAll().data(scaleIndex).enter()
		.append("svg:rect")
		.attr("width", options.cellsize)
		.attr("height", options.cellsize)
		.attr("class", function(d){ return "graph-rect q" + (d+1); })
		.attr("transform", function(d) { return "translate(" + (d * (options.cellsize + options.cellpadding))  + ", " + options.cellpadding + ")"; })
		.append("svg:title")
		.text(function(d) {
			var nextThreshold = options.scales[d+1];
			if (d === 0) {
				if (0 === nextThreshold) {
					return "0 " + options.itemName[0];
				}
				return "between 0 and " + (nextThreshold-1) + " " + options.itemName[1];
			} else if (d === options.scales.length-1) {
				return "more than " + options.scales[d] + " " + options.itemName[1];
			} else {
				if (options.scales[d] === nextThreshold) {
					return options.scales[d] + " " + (options.itemName[options.scales[d] > 1 ? 1 : 0]);
				}
				return "between " + options.scales[d] + " and " + (nextThreshold-1) + " " + options.itemName[1];
			}
		})
		;
	}


	/**
	 * Colorize all rectangles according to their items count
	 *
	 * @param  {[type]} data  [description]
	 */
	function display (data) {
		svg.each(function(hour) {
			hour = hour/1000;
			d3.select(this).selectAll("rect")
				.attr("class", function(d) {
					var min = d.getMinutes();

					if (d < options.start) {
						return "graph-rect q0";
					}

					return "graph-rect" +
					((data.hasOwnProperty(hour) && data[hour].hasOwnProperty(min)) ?
						(" " + scale(data[hour][min])) : ""
					);
				})
				.on("click", function(d) {
					var min = d.getMinutes();
					return _onClick(
						d,
						(data.hasOwnProperty(hour) && data[hour].hasOwnProperty(min)) ? data[hour][min] : 0
					);
				})
				.select("title")
				.text(function(d) {

					if (d < options.start) {
						return "";
					}

					var min = d.getMinutes();
					return (
					((data.hasOwnProperty(hour) && data[hour].hasOwnProperty(min)) ?
						(formatNumber(data[hour][min]) + " " + options.itemName[data[hour][min] > 1 ? 1 : 0] + " at ") :
						""
						) + formatDate(d));
				});
			}
		);
	}


	/**
	 * Convert a JSON result into the expected format
	 *
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	function parseDatas(data) {
		var stats = {};

		for (var d in data) {
			var date = new Date(d*1000);
			var hourStartTimestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
			hourStartTimestamp = hourStartTimestamp.getTime()/1000;

			var min = date.getMinutes();
			if (typeof stats[hourStartTimestamp] === "undefined") {
				stats[hourStartTimestamp] = {};
			}

			if (typeof stats[hourStartTimestamp][min] !== "undefined") {
				stats[hourStartTimestamp][min] += data[d];
			} else {
				stats[hourStartTimestamp][min] = data[d];
			}
		}

		return stats;
	}

	/**
	 * Return the classname for the specified value, on the scale
	 *
	 * @param  Item count n Number of items for that perdiod of time
	 * @return string		Classname according to the scale
	 */
	function scale(n) {
		for (var i = 0, total = options.scales.length-1; i < total; i++) {
			if (n <= options.scales[i]) {
				return "q" + (i+1);
			}
		}
		return n === 0 ? "" : "q" + options.scales.length;
	}

	/**
	 * Return all the minutes between from the same hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	function getMinuteSubDomain(d) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0);
		return d3.time.minutes(start, new Date(start.getTime() + 3600 * 1000));
	}

	function getHourSubDomain(d) {
	}

	function getDaySubDomain(d) {
	}


	function getWeekSubDomain(d) {
	}

	function getMonthSubDomain(d) {
	}

	/**
	 * Return the start of an hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	function getHourDomain(d) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0);
		return [
			start,
			new Date(start.getTime() + 3600 * 1000 * options.range)
		];
	}

	/**
	 * Return the start of an hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	function getDayDomain(d) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0);
		return [
			start,
			new Date(start.getTime() + 3600 * 24 * 1000 * options.range)
		];
	}

	/**
	 * Return the start of an hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	function getWeekDomain(d) {
		var start = d3.time.monday(d);
		var end = start;
		return [
			new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0),
			new Date(start.getTime() + 3600 * 24 * 7 * 1000)
		];
	}

	/**
	 * Return the start of an hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	function getMonthDomain(d) {
		var start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0);
		var monthToAddForSameYear = 0;
		var monthToAddForNextYear = 0;

		if ((start.getMonth()+options.range) > 12) {
			monthToAddForSameYear = start.getMonth() + options.range - 12;
			monthToAddForNextYear = options.range - monthToAddForSameYear;
		} else {
			monthToAddForSameYear = options.range;
		}

		return [
			start,
			new Date(
				(start.getMonth() < 12 ? start.getFullYear() : (start.getFullYear()+1)),
				(monthToAddForNextYear === 0 ? (start.getMonth()+options.range) : (start.getMonth()+options.range-12)),
				0,
				0,
				0
			)
		];
	}

	/**
	 * Return the start of an hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	function getYearDomain(d) {
		return [
			new Date(d.getFullYear(), 0, 1, 0, 0),
			new Date(d.getFullYear()+1, 0, 1, 0, 0)
		];
	}


	function getDomain(date) {
		if (typeof date === "number") {
			date = new Date(date);
		}

		switch(options.domain) {
			case "hour" : return getHourDomain(date);
			case "day" : return getDayDomain(date);
			case "week" : return getWeekDomain(date);
			case "month" : return getMonthDomain(date);
			case "year" : return getYearDomain(date);
		}
	}

	function getSubDomain(date) {
		if (typeof date === "number") {
			date = new Date(date);
		}

		switch(options.subDomain) {
			case "min" : return getMinuteSubDomain(date);
			case "hour" : return getHourSubDomain(date);
			case "day" : return getDaySubDomain(date);
			case "week" : return getWeekSubDomain(date);
			case "month" : return getMonthSubDomain(date);
		}
	}

	return {
		init : function(settings) {

			// Merge settings with default
			if ( settings !== null && settings !== undefined && settings !== "undefined" ){
					for ( var opt in options ) {
						if ( settings[ opt ] !== null &&
							settings[ opt ] !== undefined &&
							settings[ opt ] !== "undefined" ){
								options[ opt ] = settings[ opt ];
					}
				}
			}

			if (options.uri === "") {
				options.uri = "/api/scheduled-jobs/stats/"+ parseInt(options.start.getTime()/1000, 10) + "/" + parseInt(dataEndDate.getTime()/1000, 10);
			}

			if (!allowedDomains.hasOwnProperty(options.domain)) {
				console.log("The domain name is not valid");
				return false;
			}

			return init();

		},

		getDomain : function(date) {
			return getDomain(date);
		},

		getSubDomain : function(date) {
			return getSubDomain(date);
		}
	};

}();