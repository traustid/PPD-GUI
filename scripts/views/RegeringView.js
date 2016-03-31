var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');

module.exports = Backbone.View.extend({
	graphWidth: 1120,
	graphHeight: 500,

	startYear: 1971,
	endYear: 2016,

	initialize: function(options) {
		this.options = options;

		this.collection = new Backbone.Collection();
		this.collection.url = 'regering.json';
		this.collection.on('reset', this.renderGraph, this);
		this.collection.fetch({
			reset: true
		});
	},

	renderGraph: function() {
		this.render();

		var app = this;

		this.graphWidth = this.$el.parent().width();
		this.graphHeight = (this.graphWidth/1120) * 500;

		this.xRangeValues = _.map(this.collection.models, function(model) {
			return model.get('from').substr(0, 4);
		});

		this.xRange = d3.scale.ordinal().rangeRoundBands([0, this.graphWidth], 0.1).domain(this.xRangeValues);

		this.vis.selectAll('rect')
			.data(this.collection.models)
			.enter()
			.append('rect')
			.attr('class', 'point')
			.attr('fill', '#333')
			.attr('cx', function (d) {
				console.log(d);
				console.log(d.get('from'));
				return app.xRange(Number(d.get('from').substr(0, 4)));
			});

		this.trigger('renderGraph');
	},

	render: function() {
		this.vis = d3.select('#regeringChartContainer');

		window.onresize = _.bind(function() {
			if (this.collection.length > 0) {
				this.renderGraph();
			}
		}, this);
	}
});