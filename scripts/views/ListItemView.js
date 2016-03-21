var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		this.render();
	},

	events: {
		'click .item-title': 'itemTitleClick',
		'click .full-text-button': 'fullTextClick'
	},

	itemTitleClick: function(event) {
		this.$el.toggleClass('item-open');
	},

	fullTextClick: function(event) {
		event.preventDefault();

		var template = _.template($("#textViewerTemplate").html());
		$('#textViewer').html(template({
			model: this.options.model
		}));

		$('html').addClass('has-overlay');

		$('#textViewer .close-button').click(_.bind(function() {
			$('html').removeClass('has-overlay');

			$('#textViewer').removeClass('visible');
			$('#textViewer').html('');
		}, this));

		$('#textViewer').addClass('visible');
	},

	render: function() {
		var template = _.template($("#listItemTemplate").html());
		this.$el.html(template({
			model: this.options.model
		}));
	}
});