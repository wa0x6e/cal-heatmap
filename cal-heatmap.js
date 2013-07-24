/*! cal-heatmap v3.0.7 (Wed Jul 24 2013 18:16:30)
 *  ---------------------------------------------
 *  Cal-Heatmap is a javascript module to create calendar heatmap to visualize time series data, a la github contribution graph
 *  https://github.com/kamisama/cal-heatmap
 *  Licensed under the MIT license
 *  Copyright 2013 Wan Qi Chen
 */

var CalHeatMap = function() {

	"use strict";

	var self = this;

	var allowedDataType = ["json", "csv", "tsv", "txt"];

	// Default settings
	this.options = {
		// selector string of the container to append the graph to
		// Accept any string value accepted by document.querySelector or CSS3
		// or an Element object
		itemSelector : "#cal-heatmap",

		// Whether to paint the calendar on init()
		// Used by testsuite to reduce testing time
		paintOnLoad : true,

		// ================================================
		// DOMAIN
		// ================================================

		// Number of domain to display on the graph
		range : 12,

		// Size of each cell, in pixel
		cellSize : 10,

		// Padding between each cell, in pixel
		cellPadding : 2,

		// For rounded subdomain rectangles, in pixels
		cellRadius: 0,

		domainGutter : 2,

		domainMargin: [0,0,0,0],

		domain : "hour",

		subDomain : "min",

		// First day of the week is Monday
		// 0 to start the week on Sunday
		weekStartOnMonday : true,

		// Start date of the graph
		// @default now
		start : new Date(),

		// URL, where to fetch the original datas
		data : "",

		dataType: allowedDataType[0],

		// Load remote data on calendar creation
		// When false, the calendar will be left empty
		loadOnInit : true,

		// Calendar orientation
		// false : display domains side by side
		// true  : display domains one under the other
		verticalOrientation: false,

		// Domain dynamic width/height
		// The width on a domain depends on the number of
		domainDynamicDimension: true,

		// Domain Label properties
		label: {
			// valid : top, right, bottom, left
			position: "bottom",

			// Valid : left, center, right
			// Also valid are the direct svg values : start, middle, end
			align: "center",

			// By default, there is no margin/padding around the label
			offset: {
				x: 0,
				y: 0
			},

			rotate: null,

			width: 100
		},

		// ================================================
		// LEGEND
		// ================================================

		// Threshold for the legend
		legend : [10,20,30,40],

		// Whether to display the legend
		displayLegend : true,

		legendCellSize: 10,

		legendCellPadding: 2,

		legendMargin: [10, 0, 0, 0],

		// Legend vertical position
		// top : place legend above calendar
		// bottom: place legend below the calendar
		legendVerticalPosition: "bottom",

		// Legend horizontal position
		// accepted values : left, center, right
		legendHorizontalPosition: "left",


		// ================================================
		// HIGHLIGHT
		// ================================================

		// List of dates to highlight
		// Valid values :
		// - [] : don't highlight anything
		// - "now" : highlight the current date
		// - an array of Date objects : highlight the specified dates
		highlight : [],

		// ================================================
		// TEXT FORMATTING / i18n
		// ================================================

		// Name of the items to represent in the calendar
		itemName : ["item", "items"],

		// Formatting of the domain label
		// @default: null, will use the formatting according to domain type
		// Accept a string used as specifier by d3.time.format()
		// or a function
		//
		// Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
		// for accepted date formatting used by d3.time.format()
		domainLabelFormat: null,

		// Formatting of the title displayed when hovering a subDomain cell
		subDomainTitleFormat : {
			empty: "{date}",
			filled: "{count} {name} {connector} {date}"
		},

		// Formatting of the {date} used in subDomainTitleFormat
		// @default : null, will use the formatting according to subDomain type
		// Accept a string used as specifier by d3.time.format()
		// or a function
		//
		// Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
		// for accepted date formatting used by d3.time.format()
		subDomainDateFormat: null,

		// Formatting of the text inside each subDomain cell
		// @default: null, no text
		// Accept a string used as specifier by d3.time.format()
		// or a function
		//
		// Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
		// for accepted date formatting used by d3.time.format()
		subDomainTextFormat: null,

		// Formatting of the title displayed when hovering a legend cell
		legendTitleFormat : {
			lower: "less than {min} {name}",
			inner: "between {down} and {up} {name}",
			upper: "more than {max} {name}"
		},

		// Animation duration, in ms
		animationDuration : 500,

		nextSelector: false,

		previousSelector: false,

		itemNamespace: "cal-heatmap",


		// ================================================
		// CALLBACK
		// ================================================

		// Callback when clicking on a time block
		onClick : null,

		// Callback after painting the empty calendar
		afterLoad : null,

		// Callback after loading the next domain in the calendar
		afterLoadNextDomain : function(start) {},

		// Callback after loading the previous domain in the calendar
		afterLoadPreviousDomain : function(start) {},

		// Callback after finishing all actions on the calendar
		onComplete : null,

		// Callback after fetching the datas, but before applying them to the calendar
		// Used mainly to convert the datas if they're not formatted like expected
		// Takes the fetched "data" object as argument, must return a json object
		// formatted like {timestamp:count, timestamp2:count2},
		afterLoadData : function(data) { return data; }
	};



	this._domainType = {
		"min" : {
			name: "minute",
			level: 10,
			row: function(d) {return 10;},
			column: function(d) { return 6; },
			position: {
				x : function(d) { return Math.floor(d.getMinutes() / self._domainType.min.row(d)); },
				y : function(d) { return d.getMinutes() % self._domainType.min.row(d);}
			},
			format: {
				date: "%H:%M, %A %B %-e, %Y",
				legend: "",
				connector: "at"
			},
			extractUnit : function(d) { return d.getMinutes(); }
		},
		"hour" : {
			name: "hour",
			level: 20,
			row: function(d) {return 6;},
			column: function(d) {
				switch(self.options.domain) {
					case "day" : return 4;
					case "week" : return 28;
					case "month" : return (self.options.domainDynamicDimension ? self.getEndOfMonth(d).getDate() : 31) * 4;
				}
			},
			position: {
				x : function(d) {
					if (self.options.domain === "month") {
						return Math.floor(d.getHours() / self._domainType.hour.row(d)) + (d.getDate()-1)*4;
					} else if (self.options.domain === "week") {
						return Math.floor(d.getHours() / self._domainType.hour.row(d)) + self.getWeekDay(d)*4;
					}
					return Math.floor(d.getHours() / self._domainType.hour.row(d));
				},
				y : function(d) { return d.getHours() % self._domainType.hour.row(d);}
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
			name: "day",
			level: 30,
			row: function(d) {return 7;},
			column: function(d) {
				d = new Date(d);
				switch(self.options.domain) {
					case "year" : return (self.options.domainDynamicDimension ? (self.getWeekNumber(new Date(d.getFullYear(), 11, 31)) - self.getWeekNumber(new Date(d.getFullYear(), 0)) + 1) : 54);
					case "month" :
						if (self.options.verticalOrientation) {
							return 6;
						} else {
							return self.options.domainDynamicDimension ? (self.getWeekNumber(new Date(d.getFullYear(), d.getMonth()+1, 0)) - self.getWeekNumber(d) + 1) : 6;
						}
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
				y : function(d) { return self.getWeekDay(d);}
			},
			format: {
				date: "%A %B %-e, %Y",
				legend: "%e %b",
				connector: "on"
			},
			extractUnit : function(d) { return d.getFullYear() + "" + self.getDayOfYear(d); }
		},
		"week" : {
			name: "week",
			level: 40,
			row: function(d) {return 1;},
			column: function(d) {
				d = new Date(d);
				switch(self.options.domain) {
					case "year" : return 54;
					case "month" : return self.getWeekNumber(new Date(d.getFullYear(), d.getMonth()+1, 0)) - self.getWeekNumber(d);
					default: return 1;
				}
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
			name: "month",
			level: 50,
			row: function(d) {return 1;},
			column: function(d) {return 12;},
			position: {
				x : function(d) { return Math.floor(d.getMonth() / self._domainType.month.row(d)); },
				y : function(d) { return d.getMonth() % self._domainType.month.row(d);}
			},
			format: {
				date: "%B %Y",
				legend: "%B",
				connector: "on"
			},
			extractUnit : function(d) { return d.getMonth(); }
		},
		"year" : {
			name: "year",
			level: 60,
			row: function(d) {return 1;},
			column: function(d) {return 12;},
			position: {
				x : function(d) { return Math.floor(d.getFullYear() / this._domainType.year.row(d)); },
				y : function(d) { return d.getFullYear() % this._domainType.year.row(d);}
			},
			format: {
				date: "%Y",
				legend: "%Y",
				connector: "on"
			},
			extractUnit : function(d) { return d.getFullYear(); }
		}
	};

	for (var type in this._domainType) {
		this._domainType["x_" + type] = {};
		this._domainType["x_" + type].name = "x_" + type;
		this._domainType["x_" + type].level = this._domainType[type].level;
		this._domainType["x_" + type].row = this._domainType[type].column;
		this._domainType["x_" + type].column = this._domainType[type].row;
		this._domainType["x_" + type].position = {};
		this._domainType["x_" + type].position.x = this._domainType[type].position.y;
		this._domainType["x_" + type].position.y = this._domainType[type].position.x;
		this._domainType["x_" + type].format = this._domainType[type].format;
		this._domainType["x_" + type].extractUnit = this._domainType[type].extractUnit;
	}

	// Exception : always return the maximum number of weeks
	// to align the label vertically
	this._domainType.x_day.row = function(d) {
		d = new Date(d);
		switch(self.options.domain) {
			case "year" : return (self.options.domainDynamicDimension ? (self.getWeekNumber(new Date(d.getFullYear(), 11, 31)) - self.getWeekNumber(new Date(d.getFullYear(), 0)) + 1) : 54);
			case "month" :
				if (!self.options.verticalOrientation) {
					return 6;
				} else {
					return self.options.domainDynamicDimension ? (self.getWeekNumber(new Date(d.getFullYear(), d.getMonth()+1, 0)) - self.getWeekNumber(d) + 1) : 6;
				}
			case "week" : return 1;
		}
	};


	this.svg = null;

	this._completed = false;

	// Record all the valid domains
	// Each domain value is a timestamp in milliseconds
	this._domains = [];

	var graphDim = {
		width: 0,
		height: 0
	};

	this.NAVIGATE_LEFT = 1;
	this.NAVIGATE_RIGHT = 2;

	this.root = null;

	this.domainPosition = new DomainPosition();

	/**
	 * Display the graph for the first time
	 * @return bool True if the calendar is created
	 */
	function _init() {

		self._domains = self.getDomain(self.options.start).map(function(d) { return d.getTime(); });

		self.root = d3.select(self.options.itemSelector);

		self.root.append("svg").attr("class", "graph");

		if (self.options.paintOnLoad) {

			self.paint();

			// =========================================================================//
			// ATTACHING DOMAIN NAVIGATION EVENT										//
			// =========================================================================//
			if (self.options.nextSelector !== false) {
				d3.select(self.options.nextSelector).on("click." + self.options.itemNamespace, function(d) {
					d3.event.preventDefault();
					self.loadNextDomain();
				});
			}

			if (self.options.previousSelector !== false) {
				d3.select(self.options.previousSelector).on("click." + self.options.itemNamespace, function(d) {
					d3.event.preventDefault();
					self.loadPreviousDomain();
				});
			}

			// Display legend if needed
			if (self.options.displayLegend) {
				self.displayLegend(graphDim.width - self.options.domainGutter - self.options.cellPadding);
			}

			if (self.options.afterLoad !== null) {
				self.afterLoad();
			}

			// Fill the graph with some datas
			if (self.options.loadOnInit) {
				self.getDatas(
					self.options.data,
					new Date(self._domains[0]),
					self.getSubDomain(self._domains[self._domains.length-1]).pop(),
					function(data) {
						self.fill(data, self.svg);
					}
				);
			} else {
				self.onComplete();
			}
		}

		return true;
	}


	/**
	 *
	 *
	 * @param int navigationDir
	 */
	this.paint = function(navigationDir) {

		if (typeof navigationDir === "undefined") {
			navigationDir = false;
		}

		var verticalDomainLabel = (self.options.label.position === "top" || self.options.label.position === "bottom");

		var domainVerticalLabelHeight = Math.max(25, self.options.cellSize*2);
		var domainHorizontalLabelWidth = 0;

		if (!verticalDomainLabel) {
			domainVerticalLabelHeight = 0;
			domainHorizontalLabelWidth = self.options.label.width;
		}

		// @todo : check validity
		if (typeof self.options.domainMargin === "number") {
			self.options.domainMargin = [self.options.domainMargin, self.options.domainMargin, self.options.domainMargin, self.options.domainMargin];
		}

		// Return the width of the domain block, without the domain gutter
		// @param int d Domain start timestamp
		var w = function(d, outer) {
			var width = self.options.cellSize*self._domainType[self.options.subDomain].column(d) + self.options.cellPadding*self._domainType[self.options.subDomain].column(d);
			if (typeof outer !== "undefined" && outer === true) {
				return width += domainHorizontalLabelWidth + self.options.domainGutter + self.options.domainMargin[1] + self.options.domainMargin[3];
			}
			return width;
		};

		// Return the height of the domain block, without the domain gutter
		var h = function(d, outer) {
			var height = self.options.cellSize*self._domainType[self.options.subDomain].row(d) + self.options.cellPadding*self._domainType[self.options.subDomain].row(d);
			if (typeof outer !== "undefined" && outer === true) {
				height += self.options.domainGutter + domainVerticalLabelHeight + self.options.domainMargin[0] + self.options.domainMargin[2];
			}
			return height;
		};

		// Painting all the domains
		var domainSvg = self.root.select(".graph")
			.selectAll(".graph-domain")
			.data(self._domains, function(d) { return d;})
		;

		var enteringDomainDim = 0;
		var exitingDomainDim = 0;


		// =========================================================================//
		// PAINTING DOMAIN															//
		// =========================================================================//

		var svg = domainSvg
			.enter()
			.append("svg")
			.attr("width", function(d, i){
				return w(d, true);
			})
			.attr("height", function(d) {
				return h(d, true);
			})
			.attr("x", function(d, i) {
				if (self.options.verticalOrientation) {
					graphDim.width = w(d, true);
					return 0;
				} else {
					return getDomainPosition(i, graphDim, "width", w(d, true));
				}
			})
			.attr("y", function(d, i) {
				if (self.options.verticalOrientation) {
					return getDomainPosition(i, graphDim, "height", h(d, true));
				} else {
					graphDim.height = h(d, true);
					return 0;
				}
			})
			.attr("class", function(d) {
				var classname = "graph-domain";
				var date = new Date(d);
				switch(self.options.domain) {
					case "hour" : classname += " h_" + date.getHours();
					case "day" : classname += " d_" + date.getDate() + " dy_" + date.getDay();
					case "week" : classname += " w_" + self.getWeekNumber(date);
					case "month" : classname += " m_" + (date.getMonth() + 1);
					case "year" : classname += " y_" + date.getFullYear();
				}
				return classname;
			})
		;

		function getDomainPosition(index, graphDim, axis, domainDim) {
			var tmp = 0;
			switch(navigationDir) {
				case false :
					if (index > 0) {
						tmp = graphDim[axis];
					}

					graphDim[axis] += domainDim;
					self.domainPosition.pushPosition(tmp);
					return tmp;

				case self.NAVIGATE_RIGHT :
					self.domainPosition.pushPosition(graphDim[axis]);

					enteringDomainDim = domainDim;
					exitingDomainDim = self.domainPosition.getPosition(1);

					self.domainPosition.shiftRight(exitingDomainDim);
					return graphDim[axis];

				case self.NAVIGATE_LEFT :
					tmp = -domainDim;

					enteringDomainDim = -tmp;
					exitingDomainDim = graphDim[axis] - self.domainPosition.getLast();

					self.domainPosition.unshiftPosition(tmp);
					self.domainPosition.shiftLeft(enteringDomainDim);
					return tmp;
			}
		}

		svg.append("rect")
			.attr("width", function(d, i) { return w(d, true) - self.options.domainGutter - self.options.cellPadding; })
			.attr("height", function(d, i) { return h(d, true) - self.options.domainGutter - self.options.cellPadding; })
			.attr("class", "domain-background")
			;

		// =========================================================================//
		// PAINTING SUBDOMAINS														//
		// =========================================================================//
		var subDomainSvgGroup = svg.append("svg")
			.attr("x", function(d, i) {
				switch(self.options.label.position) {
					case "left" : return domainHorizontalLabelWidth + self.options.domainMargin[3];
					default : return self.options.domainMargin[3];
				}
			})
			.attr("y", function(d, i) {
				switch(self.options.label.position) {
					case "top" : return domainVerticalLabelHeight + self.options.domainMargin[0];
					default : return self.options.domainMargin[0];
				}
			})
			.attr("class", "graph-subdomain-group")
		;

		var rect = subDomainSvgGroup
			.selectAll("svg")
			.data(function(d) { return self.getSubDomain(d); })
			.enter()
			.append("g")
		;

		rect
			.append("rect")
			.attr("class", function(d) {
				return "graph-rect" + self.getHighlightClassName(d) + (self.options.onClick !== null ? " hover_cursor" : "");
			})
			.attr("width", self.options.cellSize)
			.attr("height", self.options.cellSize)
			.attr("x", function(d) { return self.positionSubDomainX(d); })
			.attr("y", function(d) { return self.positionSubDomainY(d); })
			.on("click", function(d) {
				if (self.options.onClick !== null) {
					return self.onClick(d, null);
				}
			})
			.call(radius)
		;

		function radius(selection) {
			if (self.options.cellRadius > 0) {
				selection
					.attr("rx", self.options.cellRadius)
					.attr("ry", self.options.cellRadius)
				;
			}
		}



		// =========================================================================//
		// PAINTING LABEL															//
		// =========================================================================//
		svg.append("text")
			.attr("class", "graph-label")
			.attr("y", function(d, i) {
				var y = self.options.domainMargin[0];
				switch(self.options.label.position) {
					case "top" : y += domainVerticalLabelHeight/2; break;
					case "bottom" : y += h(d) + domainVerticalLabelHeight/2;
				}

				return y + self.options.label.offset.y *
				(
					((self.options.label.rotate === "right" && self.options.label.position === "right") ||
					(self.options.label.rotate === "left" && self.options.label.position === "left")) ?
					-1 : 1
				);
			})
			.attr("x", function(d, i){
				var x = self.options.domainMargin[3];
				switch(self.options.label.position) {
					case "right" : x += w(d); break;
					case "bottom" :
					case "top" : x += w(d)/2;
				}

				if (self.options.label.align === "right") {
					return x + domainHorizontalLabelWidth - self.options.label.offset.x *
					(self.options.label.rotate === "right" ? -1 : 1);
				}
				return x + self.options.label.offset.x;

			})
			.attr("text-anchor", function() {
				switch(self.options.label.align) {
					case "start" :
					case "left" : return "start";
					case "end" :
					case "right" : return "end";
					default : return "middle";
				}
			})
			.attr("dominant-baseline", function() { return verticalDomainLabel ? "middle" : "top"; })
			.text(function(d, i) { return self.formatDate(new Date(self._domains[i]), self.options.domainLabelFormat); })
			.call(domainRotate)
		;

		function domainRotate(selection) {
			switch (self.options.label.rotate) {
				case "right" :
					selection
					.attr("transform", function(d) {
						var s = "rotate(90), ";
						switch(self.options.label.position) {
							case "right" : s += "translate(-" + w(d) + " , -" + w(d) + ")"; break;
							case "left" : s += "translate(0, -" + domainHorizontalLabelWidth + ")"; break;
						}

						return s;
					});
					break;
				case "left" :
					selection
					.attr("transform", function(d) {
						var s = "rotate(270), ";
						switch(self.options.label.position) {
							case "right" : s += "translate(-" + (w(d) + domainHorizontalLabelWidth) + " , " + w(d) + ")"; break;
							case "left" : s += "translate(-" + (domainHorizontalLabelWidth) + " , " + domainHorizontalLabelWidth + ")"; break;
						}

						return s;
					});
					break;
			}
		}


		// Appending a title to each subdomain
		rect.append("title").text(function(d){ return self.formatDate(d, self.options.subDomainDateFormat); });


		// =========================================================================//
		// PAINTING DOMAIN SUBDOMAIN CONTENT										//
		// =========================================================================//
		if (self.options.subDomainTextFormat !== null) {
			rect
				.append("text")
				.attr("class", function(d) { return "subdomain-text" + self.getHighlightClassName(d); })
				.attr("x", function(d) { return self.positionSubDomainX(d) + self.options.cellSize/2; })
				.attr("y", function(d) { return self.positionSubDomainY(d) + self.options.cellSize/2; })
				.attr("text-anchor", "middle")
				.attr("dominant-baseline", "central")
				.text(function(d){ return self.formatDate(d, self.options.subDomainTextFormat); })
			;
		}

		// =========================================================================//
		// ANIMATION																//
		// =========================================================================//

		if (navigationDir !== false) {
			domainSvg.transition().duration(self.options.animationDuration)
				.attr("x", function(d, i){
					if (self.options.verticalOrientation) {
						return 0;
					} else {
						return self.domainPosition.getPosition(i);
					}
				})
				.attr("y", function(d, i){
					if (self.options.verticalOrientation) {
						return self.domainPosition.getPosition(i);
					} else {
						return 0;
					}
				})
			;
		}

		var tempWidth = graphDim.width;
		var tempHeight = graphDim.height;

		if (self.options.verticalOrientation) {
			graphDim.height += enteringDomainDim - exitingDomainDim;
		} else {
			graphDim.width += enteringDomainDim - exitingDomainDim;
		}

		// At the time of exit, domainsWidth and domainsHeight already automatically shifted
		domainSvg.exit().transition().duration(self.options.animationDuration)
			.attr("x", function(d, i){
				if (self.options.verticalOrientation) {
					return 0;
				} else {
					switch(navigationDir) {
						case self.NAVIGATE_LEFT : return Math.min(graphDim.width, tempWidth);
						case self.NAVIGATE_RIGHT : return -w(d, true);
					}
				}
			})
			.attr("y", function(d){
				if (self.options.verticalOrientation) {
					switch(navigationDir) {
						case self.NAVIGATE_LEFT : return Math.min(graphDim.height, tempHeight);
						case self.NAVIGATE_RIGHT : return -h(d, true);
					}
				} else {
					return 0;
				}
			})
			.remove()
		;

		// Resize the graph
		self.root.select(".graph").transition().duration(self.options.animationDuration)
			.attr("width", function() { return graphDim.width - self.options.domainGutter - self.options.cellPadding; })
			.attr("height", function() { return graphDim.height - self.options.domainGutter - self.options.cellPadding; })
		;

		if (self.svg === null) {
			self.svg = svg;
		} else {
			self.svg = self.root.select(".graph").selectAll("svg")
			.data(self._domains, function(d) {return d;});
		}
	};


	this.init = function(settings) {

		self.options = mergeRecursive(self.options, settings);

		if (!this._domainType.hasOwnProperty(self.options.domain) || self.options.domain === "min" || self.options.domain.substring(0, 2) === "x_") {
			console.log("The domain '" + self.options.domain + "' is not valid");
			return false;
		}

		if (!this._domainType.hasOwnProperty(self.options.subDomain) || self.options.subDomain === "year") {
			console.log("The subDomain '" + self.options.subDomain + "' is not valid");
			return false;
		}

		if (this._domainType[self.options.domain].level <= this._domainType[self.options.subDomain].level) {
			console.log("'" + self.options.subDomain + "' is not a valid subDomain to '" + self.options.domain +  "'");
			return false;
		}


		// Set the most suitable subdomain for the domain
		// if subDomain is not explicitly specified
		if (!settings.hasOwnProperty("subDomain")) {
			switch(self.options.domain) {
				case "year" :  self.options.subDomain = "month"; break;
				case "month" : self.options.subDomain = "day"; break;
				case "week" :  self.options.subDomain = "day"; break;
				case "day" :  self.options.subDomain = "hour"; break;
				default : self.options.subDomain = "min";
			}
		}

		if (allowedDataType.indexOf(self.options.dataType) < 0) {
			console.log("The data type '" + self.options.dataType + "' is not valid data type");
			return false;
		}

		if (self.options.subDomainDateFormat === null) {
			self.options.subDomainDateFormat = this._domainType[self.options.subDomain].format.date;
		}

		if (self.options.domainLabelFormat === null) {
			self.options.domainLabelFormat = this._domainType[self.options.domain].format.legend;
		}

		// Auto-align label, depending on it's position
		if (!settings.hasOwnProperty("label") || (settings.hasOwnProperty("label") && !settings.label.hasOwnProperty("align"))) {
			switch(self.options.label.position) {
				case "left" : self.options.label.align = "right"; break;
				case "right" : self.options.label.align = "left"; break;
				default : self.options.label.align = "center";
			}


			if (self.options.label.rotate === "left") {
				self.options.label.align = "right";
			} else if (self.options.label.rotate === "right") {
				self.options.label.align = "left";
			}

		}

		if (!settings.hasOwnProperty("label") || (settings.hasOwnProperty("label") && !settings.label.hasOwnProperty("offset"))) {
			if (self.options.label.position === "left" || self.options.label.position === "right") {
				self.options.label.offset = {
					x: 10,
					y: 15
				};
			}
		}

		if (validateSelector(self.options.itemSelector)) {
			console.log("The itemSelector is invalid");
			return false;
		}

		if (d3.select(self.options.itemSelector)[0][0] === null) {
			console.log("The node specified in itemSelector does not exists");
			return false;
		}

		if (self.options.nextSelector !== false && validateSelector(self.options.nextSelector)) {
			console.log("The nextSelector is invalid");
			return false;
		}

		if (self.options.previousSelector !== false && validateSelector(self.options.previousSelector)) {
			console.log("The previousSelector is invalid");
			return false;
		}

		if (typeof self.options.itemNamespace !== "string" || self.options.itemNamespace === "") {
			console.log("itemNamespace can not be empty, falling back to cal-heatmap");
			self.options.itemNamespace = "cal-heatmap";
		}

		if (typeof self.options.domainMargin === "number") {
			self.options.domainMargin = [self.options.domainMargin, self.options.domainMargin, self.options.domainMargin, self.options.domainMargin];
		}

		if (Array.isArray(self.options.domainMargin)) {
			switch(self.options.domainMargin.length) {
				case 0 : self.options.domainMargin = [0, 0, 0, 0]; break;
				case 1 : self.options.domainMargin = [self.options.domainMargin, self.options.domainMargin, self.options.domainMargin, self.options.domainMargin]; break;
				case 2 : self.options.domainMargin = [self.options.domainMargin[0], self.options.domainMargin[1], self.options.domainMargin[0], self.options.domainMargin[1]]; break;
				case 3 : self.options.domainMargin = [self.options.domainMargin[0], self.options.domainMargin[1], self.options.domainMargin[2], self.options.domainMargin[1]]; break;
				case 4 : self.options.domainMargin = self.options.domainMargin; break;
				default : self.options.domainMargin.splice(4);
			}
		}

		if (typeof self.options.itemName === "string") {
			self.options.itemName = [self.options.itemName, self.options.itemName + "s"];
		} else if (Array.isArray(self.options.itemName) && self.options.itemName.length === 1) {
			self.options.itemName = [self.options.itemName[0], self.options.itemName[0] + "s"];
		}

		// Don't touch these settings
		var s = ["data", "onComplete", "onClick", "afterLoad", "afterLoadData", "afterLoadPreviousDomain", "afterLoadNextDomain"];

		for (var k in s) {
			if (settings.hasOwnProperty(s[k])) {
				self.options[s[k]] = settings[s[k]];
			}
		}

		if (typeof self.options.highlight === "string") {
			if (self.options.highlight === "now") {
				self.options.highlight = [new Date()];
			} else {
				self.options.highlight = [];
			}
		} else if (Array.isArray(self.options.highlight)) {
			var i = self.options.highlight.indexOf("now");
			if (i !== -1) {
				self.options.highlight.splice(i, 1);
				self.options.highlight.push(new Date());
			}
		}


		function validateSelector(selector) {
			return ((!(selector instanceof Element) && typeof selector !== "string") || selector === "");
		}

		return _init();

	};

};

CalHeatMap.prototype = {


	// =========================================================================//
	// CALLBACK																	//
	// =========================================================================//

	/**
	 * Callback when clicking on a subdomain cell
	 * @param  Date		d		Date of the subdomain block
	 * @param  int		itemNb	Number of items in that date
	 */
	onClick : function(d, itemNb) {
		if (typeof this.options.onClick === "function") {
			return this.options.onClick(d, itemNb);
		} else {
			console.log("Provided callback for onClick is not a function.");
			return false;
		}
	},

	/**
	 * Callback to fire after drawing the calendar, but before filling it
	 */
	afterLoad : function() {
		if (typeof (this.options.afterLoad) === "function") {
			return this.options.afterLoad();
		} else {
			console.log("Provided callback for afterLoad is not a function.");
			return false;
		}
	},

	/**
	 * Callback to fire at the end, when all actions on the calendar are completed
	 */
	onComplete : function() {
		if (this.options.onComplete === null || this._completed === true) {
			return true;
		}

		this._completed = true;
		if (typeof (this.options.onComplete) === "function") {
			return this.options.onComplete();
		} else {
			console.log("Provided callback for onComplete is not a function.");
			return false;
		}
	},

	/**
	 * Callback after shifting the calendar one domain back
	 * @param  Date		start	Domain start date
	 * @param  Date		end		Domain end date
	 */
	afterLoadPreviousDomain: function(start) {
		if (typeof (this.options.afterLoadPreviousDomain) === "function") {
			var subDomain = this.getSubDomain(start);
			return this.options.afterLoadPreviousDomain(subDomain.shift(), subDomain.pop());
		} else {
			console.log("Provided callback for afterLoadPreviousDomain is not a function.");
			return false;
		}
	},

	/**
	 * Callback after shifting the calendar one domain above
	 * @param  Date		start	Domain start date
	 * @param  Date		end		Domain end date
	 */
	afterLoadNextDomain: function(start) {
		if (typeof (this.options.afterLoadNextDomain) === "function") {
			var subDomain = this.getSubDomain(start);
			return this.options.afterLoadNextDomain(subDomain.shift(), subDomain.pop());
		} else {
			console.log("Provided callback for afterLoadNextDomain is not a function.");
			return false;
		}
	},

	formatNumber: d3.format(",g"),

	formatDate: function(d, format) {
		if (typeof format === "undefined") {
			format = "title";
		}

		if (typeof format === "function") {
			return format(d);
		} else {
			var f = d3.time.format(format);
			return f(d);
		}
	},

	// =========================================================================//
	// DOMAIN NAVIGATION														//
	// =========================================================================//
	loadNextDomain: function() {
		var parent = this;
		this._domains.push(this.getNextDomain().getTime());
		this._domains.shift();

		this.paint(this.NAVIGATE_RIGHT);

		this.getDatas(
			this.options.data,
			new Date(this._domains[this._domains.length-1]),
			this.getSubDomain(this._domains[this._domains.length-1]).pop(),
			function(data) {
				parent.fill(data, parent.svg);
			}
		);

		this.afterLoadNextDomain(new Date(this._domains[this._domains.length-1]));
	},

	loadPreviousDomain: function() {
		var parent = this;
		this._domains.unshift(this.getPreviousDomain().getTime());
		this._domains.pop();

		this.paint(this.NAVIGATE_LEFT);

		this.getDatas(
			this.options.data,
			new Date(this._domains[0]),
			this.getSubDomain(this._domains[0]).pop(),
			function(data) {
				parent.fill(data, parent.svg);
			}
		);

		this.afterLoadPreviousDomain(new Date(this._domains[0]));
	},

	// =========================================================================//
	// PAINTING : LEGEND														//
	// =========================================================================//

	displayLegend: function(width) {

		var parent = this;
		var legend = this.root;

		switch(this.options.legendVerticalPosition) {
			case "top" : legend = legend.insert("svg", ".graph"); break;
			default : legend = legend.append("svg");
		}

		var legendWidth =
			this.options.legendCellSize * (this.options.legend.length+1) +
			this.options.legendCellPadding * (this.options.legend.length+1) +
			this.options.legendMargin[3] + this.options.legendMargin[1];

		legend = legend
			.attr("class", "graph-legend")
			.attr("height", this.options.legendCellSize + this.options.legendMargin[0] + this.options.legendMargin[2])
			.attr("width", width)
			.append("g")
			.attr("transform", function(d) {
				switch(parent.options.legendHorizontalPosition) {
					case "right" : return "translate(" + (width - legendWidth) + ")";
					case "middle" :
					case "center" : return "translate(" + (width/2 - legendWidth/2) + ")";
					default : return "translate(" + parent.options.legendMargin[3] + ")";
				}
			})
			.attr("y", this.options.legendMargin[0])
			.selectAll().data(d3.range(0, this.options.legend.length+1));

		var legendItem = legend
			.enter()
			.append("rect")
			.attr("width", this.options.legendCellSize)
			.attr("height", this.options.legendCellSize)
			.attr("class", function(d){ return "graph-rect q" + (d+1); })
			.attr("x", function(d) {
				return d * (parent.options.legendCellSize + parent.options.legendCellPadding);
			})
			.attr("y", this.options.legendMargin[0])
			.attr("fill-opacity", 0)
			;

		legendItem.transition().delay(function(d, i) { return parent.options.animationDuration * i/10;}).attr("fill-opacity", 1);

		legendItem
			.append("title")
			.text(function(d) {
				var nextThreshold = parent.options.legend[d+1];
				if (d === 0) {
					return (parent.options.legendTitleFormat.lower).format({
						min: parent.options.legend[d],
						name: parent.options.itemName[1]});
				} else if (d === parent.options.legend.length) {
					return (parent.options.legendTitleFormat.upper).format({
						max: parent.options.legend[d-1],
						name: parent.options.itemName[1]});
				} else {
					return (parent.options.legendTitleFormat.inner).format({
						down: parent.options.legend[d-1],
						up: parent.options.legend[d],
						name: parent.options.itemName[1]});
				}
			})
		;

	},

	// =========================================================================//
	// PAINTING : SUBDOMAIN FILLING												//
	// =========================================================================//

	/**
	 * Colorize all rectangles according to their items count
	 *
	 * @param  {[type]} data  [description]
	 */
	display: function(data, domain) {
		var parent = this;
		domain.each(function(domainUnit) {

			if (data.hasOwnProperty(domainUnit)) {
				d3.select(this).selectAll(".graph-subdomain-group rect")
					.attr("class", function(d) {
						var subDomainUnit = parent._domainType[parent.options.subDomain].extractUnit(d);

						var htmlClass = "graph-rect" + parent.getHighlightClassName(d) +
						(data[domainUnit].hasOwnProperty(subDomainUnit) ?
							(" " + parent.legend(data[domainUnit][subDomainUnit])) : ""
						);

						if (parent.options.onClick !== null) {
							htmlClass += " hover_cursor";
						}

						return htmlClass;
					})
					.on("click", function(d) {
						if (parent.options.onClick !== null) {
							var subDomainUnit = parent._domainType[parent.options.subDomain].extractUnit(d);
							return parent.onClick(
								d,
								(data[domainUnit].hasOwnProperty(subDomainUnit) ? data[domainUnit][subDomainUnit] : null)
							);
						}
					});

				d3.select(this).selectAll(".graph-subdomain-group title")
					.text(function(d) {
						var subDomainUnit = parent._domainType[parent.options.subDomain].extractUnit(d);
						return (
						(data[domainUnit].hasOwnProperty(subDomainUnit) && data[domainUnit][subDomainUnit] !== null) ?
							(parent.options.subDomainTitleFormat.filled).format({
								count: parent.formatNumber(data[domainUnit][subDomainUnit]),
								name: parent.options.itemName[(data[domainUnit][subDomainUnit] !== 1 ? 1 : 0)],
								connector: parent._domainType[parent.options.subDomain].format.connector,
								date: parent.formatDate(d, parent.options.subDomainDateFormat)
							}) :
							(parent.options.subDomainTitleFormat.empty).format({
								date: parent.formatDate(d, parent.options.subDomainDateFormat)
							})
						);
					});


				}
			}
		);
		return true;
	},

	// =========================================================================//
	// POSITIONNING																//
	// =========================================================================//

	positionSubDomainX: function(d) {
		var index = this._domainType[this.options.subDomain].position.x(d);
		return index * this.options.cellSize + index * this.options.cellPadding;
	},

	positionSubDomainY: function(d) {
		var index = this._domainType[this.options.subDomain].position.y(d);
		return index * this.options.cellSize + index * this.options.cellPadding;
	},

	/**
	 * Return a classname if the specified date should be highlighted
	 *
	 * @param  Date d a date
	 * @return String the highlight class
	 */
	getHighlightClassName: function(d)
	{
		if (this.options.highlight.length > 0) {
			for (var i in this.options.highlight) {
				if (this.options.highlight[i] instanceof Date && this.dateIsEqual(this.options.highlight[i], d)) {
					return " highlight" + (this.isNow(this.options.highlight[i]) ? " now" : "");
				}
			}
		}
		return "";
	},

	/**
	 * Return whether the specified date is now,
	 * according to the type of subdomain
	 *
	 * @param  Date d The date to compare
	 * @return bool True if the date correspond to a subdomain cell
	 */
	isNow: function(d) {
		return this.dateIsEqual(d, new Date());
	},

	/**
	 * Return whether 2 dates are equals
	 * This function is subdomain-aware,
	 * and dates comparison are dependent of the subdomain
	 *
	 * @param  Date date_a First date to compare
	 * @param  Date date_b Secon date to compare
	 * @return bool true if the 2 dates are equals
	 */
	dateIsEqual: function(date_a, date_b) {
		switch(this.options.subDomain) {
			case "x_min" :
			case "min" :
				return date_a.getFullYear() === date_b.getFullYear() &&
					date_a.getMonth() === date_b.getMonth() &&
					date_a.getDate() === date_b.getDate() &&
					date_a.getHours() === date_b.getHours() &&
					date_a.getMinutes() === date_b.getMinutes();
			case "x_hour" :
			case "hour" :
				return date_a.getFullYear() === date_b.getFullYear() &&
					date_a.getMonth() === date_b.getMonth() &&
					date_a.getDate() === date_b.getDate() &&
					date_a.getHours() === date_b.getHours();
			case "x_day" :
			case "day" :
				return date_a.getFullYear() === date_b.getFullYear() &&
					date_a.getMonth() === date_b.getMonth() &&
					date_a.getDate() === date_b.getDate();
			case "x_week" :
			case "week" :
			case "x_month" :
			case "month" :
				return date_a.getFullYear() === date_b.getFullYear() &&
					date_a.getMonth() === date_b.getMonth();
			default : return false;
		}
	},

	// =========================================================================//
	// DOMAIN COMPUTATION														//
	// =========================================================================//

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
	getWeekNumber : function(d) {
		var f = this.options.weekStartOnMonday === true ? d3.time.format("%W") : d3.time.format("%U");
		return f(d);
	},


	getWeekDay : function(d) {
		if (this.options.weekStartOnMonday === false) {
			return d.getDay();
		}
		else if (d.getDay() === 0) {
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
	 * Return a range of week number
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	getWeekDomain: function (d, range) {
		var weekStart;

		if (this.options.weekStartOnMonday === false) {
			weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
		} else {
			if (d.getDay() === 1) {
				weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
			} else if (d.getDay() === 0) {
				weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
				weekStart.setDate(weekStart.getDate() - 6);
			} else {
				weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()-d.getDay()+1);
			}
		}

		var endDate = new Date(weekStart);

		var stop = new Date(endDate.setDate(endDate.getDate() + range * 7));

		return (this.options.weekStartOnMonday === true) ?
			d3.time.mondays(Math.min(weekStart, stop), Math.max(weekStart, stop)) :
			d3.time.sundays(Math.min(weekStart, stop), Math.max(weekStart, stop))
		;
	},

	getYearDomain: function(d, range){
		var start = new Date(d.getFullYear(), 0);
		var stop = new Date(d.getFullYear()+range, 0);

		return d3.time.years(Math.min(start, stop), Math.max(start, stop));
	},

	/**
	 * Return all the minutes between from the same hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	getMinuteDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
		var stop = new Date(start.getTime() + 60 * 1000 * range);

		return d3.time.minutes(Math.min(start, stop), Math.max(start, stop));
	},

	/**
	 * Return the start of an hour
	 * @param  number|Date	d	A date, or timestamp in milliseconds
	 * @return Date				The start of the hour
	 */
	getHourDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
		var stop = range;
		if (typeof range === "number") {
			stop = new Date(start.getTime() + 3600 * 1000 * range);
		}

		return d3.time.hours(Math.min(start, stop), Math.max(start, stop));
	},

	/**
	 * Return the start of an hour
	 * @param  number|Date	d		A date, or timestamp in milliseconds
	 * @param  int			range	Number of days in the range
	 * @return Date					The start of the hour
	 */
	getDayDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		var stop = new Date(start);
		stop = new Date(stop.setDate(stop.getDate() + parseInt(range, 10)));

		return d3.time.days(Math.min(start, stop), Math.max(start, stop));
	},

	/**
	 * Return the month domain for the current date
	 * @param  Date		d	A date
	 * @return Array
	 */
	getMonthDomain: function (d, range) {
		var start = new Date(d.getFullYear(), d.getMonth());
		var stop = new Date(start);
		stop = stop.setMonth(stop.getMonth()+range);

		return d3.time.months(Math.min(start, stop), Math.max(start, stop));
	},

	getDomain: function(date, range) {
		if (typeof date === "number") {
			date = new Date(date);
		}

		if (typeof range === "undefined") {
			range = this.options.range;
		}

		switch(this.options.domain) {
			case "hour"  : return this.getHourDomain(date, range);
			case "day"   : return this.getDayDomain(date, range);
			case "week"  : return this.getWeekDomain(date, range);
			case "month" : return this.getMonthDomain(date, range);
			case "year"  : return this.getYearDomain(date, range);
		}
	},

	getSubDomain: function(date) {
		if (typeof date === "number") {
			date = new Date(date);
		}

		var parent = this;

		var computeDaySubDomainSize = function(date, domain) {
			switch(domain) {
				case "year" : return parent.getDayOfYear(new Date(date.getFullYear()+1, 0, 0));
				case "month" :
					var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
					return lastDayOfMonth.getDate();
				case "week" : return 7;
			}
		};

		var computeMinSubDomainSize = function(date, domain) {
			switch (domain) {
				case "hour" : return 60;
				case "day" : return 60 * 24;
				case "week" : return 60 * 24 * 7;
			}
		};

		var computeHourSubDomainSize = function(date, domain) {
			switch(domain) {
				case "day" : return 24;
				case "week" : return 168;
				case "month" :
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
				return parent.getWeekNumber(new Date(date.getFullYear(), 11, 31));
			}
		};


		switch(this.options.subDomain) {
			case "x_min" :
			case "min"   : return this.getMinuteDomain(date, computeMinSubDomainSize(date, this.options.domain));
			case "x_hour":
			case "hour"  : return this.getHourDomain(date, computeHourSubDomainSize(date, this.options.domain));
			case "x_day" :
			case "day"   : return this.getDayDomain(date, computeDaySubDomainSize(date, this.options.domain));
			case "week"  : return this.getWeekDomain(date, computeWeekSubDomainSize(date, this.options.domain));
			case "x_month":
			case "month" : return this.getMonthDomain(date, 12);
		}
	},

	getNextDomain: function() {
		return this.getDomain(this._domains[this._domains.length-1], 2).pop();
	},

	getPreviousDomain: function() {
		return this.getDomain(this._domains[0], -1)[0];
	},

	/**
	 * Return the classname on the legend for the specified value
	 *
	 * @param  Item count n Number of items for that perdiod of time
	 * @return string		Classname according to the legend
	 */
	legend: function(n) {

		if (isNaN(n)) {
			return "qi";
		} else if (n === null) {
			return "";
		}

		for (var i = 0, total = this.options.legend.length-1; i <= total; i++) {

			if (n === 0 && this.options.legend[0] > 0) {
				return "";
			} else if (this.options.legend[0] > 0 && n < 0) {
				return "qi";
			}

			if (n <= this.options.legend[i]) {
				return "q" + (i+1);
			}
		}
		return "q" + (this.options.legend.length + 1);
	},

	// =========================================================================//
	// DATAS																	//
	// =========================================================================//

	/**
	 * @todo Add check for empty data
	 *
	 * @return bool True if the calendar was filled with the passed data
	 */
	fill: function(datas, domain) {
		var response = this.display(this.parseDatas(datas), domain);
		this.onComplete();
		return response;
	},

	/**
	 * Interpret the data property
	 *
	 * @return mixed
	 * - True if no data to load
	 * - False if data is loaded asynchornously
	 * - json object
	 */
	getDatas: function(source, startDate, endDate, callback) {
		var parent = this;

		switch(typeof source) {
			case "string" :
				if (source === "") {
					this.onComplete();
					return true;
				} else {

					switch(this.options.dataType) {
						case "json" :
							d3.json(this.parseURI(source, startDate, endDate), callback);
							break;
						case "csv" :
							d3.csv(this.parseURI(source, startDate, endDate), callback);
							break;
						case "tsv" :
							d3.tsv(this.parseURI(source, startDate, endDate), callback);
							break;
						case "text" :
							d3.text(this.parseURI(source, startDate, endDate), "text/plain", callback);
							break;
					}

					return false;
				}
				break;
			case "object" :
				// @todo Check that it's a valid JSON object
				callback(source);
		}

		return true;
	},

	/**
	 * Convert a JSON result into the expected format
	 *
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	parseDatas: function(data) {
		var stats = {};

		if (typeof (this.options.afterLoadData) === "function") {
			data = this.options.afterLoadData(data);
		} else {
			console.log("Provided callback for afterLoadData is not a function.");
			return {};
		}

		for (var d in data) {
			var date = new Date(d*1000);
			var domainUnit = this.getDomain(date)[0].getTime();

			// Don't record datas not relevant to the current domain
			if (this._domains.indexOf(domainUnit) < 0) {
				continue;
			}

			var subDomainUnit = this._domainType[this.options.subDomain].extractUnit(date);
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
	},

	parseURI: function(str, startDate, endDate) {
		// Use a timestamp in seconds
		str = str.replace(/\{\{t:start\}\}/g, startDate.getTime()/1000);
		str = str.replace(/\{\{t:end\}\}/g, endDate.getTime()/1000);

		// Use a string date, following the ISO-8601
		str = str.replace(/\{\{d:start\}\}/g, startDate.toISOString());
		str = str.replace(/\{\{d:end\}\}/g, endDate.toISOString());

		return str;
	},

	// =========================================================================//
	// PUBLIC API																//
	// =========================================================================//

	next: function() {
		return this.loadNextDomain();
	},

	previous: function() {
		return this.loadPreviousDomain();
	},

	getSVG: function() {
		var styles = {
			".graph": {},
			".graph-rect": {},
			"rect.highlight": {},
			"rect.now": {},
			"text.highlight": {},
			"text.now": {},
			".domain-background": {},
			".graph-label": {},
			".subdomain-text": {},
			".qi": {}
		};

		for (var j = 0, total = this.options.legend.length; j < total; j++) {
			styles[".q" + j] = {};
		}

		var root = this.root;

		var whitelistStyles = [
			// SVG specific properties
			"stroke", "stroke-width", "stroke-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-miterlimit",
			"fill", "fill-opacity", "fill-rule",
			"marker", "marker-start", "marker-mid", "marker-end",
			"alignement-baseline", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "kerning", "text-anchor",
			"shape-rendering",

			// Text Specific properties
			"text-transform", "font-family", "font", "font-size", "font-weight"
		];

		var filterStyles = function(attribute, property, value) {
			if (whitelistStyles.indexOf(property) !== -1) {
				styles[attribute][property] = value;
			}
		};

		var getElement = function(e) {
			return root.select(e)[0][0];
		};

		for (var element in styles) {

			var dom = getElement(element);

			if (dom === null) {
				continue;
			}

			// The DOM Level 2 CSS way
			if ("getComputedStyle" in window) {
				var cs = getComputedStyle(dom, null);
				if (cs.length !== 0) {
					for (var i = 0; i < cs.length; i++) {
						filterStyles(element, cs.item(i), cs.getPropertyValue(cs.item(i)));
					}

				// Opera workaround. Opera doesn"t support `item`/`length`
				// on CSSStyleDeclaration.
				} else {
					for (var k in cs) {
						if (cs.hasOwnProperty(k)) {
							filterStyles(element, k, cs[k]);
						}
					}
				}

			// The IE way
			} else if ("currentStyle" in dom) {
				var css = dom.currentStyle;
				for (var p in css) {
					filterStyles(element, p, css[p]);
				}
			}
		}



		var string = "<svg xmlns=\"http://www.w3.org/2000/svg\" "+
		"xmlns:xlink=\"http://www.w3.org/1999/xlink\"><style type=\"text/css\"><![CDATA[ ";

		for (var style in styles) {
			string += style + " {\n";
			for (var l in styles[style]) {
				string += "\t" + l + ":" + styles[style][l] + ";\n";
			}
			string += "}\n";
		}

		string += "]]></style>";
		string += new XMLSerializer().serializeToString(this.root.selectAll("svg")[0][0]);
		string += new XMLSerializer().serializeToString(this.root.selectAll("svg")[0][1]);
		string += "</svg>";

		return string;
	}
};

var DomainPosition = function() {
	this.positions = [];
};

DomainPosition.prototype.getPosition = function(i) {
	return this.positions[i];
};

DomainPosition.prototype.getLast = function() {
	return this.positions[this.positions.length-1];
};

DomainPosition.prototype.pushPosition = function(dim) {
	this.positions.push(dim);
};

DomainPosition.prototype.unshiftPosition = function(dim) {
	this.positions.unshift(dim);
};

DomainPosition.prototype.shiftRight = function(exitingDomainDim) {
	for(var i in this.positions) {
		this.positions[i] -= exitingDomainDim;
	}
	this.positions.shift();
};

DomainPosition.prototype.shiftLeft = function(enteringDomainDim) {
	for(var i in this.positions) {
		this.positions[i] += enteringDomainDim;
	}
	this.positions.pop();
};


/**
 * Sprintf like function
 * @source http://stackoverflow.com/a/4795914/805649
 * @return String
 */
String.prototype.format = function () {
	var formatted = this;
	for (var prop in arguments[0]) {
		var regexp = new RegExp("\\{" + prop + "\\}", "gi");
		formatted = formatted.replace(regexp, arguments[0][prop]);
	}
	return formatted;
};

/**
 * #source http://stackoverflow.com/a/383245/805649
 */
function mergeRecursive(obj1, obj2) {

	for (var p in obj2) {
		try {
			// Property in destination object set; update its value.
			if (obj2[p].constructor === Object) {
				obj1[p] = mergeRecursive(obj1[p], obj2[p]);
			} else {
				obj1[p] = obj2[p];
			}
		} catch(e) {
			// Property in destination object not set; create it and set its value.
			obj1[p] = obj2[p];
		}
	}

	return obj1;
}

/**
 * AMD Loader
 */
if (typeof define === "function" && define.amd) {
	define(["d3"], function(d3) {
		return CalHeatMap;
	});
}
