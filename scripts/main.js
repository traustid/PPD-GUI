var AppView = require('./views/AppView');
var $ = require('jquery');
window._ = require('underscore');

$(function() {
	window.appView = new AppView({
		el: $('#appViewContainer')
	});
});
