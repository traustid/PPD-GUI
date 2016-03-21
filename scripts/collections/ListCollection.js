var Backbone = require('backbone');
var _ = require('underscore');
var ListItemModel = require('./../models/ListItemModel');

module.exports = Backbone.Collection.extend({
	model: ListItemModel,

	url: 'example-documents.json',

	search: function(query) {
		this.fetch({
			reset: true
		});
	},

	filtered: function() {
		return this.models;
	},

	parse: function(data) {
		return data.responses[0].hits.hits;
	}
});
