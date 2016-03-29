var Backbone = require('backbone');
var _ = require('underscore');
var ListItemModel = require('./../models/ListItemModel');

module.exports = Backbone.Collection.extend({
	model: ListItemModel,

	url: 'http://cdh-vir-1.it.gu.se:8900/motioner/hits',

	search: function(query, timeRange) {
		console.log('ListCollection:search')
		this.fetch({
			reset: true,
			data: {
				"searchPhrase": query,
				"startDate": timeRange[0],
				"endDate": timeRange[1]
			}
		});
	}
});
