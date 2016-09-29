(function() {
"use strict";

var Settings = {
	trafficDistribution: {
		LL: 0,
		LR: 0,
		RL: 0,
		RR: 0
	},
	successRate: {
		LL: {
			success: 0,
			failure: 0,
			delay: 0
		},
		LR: {
			success: 0,
			failure: 0,
			delay: 0
		},
		RL: {
			success: 0,
			failure: 0,
			delay: 0
		},
		RR: {
			success: 0,
			failure: 0,
			delay: 0
		}
	}
};

window.Settings = Settings;

})();
