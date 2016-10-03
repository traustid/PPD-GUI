var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var BarChartCollection = require('./../collections/BarChartCollection');

module.exports = Backbone.View.extend({
	graphWidth: 1120,
	graphHeight: 500,

	graphMargins: {
		top: 20,
		right: 0,
		bottom: 35,
		left: 25
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

	search: function(query, timeRange, queryMode, aggregationField) {
		this.lastQuery = query;
		this.lastQueryMode = queryMode;
		this.lastAggregationField = aggregationField;
		this.collection.search(query, timeRange, queryMode, aggregationField);

		this.timeRange = timeRange;

		this.$el.addClass('loading');			
	},

	collectionReset: function() {
		this.renderGraph();
	},

	barClick: function(event) {
		var bar = this.vis.select('.bar[data-label="'+event.key+'"]')[0][0];
		var barPosition = bar.x.baseVal.value;
		var barWidth = bar.width.baseVal.value;

		this.vis.selectAll('.bar-arrow')
			.transition()
			.duration(400)
			.attr('opacity', 0);

		this.vis.select('.bar-container[data-label="'+event.key+'"]').select('.bar-arrow')
			.transition()
			.duration(400)
			.attr('opacity', 1);		

		this.trigger('barclick', {
			key: event.key,
			aggregationField: this.lastAggregationField
		});
	},

	renderGraph: function() {
		// Render the graph

		this.$el.removeClass('loading');
		var view = this;

		this.graphWidth = this.$el.find('.chart-container').width();
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
//			.range([this.graphHeight-this.graphMargins.top-this.graphMargins.bottom, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.tickSize(1)
			.innerTickSize(-(this.graphHeight-this.graphMargins.bottom-this.graphMargins.top))
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

		graph.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate('+this.graphMargins.left+',' + (this.graphHeight) + ')')
			.call(xAxis);

		graph.selectAll(".x.axis text")
			.html(function(d) {
				return '<title>'+d+'</title>'+(d.length > 10 ? d.substr(0, 10)+'...' : d);
//				return d.toUpperCase();
			})

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
			.on('mouseenter', function() {
				view.$el.find('.info-overlay').addClass('visible');
			})
			.on('mouseout', function() {
				view.$el.find('.info-overlay').removeClass('visible');
			})
			.on('mousemove', function(d) {
				view.$el.find('.info-overlay').html('<strong>'+d.key+'</strong>: '+d.doc_count);

				var xPos = d3.event.screenX;
				var yPos = d3.event.screenY-20;
				console.log(d)

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
			.attr('fill', '#ec7217')
			.attr('d',d3.svg.symbol().type('triangle-down'))
			.attr('transform', 'translate(25, '+(view.graphHeight+(view.graphMargins.bottom-5))+')')
			.attr('y', function(d) {
				return view.graphHeight;
			})
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