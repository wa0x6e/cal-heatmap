/*!
	Cal-HeatMap v1.0.0
	------------------
	A module to create calendar heat map
	to visualise time data series a la github contribution graph

	Licensed under the MIT license.
	Copyright 2013 Wan Qi Chen
	https://github.com/kamisama/cal-heatmap
*/

var CalHeatMap = function() {

	var self = this;

	// Default settings
	this.options = {
		// DOM ID of the container to append the graph to
		id : "cal-heatmap",

		// Threshold for each scale
		scales : [10,20,30,40],

		// Number of domain to display on the graph
		range : 12,

		// Size of each cell, in pixel
		cellsize : 10,

		// Padding between each cell, in pixel
		cellpadding : 2,

		format : {
			// Formatting of the date when hovering an subdomain block
			// @default : null, will use the formatting according to domain type
			date : null,

			// Formatting of domain label
			// @default : null, will use the formatting according to domain type
			legend : null
		},

		// Callback when clicking on a time block
		onClick : function(date, itemNb) {},

		// Whether to display the scale
		displayScale : true,

		// Name of the items to represent in the calendar
		itemName : ["item", "items"],

		// Start date of the graph
		// @default now
		start : new Date(),

		// URL, where to fetch the original datas
		uri : "",

		// Load remote data on calendar creation
		// When false, the calendar will be left empty
		loadOnInit : true,

		domain : "hour",

		subDomain : "min"
	};



	var domainType = {
		"min" : {
			row: 10,
			column: function(d) { return 6; },
			position: {
				x : function(d) { return Math.floor(d.getMinutes() / domainType.min.row); },
				y : function(d) { return d.getMinutes() % domainType.min.row;}
			},
			format: {
				date: "%H:%M, %A %B %-e, %Y",
				legend: "",
				connector: "at"
			},
			extractUnit : function(d) { return d.getMinutes(); }
		},
		"hour" : {
			row: 6,
			column: function(d) {
				switch(self.options.domain) {
					case "day" : return 4;
					case "week" : return 28;
					case "month" : return self.getEndOfMonth(d).getDate() * 4;
				}
			},
			position: {
				x : function(d) {
					if (self.options.domain === "month") {
						return Math.floor(d.getHours() / domainType.hour.row) + (d.getDate()-1)*4;
					} else if (self.options.domain === "week") {
						return Math.floor(d.getHours() / domainType.hour.row) + self.getWeekDay(d)*4;
					}
					return Math.floor(d.getHours() / domainType.hour.row);
				},
				y : function(d) { return d.getHours() % domainType.hour.row;}
			},
			format: {
				date: "%Hh, %A %B %-e, %Y",
				legend: "%H:00",
				connector: "at"
			},
			extractUnit : function(d) {
				var formatHour = d3.time.format("%H");
				return d.getFullYear() + "" +  self.getDayOfYear(d) + "" + formatHour(d);
			}
		},
		"day" : {
			row: 7,
			column: function() {
				switch(self.options.domain) {
					case "year" : return 54;
					case "month" : return 5;
					case "week" : return 1;
				}
			},
			position: {
				x : function(d) {
					switch(self.options.domain) {
						case "week" : return 0;
						case "month" :
							return self.getWeekNumber(d) - self.getWeekNumber(new Date(d.getFullYear(), d.getMonth()));
						case "year" : return self.getWeekNumber(d) ;
					}
				},
				y : function(d) { return (d.getDay() === 0 ? 6 : d.getDay()-1);}
			},
			format: {
				date: "%A %B %-e, %Y",
				legend: "%e %b",
				connector: "on"
			},
			extractUnit : function(d) { return d.getFullYear() + "" + self.getDayOfYear(d); }
		},
		"week" : {
			row: 1,
			column: function(d) {
				d = new Date(d);
				switch(self.options.domain) {
					case "year" : return 54;
					case "month" : return self.getWeekNumber(new Date(d.getFullYear(), d.getMonth()+1, 0)) - self.getWeekNumber(d);
				}
				return 1;
			},
			position: {
				x: function(d) {
					switch(self.options.domain) {
						case "year" : return self.getWeekNumber(d);
						case "month" : return self.getWeekNumber(d) - self.getWeekNumber(new Date(d.getFullYear(), d.getMonth())) - 1;
					}
				},
				y: function(d) {
					return 0;
				}
			},
			format: {
				date: "%B Week #%W",
				legend: "%B Week #%W",
				connector: "on"
			},
			extractUnit : function(d) { return self.getWeekNumber(d); }
		},
		"month" : {
			row: 1,
			column: function(d) {return 12;},
			position: {
				x : function(d) { return Math.floor(d.getMonth() / domainType.month.row); },
				y : function(d) { return d.getMonth() % domainType.month.row;}
			},
			format: {
				date: "%B %Y",
				legend: "%B",
				connector: "on"
			},
			extractUnit : function(d) { return d.getMonth(); }
		},
		"year" : {
			row: 1,
			column: function(d) {return 12;},
			position: {
				x : function(d) { return Math.floor(d.getFullYear() / domainType.year.row); },
				y : function(d) { return d.getFullYear() % domainType.year.row;}
			},
			format: {
				date: "%Y",
				legend: "%Y",
				connector: "on"
			},
			extractUnit : function(d) { return d.getFullYear(); }
		}
	};

	var formatDate,
		formatNumber = d3.format(",d");

	this.svg = null;
	var rect = null;

	// Record all the valid domains
	// Each domain value is a timestamp in milliseconds
	this._domains = [];

	function positionSubDomainX(d) {
		var index = domainType[self.options.subDomain].position.x(d);
		return index * self.options.cellsize + index * self.options.cellpadding;
	}

	function positionSubDomainY(d) {
		var index = domainType[self.options.subDomain].position.y(d);
		return index * self.options.cellsize + index * self.options.cellpadding;
	}




	/**
	 * Display the graph for the first time
	 * @return bool True if the calendar is created
	 */
	var _init = function() {

		var graphLegendHeight = self.options.cellsize*2;

		formatDate = d3.time.format(self.options.format.date);

		// Compute the width of the domain block
		var w = function(d) {
			return self.options.cellsize*domainType[self.options.subDomain].column(d) + self.options.cellpadding*domainType[self.options.subDomain].column(d);
		};

		// Compute the height of the domain block
		var h = self.options.cellsize*domainType[self.options.subDomain].row + self.options.cellpadding*domainType[self.options.subDomain].row + self.options.cellpadding;

		// Format the domain legend according to the domain type
		var legendFormat = d3.time.format(self.options.format.legend);

		self._domains = self.getDomain(self.options.start).map(function(d) { return d.getTime(); });

		// Painting all the domains
		self.svg = d3.select("#" + self.options.id)
			.append("div")
			.attr("class", "graph")
			.selectAll()
			.data(self._domains)
			.enter().append("div")
			.attr("class", "graph-domain")
			.style("width", function(d) { return w(d) + "px"; })
			.style("height", h + graphLegendHeight + "px")
			.style("display", "inline-block")
			.append("svg:svg")
			.attr("width", function(d){ return w(d); })
			.attr("height", h + graphLegendHeight)
			.append("svg:g")
			.attr("transform", "translate(0, 1)");

		// Addending a label to each domain
		self.svg.append("svg:text")
			.attr("y", h + graphLegendHeight/1.5)
			.attr("class", "graph-label")
			.attr("text-anchor", "middle")
			.attr("vertical-align", "middle")
			.attr("x", function(d){ return w(d)/2; })
			.text(function(d) { return legendFormat(new Date(d)); });

		// Drawing the sudomain inside each domain
		rect = self.svg.selectAll("rect")
			.data(function(d) { return self.getSubDomain(d); })
			.enter().append("svg:rect")
			.attr("class", "graph-rect")
			.attr("width", self.options.cellsize)
			.attr("height", self.options.cellsize)
			.attr("x", function(d) { return positionSubDomainX(d); })
			.attr("y", function(d) { return positionSubDomainY(d); })
			;

		// Appeding a title to each subdomain
		rect.append("svg:title").text(function(d){ return formatDate(d); });

		// Display scale if needed
		if (self.options.displayScale) {
			self.displayScale();
		}

		// Get datas from remote, parse them to expected format, then display them in the graph
		if (self.options.loadOnInit) {
			self.fill(self.options.uri);
		}

		return true;
	};

	this.fill = function(uri) {
		d3.json(uri, function(data) {
			display(parseDatas(data));
		});
	};



	/**
	 * Colorize all rectangles according to their items count
	 *
	 * @param  {[type]} data  [description]
	 */
	function display (data) {
		self.svg.each(function(domainUnit) {
			d3.select(this).selectAll("rect")
				.attr("class", function(d) {
					var subDomainUnit = domainType[self.options.subDomain].extractUnit(d);

					return "graph-rect" +
					((data.hasOwnProperty(domainUnit) && data[domainUnit].hasOwnProperty(subDomainUnit)) ?
						(" " + self.scale(data[domainUnit][subDomainUnit])) : ""
					);
				})
				.on("click", function(d) {
					var subDomainUnit = domainType[self.options.subDomain].extractUnit(d);
					return self.onClick(
						d,
						(data.hasOwnProperty(domainUnit) && data[domainUnit].hasOwnProperty(subDomainUnit)) ? data[domainUnit][subDomainUnit] : 0
					);
				})
				.select("title")
				.text(function(d) {
					var subDomainUnit = domainType[self.options.subDomain].extractUnit(d);

					return (
					((data.hasOwnProperty(domainUnit) && data[domainUnit].hasOwnProperty(subDomainUnit)) ?
						(formatNumber(data[domainUnit][subDomainUnit]) + " " + self.options.itemName[(data[domainUnit][subDomainUnit] > 1 ? 1 : 0)] + " " + domainType[self.options.subDomain].format.connector + " ") :
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
			var domainUnit = self.getDomain(date)[0].getTime();

			// Don't record datas not relevant to the current domain
			if (self._domains.indexOf(domainUnit) < 0) {
				continue;
			}

			var subDomainUnit = domainType[self.options.subDomain].extractUnit(date);
			if (typeof stats[domainUnit] === "undefined") {
				stats[domainUnit] = {};
			}

			if (typeof stats[domainUnit][subDomainUnit] !== "undefined") {
				stats[domainUnit][subDomainUnit] += data[d];
			} else {
				stats[domainUnit][subDomainUnit] = data[d];
			}
		}

		return stats;
	}


	this.init = function(settings) {

		// Merge settings with default
		if ( settings !== null && settings !== undefined && settings !== "undefined" ){
				for ( var opt in self.options ) {
					if ( settings[ opt ] !== null &&
						settings[ opt ] !== undefined &&
						settings[ opt ] !== "undefined" ){
							self.options[ opt ] = settings[ opt ];
				}
			}
		}

		if (!domainType.hasOwnProperty(self.options.domain) || self.options.domain === "min") {
			console.log("The domain name is not valid");
			return false;
		}

		var domain = self.getDomain(self.options.start);

		if (self.options.uri === "") {
			self.options.uri = "/api/scheduled-jobs/stats/"+ parseInt(self.options.start.getTime()/1000, 10) + "/" + parseInt(domain[domain.length-1].getTime()/1000, 10);
		}

		if (self.options.format.date === null) {
			self.options.format.date = domainType[self.options.subDomain].format.date;
		}

		if (self.options.format.legend === null) {
			self.options.format.legend = domainType[self.options.domain].format.legend;
		}

		return _init();

	};

};







CalHeatMap.prototype = {

	/**
	 * Function to execute when clicking on a subdomain block
	 * @param  Date		d		Date of the subdomain block
	 * @param  int		itemNb	Number of items in that date
	 */
	onClick : function(d, itemNb) {
		return this.options.onClick(d, itemNb);
	},



	displayScale: function() {

		var parent = this;

		var scale = d3.select("#" + this.options.id)
			.append("svg:svg")
			.attr("class", "graph-scale")
			.attr("height", this.options.cellsize + (this.options.cellpadding*2))
			.selectAll().data(d3.range(0, this.options.scales.length+1))
			.enter()
			.append("svg:rect")
			.attr("width", this.options.cellsize)
			.attr("height", this.options.cellsize)
			.attr("class", function(d){ return "graph-rect q" + (d+1); })
			.attr("transform", function(d) { return "translate(" + (d * (parent.options.cellsize + parent.options.cellpadding))  + ", " + parent.options.cellpadding + ")"; })
			.append("svg:title")
			.text(function(d) {
				var nextThreshold = parent.options.scales[d+1];
				if (d === 0) {
					return "less than " + parent.options.scales[d] + " " + parent.options.itemName[1];
				} else if (d === parent.options.scales.length) {
					return "more than " + parent.options.scales[d-1] + " " + parent.options.itemName[1];
				} else {
					return "between " + parent.options.scales[d-1] + " and " + parent.options.scales[d] + " " + parent.options.itemName[1];
				}
			})
		;
	},


	/**
	 * Return the day of the year for the date
	 * @param	Date
	 * @return  int Day of the year [1,366]
	 */
	getDayOfYear : d3.time.format("%j"),

	/**
	 * Return the week number of the year
	 * Monday as the first day of the week
	 * @return int	Week number [0-53]
	 */
	getWeekNumber : d3.time.format("%W"),


	getWeekDay : function(d) {
		if (d.getDay() === 0) {
			return 6;
		}
		return d.getDay()-1;
	},


	/**
	 * Get the last day of the month
	 * @param  Date|int	d	Date or timestamp in milliseconds
	 * @return Date			Last day of the month
	 */
	getEndOfMonth : function(d) {
		if (typeof d === "number") {
			d = new Date(d);
		}
		return new Date(d.getFullYear(), d.getMonth()+1, 0);
	},

	/**
	 * Return a range if week number
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	getWeekDomain: function (d, range) {
		var monday;
		if (d.getDay() === 1) {
			monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		} else if (d.getDay() === 0) {
			monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
			monday.setDate(monday.getDate() - 6);
		} else {
			monday = new Date(d.getFullYear(), d.getMonth(), d.getDate()-d.getDay()+1);
		}
		var endDate = new Date(monday);
		return d3.time.mondays(monday, new Date(endDate.setDate(endDate.getDate() + range*7)));
	},

	getYearDomain: function(d, range){
		return d3.time.years(new Date(d.getFullYear(), 0), new Date(d.getFullYear()+range, 0));
	},

	/**
	 * Return all the minutes between from the same hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	getMinuteDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
		return d3.time.minutes(start, new Date(start.getTime() + 60 * 1000 * range));
	},

	/**
	 * Return the start of an hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	getHourDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
		if (typeof range === "number") {
			range = new Date(start.getTime() + 3600 * 1000 * range);
		}
		return d3.time.hours(start,	range);
	},

	/**
	 * Return the start of an hour
	 * @param  number|Date	d		A date, or timestamp in milliseconds
	 * @param  int			range	Number of days in the range
	 * @return Date					The start of the hour
	 */
	getDayDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		var end = new Date(start);
		end = new Date(end.setDate(end.getDate()+ parseInt(range, 10)));
		return d3.time.days(start, end);
	},

	/**
	 * Return the month domain for the current date
	 * @param  Date		d	A date
	 * @return Array
	 */
	getMonthDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth());
		var end = new Date(start);
		end = end.setMonth(end.getMonth()+range);

		return d3.time.months(start, end);
	},

	getDomain: function(date) {
		if (typeof date === "number") {
			date = new Date(date);
		}

		switch(this.options.domain) {
			case "hour"  : return this.getHourDomain(date, this.options.range);
			case "day"   : return this.getDayDomain(date, this.options.range);
			case "week"  : return this.getWeekDomain(date, this.options.range);
			case "month" : return this.getMonthDomain(date, this.options.range);
			case "year"  : return this.getYearDomain(date, this.options.range);
		}
	},

	getSubDomain: function(date) {
		if (typeof date === "number") {
			date = new Date(date);
		}

		var parent = this;

		var computeDaySubDomainSize = function(date, domain) {
			if (domain === "year") {
				return parent.getDayOfYear(new Date(date.getFullYear()+1, 0, 0));
			} else if (domain === "month") {
				var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
				return lastDayOfMonth.getDate();
			} else if (domain === "week") {
				return 7;
			}
		};

		var computeMinSubDomainSize = function(date, domain) {
			if (domain === "day") {
				return 1440;
			} else if (domain === "hour") {
				return 60;
			} else if (domain === "week") {
				return 25200;
			}
		};

		var computeHourSubDomainSize = function(date, domain) {
			if (domain === "day") {
				return 24;
			} else if (domain === "week") {
				return 168;
			} else if (domain === "month") {
				var endOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
				return endOfMonth.getDate() * 24;
			}
		};

		var computeWeekSubDomainSize = function(date, domain) {
			if (domain === "month") {
				var endOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
				var endWeekNb = parent.getWeekNumber(endOfMonth);
				var startWeekNb = parent.getWeekNumber(new Date(date.getFullYear(), date.getMonth()));

				if (startWeekNb > endWeekNb) {
					startWeekNb = 0;
					endWeekNb++;
				}

				return endWeekNb - startWeekNb + 1;
			} else if (domain === "year") {
				return parent.getDayOfYear(new Date(date.getFullYear(), 11, 31));
			}
		};


		switch(this.options.subDomain) {
			case "min"   : return this.getMinuteDomain(date, computeMinSubDomainSize(date, this.options.domain));
			case "hour"  : return this.getHourDomain(date, computeHourSubDomainSize(date, this.options.domain));
			case "day"   : return this.getDayDomain(date, computeDaySubDomainSize(date, this.options.domain));
			case "week"  : return this.getWeekDomain(date, computeWeekSubDomainSize(date, this.options.domain));
			case "month" : return this.getMonthDomain(date, 12);
		}


	},

	/**
	 * Return the classname on the scale for the specified value
	 *
	 * @param  Item count n Number of items for that perdiod of time
	 * @return string		Classname according to the scale
	 */
	scale: function(n) {
		for (var i = 0, total = this.options.scales.length-1; i < total; i++) {

			if (n === 0 && this.options.scales[0] > 0) {
				return "";
			} else if (this.options.scales[0] > 0 && n < 0) {
				return "qi";
			}

			if (n <= this.options.scales[i]) {
				return "q" + (i+1);
			}
		}
		return "q" + this.options.scales.length;
	}

};




