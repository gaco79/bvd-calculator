# BVD Calculator

jQuery plugin for compensating back vertex distance of optical lenses.

## Getting Started
You don't need to know anything technical in order to use this plugin, 
it's latest release is running [on my website](http://bvdcalculator.garethcooper.com)

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/gareth/bvd-calculator/master/dist/jquery.bvd_calculator.min.js
[max]: https://raw.github.com/gareth/bvd-calculator/master/src/jquery.bvd_calculator.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/bvd-calculator.min.js"></script>
<script>
jQuery(function($) {
  $('.rx-form-selector').bvd_calculator();
});
</script>
```

## Example
In your HTML file, allow the user to input the Rx. For the moment the form class must be `rx` and the input ids must be `sph`, `cyl` and `axis`. This will be more flexible in future versions.
```html
<form id="R" class="rx">
 <input type="text" id="sph" />
 <input type="text" id="cyl" />
 <input type="text" id="axis" />
</form>
```

Elsewhere in your HTML file, provide a span which will be populated with the compensated Rx.
The id of the span must be `output` appended with the id of your original form, so in this
case `outputR`.
```html
<span id="outputR"></span>
```

## Release History
 * **version 0.1** : First working version.
