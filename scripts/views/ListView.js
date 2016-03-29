var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var ListCollection = require('./../collections/ListCollection');
var ListItemView = require('./ListItemView.js');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		this.collection = new ListCollection();
		this.collection.on('reset', this.render, this);

		this.renderUi();
	},

	events: {
		'click .item-title': 'itemTitleClick',
		'click .result-tabs a.tab': 'resultTabClick'
	},

	itemTitleClick: function(event) {
		$(event.currentTarget).parent().toggleClass('item-open');
	},

	resultTabClick: function(event) {
		this.$el.find('.tabs.result-tabs a.tab').removeClass('selected');
		$(event.currentTarget).addClass('selected');

		this.resultIndex = $(event.currentTarget).data('resultindex');
		this.renderList();
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

	renderList: function() {
		this.$el.find('.list-container').html('');

		_.each(this.collection.at(this.resultIndex).get('hits'), _.bind(function(model, index) {
			var newEl = $('<div class="list-item"/>');
			this.$el.find('.list-container').append(newEl);

			var itemView = new ListItemView({
				el: newEl,
				model: new Backbone.Model(model),
				router: this.options.router
			});		
		}, this));

		this.$el.removeClass('loading');
	}
});