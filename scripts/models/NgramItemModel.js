var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
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
	}
});
