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
			if (document._source.dokforslag) {
				if (document._source.dokforslag.forslag[0]) {
					document.proposals = _.compact(_.map(document._source.dokforslag.forslag, function(forslag) {
						return forslag.kammarbeslutstyp || forslag.kammaren || forslag.utskottet ?
							{
								kammarbeslutstyp: forslag.kammarbeslutstyp,
								kammaren: forslag.kammaren,
								utskottet: forslag.utskottet,
								behandlas_i: forslag.behandlas_i,
								lydelse: forslag.lydelse,
								number: forslag.nummer
							} : null;
					}));
				}
				else {
					var forslag = document._source.dokforslag.forslag;

					document.proposals = forslag.kammarbeslutstyp || forslag.kammaren || forslag.utskottet ?
						[
							{
								kammarbeslutstyp: forslag.kammarbeslutstyp,
								kammaren: forslag.kammaren,
								utskottet: forslag.utskottet,
								behandlas_i: forslag.behandlas_i,
								lydelse: forslag.lydelse,
								number: forslag.nummer
							}
						]: [];
				}
			}

			document._source.dokument.dateFormatted = this.formatDate(document._source.dokument.datum)
		}, this));
		return data;
	}
});
