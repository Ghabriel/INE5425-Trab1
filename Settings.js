(function() {
"use strict";

var Settings = {
    width: 900,
    height: 350,
    mailURL: "images/envelope.svg",
    mailScaling: 3,
    mailInterval: function(speed) {
        return 300 / speed;
    },
    simulationInterval: function(speed) {
        return 150 / speed;
    },
    ui: {
        boxFillColor: "white",
        boxStrokeColor: "black",
        wireColor: "black",
        spawners: [
            {
                x: 50,
                y: 50,
                width: 120,
                height: 120
            },
            {
                x: 50,
                y: 190,
                width: 120,
                height: 120
            }
        ],
        serviceCenter: {
            main: {
                x: 300,
                y: 120,
                width: 120,
                height: 120
            },
            first: {
                x: 500,
                y: 50,
                width: 120,
                height: 120
            },
            second: {
                x: 500,
                y: 190,
                width: 120,
                height: 120
            }
        },
        disposers: [
            {
                x: 750,
                y: 120,
                width: 120,
                height: 120
            }
        ]
    },
    regex: {
        numbers: /[0-9]*\.[0-9]+|[0-9]+\.?[0-9]*/
    },
    events: {},
    fn: {
        uniform: {
            label: "UNIF",
            params: 2
        },
        exponential: {
            label: "EXPO",
            params: 1
        },
        triangular: {
            label: "TRIA",
            params: 3
        },
        normal: {
            label: "NORM",
            params: 2
        }
    },
    general: {
        simulationTime: 45,
        numServers: {
            local: 10,
            remote: 10
        }
    },
    trafficDistribution: {
        LL: 66,
        LR: 34,
        RL: 75,
        RR: 25
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

Settings.foreach = function(obj, callback) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            callback(i, obj[i]);
        }
    }
};

Settings.bind = function(fn/*, ...args*/) {
    var args = arguments;
    return function() {
        return fn.apply(window, Array.prototype.slice.call(args, 1));
    };
};

Settings.round = function(value, decimalPlaces) {
    var factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
};

var foreach = Settings.foreach;
var numbers = Settings.regex.numbers;

function operation(name, numParams) {
    var result = name + " *\\(";
    var comma = false;
    for (var i = 0; i < numParams; i++) {
        if (comma) {
            result += ",";
        } else {
            comma = true;
        }
        result += " *(" + numbers.source + ") *";
    }
    result += "\\)";
    return result;
}

var functions = {};
foreach(Settings.fn, function(name, props) {
    functions[name] = operation(props.label, props.params);
});
functions.constant = numbers.source;

Settings.regex.expoFunction = new RegExp(functions.exponential, "i");
Settings.regex.functions = new RegExp(Object.values(functions).join("|"), "i");

window.Settings = Settings;

})();
