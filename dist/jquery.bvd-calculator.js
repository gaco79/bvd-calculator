/*! BVD Calculator - v0.0.1 - 2014-07-17
* http://bvdcalculator.garethcooper.com
* Copyright (c) 2014 Gareth Cooper; Licensed GPLv2 */
window.console.log('Start BVD Calculator');

(function($) {

	// Collection method.
	$.fn.bvd_calculator = function() {
		return this.each(function(i) {
			window.console.log('Start collection method');
			
			window.console.log($(this));
			$(this).html('awesome' + i);
		});
	};

	// Static method.
	$.bvd_calculator = function(options) {
		window.console.log('Start static method');
		
		// Override default options with passed-in options.
		options = $.extend({}, $.bvd_calculator.options, options);
		// Return something awesome.
		return 'awesome' + options.punctuation;
	};

	// Static method default options.
	$.bvd_calculator.options = {
		punctuation : '.'
	};

	// Custom selector.
	$.expr[':'].bvd_calculator = function(elem) {
		// Is this element awesome?
		return $(elem).text().indexOf('awesome') !== -1;
	};

}(jQuery));
