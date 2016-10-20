(function() {
"use strict";

var simulator;

function speed() {
    return $("#speed_text").value;
}

function $(selector) {
    if (selector[0] == '#') {
        return document.querySelector(selector);
    }
    return document.querySelectorAll(selector);
}

function setDOMEvents() {
    var leftBar = $("#leftbar");
    var speedSlider = $("#sim_speed");
    var speedText = $("#speed_text");
    var playButton = $("#play_btn");
    var pauseButton = $("#pause_btn");
    var fastForwardButton = $("#ffw_btn");
    var settingsButton = $("#settings_btn");

    leftBar.style.display = "none";

    var sliderCallback = function() {
        speedText.value = this.value;
        simulator.setSpeed(this.value);
    };

    speedSlider.addEventListener("input", sliderCallback);
    speedSlider.addEventListener("change", sliderCallback);

    speedText.value = speedSlider.value;
    speedText.addEventListener("keyup", function(ev) {
        if (ev.keyCode == 13) {
            this.value = Math.max(this.value, 0);
            speedSlider.value = this.value;
            simulator.setSpeed(this.value);
        }
    });

    playButton.addEventListener("click", function() {
        simulator.play(false);
    });

    pauseButton.addEventListener("click", function() {
        simulator.pause();
    });

    fastForwardButton.addEventListener("click", function() {
        simulator.play(true);
    });

    settingsButton.addEventListener("click", function() {
        var currentDisplay = leftBar.style.display;
        leftBar.style.display = (currentDisplay == "none") ? "" : "none";
    });
}

function printAllTables() {
    var tables = [];
    tables.push(Table.generalSettings());
    tables.push(Table.trafficDistribution());
    tables.push(Table.successRate());
    tables.push(Table.timeBetweenArrivals());
    tables.push(Table.serviceTimes());

    for (var i = 0; i < tables.length; i++) {
        var table = Table.toHTML(tables[i]);
        $("#leftbar").appendChild(table);
    }
}

function printInterface() {
    var container = $("#content");
    var ui = new Interface(container);
	ui.setStatsContainer($("#stats"));
    ui.render();
    simulator = new Simulator(ui);
    simulator.setSpeed(speed());
}

addEventListener("load", function() {
    setDOMEvents();
    printAllTables();
    printInterface();
});

})();
