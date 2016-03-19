var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Collection.extend({
	url: 'http://cdh-vir-1.it.gu.se:8900/motioner/timeline/search',

	search: function(query) {
		this.queryString = query;
		this.fetch({
			data: $.param({
				searchPhrase: query
			}),
			reset: true
		});
	}
});
