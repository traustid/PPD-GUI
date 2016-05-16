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
		bottom: 25,
		left: 25
	},

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

	search: function(query, timeRange, queryMode, resultIndex) {
		this.resultIndex = resultIndex;
		this.lastQuery = query;
		this.lastQueryMode = queryMode;
		this.collection.search(query, timeRange, queryMode);

		this.timeRange = timeRange;

		this.$el.addClass('loading');			
	},

	collectionReset: function() {
		this.renderGraph();
	},

	renderGraph: function() {
		console.log('BarChartView:renderGraph');
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

		x.domain(this.collection.at(this.resultIndex).get('buckets').map(function(d) {
			return d.key;
		}));

		y.domain([0, d3.max(this.collection.at(this.resultIndex).get('buckets'), function(d) {
			return d.doc_count;
		})]);

		var graph = this.vis.append('g')
			.attr('transform', 'translate('+this.graphMargins.left+', '+this.graphMargins.top+')');

		graph.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate('+this.graphMargins.left+',' + (this.graphHeight) + ')')
			.call(xAxis);
/*	
		graph.selectAll(".x.axis text")
			.attr("transform"," translate(0,15) rotate(-65)") // To rotate the texts on x axis. Translate y position a little bit to prevent overlapping on axis line.
			.attr('font-family', function(d) {
				var party = _.find(view.options.parties, function(party) {
					return party.letter.toLowerCase() == d.toLowerCase();
				});

				return party.entity && party.entity != '' ? 'icomoon' : 'inherit';
			})
			.attr('font-size', '16px')
			.html(function(d) {
				var party = _.find(view.options.parties, function(party) {
					return party.letter.toLowerCase() == d.toLowerCase();
				});

				return party ? (party.entity && party.entity != '' ? party.entity : d) : d;
			});
*/
		graph.selectAll(".x.axis text")
			.html(function(d) {
/*
				var party = _.find(view.options.parties, function(party) {
					return party.letter.toLowerCase() == d.toLowerCase();
				});
*/
				return d.toUpperCase();
			})

		graph.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate('+this.graphMargins.left+', 0)')
			.call(yAxis);

		graph.selectAll('.bar')
			.data(this.collection.at(this.resultIndex).get('buckets'))
			.enter().append('rect')
			.attr('class', 'bar')
			.attr('fill', function(d) {
				var party = _.find(view.options.parties, function(party) {
					return party.letter.toLowerCase() == d.key.toLowerCase();
				});

				return party ? (party.color && party.color != '' ? party.color : '#4F4F4F') : '#4F4F4F';
			})
/*
			.attr('x', function(d) {
				return x(d.key)+view.graphMargins.left;
			})
*/
			.attr("x", function(d, i) {
				return (x(d.key)+(x.rangeBand()-50)/2)+view.graphMargins.left;
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