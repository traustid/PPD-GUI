var _ = require('underscore');

function QueryParser(query) {
	this.parsed = [];
	if (query) {
		this.parse(query);
	}
}

QueryParser.prototype.setFilter = function() {

}

QueryParser.prototype.parse = function(query) {
	var splitted = query.split(/(?![^)(]*\([^)(]*?\)\)),(?![^\(]*\))/g);

	if (splitted.length > 0) {
		this.parsed = _.map(splitted, function(queryItem) {
			var searchTerm = queryItem.split(/[A-ZÖÄÅ,|a-zöäå,]+:(\([A-ZÖÄÅ,|a-zöäå,]+\))/g)[0];
			searchTerm = searchTerm.substr(searchTerm.length-1, 1) == ' ' ? searchTerm.substr(0, searchTerm.length-1) : searchTerm;

			var filters = _.map(queryItem.match(/[A-ZÖÄÅ,|a-zöäå,]+:(\([A-ZÖÄÅ,|a-zöäå,]+\))/g), function(filter) {
				var filterKey = filter.split(':')[0];
				var filterValues = filter.split(':')[1].replace(/\(|\)/g, '').split(',');

				return {
					key: filterKey,
					values: filterValues
				};
			});

			return {
				searchTerm: searchTerm,
				filters: filters
			};
		});
	}

	return this.parsed;
}

QueryParser.prototype.build = function(queryObj) {
	var queryString = _.map(queryObj, function(queryItem) {
		return queryItem.searchTerm+(queryItem.filters && queryItem.filters.length > 0 ? ' '+(
			_.map(queryItem.filters, function(filter) {
				return filter.key+':('+filter.values.join(',')+')';
			}).join(' ')
		) : '');
	}).join(',');

	return queryString;
}

module.exports = QueryParser;