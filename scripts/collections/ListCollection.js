var Backbone = require('backbone');
var _ = require('underscore');
var ListItemModel = require('./../models/ListItemModel');

module.exports = Backbone.Collection.extend({
	model: ListItemModel,

	url: 'http://cdh-vir-1.it.gu.se:8990/hitlist',

	sortField: 'score',
	sortOrder: 'desc',

	search: function(query, timeRange, queryMode, queryTranslated) {
		this.pageIndex = 0;
		this.searchData = {
			searchQuery: query,
			startDate: timeRange[0],
			endDate: timeRange[1],
			queryMode: queryMode == null ? 'exact' : queryMode,
			queryTranslated: queryTranslated == null ? 'false' : 'true',
			sortField: this.sortField,
			sortOrder: this.sortOrder
		};

		this.fetch({
			reset: true,
			data: this.searchData
		});
	},

	filtersToString: function(filters) {
		if (filters && filters.length > 0) {		
			var filterStrings = _.map(filters, function(filter) {
				var filterString = '';
				for (var name in filter) {
					filterString += name+':('+(filter[name].join(','))+')';
				}
				return filterString;
			});

			return filterStrings.join(' ');
		}
		else {
			return '';
		}
	},

	addPage: function(resultIndex) {
		if (this.at(resultIndex).get('query').from_index+20 < this.at(resultIndex).get('data').total_hits) {
			
			var originalQuery = this.at(resultIndex).get('query');
			originalQuery.from_index = this.at(resultIndex).get('query').from_index+20;
			this.at(resultIndex).set('query', originalQuery);

			this.searchData.fromIndex = this.at(resultIndex).get('query').from_index;

			var tempCollection = new Backbone.Collection();
			tempCollection.model = ListItemModel;
			tempCollection.url = this.url;
			tempCollection.on('reset', _.bind(function()  {
				var data = this.at(resultIndex).get('data');
				data.hits = _.union(data.hits, tempCollection.at(0).get('data').hits);
				console.log(data);
				this.at(resultIndex).set('data', data);

				this.trigger('hitsupdate');
			}, this));

			var searchData = {
				searchQuery: this.at(resultIndex).get('query').original_search_terms+this.at(resultIndex).filtersToString(true),
				startDate: this.searchData.startDate,
				endDate: this.searchData.endDate,
				queryMode: this.searchData.queryMode,
				sortField: this.searchData.sortField,
				sortOrder: this.searchData.sortOrder,
				fromIndex: this.searchData.fromIndex
			};

			tempCollection.fetch({
				data: searchData,
				reset: true
			});
		}
	}
});
