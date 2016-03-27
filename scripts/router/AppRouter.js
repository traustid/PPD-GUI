var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Router.extend({
	routes: {
		"": "default",
		"search/:query(/:yearfrom/:yearto)(/view/:document)": "search",
		"view/:document": "view"
	}
});
