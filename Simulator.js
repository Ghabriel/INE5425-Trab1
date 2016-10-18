(function() {
"use strict";

var Simulator = function(ui) {
	this.ui = ui;
	this.timer = null;
};

function unify(value) {
	return value * 300;
}

function call() {
	return 1;
}

Simulator.prototype.setSpeed = function(speed) {
	this.speed = speed;
	// TODO: bye cartinhas
};

Simulator.prototype.spawnLocal = function() {
	Stats.local++;
	var settings = Settings.ui;
	this.ui.render();
	this.ui.spawnMail(this.speed, settings.spawners[0],
					  settings.serviceCenter.main, function() {
		Stats.atReceptionCenter++;
	});
};

Simulator.prototype.spawnRemote = function() {
	Stats.remote++;
	var settings = Settings.ui;
	this.ui.render();
	this.ui.spawnMail(this.speed, settings.spawners[1],
					  settings.serviceCenter.main, function() {
		Stats.atReceptionCenter++;
	});
};

Simulator.prototype.checkLocalSpawn = function() {
	var self = this;
	var localTec = Settings.timeBetweenArrivals.local;
	var nextLocal = call(localTec);
	setTimeout(function() {
		self.spawnLocal();
		self.checkLocalSpawn();
	}, unify(nextLocal));
};

Simulator.prototype.checkRemoteSpawn = function() {
	var self = this;
	var remoteTec = Settings.timeBetweenArrivals.remote;
	var nextRemote = call(remoteTec);

	setTimeout(function() {
		self.spawnRemote();
		self.checkRemoteSpawn();
	}, unify(nextRemote));
};

Simulator.prototype.play = function() {
	this.checkLocalSpawn();
	this.checkRemoteSpawn();
};

Simulator.prototype.pause = function() {
	var self = this;
	clearInterval(this.timer);
	// TODO: pause properly
};

window.Simulator = Simulator;

})();