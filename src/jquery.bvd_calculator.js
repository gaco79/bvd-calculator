/*bvs
 * bvd-calculator
 * http://bvdcalculator.garethcooper.com
 *
 * Copyright (c) 2014 Gareth Cooper
 * Licensed under the GPLv2 license.
 */

window.console.log('Start BVD Calculator');

(function($) {

	// Collection method.
	$.fn.bvd_calculator = function() {
		return this.each(function(i) {
			window.console.log('Start collection method');
			
			var sph = $('#sph', this).val();
			window.console.log(sph);
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
