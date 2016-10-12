var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var NgramCollection = require('./../collections/NgramCollection');

module.exports = Backbone.View.extend({

	/*
		Define colors to use in the graph.
		Todo: implement D3.js color creation functionality
	*/

	graphYearTicks: [],

	/*
		Graph size and visual margins
	*/
	graphWidth: 1120,
	graphHeight: 500,

	graphMargins: {
		top: 20,
		right: 0,
		bottom: 20,
		left: 100
	},

	graphValueKey: 'term_freq',

	yAxisLabels: {
		absolute: {
			term_freq: 'Antal träffar',
			doc_count: 'Antal sidor med träff',
			work_count: 'Antal olika verk',
			auth_count: 'Antal olika författare'
		},
		relative: {
			term_freq: 'Antal träffar relativt totala antalet termer',
			doc_count: 'Antal sidor med träff relativt totala antalet sidor',
			work_count: 'Antalet olika verk relativt totala antalet verk publicerade detta år',
			auth_count: 'Antalet olika författare relativt totala antalet författare med publikationer '
		}
	},

	popupLabels: {
		term_freq: 'Total antalet träffar',
		doc_count: 'Total antalet sidor med träff',
		work_count: 'Total antalet olika verk',
		auth_count: 'Total antalet olika författare'
	},

	/*
		Initialize the module
	*/
	initialize: function(options) {
		this.options = options;

		this.app = this.options.app;
		this.percentagesView = this.options.percentagesView ? this.options.percentagesView : false;

		for (var year = this.options.startYear; year<this.options.endYear; year += 20) {
			this.graphYearTicks.push(year);
		}
	
		/*
			Initialize the collection that handles API calls
		*/
		this.collection = new NgramCollection();
		this.collection.on('reset', this.collectionReset, this);
		this.collection.once('totalCollectionReset', _.bind(function() {
			this.trigger('totalCollectionReset');
		}, this));
		this.render();
	},

	/*
		Define DOM events
	*/
	events: {
		'click .tabs.ngram-view-mode a.tab': 'ngramViewModeClick',
		'click .tabs.ngram-result-mode a.tab': 'ngramResultModeClick'
	},

	/*
		DOM event handler: switch between relative and absolute view mode
	*/
	ngramViewModeClick: function(event) {
		this.$el.find('.tabs.ngram-view-mode a.tab').removeClass('selected');
		$(event.currentTarget).addClass('selected');

		var currentView = this.percentagesView;

		this.percentagesView = $(event.currentTarget).data('viewmode') == 'relative';

		if (currentView != this.percentagesView) {
			this.updateGraph();
		}
	},

	/*
		DOM event handler: switch between view of different keys in the results, doc_count, auth_count, work_count, term_freq
	*/
	ngramResultModeClick: function(event) {
		this.$el.find('.tabs.ngram-result-mode a.tab').removeClass('selected');
		$(event.currentTarget).addClass('selected');

		var currentGraphValueKey = this.graphValueKey;

		this.graphValueKey = $(event.currentTarget).data('resultmode');

		if (currentGraphValueKey != this.graphValueKey) {
			this.updateGraph();
		}
	},

	lastQuery: '',

	search: function(query, queryMode, modernSpelling) {
		var searchTerms = query.split(/(?![^)(]*\([^)(]*?\)\)),(?![^\(]*\))/g);

		this.lastQuery = query;
		this.lastQueryMode = queryMode;
		this.lastModernSpelling = modernSpelling;
		this.$el.addClass('loading');
		this.collection.search(query, queryMode);
	},

	collectionReset: function() {
		if (this.app.colorRegistry.length == 0) {
			this.app.createColorRegistry(this.collection.models);
		}

		if (this.collection.length > 0 && this.collection.at(0).get('type') == 'wildcard') {
			this.trigger('wildcardresults');
			this.wildcardSearch = true;
		}
		else {
			this.wildcardSearch = false;
		}
		this.renderGraph();
	},

	createLine: function(yProcessor) {
		/*
			Generate path data.
			yProcessor: function that returns value for the y axis

		*/
		var view = this;

		return d3.svg.line()
			.interpolate("monotone")
			.x(function(d) {
				// Returns a pixel value for the x range based on the corrent year using the xRange scale object
				return view.xRange(Number(d.key.substr(0, 4)));
			})
			.y(yProcessor)
	},

	createYRangeValues: function() {
		this.yRangeValues = _.map(this.collection.at(0).get('data').buckets, _.bind(function(bucket) {
			if (this.percentagesView) {
				var totalByYear = this.collection.getTotalByYear(Number(bucket.key.substr(0, 4)), this.graphValueKey);
				return isNaN(bucket[this.graphValueKey]/totalByYear) ? 0 : bucket[this.graphValueKey]/totalByYear;
			}
			else {
				return bucket[this.graphValueKey];
			}
		}, this));
		
		if (this.collection.length > 1) {
			this.collection.each(_.bind(function(model) {
				this.yRangeValues = _.union(
					this.yRangeValues, 
					_.map(this.collection.at(1).get('data').buckets, _.bind(function(bucket) {
						if (this.percentagesView) {
							var totalByYear = this.collection.getTotalByYear(Number(bucket.key.substr(0, 4)), this.graphValueKey);
							return isNaN(bucket[this.graphValueKey]/totalByYear) ? 0 : bucket[this.graphValueKey]/totalByYear;
						}
						else {
							return bucket[this.graphValueKey];
						}
					}, this))
				);
			}, this));
			this.yRangeValues = this.yRangeValues.sort();
		}
	},

	createYRange: function() {
		return d3.scale.linear().range([this.graphHeight - this.graphMargins.top, this.graphMargins.bottom]).domain([0,
			d3.max(this.yRangeValues)
		]);
	},

	updateYAxis: function() {
		var yRange = this.createYRange();

		var yAxis = d3.svg.axis()
			.scale(yRange)
			.tickSize(1)
			.orient('left')
			.innerTickSize(-this.graphWidth)
			.tickSubdivide(true);

		this.vis.selectAll('g.y.axis')
			.call(yAxis);
	},

	updateLines: function() {
		var yRange = this.createYRange();

		_.each(this.collection.models, _.bind(function(model, index) {
			var lineData = model.get('data').buckets;

			var line = this.createLine(_.bind(function(d) {
				if (this.percentagesView) {
					var year = Number(d.key.substr(0, 4));

					var totalByYear = this.collection.getTotalByYear(Number(year), this.graphValueKey);
					var percentage = isNaN(d[this.graphValueKey]/totalByYear) ? 0 : d[this.graphValueKey]/totalByYear;

					return (yRange(percentage));
				}
				else {
					return (yRange(d[this.graphValueKey]));
				}
			}, this));

			this.vis.select('path.line.line-'+index)
				.transition()
				.duration(1000)
				.attr("d", line);

		}, this));
	},

	updateCircles: function() {
		var yRange = this.createYRange();

		this.vis.selectAll('circle.point')
			.transition()
			.duration(1000)
			.attr('cy', _.bind(function (d) {
				if (this.percentagesView) {					
					var totalByYear = this.collection.getTotalByYear(Number(d.key.substr(0, 4)), this.graphValueKey);
					var percentage = isNaN(d[this.graphValueKey]/totalByYear) ? 0 : d[this.graphValueKey]/totalByYear;
					return (yRange(percentage));
				}
				else {
					return (yRange(d[this.graphValueKey]));
				}
			}, this));
	},

	updateGraph: function() {
		this.createYRangeValues();

		this.yAxisLabel.text(this.yAxisLabels[this.percentagesView ? 'relative' : 'absolute'][this.graphValueKey]);

		this.updateYAxis();
		this.updateLines();
		this.updateCircles();
	},

	renderGraph: function() {
		// Render the graph

		this.$el.removeClass('loading');
		var view = this;

		this.graphWidth = this.$el.parent().width();
		this.graphHeight = (this.graphWidth/1120) * 500;

		this.$el.find('svg.chart-container').attr('height', this.graphHeight);

		this.$el.find('.search-term-label').text(this.collection.queryString);

		// Remove all elements from our svg element
		d3.selectAll('svg#chartContainer'+this.cid+' > *').remove();

		// Check if we have results or not
		if (this.collection.length == 0) {
			this.trigger('zeroresults');
			this.$el.addClass('no-results');

			return;
		}
		else {
			this.$el.removeClass('no-results');
		}

		// Collect all x values (year) from the result colleciton
		this.xRangeValues = _.map(this.collection.at(0).get('data').buckets, function(bucket) {
			return bucket.key.substr(0, 4);
		});
		if (this.collection.length > 1) {
			this.collection.each(_.bind(function(model) {
				this.xRangeValues = _.union(
					this.xRangeValues, 
					_.map(model.get('data').buckets, function(bucket) {
						return bucket.key.substr(0, 4);
					})
				);
			}, this));
			this.xRangeValues = this.xRangeValues.sort();
		}

		// Create x range scale which we will use to position points on the graph
		this.xRange = d3.scale.linear().range([this.graphMargins.left, this.graphWidth - this.graphMargins.right]).domain([this.options.startYear, this.options.endYear]);

		// Collect all y values from the result collection
		this.createYRangeValues();

		// Create y range scale which we will use to position points on the graph
		var yRange = this.createYRange();

		// Create the overlay rectangle which is used to display selected time range on the graph
		this.vis.append("rect")
			.attr("class", "timerange-overlay")
			.attr("x", this.graphMargins.left)
			.attr("y", this.graphMargins.top)
			.attr("width", this.graphWidth-this.graphMargins.right-this.graphMargins.left)
			.attr("height", this.graphHeight-this.graphMargins.bottom-this.graphMargins.top)
			.style("opacity", 0);

		// Bind mouse events to the graph
		this.vis
			.on("mouseenter", _.bind(function() {
				this.$el.find('.info-overlay').addClass('visible'); // Make the Info/Legends box visibile when the mouse enters the graph
			}, this))
			.on("mouseleave", _.bind(function() {
				this.$el.find('.info-overlay').removeClass('visible'); // Hide the Info/Legends box when the mouse leaves the graph
			}, this))
			.on("mousemove", function(event) {
				/*
					Move the vertical line on the x axis as the mouse moves on the graph.
					Also move the Info/Legends box with relevant information about the year under the mouse.
				*/

				// Get the current position of the mouse
				var xPos = d3.mouse(this)[0];

				// Convert x position of the mouse to a year on the x axis using our xRange scale object
		        var year = Math.round(view.xRange.invert(xPos));

		        // Position the Info/Legends box and pass the x mouse position as a year as a parameter
		        view.overlayMessage(year, [d3.event.clientX, d3.event.clientY]);

		        // Move the vertical line to the x position of the mouse
				view.verticalLine.attr("transform", function () {
					return "translate(" + xPos + ",0)";
				});

				// If we are draging, set the time overlay to current drag range
				if (view.dragStart) {
					view.setTimeOverlay([view.dragStart < year ? view.dragStart : year, view.dragStart > year ? view.dragStart : year]);
				}
			})
			.on('mousedown', function(event) {
				// Get the current position of the mouse
				var xPos = d3.mouse(this)[0];

				// Convert x position of the mouse to a year on the x axis using our xRange scale object
		        var year = Math.round(view.xRange.invert(xPos));

		       // set dragStart to know in mousemove handler if we are draging the timerange or not
		       if (!view.options.disableDrag) {
			        view.dragStart = year;
		       }
			})
			.on('mouseup', function(event) {
				// Get the current position of the mouse
				var xPos = d3.mouse(this)[0];

				// Convert x position of the mouse to a year on the x axis using our xRange scale object
		        var year = Math.round(view.xRange.invert(xPos));

		        if (view.dragStart) {
		        	// if we are finishing a drag on the graph, fire a 'timerange' event
			        view.trigger('timerange', {
			        	values: [view.dragStart < year ? view.dragStart : year, view.dragStart > year ? view.dragStart : year]
			        });
		        }
		        else {
		        	// othervise fire a normal 'click' event
			        view.trigger('graphclick', {
			        	year: year
			        });
		        }

		        // unset dragStart var
		        view.dragStart = undefined;
			});


		// Create the visual x axis
		var xAxis = d3.svg.axis()
			.scale(this.xRange)
			.tickSize(1)
			.innerTickSize(-(this.graphHeight-this.graphMargins.bottom-this.graphMargins.top))
			.tickValues(this.graphYearTicks)
			.tickSubdivide(true)
			.tickFormat(function(d, i) {
				return d;
			});

		this.vis.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (this.graphHeight - this.graphMargins.bottom) + ')')
			.call(xAxis);

		// Create the visual x axis
		var yAxis = d3.svg.axis()
			.scale(yRange)
			.tickSize(1)
			.innerTickSize(-this.graphWidth)
			.orient('left')
			.tickSubdivide(true);

		this.vis.append('svg:g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + (this.graphMargins.left) + ',0)')
			.call(yAxis);

		this.yAxisLabel = this.vis.append("text")
			.attr('class', 'axisLabel')
			.attr("text-anchor", "middle")
			.attr("transform", "translate("+ (10) +","+(this.graphHeight/2)+")rotate(-90)")
			.text(this.yAxisLabels[this.percentagesView ? 'relative' : 'absolute'][this.graphValueKey]);

		// Add the vertical line to the svg
		this.verticalLine = this.vis.append('line')
			.attr({
				'x1': 0,
				'y1': this.graphMargins.top,
				'x2': 0,
				'y2': this.graphHeight-this.graphMargins.bottom
			})
			.attr("transform", "translate("+this.graphMargins.left+",0)")
			.attr("stroke", "steelblue")
			.attr('class', 'verticalLine');

		var addLine = _.bind(function(lineData, color, index) {
			/*
				Helper function to create a line on the graph.

				lineData: buckets from the API
				color: color value for the line
				index: index of the line in the context of results items from the API (results.data.[...])
				*/

			// Filter data for graph to fit between time boundaries
			lineData = _.filter(lineData, _.bind(function(dataItem) {
				var year = Number(dataItem.key.substr(0, 4));
				return year > this.options.startYear && year < this.options.endYear;
			}, this));

			/*
				When the graph renders, y values animate from 0 to the correcct value.
				In the becinning, we create a path data where y is always 0
			*/
			var line1 = this.createLine(_.bind(function(d) {
					return (yRange(0));
				}, this));

			// Create path data with correct y values
			var line = this.createLine(_.bind(function(d) {
				if (this.percentagesView) { // Check if we are rendering relative values to the total document per year or absolute values
					var totalByYear = this.collection.getTotalByYear(Number(d.key.substr(0, 4)), this.graphValueKey); // Get total documents per year
					var percentage = isNaN(d[this.graphValueKey]/totalByYear) ? 0 : d[this.graphValueKey]/totalByYear;
					return (yRange(percentage));
				}
				else {
					return (yRange(d[this.graphValueKey]));
				}
			}, this));

			// Appent the path element to the svg object
			this.vis.append("path")
				.datum(lineData) // set the data/buckets to the path element.
				.attr("class", "line line-"+index)
				.attr('fill', 'none')
				.attr('stroke-width', 2)
				.attr('stroke', color)
				.attr("data-index", index)
				.attr("d", line1) // Set the path data with y values as 0 to the path "d" attribute.
				.on("mouseenter", function() {
					view.fadeLines(this);
				})
				.on("mouseleave", function() {
					view.showLines();
				})
				.transition() // Initialize animation.
				.duration(1000)
				.attr("d", line); // Animate the line to the corrent y values.

			// Appent the small circles to each data point on the line.
			var circles = this.vis.append('g');
			var data = circles.selectAll('circle')
				.data(lineData);

			data.enter()
				.append('circle')
				.attr('class', 'point')
				.attr('fill', color)
				.attr('cx', function (d) {
					return view.xRange(Number(d.key.substr(0, 4)));
				})
				.attr('cy', _.bind(function (d) {
					if (this.percentagesView) {					
						var totalByYear = this.collection.getTotalByYear(Number(d.key.substr(0, 4)), this.graphValueKey);
						var percentage = isNaN(d[this.graphValueKey]/totalByYear) ? 0 : d[this.graphValueKey]/totalByYear;
						return (yRange(percentage));
					}
					else {
						return (yRange(d[this.graphValueKey]));
					}
				}, this))
				.attr('r', 0)
				.on('mousemove', function(d) {
					var xPosition = d3.mouse(this)[0] - 50;
					var yPosition = d3.mouse(this)[1] - 25;
				})
				.transition()
				.delay(750)
				.duration(200)
				.attr('r', 2);

			data.exit().attr('class', 'exit').transition(750)
				.ease('linear')
				.attr('cy', 0)
				.style('opacity', 0.2)
				.remove();
		}, this);

		// Iterate through each results item and add a line for each item.
		_.each(this.collection.models, _.bind(function(model, index) {
			model.set('color', this.app.getItemColor(model.get('query').original_search_terms+model.filtersToString(true)));
			addLine(model.get('data').buckets, model.get('color'), index);
		}, this));

		// If the grahp has a set timerange, then adjust the time overlay.
		if (this.timeOverlay) {
			this.setTimeOverlay(this.timeOverlay);
		}
		this.trigger('rendergraph'); // Trigger 'renderGraph' event.
	},

	setTimeOverlay: function(values) {
		/*
			Adjust the visual time range overlay.
		*/
		this.timeOverlay = values;
		if (this.timeOverlay[0] == this.options.startYear && this.timeOverlay[1] == this.options.endYear) {
			this.vis.select('rect.timerange-overlay')
				.transition()
				.duration(100)
				.style('opacity', 0);
		}
		else {
			this.vis.select('rect.timerange-overlay')
				.attr('x', this.xRange(Number(values[0])+0.2))
				.attr('width', this.xRange(Number(values[1])-0.2)-this.xRange(Number(values[0])+0.2))
				.transition()
				.duration(100)
				.style('opacity', 0.1);			
		}
	},

	fadeLines: function(exclude) {
//		this.$el.find('.info-overlay .item[data-index='+$(exclude).data('index')+']').addClass('highlight');
		this.vis.selectAll('path.line').style("stroke-opacity", function () {
			return (this === exclude) ? 1.0 : 0.2;
		});
	},

	showLines: function() {
//		this.$el.find('.info-overlay .item').removeClass('highlight');
		this.vis.selectAll('path.line').style("stroke-opacity", 1);
	},

	overlayMessage: function(year, position) {
		/*
			Position the info/legends box for the current year and feed the right data into it.
		*/
		var legends = _.map(this.collection.models, _.bind(function(model) {
			return {
				color: model.get('color'),
				key: model.get('query').original_search_terms,
				filterString: model.filtersToString(true),
				data: _.find(model.get('data').buckets, function(bucket) {
					return bucket.key == year;
				})
			};
		}, this));

		var template = _.template($("#ngramInfoTemplate").html());

		this.$el.find('.info-overlay').html(template({
			data: {
				year: year,
				total: this.collection.getTotalByYear(year, this.graphValueKey),
				graphValueKey: this.graphValueKey,
				legends: legends,
				totalLabelText: this.popupLabels[this.graphValueKey]
			}
		}));

		var xPos = (position[0]+60);
		var yPos = (position[1]);

		if (xPos+this.$el.find('.info-overlay').width() > $(window).width()) {
			xPos = xPos-this.$el.find('.info-overlay').width()-100;
		}

		this.$el.find('.info-overlay').css({
			'-webkit-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'-moz-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'-ms-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'-o-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'transform': 'translate('+xPos+'px, '+yPos+'px)'
		})
	},

	render: function() {
		/*
			Render the graph.
		*/
		var template = _.template($("#ngramViewTemplate").html());
	
		this.$el.html(template({}));

		this.$el.find('svg.chart-container').attr('id', 'chartContainer'+this.cid); // Set a unique ID to the graph to enable multiple graphs to be displayed on a single page.

		this.vis = d3.select('#chartContainer'+this.cid);

		window.onresize = _.bind(function() {
			if (this.collection.length > 0) {
				this.renderGraph();
			}
		}, this);
	}
});