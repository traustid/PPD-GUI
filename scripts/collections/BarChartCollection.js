var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Collection.extend({
	url: 'http://cdh-vir-1.it.gu.se:8990/barchart',

	initialize: function() {
	},

	parse: function(data) {
		return data;
	},

	search: function(query, timeRange, queryMode, aggregationField) {
		this.searchData = {
			'searchQuery': query,
			'startDate': timeRange[0],
			'endDate': timeRange[1],
			'queryMode': queryMode == null ? 'exact' : queryMode,
			'aggField': aggregationField
		};

		this.fetch({
			reset: true,
			data: this.searchData
		});
	}
});
