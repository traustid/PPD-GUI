var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

$.fn.outerOffset = function () {
    /// <summary>Returns an element's offset relative to its outer size; i.e., the sum of its left and top margin, padding, and border.</summary>
    /// <returns type="Object">Outer offset</returns>
    var margin = this.margin();
    var padding = this.padding();
    var border = this.border();
    return Point(
        margin.left + padding.left + border.left,
        margin.top + padding.top + border.top
    );
};

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

		var htmlEl = $(this.options.model.get('_source').dokument.html);

		if (htmlEl[0].tagName.toLowerCase() == 'style') {
			var htmlString = $(htmlEl[1]).html();
		}
		else {
			var htmlString = $(htmlEl[0]).html();
		}

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