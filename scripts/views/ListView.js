var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var ListCollection = require('./../collections/ListCollection');
var ListItemView = require('./ListItemView.js');

module.exports = Backbone.View.extend({
	parties: [
		{
			letter: "s",
			name: "Socialdemokraterna"
		},
		{
			letter: "m",
			name: "Moderata samlingspartiet"
		},
		{
			letter: "c",
			name: "Centerpartiet"
		},
		{
			letter: "fp",
			name: "Folkpartiet"
		},
		{
			letter: "kd",
			name: "Kristdemokraterna"
		},
		{
			letter: "v",
			name: "Vänsterpartiet"
		},
		{
			letter: "mp",
			name: "Miljöpartiet de gröna"
		},
		{
			letter: "vpk",
			name: "Vänsterpartiet Kommunisterna"
		},
		{
			letter: "sd",
			name: "Sverigedemokraterna "
		},
		{
			letter: "kds",
			name: "Kristen demokratisk samling"
		},
		{
			letter: "nyd",
			name: "Ny Demokrati"
		},
		{
			letter: "l",
			name: "Liberalerna"
		},
		{
			letter: "apk",
			name: ""
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
			name: ""
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
		this.collection = new ListCollection();
		this.collection.on('reset', this.render, this);
		this.collection.on('hitsupdate', this.hitsUpdate, this)

		this.renderUi();
	},

	events: {
		'click .item-title': 'itemTitleClick',
		'click .result-tabs a.tab': 'resultTabClick',
		'click .load-more-button': 'loadMoreClick'
	},

	itemTitleClick: function(event) {
		$(event.currentTarget).parent().toggleClass('item-open');
	},

	resultTabClick: function(event) {
		this.$el.find('.tabs.result-tabs a.tab').removeClass('selected');
		$(event.currentTarget).addClass('selected');

		this.resultIndex = $(event.currentTarget).data('resultindex');
		this.collection.resultindex = this.resultindex;
		this.renderList();
	},

	loadMoreClick: function() {
		this.collection.addPage();
	},

	renderUi: function() {
		var template = _.template($("#hitlistUiTemplate").html());

		this.$el.html(template({}));
	},

	lastQuery: '',
	timeRange: [],

	resultIndex: 0,

	search: function(query, timeRange) {
		this.lastQuery = query;
		this.timeRange = timeRange;

		this.collection.search(query, timeRange);

		this.$el.find('.list-header-label').text('"'+query+'", '+timeRange[0]+'-'+timeRange[1]);

		this.$el.addClass('loading');
	},

	render: function() {
		this.resultIndex = 0;

		var resultsTabsHtml = '';
		_.each(this.collection.models, _.bind(function(model, index) {
			var filterStrings = [];
			if (model.get('filters') && model.get('filters').length > 0) {
				filterStrings = _.map(model.get('filters'), function(filter) {
					var filterString = '';
					for (var name in filter) {
						filterString += name+':('+(filter[name].join(','))+')';
					}
					return filterString;
				});
			}
			resultsTabsHtml += '<a class="tab'+(index == this.resultIndex ? ' selected' : '')+'" data-resultindex="'+index+'"><span class="line-color" style="border-color: '+this.options.colors[index]+'"></span>'+model.get('search_query')+' '+filterStrings.join(' ')+'</a>';
		}, this));
		this.$el.find('.result-tabs').html(resultsTabsHtml);

		this.renderList();
	},

	hitsUpdate: function() {
		var newHits = this.collection.at(this.resultIndex).get('hits');
		newHits = _.rest(newHits, this.collection.pageIndex);

		_.each(newHits, _.bind(function(model, index) {
			var newEl = $('<div class="list-item"/>');
			this.$el.find('.list-container').append(newEl);

			var itemView = new ListItemView({
				el: newEl,
				model: new Backbone.Model(model),
				router: this.options.router
			});		
		}, this));
	},

	renderList: function() {
		console.log(this.collection.length);
		this.$el.find('.list-container').html('');

		if (this.collection.at(this.resultIndex).get('hits').length == 0) {
			this.$el.addClass('no-results');
		}
		else {
			this.$el.removeClass('no-results');
			_.each(this.collection.at(this.resultIndex).get('hits'), _.bind(function(model, index) {
				var newEl = $('<div class="list-item"/>');
				this.$el.find('.list-container').append(newEl);

				var itemView = new ListItemView({
					el: newEl,
					model: new Backbone.Model(model),
					router: this.options.router
				});		
			}, this));
		}

		this.$el.removeClass('loading');
	}
});