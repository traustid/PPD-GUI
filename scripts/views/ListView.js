var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var ListCollection = require('./../collections/ListCollection');
var ListItemView = require('./ListItemView.js');
var BarChartView = require('./BarChartView');


var QueryParser = require('./../utils/QueryParser');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		this.app = this.options.app;
		this.collection = new ListCollection();
		this.collection.on('reset', this.render, this);
		this.collection.on('hitsupdate', this.hitsUpdate, this)

		this.renderUi();
	},

	events: {
		'click .item-title': 'itemTitleClick',
		'click .result-tabs a.tab': 'resultTabClick',
		'click .load-more-button': 'loadMoreClick',
		'change .aggregation-select': 'aggregationChange',
		'click .list-options-menu .menu-button': 'optionsButtonClick',
		'click .popup-controller': 'popupControlClick',
		'click .sort-button': 'sortButtonClick'
	},

	optionsButtonClick: function(event) {
		$(event.currentTarget).parent().toggleClass('open');
	},

	popupControlClick: function(event) {
		event.stopPropagation();
	},

	sortButtonClick: function(event) {
		event.preventDefault();

		this.collection.sortField = $(event.currentTarget).data('field');
		this.collection.sortOrder = $(event.currentTarget).data('order');

		this.$el.find('.popup-controller').removeClass('open');

		this.$el.find('.sort-menu-item .item-label').removeClass('selected');
		this.$el.find('.sort-menu-item .sort-button').removeClass('selected');

		this.$el.find('.sort-menu-item .item-label[data-field="'+this.collection.sortField+'"]').addClass('selected');
		this.$el.find('.sort-menu-item .sort-button[data-field="'+this.collection.sortField+'"][data-order="'+this.collection.sortOrder+'"]').addClass('selected');

		this.collection.search(this.lastQuery, this.timeRange, this.lastQueryMode, this.lastQueryTranslated);
	},
	
	itemTitleClick: function(event) {
		$(event.currentTarget).parent().toggleClass('item-open');
	},

	resultTabClick: function(event) {
		this.$el.find('.tabs.result-tabs a.tab').removeClass('selected');
		$(event.currentTarget).addClass('selected');

		this.resultIndex = $(event.currentTarget).data('result-index');
		this.collection.resultIndex = this.resultIndex;
		this.renderList();

		var barChartQuery = this.collection.at(this.resultIndex).get('query').original_search_terms+this.collection.at(this.resultIndex).filtersToString(' ');
		var aggregationField = this.$el.find('.aggregation-select').find(":selected").val();
		this.barChart.search(barChartQuery, this.timeRange, this.lastQueryMode, aggregationField);
	},

	aggregationChange: function() {
		this.renderList();

//		var barChartQuery = this.collection.at(this.resultIndex).get('query').original_search_terms+this.collection.at(this.resultIndex).filtersToString(' ');

		var aggregationField = this.$el.find('.aggregation-select').find(":selected").val();
		this.barChart.search(this.lastQuery, this.timeRange, this.lastQueryMode, aggregationField);
	},

	loadMoreClick: function() {
		this.collection.addPage(this.resultIndex);
	},

	renderUi: function() {
		var template = _.template($("#hitlistUiTemplate").html());

		this.$el.html(template({}));

		this.barChart = new BarChartView({
			el: this.$el.find('.barchart-container'),
			app: this
		});
		this.barChart.on('barclick', this.barClick, this);
		this.barChart.on('bardeselect', this.barDeselect, this);
	},

	aggFilters: {
		authors: 'författare',
		mediatype: 'mediatype',
		gender: 'kön',
		works: 'verk',
		texttype: 'typ'
	},

	barClick: function(event) {
		this.$el.addClass('loading');

		var parser = new QueryParser(this.lastQuery);

		var parsedQuery = parser.parsed;

		var newFilter = {
			key: this.aggFilters[event.aggregationField],
			values: [
				event.key
			]
		};

		_.each(parsedQuery, _.bind(function(queryItem) {
			if (_.findIndex(queryItem.filters, _.bind(function(filter) {
				return filter.key == this.aggFilters[event.aggregationField];
			}, this)) > -1) {
				var index = _.findIndex(queryItem.filters, _.bind(function(filter) {
					return filter.key == this.aggFilters[event.aggregationField];
				}, this));

				queryItem.filters.splice(index, 1);
			}

			queryItem.filters.push(newFilter);
		}, this));

		this.disableContainerRender = true;
		this.collection.search(parser.build(parsedQuery), this.timeRange, this.lastQueryMode);
	},

	barDeselect: function() {
		this.disableContainerRender = true;
		this.collection.search(this.lastQuery, this.timeRange, this.lastQueryMode, this.lastQueryTranslated);
	},

	timeRange: [],

	resultIndex: 0,

	search: function(query, timeRange, queryMode, queryTranslated) {
		this.disableContainerRender = false;

		this.timeRange = timeRange;

		this.lastQuery = query;
		this.lastQueryMode = queryMode;
		this.lastQueryTranslated = queryTranslated;
		this.collection.search(query, timeRange, queryMode, queryTranslated);

		this.$el.find('.list-header-label').text('"'+query+'", '+timeRange[0]+'-'+timeRange[1]);

		this.$el.addClass('loading');			
	},

	render: function() {
		if (!this.disableContainerRender) {
			console.log('disableContainerRender = false');

			if (this.app.colorRegistry.length == 0) {
				this.app.createColorRegistry(this.collection.models);
			}

			this.resultIndex = 0;

			var barChartQuery = this.collection.at(this.resultIndex).get('query').original_search_terms+this.collection.at(this.resultIndex).filtersToString(true);

			var aggregationField = this.$el.find('.aggregation-select').find(":selected").val();
			this.barChart.search(barChartQuery, this.timeRange, this.lastQueryMode, this.lastQueryTranslated, aggregationField);

			var resultsTabsHtml = '';
			_.each(this.collection.models, _.bind(function(model, index) {
				resultsTabsHtml += '<a class="tab'+(index == this.resultIndex ? ' selected' : '')+'" data-result-index="'+index+'"><span class="line-color" style="border-color: '+this.app.getItemColor(model.get('query').original_search_terms+model.filtersToString(true))+'"></span>'+model.get('query').original_search_terms+model.filtersToString(true)+'</a>';
			}, this));
			this.$el.find('.result-tabs').html(resultsTabsHtml);
		}

		this.renderList();
	},

	hitsUpdate: function() {
		var newHits = this.collection.at(this.resultIndex).get('data').hits;
		newHits = _.rest(newHits, this.collection.at(this.resultIndex).get('from_index'));

		_.each(newHits, _.bind(function(model, index) {
			var newEl = $('<div class="list-item"/>');
			this.$el.find('.list-container').append(newEl);

			var itemView = new ListItemView({
				el: newEl,
				model: new Backbone.Model(model),
				router: this.options.router,
				searchTermAnalyzed: this.collection.at(this.resultIndex).get('query').analyzed_search_terms
			});		
		}, this));

		this.renderPageInfo();
	},

	renderPageInfo: function() {
		this.$el.find('.page-info').html(' '+(
			Number(this.collection.at(this.resultIndex).get('query').from_index+20) > this.collection.at(this.resultIndex).get('data').total_hits ? 
			this.collection.at(this.resultIndex).get('data').total_hits :
			Number(this.collection.at(this.resultIndex).get('query').from_index+20)
		)+' av '+this.collection.at(this.resultIndex).get('data').total_hits);		
	},

	renderList: function() {
		this.$el.find('.list-container').html('');

		if (this.collection.at(this.resultIndex).get('data').hits.length == 0) {
			this.$el.addClass('no-results');
		}
		else {
			this.$el.removeClass('no-results');
			_.each(this.collection.at(this.resultIndex).get('data').hits, _.bind(function(model, index) {
				var newEl = $('<div class="list-item"/>');
				this.$el.find('.list-container').append(newEl);

				var itemView = new ListItemView({
					el: newEl,
					model: new Backbone.Model(model),
					router: this.options.router,
					searchTermAnalyzed: this.collection.at(this.resultIndex).get('query').analyzed_search_terms
				});		
			}, this));
		}

		this.renderPageInfo();

		this.$el.removeClass('loading');
	}
});