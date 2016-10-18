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

var Simulator = function(ui) {
	this.time = 0;
	this.ui = ui;
	this.paused = false;
	this.eventCalendar = new EventCalendar();
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
	// console.log("[" + (next + this.time) + "] local");
	this.addEvent(next, function() {
		self.spawnLocal();
		self.checkLocalSpawn();
	});
};

Simulator.prototype.checkRemoteSpawn = function() {
	var tba = Settings.timeBetweenArrivals.remote;
	var next = call(tba);
	var self = this;
	// console.log("[" + (next + this.time) + "] remote");
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
		time: time + this.time,
		exec: callback
	};
	calendar.push(event);
};

Simulator.prototype.step = function() {
	if (this.paused) {
		return;
	}
	var calendar = this.eventCalendar;
	var event = calendar.pop();
	this.time = event.time;
	event.exec();
};

Simulator.prototype.play = function(fastForward) {
	var self = this;
	var fn = function() {
		var step = function() {
			self.step();
			fn();
		}
		if (!self.eventCalendar.empty()) {
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
