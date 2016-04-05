var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var SearchInputView = require('./SearchInputView');
var AppRouter = require('./../router/AppRouter');
var NgramView = require('./NgramView');
var RegeringView = require('./RegeringView');
var SliderView = require('./SliderView');
var ListView = require('./ListView');

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

	startYear: 1971,
	endYear: 2016,

	initialize: function() {
		this.router = new AppRouter();

		this.render();

		this.router.on('route:default', _.bind(function(query) {
			$(document.body).removeClass('search-mode');
		}, this));

		this.router.on('route:view', _.bind(function(document) {
		}, this));

		this.router.on('route:search', _.bind(function(query, yearFrom, yearTo, document) {
			$('html').removeClass('has-overlay');
			$('#textViewer').removeClass('visible');
			this.search(query, yearFrom == null ? this.startYear : yearFrom, yearTo == null ? this.endYear : yearTo);
		}, this));

		Backbone.history.start();
	},

	search: function(query, yearFrom, yearTo) {
		$(document.body).addClass('search-mode');

		if (!this.sliderView) {
			this.initSlider();
		}

		if (this.ngramView == undefined) {
			this.ngramView = new NgramView({
				el: this.$el.find('#ngramContianer'),
				percentagesView: true
			});
			this.ngramView.on('updateGraph', this.onNgramUpdate, this);
		}

		if (this.ngramView.lastQuery != query) {
			this.ngramView.search(query);
		}

		if (this.regeringView == undefined) {
			this.regeringView = new RegeringView({
				el: this.$el.find('#regeringViewContainer')
			});
		}

		if (this.hitList == undefined) {
			this.hitList = new ListView({
				el: this.$el.find('#hitlistContainer'),
				router: this.router,
				colors: this.ngramView.colors,
				parties: this.parties
			});
		}

		if (this.searchInput.getQueryString() != query) {
			this.searchInput.resetQueryItems(query);
		}

		if ((query != this.hitList.lastQuery || (yearFrom != this.hitList.timeRange[0] || yearTo != this.hitList.timeRange[1]))) {
			this.hitList.search(query, [yearFrom, yearTo]);
		}

		if (this.sliderView.sliderValues[0] != yearFrom || this.sliderView.sliderValues[1] != yearTo) {
			this.sliderView.setSliderValues([yearFrom, yearTo]);
			this.ngramView.setTimeOverlay([yearFrom, yearTo]);
		}
	},

	onNgramUpdate: function() {
	},

	initSlider: function() {
		this.sliderView = new SliderView({
			el: this.$el.find('#sliderContainer'),
			range: [1971, 2016]
		});
		this.sliderView.on('change', _.bind(function(event) {

			this.router.navigate('search/'+this.searchInput.getQueryString()	+'/'+event.values[0]+'/'+event.values[1], {
				trigger: true
			});
		}, this));
		this.sliderView.on('slide', _.bind(function(event) {
			this.ngramView.setTimeOverlay(event.values);
		}, this));
	},

	render: function() {
		this.searchInput = new SearchInputView({
			el: this.$el.find('#searchInput'),
			parties: this.parties
		});

		this.searchInput.on('search', _.bind(function(event) {
			this.router.navigate('search/'+event.queryString, {
				trigger: true
			});
		}, this));
		return this;
	}
});