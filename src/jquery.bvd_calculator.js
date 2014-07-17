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

			// get inputs
			sphereInput = $.fn.bvd_calculator.inputs.sphere = $('#sph', this);
			cylInput = $.fn.bvd_calculator.inputs.cyl = $('#cyl', this);
			axisInput = $.fn.bvd_calculator.inputs.axis = $('#axis', this);

			// Bind sph and cyl to power number formatter
			sphereInput.on("focusout", formatPower);
			cylInput.on("focusout", formatPower);

			// Bind axis input to formatter
			axisInput.on("focusout", formatAxis);

			// Select values in input boxes on focus
			// more complicated than it looks:
			// http://stackoverflow.com/questions/3380458/looking-for-a-better-workaround-to-chrome-select-on-focus-bug
			/*
			 * jQuery(sphereInput, cylInput, axisInput).on("click", function() {
			 * $(this).select(); });
			 */

		});
	};

	/**
	 * HTML Input boxes for Rx values
	 */
	$.fn.bvd_calculator.inputs = {
		sphere : null,
		cyl : null,
		axis : null
	};

	/**
	 * Defaults
	 */
	$.fn.bvd_calculator.defaults = {
		sphereSelector : '#sph',
		cylSelector : '#cyl',
		axisSelector : '#axis',
		originalBvdSelector : '#originalBvd',
		newBvdSelector : '#newBvd',
	};

	// Static method.
	$.bvd_calculator = function(options) {
		window.console.log('Start static method');

		// Override default options with passed-in options.
		options = $.extend({}, $.bvd_calculator.options, options);
		// Return something awesome.
		return 'awesome' + options.punctuation;
	};

	/**
	 * Format an input as standard format lens power value
	 */
	function formatPower(powerContainer, roundValue) {
		// default roundValue to false
		roundValue = typeof roundValue !== 'undefined' ? roundValue : false;

		// get Power value
		var powerValue = powerContainer.target.value;

		// Value is PLANO?
		if (powerValue == 'PLANO') {
			powerValue = 0;
		}

		// Get power as float type
		var power = parseFloat(powerValue);

		// round to 0.25??
		if (roundValue) {
			console.log('Rounding...');
			power = Math.floor(power * 4) / 4;
		}

		// Round to 2dp
		power = power.toFixed(2);

		// Format output
		if (power > 0) {
			finalValue = '+' + power;
		} else if (power < 0) {
			finalValue = power;
		} else if (power == 0){
			finalValue = 'PLANO';
		} else {
			finalValue = '';
		}
		powerContainer.target.value = finalValue;

		// Update jQuery objects
		if (powerContainer.target.id == 'sph') {
			$.fn.bvd_calculator.inputs.sphere = $(powerContainer.target);
		} else if (powerContainer.target.id == 'cyl') {
			$.fn.bvd_calculator.inputs.cyl = $(powerContainer.target);
		}

		// Validate our Rx
		$.fn.bvd_calculator.validate();
	}
	;

	/**
	 * Format a number as an axis
	 * 
	 * Current British Standard specifies no decimal points
	 */
	function formatAxis(axisContainer) {
		// get Axis container
		var axisValue = axisContainer.target.value;

		// No value set, return no value
		if (axisValue == '') {
			return;
		}

		// Get axis value as float type and round off decimals
		var axis = Math.floor(parseFloat(axisValue));

		// Set input container value
		axisContainer.target.value = axis;
	}
	;

	/**
	 * Validate the Rx
	 */
	$.fn.bvd_calculator.validate = function() {
		validateSph($.fn.bvd_calculator.inputs.sphere);
		validateCyl($.fn.bvd_calculator.inputs.cyl);
		validateAxis();

		console.log($.fn.bvd_calculator.toString());
	};

	/**
	 * Validate power value is correct
	 */
	function validatePower(input) {
		var value = parseFloat(input.val());
		var errorText = '';
		
		// PLANO or null value is fine, but all following assume numerical input
		if (input.val() == 'PLANO' || input.val() === '') {
			displayError(input, '');
			return;
		}
		
		// Not a number
		if (typeof value == 'NaN') {
			errorText = 'Not a number';
		}
		
		// very large power error
		if (value > 40 || value < -40) {
			errorText = 'Power out of normal range';
		}

		// Not multiple of 0.25 error
		if (value * 4 != Math.floor(value * 4)) {
			errorText = 'Power not multiple of 0.25';
		}
		
		displayError(input, errorText);
	}
	
	function displayError(element, errorText) {
		// remove old error messages
		element.next('small.error').remove();
		
		// Add / remove error markers
		if (errorText != '') {
			element.parent('label').addClass('error');

			element.after('<small class="error">' + errorText
					+ '</small>');
		} else {
			// remove old errors
			element.parent('label').removeClass('error');
		}
	}
	
	/**
	 * Sphere specific input validation
	 * 
	 * Problems with power values handled by validatePower()
	 */
	function validateSph(input) {
		// Must contain at least 'PLANO'
		if (input.val() == '') {
			input.val('PLANO');
		}
		
		validatePower(input);
	}

	/**
	 * Validate cyl power is correct
	 * 
	 * Only errors specific to cyls required here. Errors relating to 
	 * incorrect power values will be dealt with be validatePower()
	 */
	function validateCyl(input) {
		// Can't have PLANO cyl
		if (input.val() == 'PLANO') {
			input.val('');
		}
		
		// Cyl power but no axis
		if (input.val() != '' && $.fn.bvd_calculator.inputs.axis.val() == "") {
			console.log('cyl val', input.val());
			console.log('axis val', $.fn.bvd_calculator.inputs.axis.val());
			
			displayError($.fn.bvd_calculator.inputs.axis, 'Cyl power but no axis');
		}
		
		validatePower(input);
	}

	/**
	 * Validate axis is correct
	 */
	function validateAxis() {

	}
	/**
	 * Return Rx as String
	 */
	$.fn.bvd_calculator.toString = function() {
		sph = $.fn.bvd_calculator.inputs.sphere.val();
		cyl = $.fn.bvd_calculator.inputs.cyl.val();
		axis = $.fn.bvd_calculator.inputs.axis.val();

		return sph + ' / ' + cyl + ' x ' + axis;
	};

}(jQuery));
