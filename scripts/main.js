var AppView = require('./views/AppView');
var $ = require('jquery');
window._ = require('underscore');

$(function() {
	console.log('appView');
	if ($('#appViewContainer').length > 0) {
		window.appView = new AppView({
			el: $('#appViewContainer')
		});
	}

	if ($('.sc-ngram-container').length > 0) {
		_.each($('.sc-ngram-container'), _.bind(function(ngramContainer) {
			var NgramView = require('./views/NgramView');

			var ngramView = new NgramView({
				el: $(ngramContainer).find('.view-container'),
				percentagesView: true
			});

			ngramView.search($(ngramContainer).data('query'));
		}, this));
	}
});
