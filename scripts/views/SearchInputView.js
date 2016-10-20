var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;

		this.collection = new Backbone.Collection();
		this.collection.on('add', this.queryCollectionChange, this);
		this.collection.on('remove', this.queryCollectionChange, this);
		this.collection.on('change', this.queryCollectionChange, this);

		this.render();
	},

	events: {
		'keydown .query-input': 'queryInputKeyDown',
		'keyup .query-input': 'queryInputKeyUp',
		'input .query-input': 'queryInputChange',
		'click .search-button': 'searchButtonClick',
		'click .clear-input': 'clearInputClick',
		'click .search-query-options .options-button': 'searchOptionsButtonClick',
		'click .popup-controller': 'popupControlClick'
	},

	searchOptionsButtonClick: function() {
		this.$el.find('.search-query-options').toggleClass('open');
	},

	clearInputClick: function(event) {
		event.preventDefault();

		this.queryInput.val('');
		this.collection.reset();
		this.render();
	},

	popupControlClick: function(event) {
		event.stopPropagation();
	},

	searchButtonClick: function() {
		if (this.queryInput.val() == '') {
			this.search();
		}
		else if (this.validateSingleQuery()) {
			this.search();
		}
	},

	getQueryMode: function() {
		return this.$el.find('.search-query-mode').val() == null ? 'exact' : this.$el.find('.search-query-mode').val();
	},

	setQueryMode: function(queryMode) {
		this.$el.find('.search-query-mode').val(queryMode == null ? 'exact' : queryMode);
	},

	getQueryTranslatedValue: function() {
		return this.$el.find('.auto-modern-spelling').is(':checked');
	},

	setQueryTranslatedValue: function(queryTranslated) {
		this.$el.find('.auto-modern-spelling').prop('checked', queryTranslated);
	},

	search: function() {
		this.trigger('search', {
			queryString: this.getQueryString(),
			query: this.collection.models,
			queryMode: this.getQueryMode(),
			queryTranslated: this.getQueryTranslatedValue()
		});
	},

	queryInputChange: function(event) {
		if (this.queryInput.val().match(/[A-ZÖÄÅ|a-zöäå]+( [A-ZÖÄÅ|a-zöäå]+:\([A-ZÖÄÅ,|a-zöäå,]+\))?,/g) ||
				this.queryInput.val().match(/[A-ZÖÄÅ|a-zöäå]+:\([A-ZÖÄÅ,|a-zöäå,]+\),/g)) {
			this.addQueryItem(this.queryInput.val());
			this.queryInput.val('');
		}
	},

	queryInputKeyDown: function(event) {
		if (event.keyCode == 9) {
			event.preventDefault();
			this.validateSingleQuery();
		}
	},

	queryInputKeyUp: function(event) {
		if (event.keyCode == 13) {
			if (this.queryInput.val() == '') {
				this.search();
			}
			else if (this.validateSingleQuery()) {
				this.search();
			}
		}
		if (event.keyCode == 8) {
			if (this.queryInput.val() == '') {
				this.editLastItem();
			}
		}
	},

	getQueryString: function() {
		var retStr = _.map(this.collection.models, function(model) {
			return model.get('queryValue')
		}).join(',').split(' ').join('%20');
		return retStr;
	},

	validateSingleQuery: function(event) {
		if (this.queryInput.val().match(/[A-ZÖÄÅ,|a-zöäå,]+(:\([A-ZÖÄÅ, |a-zöäå, ]+\))?/g)) {
			this.addQueryItem(this.queryInput.val());
			this.queryInput.val('');

			return true;
		}
		else {
			return false;
		}
	},

	editLastItem: function() {
		if (this.collection.length > 0) {
			var lastItem = this.collection.at(this.collection.length-1);

			this.queryInput.val(lastItem.get('queryValue'));

			this.collection.remove(lastItem);
		}
	},

	resetQueryItems: function(queryString) {
		this.collection.reset();

		
		_.each(queryString.split(/(?![^)(]*\([^)(]*?\)\)),(?![^\(]*\))/g), _.bind(function(query) {
			this.addQueryItem(query);
		}, this));
	},

	addQueryItem: function(queryValue) {
		queryValue = queryValue.substr(queryValue.length-1) == ',' ? queryValue.substr(0, queryValue.length-1) : queryValue;

		var queryString = queryValue.split(/ [A-ZÖÄÅ,|a-zöäå,]+:(\([A-ZÖÄÅ, |a-zöäå, ]+\))/)[0];

		var mediaTypeStrings = queryValue.match(/mediatype:(\([A-ZÖÄÅ, |a-zöäå, ]+\))/g);
		var authorStrings = queryValue.match(/författare:(\([A-ZÖÄÅ, |a-zöäå,]+\))/g);
		var genderStrings = queryValue.match(/kön:(\([A-ZÖÄÅ, |a-zöäå, ]+\))/g);
		var searchModernEditionsStrings = queryValue.match(/edition:(\([A-ZÖÄÅ|a-zöäå]+\))/g);

		var mediaTypeArray = [];

		if (mediaTypeStrings) {
			var mediaTypeString = mediaTypeStrings[0].substr("mediatype:(".length);
			mediaTypeString = mediaTypeString.substr(0, mediaTypeString.length-1);
			mediaTypeArray = mediaTypeString.split(',');
		}

		var authorString = '';

		if (authorStrings) {
			authorString = authorStrings[0].substr("författare:(".length);
			authorString = authorString.substr(0, authorString.length-1);
		}

		var genderArray = [];

		if (genderStrings) {
			var genderString = genderStrings[0].substr("kön:(".length);
			genderString = genderString.substr(0, genderString.length-1);
			genderArray = genderString.split(',');
		}

		var searchModernEditions = false;

		console.log(searchModernEditionsStrings)

		if (searchModernEditionsStrings && searchModernEditionsStrings[0] == 'edition:(modern)') {
			searchModernEditions = true;
		}

		this.collection.add({
			queryValue: queryValue,
			queryString: queryString.match(/[A-ZÖÄÅ,|a-zöäå,]+:(\([A-ZÖÄÅ, |a-zöäå, ]+\))/) ? '' : queryString,
			mediaTypes: _.map(mediaTypeArray, function(mediaType) {
				return mediaType.toLowerCase();
			}),
			gender: _.map(genderArray, function(gender) {
				return gender.toLowerCase();
			}),
			authorString: authorString,
			searchModernEditions: searchModernEditions
		});
	},

	queryCollectionChange: function() {
		var template = _.template($("#queryItemsTemplate").html());

		this.queryItems.html(template({
			models: this.collection.models,
			mediaTypes: this.options.mediaTypes,
			genders: this.options.genders
		}));

		_.each(this.queryItems.find('.item'), _.bind(function(item) {
			$(item).find('.remove-button').click(_.bind(function() {
				this.collection.remove(this.collection.at($(item).data('index')));
			}, this));
			$(item).find('.label').click(_.bind(function() {
				$(item).toggleClass('open');

				if ($(item).hasClass('open')) {
					$(item).find('.query-form-search-input').focus();
					$(item).find('.query-form-search-input')[0].setSelectionRange(0, $(item).find('.query-form-search-input').val().length);
				}
			}, this));

			$(item).find('.form-cancel-button').click(_.bind(function() {
				$(item).removeClass('open');
			}, this));

			$(item).find('.query-form-input').keyup(_.bind(function() {
				if (event.keyCode == 13) {
					this.updateForm($(item).data('index'));
					$(item).removeClass('open');

					this.searchButtonClick();
				}
				if (event.keyCode == 27) {
					$(item).removeClass('open');
				}
			}, this));

			$(item).find('.form-save-button').click(_.bind(function() {
				this.updateForm($(item).data('index'));
				$(item).removeClass('open');

				this.searchButtonClick();
			}, this));
		}, this));

		this.updateInputSize();
	},

	updateForm: function(index) {
		var form = this.$el.find('.item[data-index='+index+']');
		var queryString = form.find('.query-form-search-input').val();

		var selectedMediaTypes = [];
		_.map(form.find('.query-types input'), _.bind(function(input) {
			if (input.checked) {
				selectedMediaTypes.push($(input).val().toLowerCase());
			}
		}, this));

		if (selectedMediaTypes.length == this.options.mediaTypes.length) {
			selectedMediaTypes = [];
		}

		var selectedGender = [];
		_.map(form.find('.query-gender input'), _.bind(function(input) {
			if (input.checked) {
				selectedGender.push($(input).val().toLowerCase());
			}
		}, this));

		if (selectedGender.length == this.options.genders.length) {
			selectedGender = [];
		}

		var selectedAuthors = form.find('.query-author').val();

		var searchModernEditions = form.find('.query-modern-editions').is(':checked');

		this.collection.at(index).set({
			queryValue: queryString+
				(selectedMediaTypes.length > 0 ? ' mediatype:('+selectedMediaTypes.join(',')+')' : '')+
				(selectedAuthors.length > 0 ? ' författare:('+selectedAuthors+')' : '')+
				(selectedGender.length > 0 ? ' kön:('+selectedGender.join(',')+')' : '')+
				(searchModernEditions ? ' edition:(modern)' : ''),
			queryString: queryString,
			mediaTypes: selectedMediaTypes,
			authorString: selectedAuthors,
			searchModernEditions: searchModernEditions
		});

	},

	updateInputSize: function() {
		var thisWidth = this.$el.find('.search-wrapper').width();
		var queryItemsSize = this.queryItems.width()

		this.queryInput.width(thisWidth-queryItemsSize-46);

		if (this.collection.length > 0) {
			this.$el.find('.clear-input').css('display', 'block');
		}
		else {
			this.$el.find('.clear-input').css('display', 'none');
		}
	},

	render: function() {
		var template = _.template($("#searchInputTemplate").html());

		this.$el.html(template({}));

		this.queryInput = this.$el.find('.query-input');
		this.queryItems = this.$el.find('.query-items');

		this.updateInputSize();

		window.onresize = _.bind(function() {
			this.updateInputSize();
		}, this);
	}
});