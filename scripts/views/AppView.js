var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var SearchInputView = require('./SearchInputView');


module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function() {
		this.searchInput = new SearchInputView({
			el: this.$el.find('#searchInput')
		});
		return this;
	}
});

console.log('appview')