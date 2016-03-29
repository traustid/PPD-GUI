var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

require('../lib/jquery.truncate');

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

		var htmlString = this.model.get('_source').dokument.html;
		var htmlEl = $(htmlString);
		htmlEl.find('style').remove();
		htmlString = htmlEl.html();

		var template = _.template($("#textViewerTemplate").html());
		$('#textViewer').html(template({
			title: this.model.get('_source').dokument.titel,
			html: htmlString
		}));

		$('html').addClass('has-overlay');

		$('#textViewer .close-button').click(_.bind(function() {
			history.go(-1);
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

		this.options.router.navigate('view/document', {
			trigger: false
		});
	},

	render: function() {
		var template = _.template($("#listItemTemplate").html());

		var htmlString = this.model.get('_source').dokument.html;
		var htmlEl = $(htmlString);
		htmlEl.find('style').remove();
		htmlString = htmlEl.html();

		htmlString = $.truncate(htmlString, {
			length: 400
		});

		this.$el.html(template({
			model: this.model,
			shortText: htmlString
		}));
	}
});