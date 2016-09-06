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

	getPageUrl: function() {
//	http://litteraturbanken.se/#!/forfattare/SodergranE/titlar/BrokigaIakttagelser/sida/22/etext
		var url = '';

		console.log(this.model.get('_source').meta_info.mediatype);

//		if (this.model.get('_source').meta_info.mediatype == 'etext') {

			var author = this.model.get('_source').meta_info.authorid.authors.length > 0 ? 
				this.model.get('_source').meta_info.authorid.authors[0].id :
				this.model.get('_source').meta_info.authorid.editors.length > 0 ?
				this.model.get('_source').meta_info.authorid.editors[0].id :
				''
			;

			url = 'http://litteraturbanken.se/#!/forfattare/'+author+'/titlar/'+this.model.get('_source').meta_info.titleid+'/sida/'+this.model.get('_source').page_idx+'/'+this.model.get('_source').meta_info.mediatype;
//		}

		return url;
	},


	highlight: function(data, search) {
		function preg_quote(str) {
			// http://kevin.vanzonneveld.net
			// +   original by: booeyOH
			// +   improved by: Ates Goral (http://magnetiq.com)
			// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +   bugfixed by: Onno Marsman

			return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
		}
		return data.replace( new RegExp( "(" + preg_quote( search ) + ")" , 'gi' ), "<span class=\"highlight\">$1</span>" );
	},

	render: function() {
		var template = _.template($("#listItemTemplate").html());

		var authorNames = [];
		var authorIDs = [];

		console.log(this.options.searchTermAnalyzed);

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

		var pageContentText = this.highlight(this.model.get('_source').page_content_original, this.options.searchTermAnalyzed);

		this.$el.html(template({
			model: this.model,
			authorNames: authorNames,
			authorIDs: authorIDs,
			year: (new Date(this.model.get('_source').meta_info.imprintyear)).getFullYear(),
			pageUrl: this.getPageUrl(),
			pageContentText
		}));
	}
});