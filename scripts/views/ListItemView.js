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
	},

	itemTitleClick: function(event) {
		this.$el.toggleClass('item-open');
	},

	fullTextClick: function(event) {
		event.preventDefault();

		var htmlString = this.model.get('_source').dokument.html;
		var htmlEl = $(htmlString);

		htmlString = htmlString.split('<style>').join('<!--').split('</style>').join('-->');

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
/*
		var htmlString = this.model.get('_source').dokument.html;

		htmlString = htmlString.split('<style>').join('<!--').split('</style>').join('-->');

		htmlString = $.truncate(htmlString, {
			length: 300,
			ellipsis: '<br/><a href="" class="button full-text-button">&hellip;</a>'
		});

		var partyLetters = '';
		if (this.model.get('parties').length > 0) {
			partyLetters = _.map(this.model.get('parties'), _.bind(function(party) {
				var partyItem = _.findWhere(this.options.parties, {letter: party.toLowerCase()});
				if (partyItem) {				
					if (partyItem.logo) {
						return '<div title="'+partyItem.name+'" class="party-letter image" style="background-image: url(img/'+partyItem.logo+')"></div>';
					}
					else {
						return '<div title="'+partyItem.name+'" class="party-letter letter">'+party.toUpperCase()+'</div>';
					}
				}
				else {
					return '<div class="party-letter letter">'+party.toUpperCase()+'</div>';
				}
			}, this)).join('');
		}
*/
		var authorNames = [];
		var authorIDs = [];

		if (this.model.get('_source').meta_info.authorid && this.model.get('_source').meta_info.authorid.authors) {
			authorNames = _.map(this.model.get('_source').meta_info.authorid.authors, function(author) {
				return author.name;
			});
			authorIDs = _.map(this.model.get('_source').meta_info.authorid.authors, function(author) {
				return author.id;
			});
		}

		var year = '';

		if (this.model.get('_source').meta_info.imprintyear) {
			year = (new Date('1929-01-01')).getFullYear()
		}

		this.$el.html(template({
			model: this.model,
			authorNames: authorNames,
			authorIDs: authorIDs,
			year: (new Date(this.model.get('_source').meta_info.imprintyear)).getFullYear()
		}));
	}
});