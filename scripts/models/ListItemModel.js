var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
	formatDate: function(dateStr) {
		var d = new Date(dateStr);
		return d.toLocaleDateString();
	},

	parse: function(data) {
		if (data._source.dokintressent) {		
			if (data._source.dokintressent.intressent.partibet) {
				data.parties = [data._source.dokintressent.intressent.partibet];
			}
			else {		
				var parties = _.uniq(_.filter(_.pluck(data._source.dokintressent.intressent, 'partibet'), Boolean));
				data.parties = parties;
			}
		}
		else {
			data.parties = [];
		}

		data._source.dokument.dateFormatted = this.formatDate(data._source.dokument.datum)
		return data;
	}
});
