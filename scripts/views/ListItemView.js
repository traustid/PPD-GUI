var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

require('../lib/jquery.truncate');

module.exports = Backbone.View.extend({
	parties: [
		{
			letter: "s",
			name: "Socialdemokraterna",
			logo: "partylogo-s.png"
		},
		{
			letter: "m",
			name: "Moderata samlingspartiet",
			logo: "partylogo-m.png"
		},
		{
			letter: "c",
			name: "Centerpartiet",
			logo: "partylogo-c.png"
		},
		{
			letter: "fp",
			name: "Folkpartiet",
			logo: "partylogo-fp.png"
		},
		{
			letter: "kd",
			name: "Kristdemokraterna",
			logo: "partylogo-kd.png"
		},
		{
			letter: "v",
			name: "Vänsterpartiet",
			logo: "partylogo-v.png"
		},
		{
			letter: "mp",
			name: "Miljöpartiet de gröna",
			logo: "partylogo-mp.png"
		},
		{
			letter: "vpk",
			name: "Vänsterpartiet Kommunisterna"
		},
		{
			letter: "sd",
			name: "Sverigedemokraterna ",
			logo: "partylogo-sd.png"
		},
		{
			letter: "kds",
			name: "Kristen demokratisk samling"
		},
		{
			letter: "nyd",
			name: "Ny Demokrati",
			logo: "partylogo-nyd.png"
		},
		{
			letter: "l",
			name: "Liberalerna"
		},
		{
			letter: "apk",
			name: "Arbetarpartiet kommunisterna"
		},
		{
			letter: "ni",
			name: ""
		},
		{
			letter: "i",
			name: ""
		},
		{
			letter: "kr",
			name: ""
		},
		{
			letter: "bör",
			name: ""
		},
		{
			letter: "in",
			name: ""
		},
		{
			letter: "rn",
			name: ""
		},
		{
			letter: "vp",
			name: "Vänsterpartiet"
		},
		{
			letter: "e",
			name: ""
		},
		{
			letter: "nt",
			name: ""
		},
		{
			letter: "tn",
			name: ""
		},
		{
			letter: "a",
			name: ""
		},
		{
			letter: "0",
			name: ""
		}
	],

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

		var htmlString = this.model.get('_source').dokument.html;

		htmlString = htmlString.split('<style>').join('<!--').split('</style>').join('-->');

		htmlString = $.truncate(htmlString, {
			length: 300,
			ellipsis: '<br/><a href="" class="button full-text-button">&hellip;</a>'
		});

		var partyLetters = '';
		if (this.model.get('parties').length > 0) {
			partyLetters = _.map(this.model.get('parties'), _.bind(function(party) {
				var partyItem = _.findWhere(this.parties, {letter: party.toLowerCase()});
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

		this.$el.html(template({
			model: this.model,
			shortText: htmlString,
			partyLetters: partyLetters
		}));
	}
});