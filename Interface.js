(function() {
"use strict";

function extend(obj, props) {
    Settings.foreach(props, function(i, value) {
        obj[i] = props[i];
    });
}

function rect(canvas, props, content) {
    canvas.rect(props.x, props.y, props.width, props.height);
    var textX = props.x + props.width/2;
    var textY = props.y + props.height/2;
    var text = canvas.text(textX, textY, content);
    text.attr({
        "font-size": 20
    });
}

var Interface = function(container) {
    this.canvas = Raphael(container, Settings.width, Settings.height);
};

Interface.prototype.render = function() {
    this.renderSpawner();
    this.renderServiceCenters();
};

Interface.prototype.renderSpawner = function() {
    var settings = Settings.ui.spawner;
    rect(this.canvas, settings, "Origem\n" + Stats.numEntities);
};

Interface.prototype.renderServiceCenters = function() {
    var settings = Settings.ui.serviceCenter;
    rect(this.canvas, settings.main, "Centro de\nRecepção\n" + Stats.atServiceCenter);
    rect(this.canvas, settings[1], "Centro de\nServiço 1\n" + Stats.atServiceCenter);
    rect(this.canvas, settings[2], "Centro de\nServiço 2\n" + Stats.atServiceCenter);
};

window.Interface = Interface;

})();
