(function() {
"use strict";

var Stats = {
	local: 0,
	remote: 0,
	atReceptionCenter: 0,
	atServiceCenter1: 0,
	atServiceCenter2: 0,
	success: 0,
	failure: 0,

	minTravelTime: Infinity,
	maxTravelTime: -Infinity,
	avgTravelTime: 0
};


Stats.finished = function(mail) {
	var numFinished = this.success + this.failure;
	var travelTime = mail.finish - mail.entrance;
	var avg = this.avgTravelTime;
	this.avgTravelTime = (avg * numFinished + travelTime) / (numFinished + 1);

	if (travelTime < this.minTravelTime) {
		this.minTravelTime = travelTime;
	}

	if (travelTime > this.maxTravelTime) {
		this.maxTravelTime = travelTime;
	}

	var status = mail.status.success;
	if (status) {
		this.success++;
	} else {
		this.failure++;
	}
};

window.Stats = Stats;

})();
