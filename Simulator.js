(function() {
"use strict";

var LOCAL = 0;
var REMOTE = 1;

var labels = {};
labels[LOCAL] = "L";
labels[REMOTE] = "R";

function call(expression) {
	var matches = expression.match(Settings.regex.functions);
	if (!matches) {
		// TODO: what to do?
		return -1;
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
	this.atRecCenter = [];
	this.atServCenter1 = [];
	this.atServCenter2 = [];
	this.atDisposer = [];
};

Simulator.prototype.setSpeed = function(speed) {
	this.speed = speed;
	this.interval = 300 / speed; // TODO
	// TODO: bye cartinhas
};

Simulator.prototype.generateTarget = function(origin) {
	var data = Settings.trafficDistribution;
	var table = {};
	Settings.foreach(data, function(name, chance) {
		if (name[0] == labels[origin]) {
			table[name] = chance;
		}
	});
	// TODO
	return LOCAL;
	// return Random.monteCarlo(table);
};

Simulator.prototype.generateStatus = function(origin, target) {
	var table = Settings.successRate[labels[origin] + labels[target]];
	// TODO
	return "success";
	// return Random.monteCarlo(table);
};

Simulator.prototype.generateMail = function(origin) {
	var target = this.generateTarget(origin);
	var status = this.generateStatus(origin, target);
	return {
		origin: origin,
		target: target,
		status: status
	};
};

Simulator.prototype.spawnLocal = function() {
	Stats.local++;
	var settings = Settings.ui;
	var ui = this.ui;
	ui.render();
	var self = this;
	var mail = this.generateMail(LOCAL);
	ui.spawnMail(this.speed, settings.spawners[0],
			     settings.serviceCenter.main, function() {
		Stats.atReceptionCenter++;
		self.atRecCenter.push(mail);
		ui.render();
	});
};

Simulator.prototype.spawnRemote = function() {
	Stats.remote++;
	var settings = Settings.ui;
	var ui = this.ui;
	ui.render();
	var self = this;
	var mail = this.generateMail(REMOTE);
	ui.spawnMail(this.speed, settings.spawners[1],
				 settings.serviceCenter.main, function() {
		Stats.atReceptionCenter++;
		self.atRecCenter.push(mail);
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
	this.eventCalendar.push({
		time: time + this.time,
		exec: callback
	});
};

Simulator.prototype.step = function() {
	if (this.paused) {
		return;
	}
	var event = this.eventCalendar.pop();
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
