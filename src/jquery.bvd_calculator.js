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
	$.fn.bvd_calculator = function(options) {
		var opts = $.extend({}, $.fn.bvd_calculator.defaults, options);

		return this.each(function(i) {

			// Get inputs
			sphereInput = $('#sph', this);
			cylInput = $('#cyl', this);
			axisInput = $('#axis', this);

			// Generate and store output element
			$(this).data('outputElement', 'output' + $(this).attr('id'));

			// Bind inputs to number formatters
			sphereInput.on("focusout", formatPower);
			cylInput.on("focusout", formatPower);
			axisInput.on("focusout", formatAxis);

			// Bind inputs to output calculators
			sphereInput.on("keyup", compensatePower);

		});

	};

	function compensatePower(inputForm) {
		outputId = '#' + inputForm.data('outputElement');
		console.log ('output ID', outputId);
		
		var sph = parseFloat(inputForm.find('#sph').val());
		var cyl = parseFloat(inputForm.find('#cyl').val());
		var axis = parseFloat(inputForm.find('#axis').val());
		
		var bvdChange = ($('#newBvd').val() - $('#originalBvd').val())/1000;
		
		var newSph = sph/(1+sph*bvdChange);
		var newCyl = (sph+cyl)/(1+(sph+cyl)*bvdChange) - newSph;
		
		$(outputId).html('test');
	}

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
	function formatPower(event) {
		powerContainer = $(event.target);

		// get Power value
		var powerValue = powerContainer.val();

		// Value is PLANO?
		if (powerValue == 'PLANO') {
			powerValue = 0;
		}

		// Get power as float type
		var power = parseFloat(powerValue);

		// round to 0.25
		power = Math.floor(power * 4) / 4;

		// Round to 2dp
		power = power.toFixed(2);

		// Format output
		if (power > 0) {
			finalValue = '+' + power;
		} else if (power < 0) {
			finalValue = power;
		} else if (power == 0) {
			finalValue = 'PLANO';
		} else {
			finalValue = '';
		}
		powerContainer.val(finalValue);

		// Validate our Rx
		$.fn.bvd_calculator.validate(powerContainer);
	}
	;

	/**
	 * Format a number as an axis
	 * 
	 * Current British Standard specifies no decimal points
	 */
	function formatAxis(event) {
		// Axis <input> HTML element
		axisInput = $(event.target);

		// get Axis value
		var axisValue = axisInput.val();

		// No value set, return no value
		if (axisValue == '') {
			displayError(axisInput, '');
			return;
		}

		// Get axis value as float type and round off decimals
		if (typeof axisValue == 'number') {
			// Set input container value
			var axis = Math.floor(parseFloat(axisValue));
			axisInput.val(axis);
		}

		// Validate
		$.fn.bvd_calculator.validate(axisInput);
	}
	;

	/**
	 * Validate the Rx
	 */
	$.fn.bvd_calculator.validate = function(inputElement) {
		inputContainer = inputElement.parents('form.rx');

		validateSph(inputContainer.find('#sph'));
		validateCyl(inputContainer.find('#cyl'));
		validateAxis(inputContainer.find('#axis'));
		
		compensatePower(inputContainer);
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

	/**
	 * Attach an error to an element
	 */
	function displayError(element, errorText) {
		// remove old error messages
		element.next('small.error').remove();

		// Add / remove error markers
		if (errorText != '') {
			element.parent('label').addClass('error');

			element.after('<small class="error">' + errorText + '</small>');
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
	function validateSph(inputElement) {
		// Must contain at least 'PLANO'
		if (inputElement.val() == '') {
			inputElement.val('PLANO');
		}

		validatePower(inputElement);
	}

	/**
	 * Validate cyl power is correct
	 * 
	 * Only errors specific to cyls required here. Errors relating to incorrect
	 * power values will be dealt with be validatePower()
	 */
	function validateCyl(inputElement) {
		// Can't have PLANO cyl
		if (inputElement.val() == 'PLANO') {
			inputElement.val('');
		}

		// Cyl power but no axis
		// tricky one this... leave it for now...

		validatePower(inputElement);
	}

	/**
	 * Validate axis is correct
	 */
	function validateAxis(inputElement) {
		var val = parseFloat(inputElement.val());
		errorText = '';
		
		// PLANO or null value is fine, but all following assume numerical input
		if (val === '') {
			displayError(inputElement, '');
			return;
		}

		if (val < 0 || val > 180) {
			errorText = "Axis out of range";
		}

		displayError(inputElement, errorText);
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
