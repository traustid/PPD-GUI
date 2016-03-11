var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
	url: 'example.json',

	search: function(query) {
		this.queryString = query;
		this.fetch({
			reset: true
		});
	}
});
