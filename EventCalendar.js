(function() {
"use strict";

function insert(element, array, compare) {
	array.splice(locationOf(element, array, compare) + 1, 0, element);
	return array;
}

// performs binary search in a sorted array
function locationOf(element, array, compare, start, end) {
    if (array.length === 0)
        return -1;
    start = start || 0;
    end = end || array.length;
    var pivot = (start + end) >> 1;

    var c = compare(element, array[pivot]);
    if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;
    switch (c) {
        case -1: return locationOf(element, array, compare, start, pivot);
        case 0: return pivot;
        case 1: return locationOf(element, array, compare, pivot, end);
    };
};

var EventCalendar = function() {
	this.values = [];
	this.offset = 0;
};

EventCalendar.prototype.push = function(value) {
	insert(value, this.values, function(lhs, rhs) {
		if (lhs.time < rhs.time) return -1;
		if (lhs.time > rhs.time) return 1;
		return 0;
	});
};

EventCalendar.prototype.pop = function() {
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

EventCalendar.prototype.empty = function() {
	return this.values.length == 0;
};

window.EventCalendar = EventCalendar;

})();
