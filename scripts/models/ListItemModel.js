var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
	parse: function(data) {
		var parties = _.uniq(_.filter(_.pluck(data._source.dokintressent.intressent, 'partibet'), Boolean));
		data.parties = parties;
		return data;
	}
});
