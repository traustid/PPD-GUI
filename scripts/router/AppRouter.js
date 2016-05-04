var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Router.extend({
	routes: {
		"": "default",
		"search/:query(/querymode/:querymode)(/:yearfrom/:yearto)(/view/:document)": "search",
		"view/:document": "view"
	}
});
