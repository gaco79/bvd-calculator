/*bvs
 * bvd-calculator
 * http://bvdcalculator.garethcooper.com
 *
 * Copyright (c) 2014 Gareth Cooper
 * Licensed under the GPLv2 license.
 */

window.console.log('Start BVD Calculator');

(function($) {
	var sph = 0;
	var cyl = 0;
	var axis = 0;

	// Collection method.
	$.fn.bvd_calculator = function() {
		return this.each(function(i) {
			window.console.log('Start collection method');

			// get current values
			sphereInput = $('#sph', this);
			sph = sphereInput.val();
			
			cylInput = $('#cyl', this);
			cyl = cylInput.val();
			
			axisInput = $('#axis', this);
			axis = axisInput.val();

			//Bind sph and cyl to power number formatter
			sphereInput.on("focusout", formatPower);
			cylInput.on("focusout", formatPower);
			
			// Bind axis input to formatter
			axisInput.on("focusout", formatAxis );
			
			// Select values in input boxes on focus
			// more complicated than it looks:
			//http://stackoverflow.com/questions/3380458/looking-for-a-better-workaround-to-chrome-select-on-focus-bug
			/*
			jQuery(sphereInput, cylInput, axisInput).on("click", function() {
				$(this).select();
			});
			*/

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

	function formatPower(powerContainer, roundValue) {
		//default roundValue to false
		roundValue = typeof roundValue !== 'undefined' ? roundValue : false;
		
		//get Power value
		var powerValue = powerContainer.target.value;
		
		// Value not set? or PLANO
		if (powerValue == '' || powerValue == 'PLANO') {
			powerValue = 0;
		}
		
		// Get power as float type
		var power = parseFloat(powerValue);
		
		//round to 0.25??
		if (roundValue) {
			console.log('Rounding...');
			power = Math.floor(power*4)/4;
		}
		
		// Round to 2dp
		power = power.toFixed(2);
		
		// Format output	
		if (power > 0)  {
			finalValue = '+' + power;
		} else if (power < 0) {
			finalValue = power;
		} else {
			finalValue = 'PLANO';
		}
		powerContainer.target.value = finalValue;
		
		// Update member variables
		if (powerContainer.target.id == 'sph') {
			sph = power;
		} else if (powerContainer.target.id == 'cyl') {
			cyl = power;
		}
		
		console.log(toString());
	}
	
	/**
	 * Format a number as an axis
	 * 
	 * Current British Standard specifies no decimal points
	 */
	function formatAxis(axisContainer) {
		//get Axis container
		var axisValue = axisContainer.target.value;
		if (axisValue == '') {
			return;
		}
		
		// Get axis as float type and round off decimals
		var power = Math.floor(parseFloat(axisValue));
		
		// Update function axis value 
		axis = power;
		
		// Set input container value
		axisContainer.target.value = power;
	}
	
	function toString() {
		return sph + ' / ' + cyl + ' x ' + axis;
	}

}(jQuery));
