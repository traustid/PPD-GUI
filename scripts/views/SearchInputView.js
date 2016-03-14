var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({
	initialize: function() {
		console.log('SearchInputView:initialize');
		this.collection = new Backbone.Collection();
		this.collection.on('add', this.queryCollectionChange, this);
		this.collection.on('remove', this.queryCollectionChange, this);
		this.collection.on('change', this.queryCollectionChange, this);

		this.render();
	},

	events: {
		'keyup .query-input': 'queryInputKeyUp',
		'input .query-input': 'queryInputChange',
		'click .search-button': 'searchButtonClick'
	},

	searchButtonClick: function() {
		this.trigger('search', {
			queryString: _.map(this.collection.models, function(model) {
				return model.get('queryValue')
			}).join(', ')
		});
	},

	queryInputKeyUp: function(event) {
		if (event.keyCode == 13) {
			if (this.queryInput.val() == '') {
				this.searchButtonClick();
			}
			else if (this.validateSingleQuery()) {
				this.searchButtonClick();
			}
		}
		if (event.keyCode == 8) {
			console.log('backspace');
			if (this.queryInput.val() == '') {
				this.editLastItem();
			}
		}
	},

	validateSingleQuery: function(event) {
		if (this.queryInput.val().match(/"(.*?)"( \([A-Z,|a-z,]+\))?/g)) {
			this.addQueryItem(this.queryInput.val());
			this.queryInput.val('');

			return true;
		}
		else {
			return false;
		}
	},

	queryInputChange: function(event) {
		if (this.queryInput.val().match(/"(.*?)"( \([A-Z,|a-z,]+\))?,/g) || this.queryInput.val().match(/"(.*?)"( \([A-Z,|a-z,]+\))/g)) {
			this.addQueryItem(this.queryInput.val());
			this.queryInput.val('');
		}
	},

	editLastItem: function() {
		if (this.collection.length > 0) {
			var lastItem = this.collection.at(this.collection.length-1);

			this.queryInput.val(lastItem.get('queryValue'));

			this.collection.remove(lastItem);
		}
	},

	addQueryItem: function(queryValue) {
		queryValue = queryValue.substr(queryValue.length-1) == ',' ? queryValue.substr(0, queryValue.length-1) : queryValue;

		var queryString = queryValue.match(/"(.*?)"/g)[0];
		queryString = queryString.substr(1, queryString.length-2);
		
		var partyStrings = queryValue.match(/(\([A-Z,|a-z,]+\))/g);

		var partyArray = [];

		console.log(partyStrings)
		if (partyStrings) {
			console.log('split!')
			var partyString = partyStrings[0].substr(1, partyStrings[0].length-2);
			console.log(partyString);
			partyArray = partyString.split(',');
		}

		this.collection.add({
			queryValue: queryValue,
			queryString: queryString,
			parties: partyArray
		});
	},

	queryCollectionChange: function() {
		var template = _.template($("#queryItemsTemplate").html());

		this.queryItems.html(template({
			models: this.collection.models
		}));

		_.each(this.queryItems.find('.item'), _.bind(function(item) {
			$(item).find('.remove-button').click(_.bind(function() {
				this.collection.remove(this.collection.at($(item).data('index')));
			}, this));
			$(item).find('.label').click(_.bind(function() {
				$(item).toggleClass('form-open');
			}, this));

			$(item).find('.form-cancel-button').click(_.bind(function() {
				$(item).removeClass('form-open');
			}, this));

			$(item).find('.form-save-button').click(_.bind(function() {
				this.updateForm($(item).data('index'));
				$(item).removeClass('form-open');
			}, this));
		}, this));

		this.updateInputSize();
	},

	updateForm: function(index) {
		var form = this.$el.find('.item[data-index='+index+']');
		var queryString = form.find('.query-form-input').val();

		var selectedParties = [];

		_.map(form.find('.query-parties input'), _.bind(function(input) {
			console.log(input);
			if (input.checked) {
				selectedParties.push($(input).val());
			}
		}, this));

		this.collection.at(index).set({
			queryValue: '"'+queryString+'"'+(selectedParties.length > 0 ? ' ('+selectedParties.join(',')+')' : ''),
			queryString: queryString,
			parties: selectedParties
		});

	},

	updateInputSize: function() {
		var thisWidth = this.$el.find('.search-wrapper').width();
		var queryItemsSize = this.queryItems.width()

		this.queryInput.width(thisWidth-queryItemsSize-46);
	},

	render: function() {
		console.log('SearchInputView:render');
		console.log(this.$el);
		var template = _.template($("#searchInputTemplate").html());

		this.$el.html(template({}));

		this.queryInput = this.$el.find('.query-input');
		this.queryItems = this.$el.find('.query-items');

		this.updateInputSize();
	}
});