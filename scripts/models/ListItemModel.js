var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
	formatDate: function(dateStr) {
		return dateStr.substr(0, 10);
	},

	filtersToString: function(addSpace) {
		if (this.get('query').filters && this.get('query').filters.length > 0) {		
			var filterStrings = _.map(this.get('query').filters, function(filter) {
				var filterString = '';
				filterString = filter.key+':('+(filter.terms.join(','))+')';

				return filterString;
			});

			return (addSpace ? ' ' : '')+filterStrings.join(' ');
		}
		else {
			return '';
		}
	},

	parse: function(data) {
		_.each(data.hits, _.bind(function(document) {
			document._source.dokument.dateFormatted = this.formatDate(document._source.dokument.datum)
		}, this));
		return data;
	}
});
