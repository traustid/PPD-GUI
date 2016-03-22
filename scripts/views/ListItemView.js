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

		if (htmlEl[0].tagName.toLowerCase() == 'style') {
			$(htmlEl[1]).removeAttr('style');
			var htmlString = $(htmlEl[1]).html();
		}
		else {
			$(htmlEl[0]).removeAttr('style');
			var htmlString = $(htmlEl[0]).html();
		}

//		htmlString = this.options.model.get('_source').dokument.html;


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