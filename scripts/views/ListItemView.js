var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

require('../lib/jquery.truncate');

module.exports = Backbone.View.extend({
	authorImages: [
		"AfzeliusAA",
		"AgardhCA",
		"AgrellA",
		"AlmqvistCJL",
		"AnderssonD",
		"AnderssonO",
		"AndraeT",
		"AngeredStrandbergH",
		"ArmfeltGM",
		"AroseniusI",
		"ArvidiA",
		"AtterbomPDA",
		"BaathAU",
		"BauerJ",
		"BellmanCM",
		"BenedictssonV",
		"BenzonK",
		"BergerH",
		"BergmanB",
		"BergmanHj",
		"Birgitta",
		"BlancheA",
		"BondesonA",
		"BottigerCW",
		"BremerF",
		"BrennerSE",
		"BureusJ",
		"CederborghF",
		"CelsiusO",
		"CreutzGP",
		"DagermanS",
		"DulciU",
		"DuseSA",
		"EdelfeldtI",
		"EhrensvardCA",
		"EkebladJ",
		"EkelundJ",
		"EkelundV",
		"ElkanS",
		"EnglundP",
		"FitinghoffL",
		"FlygareCarlenE",
		"FranzenFM",
		"FrodingG",
		"FrostensonK",
		"GeijerEG",
		"GjorwellCC",
		"GoranssonL",
		"GrandelL",
		"GustafIII",
		"GyllenborgC",
		"GyllenborgGF",
		"HallstromP",
		"HanssonO",
		"HebbeW",
		"HedbergT",
		"HeidenstamV",
		"HiarneU",
		"HolmstromI",
		"Horatius",
		"HorbergP",
		"JosephsonE",
		"KarlfeldtEA",
		"KellgrenJH",
		"KeyE",
		"KnorringS",
		"KolmodinO",
		"LagerlofS",
		"LarssonC",
		"LefflerAC",
		"LeijonhufvudAG",
		"LenngrenAM",
		"LenstromCJ",
		"LeopoldCG",
		"LevertinO",
		"LidmanSv",
		"LindegrenE",
		"LindqvistS",
		"LinneCvon",
		"LithouG",
		"LivijnC",
		"LjungstedtA",
		"Lo-JohanssonI",
		"LowenhjelmH",
		"LucidorL",
		"LundegardA",
		"MartinsonH",
		"MennanderCF",
		"MesseniusJ",
		"MolinL",
		"NordenflychtHC",
		"NordstromL",
		"NybergJC",
		"NybomJ",
		"OswaldG",
		"PalmbladVF",
		"ParlandH",
		"RalambHG",
		"RambachJJ",
		"RegisJ",
		"RosensteinN",
		"RudbeckOaldre",
		"RunebergFC",
		"RunebergJL",
		"RuniusJ",
		"RydbergV",
		"SandelM",
		"SatherbergH",
		"SchwartzMS",
		"SilfverstolpeM",
		"SjobergB",
		"SnellmanJV",
		"SnoilskyC",
		"SodergranE",
		"SondenPA",
		"SpegelH",
		"StagneliusEJ",
		"StiernhielmG",
		"StrindbergA",
		"Sturzen-BeckerOP",
		"SwedbergJ",
		"SwedenborgE",
		"TegnerE",
		"ThorildT",
		"WagmanFO",
		"WallenbergJ",
		"WallengrenA",
		"WallinJO",
		"WastbergP",
		"WellanderJ",
		"WingardJ"
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

	render: function() {
		var template = _.template($("#listItemTemplate").html());

		var authorNames = [];
		var authorIDs = [];

		var showAuthorImage = false;

		if (this.model.get('_source').meta_info.authorid && this.model.get('_source').meta_info.authorid.authors) {
			authorNames = _.map(this.model.get('_source').meta_info.authorid.authors, function(author) {
				return author.name;
			});
			authorIDs = _.map(this.model.get('_source').meta_info.authorid.authors, _.bind(function(author) {
				if (this.authorImages.indexOf(author.id) > -1) {
					showAuthorImage = true;
				}
				return author.id;
			}, this));
		}

		var year = '';

		if (this.model.get('_source').meta_info.imprintyear) {
			year = (new Date('1929-01-01')).getFullYear()
		}

		this.$el.html(template({
			model: this.model,
			authorNames: authorNames,
			authorIDs: authorIDs,
			year: (new Date(this.model.get('_source').meta_info.imprintyear)).getFullYear(),
			pageUrl: this.getPageUrl(),
			showAuthorImage: showAuthorImage
		}));
	}
});