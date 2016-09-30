(function() {
"use strict";

var settings = Settings;
var regex = settings.regex;
var numbers = regex.numbers;
var expoFunction = regex.expoFunction;
var statFunction = regex.functions;

var Filter = function(regex, className) {
	this.regex = regex;
	this.css = className;
};

Filter.prototype.validate = function(content) {
	return this.regex.test(content);
};

var NumericFilter = function() {
	return new Filter(numbers, "numeric_filter");
};

var ExponentialFilter = function() {
	return new Filter(expoFunction, "expo_filter");
}

var StatisticFilter = function() {
	return new Filter(statFunction, "stat_filter");
}


var Macro = function(callback) {
	this.callback = callback;
	this.params = [];
};

Macro.prototype.setParams = function(args) {
	this.params = args;
}

Macro.prototype.call = function() {
	return this.callback(this.params);
};

var AdderMacro = function(columns) {
	return new Macro(function(values) {
		var sum = 0;
		for (var i = 0; i < values.length; i++) {
			if (values.includes(i)) {
				sum += values[i];
			}
		}
		return sum;
	});
};

window.Filter = Filter;
window.NumericFilter = NumericFilter;
window.ExponentialFilter = ExponentialFilter;
window.StatisticFilter = StatisticFilter;
window.Macro = Macro;
window.AdderMacro = AdderMacro;

})();
