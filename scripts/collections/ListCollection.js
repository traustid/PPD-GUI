var Backbone = require('backbone');
var _ = require('underscore');
var ListItemModel = require('./../models/ListItemModel');

module.exports = Backbone.Collection.extend({
	model: ListItemModel,

	url: 'http://cdh-vir-1.it.gu.se:8900/motioner/hits',
	pageIndex: 0,

	search: function(query, timeRange) {
		this.pageIndex = 0;
		this.searchData = {
			"searchPhrase": query,
			"startDate": timeRange[0],
			"endDate": timeRange[1]
		};

		this.fetch({
			reset: true,
			data: this.searchData
		});
	},

	addPage: function() {
		this.pageIndex += 20;
		this.searchData.fromIndex = this.pageIndex;

		var tempCollection = new Backbone.Collection();
		tempCollection.model = ListItemModel;
		tempCollection.url = this.url;
		tempCollection.on('reset', _.bind(function()  {
			console.log(tempCollection);

			_.each(tempCollection.models, _.bind(function(model, index) {
				this.at(index).set('hits', _.union(this.at(index).get('hits'), model.get('hits')));
			}, this));

			this.trigger('hitsupdate');
		}, this));
		tempCollection.fetch({
			data: this.searchData,
			reset: true
		});
	}
});
