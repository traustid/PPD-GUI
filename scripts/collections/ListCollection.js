var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
	search: function(query) {
		this.fetch({
			reset: true
		});
	}
});
