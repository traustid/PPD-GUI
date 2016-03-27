var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var noUiSlider = require('../lib/nouislider.min');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;

		this.render();
	},

	updateHandleValues: function() {
		this.$el.find('.noUi-handle-lower').html('<div class="handle-number">'+Math.round(this.slider.get()[0])+'</div>');
		this.$el.find('.noUi-handle-upper').html('<div class="handle-number">'+Math.round(this.slider.get()[1])+'</div>');
	},

	setSliderRange: function(range) {
		this.slider.updateOptions({
			range: {
				min: range[0],
				max: range[1]
			}
		});
	},

	sliderValues: function() {
		return [Number(this.slider.get()[0]), Number(this.slider.get()[1])];
	},

	setSliderValues: function(values) {
		this.slider.set(values);
		this.updateHandleValues();
	},

	sliderDelay: false,

	render: function() {
		this.slider = noUiSlider.create(this.$el[0], {
			start: this.options.range,
			step: 1,
			behaviour: 'drag',
			connect: true,
			range: {
				'min': this.options.range[0],
				'max':  this.options.range[1]
			}
		});
		this.updateHandleValues();

		this.slider.on('change', _.bind(function(event, ui) {
			this.trigger('change', {
				values: [Number(this.slider.get()[0]), Number(this.slider.get()[1])]
			});
		}, this));

		this.slider.on('slide', _.bind(function(event, ui) {
			this.updateHandleValues();

			if (!this.sliderDelay) {
				this.sliderDelay = true;

				setTimeout(_.bind(function() {
					this.sliderDelay = false;
				}, this), 50);

				this.trigger('slide', {
					values: [Number(this.slider.get()[0]), Number(this.slider.get()[1])]
				});
			}
		}, this));
	}
});