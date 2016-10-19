(function() {
"use strict";

var LOCAL = 0;
var REMOTE = 1;

var labels = {};
labels[LOCAL] = "L";
labels[REMOTE] = "R";

var targets = {};
Settings.foreach(labels, function(key, value) {
	targets[value] = key;
});

function call(expression) {
	var matches = (expression + "").match(Settings.regex.functions);
	if (!matches) {
		// TODO: what to do?
		return -1;
	}

	var constRegex = Settings.regex.numbers;
	var constant = new RegExp("^(" + constRegex.source + ")$", constRegex.flags);
	if (constant.test(matches[0])) {
		// Constant
		return matches[0] * 1;
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
			wrapper = Random.wrap.apply(Random, [name].concat(args));
		}
	});
	return wrapper.exec();
}

var Simulator = function(ui) {
	this.time = 0;
	this.ui = ui;
	this.paused = false;
	this.eventCalendar = new EventCalendar();
	this.addInitialEvents();
	this.atRecCenter = new Queue();
	this.atServiceCenter1 = new Queue();
	this.atServiceCenter2 = new Queue();
	this.success = new Queue();
	this.failure = new Queue();
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
	return targets[Random.monteCarlo(table)[1]];
};

Simulator.prototype.generateStatus = function(origin, target) {
	var table = Settings.successRate[labels[origin] + labels[target]];
	var delays = 0;
	var result = Random.monteCarlo(table);
	while (result == "delay") {
		delays++;
		result = Random.monteCarlo(table);
	}
	return {
		delays: delays,
		success: result == "success"
	};
};

Simulator.prototype.generateMail = function(origin) {
	var target = this.generateTarget(origin);
	var status = this.generateStatus(origin, target);
	return {
		origin: origin,
		target: target,
		status: status,
		toString: function() {
			var statusCode = (this.status.delays > 0) ? "A"
							 : ((this.status.success) ? "S"
													  : "F");
			return labels[this.origin] +
				   labels[this.target] +
				   statusCode;
		}
	};
};

Simulator.prototype.spawnLocal = function() {
	Stats.local++;
	var settings = Settings.ui;
	var ui = this.ui;
	ui.render();
	var mail = this.generateMail(LOCAL);
	var self = this;
	ui.spawnMail(this.speed, settings.spawners[0],
				 settings.serviceCenter.main, function() {
		self.receptionEntrance(mail);
		ui.render();
	});
};

Simulator.prototype.spawnRemote = function() {
	Stats.remote++;
	var settings = Settings.ui;
	var ui = this.ui;
	ui.render();
	var mail = this.generateMail(REMOTE);
	var self = this;
	ui.spawnMail(this.speed, settings.spawners[1],
				 settings.serviceCenter.main, function() {
		self.receptionEntrance(mail);
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

Simulator.prototype.receptionEntrance = function(mail) {
	Stats.atReceptionCenter++;
	this.atRecCenter.push(mail);
	var ui = this.ui;
	ui.render();

	var receptionTime = Settings.serviceTimes[mail.toString()].reception;
	var next = call(receptionTime);

	var settings = Settings.ui;
	var self = this;
	this.addEvent(next, function() {
		var isLocal = (mail.origin == LOCAL);
		var target = (isLocal) ? "first" : "second";
		ui.spawnMail(self.speed, settings.serviceCenter.main,
					 settings.serviceCenter[target], function() {
			Stats.atReceptionCenter--;
			self.atRecCenter.pop();
			ui.render();
			self.serviceCenterEntrance(mail);
		});
	});
};

Simulator.prototype.serviceCenterEntrance = function(mail) {
	var isLocal = (mail.origin == LOCAL);
	var prop = (isLocal) ? "atServiceCenter1" : "atServiceCenter2";

	Stats[prop]++;
	this[prop].push(mail);
	var ui = this.ui;
	ui.render();

	var serviceTime = Settings.serviceTimes[mail.toString()].serviceCenter;
	var next = call(serviceTime);

	var settings = Settings.ui;
	var self = this;
	this.addEvent(next, function() {
		var target = (isLocal) ? "first" : "second";
		ui.spawnMail(self.speed, settings.serviceCenter[target],
					 settings.disposers[0], function() {
			Stats[prop]--;
			self[prop].pop();
			ui.render();
			// TODO
		});
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
