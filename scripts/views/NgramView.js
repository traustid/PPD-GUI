var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var NgramCollection = require('./../collections/NgramCollection');

module.exports = Backbone.View.extend({
	colors: ["#00cc88", "#8fb300", "#8c5e00", "#290099", "#0a004d", "#00590c", "#002233", "#e55c00", "#4c1400", "#006680", "#8f00b3", "#8c005e", "#ffcc00", "#36cc00", "#004b8c", "#ff0066", "#002459", "#732e00", "#00a2f2", "#00becc", "#ff00ee", "#00330e", "#003de6", "#73001f", "#403300", "#b20000", "#40001a", "#005953"],

	graphYearTicks: [1971, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015],

	graphWidth: 1120,
	graphHeight: 500,

	graphMargins: {
		top: 20,
		right: 0,
		bottom: 20,
		left: 50
	},

	startYear: 1971,
	endYear: 2016,

	initialize: function(options) {
		this.options = options;
		this.percentagesView = this.options.percentagesView ? this.options.percentagesView : false;

		this.collection = new NgramCollection();
		this.collection.on('reset', this.renderGraph, this);
		this.render();
	},

	events: {
		'click .tabs.ngram-view-mode a.tab': 'ngramViewModeClick'
	},

	ngramViewModeClick: function(event) {
		this.$el.find('.tabs.ngram-view-mode a.tab').removeClass('selected');
		$(event.currentTarget).addClass('selected');

		var currentView = this.percentagesView;

		this.percentagesView = $(event.currentTarget).data('viewmode') == 'relative';

		if (currentView != this.percentagesView) {
			this.updateGraph();
		}
	},

	lastQuery: '',

	search: function(query) {
		this.lastQuery = query;
		this.$el.addClass('loading');
		this.collection.search(query);
	},

	createLine: function(yProcessor) {
		var app = this;

		return d3.svg.line()
			.interpolate("monotone")
			.x(function(d) {
				return app.xRange(Number(d.key_as_string.substr(0, 4)));
			})
			.y(yProcessor)
	},

	createYRangeValues: function() {
		this.yRangeValues = _.map(this.collection.at(0).get('buckets'), _.bind(function(bucket) {
			if (this.percentagesView) {
				var totalByYear = this.collection.getTotalByYear(Number(bucket.key_as_string.substr(0, 4)));
				return bucket.doc_count/totalByYear;
			}
			else {
				return bucket.doc_count;
			}
		}, this));
		
		if (this.collection.length > 1) {
			this.collection.each(_.bind(function(model) {
				this.yRangeValues = _.union(
					this.yRangeValues, 
					_.map(this.collection.at(1).get('buckets'), _.bind(function(bucket) {
						if (this.percentagesView) {
							var totalByYear = this.collection.getTotalByYear(Number(bucket.key_as_string.substr(0, 4)));
							return bucket.doc_count/totalByYear;
						}
						else {
							return bucket.doc_count;
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
			.tickSubdivide(true);

		this.vis.selectAll('g.y.axis')
			.call(yAxis);
	},

	updateLines: function() {
		var yRange = this.createYRange();

		_.each(this.collection.models, _.bind(function(model, index) {
			var lineData = model.get('buckets');

			var line = this.createLine(_.bind(function(d) {
				if (this.percentagesView) {					
					var totalByYear = this.collection.getTotalByYear(Number(d.key_as_string.substr(0, 4)));
					var percentage = d.doc_count/totalByYear;
					return (yRange(percentage));
				}
				else {
					return (yRange(d.doc_count));
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
					var totalByYear = this.collection.getTotalByYear(Number(d.key_as_string.substr(0, 4)));
					var percentage = d.doc_count/totalByYear;
					return (yRange(percentage));
				}
				else {
					return (yRange(d.doc_count));
				}
			}, this));
	},

	updateGraph: function() {
		this.createYRangeValues();

		this.updateYAxis();
		this.updateLines();
		this.updateCircles();
	},

	renderGraph: function() {
		this.$el.removeClass('loading');
		var app = this;

		this.graphWidth = this.$el.parent().width();
		this.graphHeight = (this.graphWidth/1120) * 500;

		this.$el.find('.search-term-label').text(this.collection.queryString);

		d3.selectAll('svg > *').remove();

		this.xRangeValues = _.map(this.collection.at(0).get('buckets'), function(bucket) {
			return bucket.key_as_string.substr(0, 4);
		});
		if (this.collection.length > 1) {
			this.collection.each(_.bind(function(model) {
				this.xRangeValues = _.union(
					this.xRangeValues, 
					_.map(this.collection.at(1).get('buckets'), function(bucket) {
						return bucket.key_as_string.substr(0, 4);
					})
				);
			}, this));
			this.xRangeValues = this.xRangeValues.sort();
		}

		this.xRange = d3.scale.ordinal().rangeRoundBands([this.graphMargins.left, this.graphWidth - this.graphMargins.right], 0.1).domain(this.xRangeValues);

		this.createYRangeValues();

		var yRange = this.createYRange();

		var xAxis = d3.svg.axis()
			.scale(this.xRange)
			.tickSize(1)
			.tickValues(this.graphYearTicks)
			.tickSubdivide(true);

		var yAxis = d3.svg.axis()
			.scale(yRange)
			.tickSize(1)
			.orient('left')
			.tickSubdivide(true);

		this.vis.append("rect")
			.attr("class", "timerange-overlay")
			.attr("x", this.graphMargins.left)
			.attr("y", this.graphMargins.top)
			.attr("width", this.graphWidth-this.graphMargins.right-this.graphMargins.left)
			.attr("height", this.graphHeight-this.graphMargins.bottom-this.graphMargins.top)
			.style("opacity", 0);

		this.vis
			.on("mouseenter", _.bind(function() {
				this.$el.find('.info-overlay').addClass('visible');
			}, this))
			.on("mouseleave", _.bind(function() {
				this.$el.find('.info-overlay').removeClass('visible');
			}, this))
			.on("mousemove", function() {
				var xPos = d3.mouse(this)[0];

				var leftEdges = app.xRange.range();
				var width = app.xRange.rangeBand();

				var j;
				for(j=0; xPos > (leftEdges[j] + width); j++) {

				}

		        var year = app.xRange.domain()[j];

		        app.overlayMessage(year, d3.mouse(this));

				app.verticalLine.attr("transform", function () {
					return "translate(" + xPos + ",0)";
				});
			});

		this.vis.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (this.graphHeight - this.graphMargins.bottom) + ')')
			.call(xAxis);

		this.vis.append('svg:g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + (this.graphMargins.left) + ',0)')
			.call(yAxis);

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

			var line1 = this.createLine(_.bind(function(d) {
					return (yRange(0));
				}, this));

			var line = this.createLine(_.bind(function(d) {
				if (this.percentagesView) {					
					var totalByYear = this.collection.getTotalByYear(Number(d.key_as_string.substr(0, 4)));
					var percentage = d.doc_count/totalByYear;
					return (yRange(percentage));
				}
				else {
					return (yRange(d.doc_count));
				}
			}, this));


			this.vis.append("path")
				.datum(lineData)
				.attr("class", "line line-"+index)
				.attr('fill', 'none')
				.attr('stroke-width', 2)
				.attr('stroke', color)
				.attr("data-index", index)
				.attr("d", line1)
				.on("mouseenter", function() {
					app.fadeLines(this);
				})
				.on("mouseleave", function() {
					app.showLines();
				})
				.transition()
				.duration(1000)
				.attr("d", line);

			var circles = this.vis.append('g');
			var data = circles.selectAll('circle')
				.data(lineData);

			data.attr('class', 'update');

			data.enter()
				.append('circle')
				.attr('class', 'point')
				.attr('fill', color)
				.attr('cx', function (d) {
					return app.xRange(Number(d.key_as_string.substr(0, 4)));
				})
				.attr('cy', _.bind(function (d) {
					if (this.percentagesView) {					
						var totalByYear = this.collection.getTotalByYear(Number(d.key_as_string.substr(0, 4)));
						var percentage = d.doc_count/totalByYear;
						return (yRange(percentage));
					}
					else {
						return (yRange(d.doc_count));
					}
				}, this))
				.attr('r', 0)
				.on('mouseover', function() {
					tooltip.style('display', null);
				})
				.on('mouseout', function() {
					tooltip.style('display', 'none')
				})
				.on('mousemove', function(d) {
					var xPosition = d3.mouse(this)[0] - 50;
					var yPosition = d3.mouse(this)[1] - 25;
					tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')');
					tooltip.select('text').text(d.key_as_string.substr(0, 4)+': '+d.doc_count);
				})
				.transition()
				.delay(750)
				.duration(200)
				.attr('r', 3);

			data.exit().attr('class', 'exit').transition(750)
				.ease('linear')
				.attr('cy', 0)
				.style('opacity', 0.2)
				.remove();

			var tooltip = this.vis.append('g')
				.attr('class', 'tooltip')
				.style('display', 'none');

			tooltip.append('rect')
				.attr('width', 100)
				.attr('height', 20)
				.attr('fill', '#333')
				.style('opacity', 1);

			tooltip.append('text')
				.attr('x', 50)
				.attr('dy', '1.2em')
				.style('text-anchor', 'middle')
				.attr('fill', 'white')
				.attr('font-size', '12px');

		}, this);

		_.each(this.collection.models, _.bind(function(model, index) {
			model.set('color', this.colors[index]);
			addLine(model.get('buckets'), this.colors[index], index);
		}, this));

		if (this.timeOverlay) {
			this.setTimeOverlay(this.timeOverlay);
		}
		this.trigger('renderGraph');
	},

	setTimeOverlay: function(values) {
		this.timeOverlay = values;
		if (this.timeOverlay[0] == this.startYear && this.timeOverlay[1] == this.endYear) {
			this.vis.select('rect.timerange-overlay')
				.transition()
				.duration(100)
				.style('opacity', 0);
		}
		else {
			this.vis.select('rect.timerange-overlay')
				.attr('x', this.xRange(values[0]))
				.attr('width', this.xRange(values[1])-this.xRange(values[0]))
				.transition()
				.duration(100)
				.style('opacity', 0.05);			
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
		var legends = _.map(this.collection.models, _.bind(function(model) {

			var filterStrings = [];
			if (model.get('filters') && model.get('filters').length > 0) {
				filterStrings = _.map(model.get('filters'), function(filter) {
					var filterString = '';
					for (var name in filter) {
						filterString += name+':('+(filter[name].join(','))+')';
					}
					return filterString;
				});
			}

			return {
				color: model.get('color'),
				key: model.get('key'),
				filterStrings: filterStrings,
				data: _.find(model.get('buckets'), function(bucket) {
					return bucket.key_as_string == year;
				})
			};
		}, this));

		var template = _.template($("#ngramInfoTemplate").html());

		this.$el.find('.info-overlay').html(template({
			data: {
				year: year,
				total:this.collection.getTotalByYear(year),
				legends: legends
			}
		}));

		this.$el.find('.info-overlay').css({
			'-webkit-transform': 'translate('+(position[0]+60)+'px, 20px)',
			'-moz-transform': 'translate('+(position[0]+60)+'px, 20px)',
			'-ms-transform': 'translate('+(position[0]+60)+'px, 20px)',
			'-o-transform': 'translate('+(position[0]+60)+'px, 20px)',
			'transform': 'translate('+(position[0]+60)+'px, 20px)'
		})
	},

	render: function() {
		var template = _.template($("#ngramViewTemplate").html());

		this.$el.html(template({}));

		this.vis = d3.select('#chartContainer');

		window.onresize = _.bind(function() {
			if (this.collection.length > 0) {
				this.renderGraph();
			}
		}, this);
	}
});