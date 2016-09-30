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
}

var NumericFilter = function() {
	return new Filter(numbers, "numeric_filter");
};

var ExponentialFilter = function() {
	return new Filter(expoFunction, "expo_filter");
}

var StatisticFilter = function() {
	return new Filter(statFunction, "stat_filter");
}

window.NumericFilter = NumericFilter;
window.ExponentialFilter = ExponentialFilter;
window.StatisticFilter = StatisticFilter;

})();
