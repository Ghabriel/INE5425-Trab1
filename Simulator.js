(function() {
"use strict";

var Simulator = function(ui) {
	this.ui = ui;
};

Simulator.prototype.setSpeed = function(speed) {
	this.speed = speed;
	// TODO: bye cartinhas
};

Simulator.prototype.spawn = function() {
	Stats.local++;
	var settings = Settings.ui;
	this.ui.spawnMail(this.speed, settings.spawners[0],
					  settings.serviceCenter.main);
};

Simulator.prototype.exec = function() {
	var self = this;
	// setInterval(function() {
		self.spawn();
	// }, 300);
};

window.Simulator = Simulator;

})();