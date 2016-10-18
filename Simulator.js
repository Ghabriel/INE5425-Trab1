(function() {
"use strict";

function call(expression) {
	var matches = expression.match(Settings.regex.functions);
	if (!matches) {
		// TODO: what to do?
		return 666;
	}

	var constRegex = Settings.regex.numbers;
	var constant = new RegExp("^(" + constRegex.source + ")$", constRegex.flags);
	if (constant.test(matches[0])) {
		// Constant
		return matches[0];
	}

	var fn = matches[0].split("(")[0];
	var args = [];
	for (var i = 1; i < matches.length; i++) {
		if (matches[i] !== undefined) {
			args.push(matches[i]);
		}
	}

	var fnList = Settings.fn;
	var wrapper;
	Settings.foreach(fnList, function(name, props) {
		if (fn == props.label) {
			wrapper = Random.wrap(name, args);
		}
	});
	window.w = wrapper;
	return wrapper.exec();
}

function insert(element, array, compare) {
	array.splice(locationOf(element, array, compare) + 1, 0, element);
	return array;
}

// performs binary search in a reverse-sorted array
function locationOf(element, array, compare, start, end) {
    if (array.length === 0)
        return -1;

    start = start || 0;
    end = end || array.length;
    var pivot = (start + end) >> 1;

    var c = compare(element, array[pivot]);
    if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

    switch (c) {
        case -1: return locationOf(element, array, compare, pivot, end);
        case 1: return locationOf(element, array, compare, start, pivot);
        case 0: return pivot;
    };
};

var Simulator = function(ui) {
	this.ui = ui;
	this.paused = false;
	this.eventCalendar = [];
	this.addInitialEvents();
};

Simulator.prototype.setSpeed = function(speed) {
	this.speed = speed;
	this.interval = 300 / speed; // TODO
	// TODO: bye cartinhas
};

Simulator.prototype.spawnLocal = function() {
	Stats.local++;
	var settings = Settings.ui;
	var ui = this.ui;
	ui.render();
	ui.spawnMail(this.speed, settings.spawners[0],
			     settings.serviceCenter.main, function() {
		Stats.atReceptionCenter++;
		ui.render();
	});
};

Simulator.prototype.spawnRemote = function() {
	Stats.remote++;
	var settings = Settings.ui;
	var ui = this.ui;
	ui.render();
	ui.spawnMail(this.speed, settings.spawners[1],
				 settings.serviceCenter.main, function() {
		Stats.atReceptionCenter++;
		ui.render();
	});
};

Simulator.prototype.checkLocalSpawn = function() {
	var tba = Settings.timeBetweenArrivals.local;
	var next = call(tba);
	var self = this;
	this.addEvent(next, function() {
		self.spawnLocal();
		self.checkLocalSpawn();
	});
};

Simulator.prototype.checkRemoteSpawn = function() {
	var tba = Settings.timeBetweenArrivals.remote;
	var next = call(tba);
	var self = this;
	this.addEvent(next, function() {
		self.spawnRemote();
		self.checkRemoteSpawn();
	});
};

Simulator.prototype.addInitialEvents = function() {
	this.checkLocalSpawn();
	this.checkRemoteSpawn();
};

Simulator.prototype.addEvent = function(time, callback) {
	var calendar = this.eventCalendar;
	var event = {
		time: time,
		exec: callback
	};
	insert(event, calendar, function(lhs, rhs) {
		if (lhs.time < rhs.time) return -1;
		if (lhs.time > rhs.time) return 1;
		return 0;
	});
	console.log(calendar);
};

Simulator.prototype.step = function() {
	if (this.paused) {
		return;
	}
	var calendar = this.eventCalendar;
	var event = calendar[calendar.length - 1];
	this.time = event.time;
	event.exec();
};

Simulator.prototype.play = function(fastForward) {
	this.time = 0;
	var self = this;
	var fn = function() {
		var step = function() {
			self.step();
			fn();
		}
		if (self.eventCalendar.length > 0) {
			if (fastForward) {
				step();
			} else {
				setTimeout(function() {
					step();
				}, self.interval);
			}
		}
	};
	fn();
};

Simulator.prototype.pause = function() {
	this.paused = true;
	// TODO: pause properly
};

window.Simulator = Simulator;

})();
