(function() {
"use strict";

var Random = {};

function rand() {
    return Math.random();
}

Random.uniform = function(min, max) {
    return min + rand() * (max - min);
};

Random.exponential = function(mean) {
    return -1/mean * Math.log(1 - rand());
};

Random.triangular = function(a, b, c) {
    var u = rand();
    var separation = (b - a)/(c - a);
    if (u <= separation) {
        return a + Math.sqrt(u * (b - a) * (c - a));
    }
    return c - Math.sqrt((1 - u) * (c - b) * (c - a));
};

Random.normal = function(mean, deviation) {
    var u1 = rand();
    var u2 = rand();
    var z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + deviation * z;
};

Random.wrap = function(distribution/*, ...params*/) {
    return {
        fn: Random[distribution],
        params: Array.prototype.slice.call(arguments, 1),
        exec: function() {
            for (var i = 0; i < this.params.length; i++) {
                this.params[i] *= 1;
            }
            return this.fn.apply(Random, this.params);
        }
    };
};

Random.monteCarlo = function(options) {
    var value = rand();
    var sum = 0;
    for (var i in options) {
        if (options.hasOwnProperty(i)) {
            sum += options[i] / 100;
            if (sum >= value) {
                return i;
            }
        }
    }
    return null;
};

window.Random = Random;

})();
