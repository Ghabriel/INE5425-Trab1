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
	this.ui = ui;
	this.timer = null;
};

Simulator.prototype.setSpeed = function(speed) {
	this.speed = speed;
	// TODO: bye cartinhas
};

Simulator.prototype.unify = function(value) {
	return value * 300 / this.speed;
}

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
	var self = this;
	var tba = Settings.timeBetweenArrivals.local;
	var next = call(tba);
	setTimeout(function() {
		self.spawnLocal();
		self.checkLocalSpawn();
	}, this.unify(next));
};

Simulator.prototype.checkRemoteSpawn = function() {
	var self = this;
	var tba = Settings.timeBetweenArrivals.remote;
	var next = call(tba);
	setTimeout(function() {
		self.spawnRemote();
		self.checkRemoteSpawn();
	}, this.unify(next));
};

Simulator.prototype.play = function() {
	this.checkLocalSpawn();
	this.checkRemoteSpawn();
};

Simulator.prototype.pause = function() {
	// TODO: pause properly
};

window.Simulator = Simulator;

})();