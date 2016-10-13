(function() {
"use strict";

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
    var settingsButton = $("#settings_btn");

    leftBar.style.display = "none";

    speedSlider.addEventListener("input", function() {
        speedText.value = this.value;
    });

    speedSlider.addEventListener("change", function() {
        speedText.value = this.value;
    });

    speedText.value = speedSlider.value;
    speedText.addEventListener("keyup", function(ev) {
        if (ev.keyCode == 13) {
            this.value = Math.max(this.value, 0);
            speedSlider.value = this.value;
        }
    });

    playButton.addEventListener("click", function() {
        alert("Play");
    });

    pauseButton.addEventListener("click", function() {
        alert("Pause");
    });

    settingsButton.addEventListener("click", function() {
        var currentDisplay = leftBar.style.display;
        leftBar.style.display = (currentDisplay == "none") ? "block" : "none";
    });
}

function printAllTables() {
    var tables = [];
    tables.push(Table.trafficDistribution());
    tables.push(Table.successRate());
    tables.push(Table.timeBetweenArrivals());
    tables.push(Table.serviceTimes());

    for (var i = 0; i < tables.length; i++) {
        var table = Table.toHTML(tables[i]);
        $("#leftbar").appendChild(table);
    }
}

addEventListener("load", function() {
    setDOMEvents();
    printAllTables();
});

})();
