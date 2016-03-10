var AppView = require('./views/AppView');
var $ = require('jquery');

$(function() {
	window.appView = new AppView({
		el: $('#appView')
	});
});
