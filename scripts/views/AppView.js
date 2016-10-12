var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var SearchInputView = require('./SearchInputView');
var AppRouter = require('./../router/AppRouter');
var NgramView = require('./NgramView');
var SliderView = require('./SliderView');
var ListView = require('./ListView');

module.exports = Backbone.View.extend({
	startYear: 1700,
	endYear: 2016,

	mediaTypes: [
		{
			label: 'etext'
		},
		{
			label: 'faksimil'
		}
	],

	initialize: function() {
		var QueryParser = require('./../utils/QueryParser');

		this.parser = new QueryParser();

		this.ngramView = new NgramView({
			el: this.$el.find('#ngramContianer'),
			percentagesView: true,
			app: this,
			startYear: this.startYear,
			endYear: this.endYear
		});
		
		this.ngramView.on('updategraph', this.onNgramUpdate, this);
		this.ngramView.on('graphclick', _.bind(function(event) {
			this.sliderView.setSliderValues([event.year, event.year+1], true);
		}, this));
		this.ngramView.on('timerange', _.bind(function(event) {
			this.sliderView.setSliderValues([event.values[0], event.values[1]], true);
		}, this));
		this.ngramView.on('wildcardresults', _.bind(function() {
			this.hitList.search(_.first(_.map(this.ngramView.collection.models, function(model) {
				return model.get('key')+(model.get('filters') && model.get('filters')[0] && model.get('filters')[0].parti ? ' parti:('+model.get('filters')[0].parti[0]+')' : '');
			}), 4).join(','), [yearFrom, yearTo], queryMode);
		}, this));

		this.ngramView.once('totalCollectionReset', _.bind(this.initializeReady, this));
	},

	initializeReady: function() {
		this.router = new AppRouter();

		this.render();

		this.router.on('route:default', _.bind(function(query) {
			$(document.body).removeClass('search-mode');
		}, this));

		this.router.on('route:view', _.bind(function(document) {
		}, this));

		this.router.on('route:search', _.bind(function(query, queryMode, modernSpelling, yearFrom, yearTo, document) {
			$('html').removeClass('has-overlay');
			$('#textViewer').removeClass('visible');
			this.search(query, queryMode, modernSpelling, yearFrom == null ? this.startYear : yearFrom, yearTo == null ? this.endYear : yearTo);
		}, this));

		Backbone.history.start();
	},

	search: function(query, queryMode, modernSpelling, yearFrom, yearTo) {
		this.colorRegistry = [];

		$(document.body).addClass('search-mode');

		if (!this.sliderView) {
			this.initSlider();
		}

		if (this.ngramView.lastQuery != query || this.ngramView.lastQueryMode != queryMode || this.ngramView.lastModernSpelling != modernSpelling) {
			this.ngramView.search(query, queryMode, modernSpelling);
		}

		if (this.hitList == undefined) {
			this.hitList = new ListView({
				el: this.$el.find('#hitlistContainer'),
				router: this.router,
				mediaTypes: this.mediaTypes,
				app: this
			});
		}

		if (this.searchInput.getQueryString() != query) {
			this.searchInput.resetQueryItems(query);
		}

		if (query != this.hitList.lastQuery || queryMode != this.hitList.lastQueryMode || modernSpelling != this.hitList.lastModernSpelling || (yearFrom != this.hitList.timeRange[0] || yearTo != this.hitList.timeRange[1])) {
			/*
				When updating the search, we have to ckeck if we are making a wildcard search or not.
			*/

			var searchTerms = query.split(/(?![^)(]*\([^)(]*?\)\)),(?![^\(]*\))/g);

			if (this.ngramView.wildcardSearch && searchTerms[0].split(' parti:(')[0].indexOf('*') > -1) {

				// Deprecated //
				// Update hitlist based on wildcard results fron the ngramView
				this.hitList.search(_.first(_.map(this.ngramView.collection.models, function(model) {
					return model.get('key')+(model.get('filters') && model.get('filters')[0] && model.get('filters')[0].parti ? ' parti:('+model.get('filters')[0].parti[0]+')' : '');
				}), 4).join(','), [yearFrom, yearTo], queryMode);
			}
			else {
				this.hitList.search(query, [yearFrom, yearTo], queryMode, modernSpelling);
			}
		}

		if (this.sliderView.sliderValues[0] != yearFrom || this.sliderView.sliderValues[1] != yearTo) {
			this.sliderView.setSliderValues([yearFrom, yearTo]);
			this.ngramView.setTimeOverlay([yearFrom, yearTo]);
		}

		if (this.searchInput.getQueryMode() != queryMode) {
			this.searchInput.setQueryMode(queryMode);
		}
	},

	onNgramUpdate: function() {
	},

	colors: ['#00cc88', '#8fb300', '#8c5e00', '#290099', '#0a004d', '#00590c', '#002233', '#e55c00', '#4c1400', '#006680', '#8f00b3', '#8c005e', '#ffcc00', '#36cc00', '#004b8c', '#ff0066', '#002459', '#732e00', '#00a2f2', '#00becc', '#ff00ee', '#00330e', '#003de6', '#73001f', '#403300', '#b20000', '#40001a', '#005953'],
	colorRegistry: [],

	createColorRegistry: function(models, key) {
		this.colorRegistry = _.map(models, _.bind(function(model, index) {
			return {
				key: key != undefined ? model.get(key) : model.get('query').original_search_terms+model.filtersToString(true),
				color: this.colors[index]
			}
		}, this));
	},

	getItemColor: function(key) {
		return _.find(this.colorRegistry, function(color) {
			return color.key == key;
		}).color;
	},

	initSlider: function() {
		this.sliderView = new SliderView({
			el: this.$el.find('#sliderContainer'),
			range: [this.startYear, this.endYear]
		});
		this.sliderView.on('change', _.bind(function(event) {
			this.router.navigate('search/'+this.searchInput.getQueryString()+
				(this.searchInput.getQueryMode() != 'exact' ? '/querymode/'+this.searchInput.getQueryMode() : '')+
				(this.searchInput.getModernSpellingValue() == true ? '/modernspelling/'+this.searchInput.getModernSpellingValue() : '')+
				'/'+event.values[0]+'/'+event.values[1], {
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
			mediaTypes: this.mediaTypes
		});

		this.searchInput.on('search', _.bind(function(event) {
			this.router.navigate('search/'+event.queryString+
				(event.queryMode != 'exact' ? '/querymode/'+event.queryMode : '')+
				(event.modernSpelling == true ? '/modernspelling/'+event.modernSpelling : ''), {
				trigger: true
			});
		}, this));

		$(window).click(_.bind(function() {
			this.$el.find('.popup-controller').removeClass('open');
		}, this));

		return this;
	}
});