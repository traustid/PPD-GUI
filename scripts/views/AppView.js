var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var SearchInputView = require('./SearchInputView');
var AppRouter = require('./../router/AppRouter');
var NgramView = require('./NgramView');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.router = new AppRouter();

		this.render();

		this.router.on('route:search', _.bind(function(query) {
			this.doSearch(query);
		}, this));

		Backbone.history.start();

	},

	doSearch: function(query) {
		this.$el.addClass('small-header');

		if (this.ngramView == undefined) {
			this.ngramView = new NgramView({
				el: this.$el.find('#ngramContianer')
			});
		}

		this.ngramView.search(query);
	},

	render: function() {
		this.searchInput = new SearchInputView({
			el: this.$el.find('#searchInput')
		});

		this.searchInput.on('search', _.bind(function(event) {
			console.log('on search');
			this.router.navigate('search/'+event.queryString, {
				trigger: true
			});
		}, this));
		return this;
	}
});