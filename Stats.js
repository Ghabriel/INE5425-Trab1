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
	avgTravelTime: 0,
	
	numMessages: 0,
	minNumMessages: 0,
	maxNumMessages: 0,
	timePerAmount: {},
	numMessageLastChange: 0,
	
	recCenterTimePerAmount: {},
	recCenterLastChange: 0,

	localServCenterTimePerAmount: {},
	localServCenterLastChange: 0,

	remoteServCenterTimePerAmount: {},
	remoteServCenterLastChange: 0
};

Stats.weightedAverage = function(prop) {
	var sum = 0;
	var totalTime = 0;
	for (var i in this[prop]) {
		sum += i * this[prop][i];
		totalTime += this[prop][i];
	}
	return sum / totalTime;
};

Stats.avgNumMessages = function() {
	return this.weightedAverage("timePerAmount");
};

Stats.avgRecCenterOcupation = function() {
	return this.weightedAverage("recCenterTimePerAmount");
};

Stats.avgLocalServCenterOcupation = function() {
	return this.weightedAverage("localServCenterTimePerAmount");
};

Stats.avgRemoteServCenterOcupation = function() {
	return this.weightedAverage("remoteServCenterTimePerAmount");
};

Stats.updateAverage = function(time, lastChange, count, prop) {
	var constTime = time - this[lastChange];
	this[lastChange] = time;
	if (!this[prop].hasOwnProperty(this[count])) {
		this[prop][this[count]] = constTime;
	} else {
		this[prop][this[count]] += constTime;
	}
};

Stats.updateNumMessages = function(time, delta) {
	this.updateAverage(time, "numMessageLastChange", "numMessages", "timePerAmount");
	this.numMessages += delta;
	if (this.numMessages < this.minNumMessages) {
		this.minNumMessages = this.numMessages;
	} else if (this.numMessages > this.maxNumMessages) {
		this.maxNumMessages = this.numMessages;
	}
};

Stats.receptionEntrance = function(time) {
	this.updateAverage(time, "recCenterLastChange", "atReceptionCenter", "recCenterTimePerAmount");
	this.atReceptionCenter++;
};

Stats.receptionExit = function(time) {
	this.updateAverage(time, "recCenterLastChange", "atReceptionCenter", "recCenterTimePerAmount");
	this.atReceptionCenter--;
};

Stats.localServEntrance = function(time) {
	this.updateAverage(time, "localServCenterLastChange", "atServiceCenter1",
				"localServCenterTimePerAmount");
	this.atServiceCenter1++;
};

Stats.localServExit = function(time) {
	this.updateAverage(time, "localServCenterLastChange", "atServiceCenter1",
				"localServCenterTimePerAmount");
	this.atServiceCenter1--;
};

Stats.remoteServEntrance = function(time) {
	this.updateAverage(time, "remoteServCenterLastChange", "atServiceCenter2",
				"remoteServCenterTimePerAmount");
	this.atServiceCenter2++;
};

Stats.remoteServExit = function(time) {
	this.updateAverage(time, "remoteServCenterLastChange", "atServiceCenter2",
				"remoteServCenterTimePerAmount");
	this.atServiceCenter2--;
};

Stats.addMail = function(time) {
	this.updateNumMessages(time, 1);
};

Stats.finished = function(mail) {
	var time = mail.finish;
	this.updateNumMessages(time, -1);

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
