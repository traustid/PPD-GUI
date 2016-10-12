var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var NgramItemModel = require('./../models/NgramItemModel');

module.exports = Backbone.Collection.extend({
	model: NgramItemModel,

	url: 'http://cdh-vir-1.it.gu.se:8990/timeline/aggs',
	includeTotal: false,

	initialize: function() {
		this.totalCollection = new Backbone.Collection();
		this.totalCollection.url = 'http://cdh-vir-1.it.gu.se:8990/timeline/total';
		this.totalCollection.once('reset', _.bind(function() {
			this.trigger('totalCollectionReset');
		}, this));
		this.totalCollection.fetch({
			reset: true
		});
	},

	getTotalByYear: function(year, valueKey) {
		if (this.totalCollection.length == 0) {
			return null;
		}
		return _.filter(this.totalCollection.at(0).get('data').buckets, function(bucket) {
			return Number(bucket.key) == year;
		})[0][valueKey];
	},

	parse: function(data) {
		if (this.includeTotal) {
			data.data.push(this.totalCollection.toJSON()[0]);
		}
		return data;
	},

	search: function(query, queryMode, modernSpelling) {
		this.queryString = query;

		this.searchData = {
			'searchQuery': query,
			'queryMode': queryMode == null ? 'exact' : queryMode,
			'modernSpelling': modernSpelling
		};

		this.fetch({
			data: this.searchData,
			reset: true
		});
	}
});
