var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var BarChartCollection = require('./../collections/BarChartCollection');

module.exports = Backbone.View.extend({
	graphWidth: 1120,
	graphHeight: 500,

	graphMargins: {
		top: 40,
		right: 30,
		bottom: 50,
		left: 40
	},

	colors: [
		'#b6ac42', 
		'#9d4adf', 
		'#6bbc3e', 
		'#cf45ab', 
		'#54a867', 
		'#9063c7', 
		'#d68e39', 
		'#5477d0', 
		'#d74c31', 
		'#63b8b5', 
		'#da446b', 
		'#697131', 
		'#d588c2', 
		'#a5a981', 
		'#9f4e69', 
		'#7fa3d1', 
		'#ad6847', 
		'#75668d', 
		'#cc9899', 
		'#51736e'
	],

	initialize: function(options) {
		this.options = options;
		this.app = this.options.app;

		/*
			Initialize the collection that handles API calls
		*/
		this.collection = new BarChartCollection();
		this.collection.on('reset', this.collectionReset, this);
		this.render();
	},

	lastQuery: '',

	search: function(query, timeRange, queryMode, queryTranslated, aggregationField) {
		this.lastQuery = query;
		this.lastQueryMode = queryMode;
		this.lastAggregationField = aggregationField == undefined ? this.lastAggregationField : aggregationField;
		this.lastQueryTranslated = queryTranslated;
		this.collection.search(query, timeRange, queryMode, queryTranslated, aggregationField);

		this.timeRange = timeRange;

		this.$el.addClass('loading');			
	},

	collectionReset: function() {
		this.renderGraph();
	},

	barClick: function(event) {
		if (this.selectedBar && this.selectedBar.key == event.key) {
			this.vis.selectAll('.bar-arrow')
				.transition()
				.duration(400)
				.attr('opacity', 0);

			this.vis.selectAll('.bar')
				.transition()
				.duration(400)
				.attr('opacity', 1);

			this.vis.select('.arrows-line')
				.transition()
				.duration(400)
				.attr('opacity', 0);

			this.selectedBar = undefined;
			this.trigger('bardeselect');
		}
		else {
			console.log('BarChartView: barChart');
			console.log(event);

			this.selectedBar = {
				key: event.key,
				aggregationField: this.lastAggregationField
			};

			var bar = this.vis.select('.bar[data-label="'+event.key+'"]');
			var barEl = bar[0][0];

			var barPosition = barEl.x.baseVal.value;
			var barWidth = barEl.width.baseVal.value;

			this.vis.selectAll('.bar')
				.transition()
				.duration(400)
				.attr('opacity', 0.4);

			this.vis.selectAll('.bar-arrow')
				.transition()
				.duration(400)
				.attr('opacity', 0);

			bar.transition()
				.duration(400)
				.attr('opacity', 1);

			this.vis.select('.arrows-line')
				.transition()
				.duration(400)
				.attr('opacity', 1);

			this.vis.select('.bar-container[data-label="'+event.key+'"]').selectAll('.bar-arrow')
				.transition()
				.duration(400)
				.attr('opacity', 1);		

			this.trigger('barclick', {
				key: event.key,
				aggregationField: this.lastAggregationField
			});
		}
	},

	renderGraph: function() {
		// Render the graph

		// Begin by emptying possible filters
		if (this.selectedBar) {
			this.trigger('bardeselect');
		}

		this.selectedBar = undefined;

		this.$el.removeClass('loading');
		var view = this;

		this.graphWidth = this.$el.find('.chart-container').width()-this.graphMargins.left-this.graphMargins.right;
		this.graphHeight = (this.graphWidth/1120) * 200;

		this.$el.find('svg.chart-container').attr('height', this.graphHeight+this.graphMargins.top+this.graphMargins.bottom);

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

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, this.graphWidth-this.graphMargins.left], .1);

		var y = d3.scale.linear()
			.range([this.graphHeight, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.tickSize(1)
			.innerTickSize(-(this.graphHeight-this))
			.orient('bottom');

		var yAxis = d3.svg.axis()
			.scale(y)
			.tickSize(1)
			.orient('left')
			.tickSubdivide(true);

		x.domain(_.map(this.collection.at(0).get('data').buckets, function(d) {
			return d.key;
		}));

		y.domain([0, d3.max(this.collection.at(0).get('data').buckets, function(d) {
			return d.doc_count;
		})]);

		var graph = this.vis.append('g')
			.attr('transform', 'translate('+this.graphMargins.left+', '+this.graphMargins.top+')');

		this.yAxisLabel = this.vis.append("text")
			.attr('class', 'axisLabel')
			.attr("text-anchor", "middle")
			.attr("transform", "translate("+ (25) +","+((this.graphHeight/2)+40)+") rotate(-90)")
			.text('Antal sidor');

		graph.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate('+this.graphMargins.left+',' + (this.graphHeight) + ')')
			.call(xAxis);

		graph.selectAll(".x.axis text")
			.html(function(d) {
				return '<title>'+d+'</title>'+(d.length > 10 ? d.substr(0, 10)+'...' : d);
			})

		graph.append('rect')
			.attr('class', 'arrows-line')
			.attr('fill', '#f0f0f0')
			.attr('stroke', '#bdbdbd')
			.attr('height', 26)
			.attr('x', -(view.graphMargins.left+1))
			.attr('width', view.graphWidth+view.graphMargins.left+view.graphMargins.right+2)
			.attr('y', Math.ceil(view.graphHeight+24))
			.attr('opacity', 0);

		graph.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate('+this.graphMargins.left+', 0)')
			.call(yAxis);

		graph.selectAll('.bar')
			.data(this.collection.at(0).get('data').buckets)
			.enter()
			.append('g')
			.attr('class', 'bar-container')
			.attr('data-label', function(d) {
				return d.key;
			})
			.attr('transform', function(d, i) {
				return 'translate('+((x(d.key)+(x.rangeBand()-50)/2)+view.graphMargins.left)+', 0)';
			})
			.append('rect')
			.attr('class', 'bar')
			.on('mouseenter', function(d) {
				view.$el.find('.info-overlay').addClass('visible');

				if (view.selectedBar) {
						d3.select(this)
							.transition()
							.duration(400)
							.attr('opacity', 0.7);
					

				}
				else {
					d3.select(this)
						.transition()
						.duration(400)
						.attr('opacity', 0.5);
				}
			})
			.on('mouseout', function(d) {
				view.$el.find('.info-overlay').removeClass('visible');

				if (view.selectedBar) {
					if (view.selectedBar.key == d.key) {
						d3.select(this)
							.transition()
							.duration(400)
							.attr('opacity', 1);
					}
					else {
						d3.select(this)
							.transition()
							.duration(400)
							.attr('opacity', 0.4);
					}
				}
				else {
					d3.select(this)
						.transition()
						.duration(400)
						.attr('opacity', 1);
				}
			})
			.on('mousemove', function(d) {
				view.$el.find('.info-overlay').html('<strong>'+d.key+'</strong>: '+d.doc_count);

				var xPos = d3.event.screenX+20;
				var yPos = d3.event.screenY-30;

				view.$el.find('.info-overlay').css({
					'-webkit-transform': 'translate('+xPos+'px, '+yPos+'px)',
					'-moz-transform': 'translate('+xPos+'px, '+yPos+'px)',
					'-ms-transform': 'translate('+xPos+'px, '+yPos+'px)',
					'-o-transform': 'translate('+xPos+'px, '+yPos+'px)',
					'transform': 'translate('+xPos+'px, '+yPos+'px)'
				})
			})
			.on('click', _.bind(this.barClick, this))
			.attr('data-label', function(d) {
				return d.key;
			})
			.attr('opacity', 1)
			.attr('fill', function(d, index) {
				return view.colors[index];
			})
			.attr('width', Math.min.apply(null, [x.rangeBand(), 50]))
			.attr('y', function(d) {
				return view.graphHeight;
			})
			.attr('height', 0)
			.transition()
			.duration(800)
			.attr('y', function(d) {
				return y(d.doc_count);
			})
			.attr('height', function(d) {
				return view.graphHeight-y(d.doc_count);
			});

		graph.selectAll('.bar-container')
			.append('path')
			.attr('class', 'bar-arrow')
			.attr('d', 'M0,9.26429605180997L13.078685485212741,-5.26429605180997 -13.078685485212741,-5.26429605180997Z')
			.attr('transform', 'translate(25, '+(view.graphHeight+(view.graphMargins.bottom-18))+')')
			.attr('y', function(d) {
				return view.graphHeight;
			})
			.attr('fill', '#eaeaea')
			.attr('opacity', 0);

		graph.selectAll('.bar-container')
			.append('path')
			.attr('class', 'bar-arrow')
			.attr('d', 'M0,7.26429605180997L12.078685485212741,-5.26429605180997 -12.078685485212741,-5.26429605180997Z')
			.attr('transform', 'translate(25, '+(view.graphHeight+(view.graphMargins.bottom-20))+')')
			.attr('y', function(d) {
				return view.graphHeight;
			})
			.attr('fill', '#ffffff')
			.attr('stroke', '#b0b0b0')
			.attr('opacity', 0);

		graph.selectAll('.bar-container')
			.append('rect')
			.attr('class', 'bar-arrow')
			.attr('fill', '#fff')
			.attr('x', 14)
			.attr('y', view.graphHeight+24)
			.attr('width', Math.min.apply(null, [x.rangeBand(), 50])-28)
			.attr('height', 2)
			.attr('opacity', 0);

		this.trigger('rendergraph'); // Trigger 'renderGraph' event.
	},

	render: function() {
		/*
			Render the graph.
		*/
		var template = _.template($('#barChartViewTemplate').html());
	
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