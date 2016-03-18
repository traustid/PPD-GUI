var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var SearchInputView = require('./SearchInputView');
var AppRouter = require('./../router/AppRouter');
var NgramView = require('./NgramView');
var SliderView = require('./SliderView');
var ListView = require('./ListView');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.router = new AppRouter();

		this.render();

		this.router.on('route:search', _.bind(function(query) {
			this.doSearch(query);
		}, this));

		Backbone.history.start();

	},

	doSearch: function(query) {
		this.$el.addClass('small-header');

		if (this.ngramView == undefined) {
			this.ngramView = new NgramView({
				el: this.$el.find('#ngramContianer')
			});
			this.ngramView.on('updateGraph', this.ngramUpdate, this);
		}

		this.ngramView.search(query);

		if (this.hitList == undefined) {
			this.hitList = new ListView({
				el: this.$el.find('#hitlistContainer')
			});
		}

		this.hitList.search(query);
	},

	ngramUpdate: function() {
		console.log('ngramUpdate');

		if (!this.sliderView) {
			this.initSlider();
		}
		else {
			this.setSliderRange(this.ngramView.xRangeValues);
		}

		this.hitList.applyFilter({});
	},

	initSlider: function() {
		this.sliderView = new SliderView({
			el: this.$el.find('#sliderContainer'),
			range: [Number(this.ngramView.xRangeValues[0]), Number(this.ngramView.xRangeValues[this.ngramView.xRangeValues.length-1])]
		});
		this.sliderView.on('change', _.bind(function(event) {
			this.hitList.applyFilter({
				time: event.values
			});
		}, this));
		this.sliderView.on('slide', _.bind(function(event) {
			this.hitList.applyFilter({
				time: event.values
			});
		}, this));
	},

	render: function() {
		this.searchInput = new SearchInputView({
			el: this.$el.find('#searchInput')
		});

		this.searchInput.on('search', _.bind(function(event) {
			console.log('on search');
			this.router.navigate('search/'+event.queryString, {
				trigger: true
			});
		}, this));
		return this;
	}
});