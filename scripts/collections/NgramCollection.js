var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Collection.extend({
	url: 'http://cdh-vir-1.it.gu.se:8900/motioner/timeline/search',
	includeTotal: false,

	initialize: function() {
		this.totalCollection = new Backbone.Collection();
		this.totalCollection.url = 'http://cdh-vir-1.it.gu.se:8900/motioner/timeline/total';
		this.totalCollection.fetch();
	},

	parse: function(data) {
		if (this.includeTotal) {
			data.push(this.totalCollection.toJSON()[0]);
		}
		return data;
	},

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
