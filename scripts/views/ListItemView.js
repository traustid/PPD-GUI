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
		'click .full-text-button': 'fullTextClick',
		'click': 'selfClick'
	},

	selfClick: function() {
		console.log(this.model);
		console.log(this.model.get('_source').dokintressent.intressent);
	},

	itemTitleClick: function(event) {
		this.$el.toggleClass('item-open');
	},

	fullTextClick: function(event) {
		event.preventDefault();

		var htmlEl = $(this.options.model.get('_source').dokument.html);
		htmlEl.removeAttr('style');

		htmlString = this.options.model.get('_source').dokument.html;
		htmlString = htmlString.split('<style>').join('<div style="display: none">').split('</style>').join('</div>');

		var template = _.template($("#textViewerTemplate").html());
		$('#textViewer').html(template({
			title: this.options.model.get('_source').dokument.titel,
			html: htmlString
		}));

		$('html').addClass('has-overlay');

		$('#textViewer .close-button').click(_.bind(function() {
			$('html').removeClass('has-overlay');

			$('#textViewer').removeClass('visible');
			$('#textViewer').html('');
		}, this));

		_.each($('#textViewer .text-content a'), function(link) {
			$(link).click(function(event) {
				event.preventDefault();
				var scrollPos = $('#textViewer').offset().top-$(link).offset().top+$(document.body).scrollTop();
				console.log(scrollPos);
				$('#textViewer .text-content').animate({
					scrollTop: scrollPos
				}, 500);
			});
		});

		$('#textViewer').addClass('visible');
	},

	render: function() {
		var template = _.template($("#listItemTemplate").html());
		this.$el.html(template({
			model: this.options.model
		}));
	}
});