var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var SearchInputView = require('./SearchInputView');
var AppRouter = require('./../router/AppRouter');
var NgramView = require('./NgramView');
var SliderView = require('./SliderView');
var ListView = require('./ListView');

module.exports = Backbone.View.extend({
	startYear: 1970,
	endYear: 2016,

	initialize: function() {
		this.router = new AppRouter();

		this.render();

		this.router.on('route:default', _.bind(function(query) {
			$(document.body).removeClass('search-mode');
		}, this));

		this.router.on('route:search', _.bind(function(query, yearFrom, yearTo, document) {
			console.log('route:search: query: '+query+', yearFrom: '+yearFrom+', yearTo: '+yearTo+', document: '+document);

			this.search(query, yearFrom == null ? this.startYear : yearFrom, yearTo == null ? this.endYear : yearTo);

/*
			console.log(yearFrom);

			if (yearFrom != null && yearTo != null) {
				console.log('time!');
				this.ngramView.setTimeOverlay([yearFrom, yearTo]);
				this.hitList.search(query, [yearFrom, yearTo]);
			}
*/
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
			this.ngramView.on('updateGraph', this.ngramUpdate, this);
		}

		if (this.ngramView.lastQuery != query) {
			this.ngramView.search(query);
		}

		if (this.hitList == undefined) {
			this.hitList = new ListView({
				el: this.$el.find('#hitlistContainer')
			});
		}

		if (this.searchInput.getQueryString() != query) {
			this.searchInput.resetQueryItems(query);
		}
		this.hitList.search(query, [yearFrom, yearTo]);

		if (this.sliderView.sliderValues[0] != yearFrom || this.sliderView.sliderValues[1] != yearTo) {
			this.sliderView.setSliderValues([yearFrom, yearTo]);
			this.ngramView.setTimeOverlay([yearFrom, yearTo]);
		}
	},

	ngramUpdate: function() {
	},

	initSlider: function() {
		this.sliderView = new SliderView({
			el: this.$el.find('#sliderContainer'),
			range: [1970, 2016]
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
			el: this.$el.find('#searchInput')
		});

		this.searchInput.on('search', _.bind(function(event) {
			this.router.navigate('search/'+event.queryString, {
				trigger: true
			});
		}, this));
		return this;
	}
});