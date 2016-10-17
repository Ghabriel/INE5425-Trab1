(function() {
"use strict";

if (!Object.values) {
	Object.values = function(obj) {
		var result = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				result.push(obj[i]);
			}
		}
		return result;
	}
}

})();
