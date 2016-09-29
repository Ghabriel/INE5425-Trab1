(function() {
"use strict";

var Settings = {
	trafficDistribution: {
		LL: 50,
		LR: 25,
		RL: 15,
		RR: 5
	},
	successRate: {
		LL: {
			success: 87,
			failure: 0.5,
			delay: 12.5
		},
		LR: {
			success: 96,
			failure: 1.5,
			delay: 2.5
		},
		RL: {
			success: 96,
			failure: 3,
			delay: 1
		},
		RR: {
			success: 90,
			failure: 1,
			delay: 9
		}
	},
	timeBetweenArrivals: {
		local: "EXPO(0.5)",
		remote: "EXPO(0.6)"
	},
	serviceTimes: {
		LLS: {
			reception: 0.12,
			serviceCenter: "NORM(0.55, 0.05)"
		},
		LLF: {
			reception: 0.14,
			serviceCenter: "TRIA(0.02, 0.05, 0.12)"
		},
		LLA: {
			reception: 0.11,
			serviceCenter: "UNIF(0.06, 0.15)"
		},
		LRS: {
			reception: 0.12,
			serviceCenter: "NORM(0.65, 0.04)"
		},
		LRF: {
			reception: 0.13,
			serviceCenter: "UNIF(0.16, 0.25)"
		},
		LRA: {
			reception: 0.15,
			serviceCenter: "TRIA(0.05, 0.07, 0.10)"
		},
		RLS: {
			reception: 0.12,
			serviceCenter: "UNIF(0.03, 0.11)"
		},
		RLF: {
			reception: 0.14,
			serviceCenter: "NORM(0.46, 0.05)"
		},
		RLA: {
			reception: 0.11,
			serviceCenter: "NORM(0.72, 0.09)"
		},
		RRS: {
			reception: 0.16,
			serviceCenter: "UNIF(0.09, 0.18)"
		},
		RRF: {
			reception: 0.13,
			serviceCenter: "TRIA(0.08, 0.15, 0.22)"
		},
		RRA: {
			reception: 0.16,
			serviceCenter: "NORM(0.63, 0.04)"
		}
	}
};

window.Settings = Settings;

})();
