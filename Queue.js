(function() {
"use strict";

var Queue = function() {
	this.values = [];
	this.offset = 0;
};

Queue.prototype.push = function(value) {
	this.values.push(value);
};

Queue.prototype.pop = function() {
	if (this.values.length == 0) {
		return undefined;
	}

	var queue = this.values;
	var item = queue[this.offset];
	this.offset++;
	if (this.offset * 2 >= queue.length) {
		this.values = queue.slice(this.offset);
		this.offset = 0;
	}
	return item;
};

Queue.prototype.empty = function() {
	return this.values.length == 0;
};

window.Queue = Queue;

})();
