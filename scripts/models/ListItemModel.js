var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
	formatDate: function(dateStr) {
//		var d = new Date(dateStr);
//		return d.toLocaleDateString();
		return dateStr.substr(0, 10);
	},

	parse: function(data) {
		_.each(data.hits, _.bind(function(document) {
			if (document._source.dokintressent) {		
				if (document._source.dokintressent.intressent.partibet) {
					document.parties = [document._source.dokintressent.intressent.partibet.toLowerCase()];
				}
				else {		
					var parties = _.uniq(_.filter(_.map(document._source.dokintressent.intressent, function(intressent) {
						return intressent.partibet ? intressent.partibet.toLowerCase() : undefined;
					}), Boolean));
					document.parties = parties;
				}
			}
			else {
				document.parties = [];
			}

			document._source.dokument.dateFormatted = this.formatDate(document._source.dokument.datum)
		}, this));
		return data;
	}
});
