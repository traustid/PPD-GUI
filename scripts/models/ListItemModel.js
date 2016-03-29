var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
	formatDate: function(dateStr) {
		var d = new Date(dateStr);
		return d.toLocaleDateString();
	},

	parse: function(data) {
		_.each(data.hits, _.bind(function(document) {
			if (document._source.dokintressent) {		
				if (document._source.dokintressent.intressent.partibet) {
					document.parties = [document._source.dokintressent.intressent.partibet];
				}
				else {		
					var parties = _.uniq(_.filter(_.pluck(document._source.dokintressent.intressent, 'partibet'), Boolean));
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
