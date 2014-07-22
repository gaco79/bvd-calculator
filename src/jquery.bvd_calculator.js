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
			bvdInputs = $('.bvd');

			// Generate and store output element
			$(this).data('outputElement', 'output' + $(this).attr('id'));

			// Bind inputs to number formatters
			sphereInput.on("focusout", validateSph);
			cylInput.on("focusout", validateCyl);
			axisInput.on("focusout", validateAxis);
			bvdInputs.on("change", bvdChanged);

		});

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
	};

	/**
	 * Calculate the Compensated Power at the new vertex distance
	 */
	function compensatePower(inputElement) {
		if (inputElement.is('form')) {
			inputForm = inputElement;
		} else {
			inputForm = inputElement.parents('form.rx');
		}

		var outputId = '#' + inputForm.data('outputElement');

		var sph = parseFloat(inputForm.find('#sph').val());
		var cyl = parseFloat(inputForm.find('#cyl').val());
		var axis = parseFloat(inputForm.find('#axis').val());

		var bvdChange = ($('#newBvd').val() - $('#originalBvd').val()) / 1000;

		var newSph = sph / (1 + sph * bvdChange);
		var newCyl = (sph + cyl) / (1 + (sph + cyl) * bvdChange) - newSph;

		$(outputId).html(
				formatPower(newSph) + ' / ' + newCyl.toFixed(2) + ' x ' + axis);
	}

	/**
	 * Format an input as standard format lens power value
	 */
	function formatPower(powerValue) {
		// Value is PLANO?
		if (powerValue == 'PLANO') {
			powerValue = 0;
		}

		// Get power as float type
		var power = parseFloat(powerValue);

		// round to 0.25
		// power = Math.floor(power * 4) / 4;

		// Round to 2dp
		power = power.toFixed(2);

		// Format output
		var finalValue;
		if (power > 0) {
			finalValue = '+' + power;
		} else if (power < 0) {
			finalValue = power;
		} else if (power == 0) {
			finalValue = 'PLANO';
		} else {
			finalValue = '';
		}

		return finalValue;
	}
	;

	/**
	 * Format a number as an axis
	 * 
	 * Current British Standard specifies no decimal points
	 */
	function formatAxis(axisValue) {
		// No value set, return no value
		if (axisValue == '') {
			displayError(axisInput, '');
			return '';
		}

		// Get axis value as float type and round off decimals
		var finalAxis = Math.floor(parseFloat(axisValue));

		// Validate
		return finalAxis;
	}
	;

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
	function validateSph(event) {
		var inputElement = $(event.target);

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
	function validateCyl(event) {
		var inputElement = $(event.target);

		// Can't have PLANO cyl
		if (inputElement.val() == 'PLANO') {
			inputElement.val('');
		}

		// Cyl power but no axis
		// tricky one this... leave it for now...

		validatePower(inputElement);
	}

	/**
	 * Validate power value is correct
	 */
	function validatePower(inputElement) {
		var value = parseFloat(inputElement.val());
		inputElement.val(formatPower(inputElement.val()));
		var errorText = '';

		// PLANO or null value is fine, but all following assume numerical input
		if (inputElement.val() == 'PLANO' || inputElement.val() === '') {
			displayError(inputElement, '');
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

		displayError(inputElement, errorText);
		compensatePower(inputElement);
	}

	/**
	 * Validate axis is correct
	 */
	function validateAxis(event) {
		var inputElement = $(event.target);

		var val = parseFloat(inputElement.val());
		var errorText = '';

		// format
		inputElement.val(formatAxis(inputElement.val()));

		// PLANO or null value is fine, but all following assume numerical input
		if (val === '') {
			displayError(inputElement, '');
			return;
		}

		if (val < 0 || val > 180) {
			errorText = "Axis out of range";
		}

		displayError(inputElement, errorText);
		compensatePower(inputElement);
	}

	/**
	 * Update compensated power when BVD is changed
	 */
	function bvdChanged(event) {
		$('.rx').each(function() {
			compensatePower($(this));
		});
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
