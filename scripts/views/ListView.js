var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var ListCollection = require('./../collections/ListCollection');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.collection = new ListCollection();
		this.collection.on('reset', this.render, this);
		this.render();
	},

	search: function(query) {
//		this.collection.search(query);
	},

	render: function() {
		var template = _.template($("#hitlistUiTemplate").html());

		this.$el.html(template({}));
	},

	applyFilter: function(filter) {
		console.log('applyFilter');
		this.filter = filter;
		this.listData = [0, 1, 2, 3, 4, 5, 6];
		
		this.renderList();
	},

	renderList: function() {
		this.listData = [0, 1, 2, 3, 4, 5, 6];

		var template = _.template($("#hitlistTemplate").html());

		this.$el.find('.list-container').html(template({
			models: this.listData
		}));
	}
});