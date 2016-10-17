(function() {
"use strict";

Snap.plugin(function (Snap, Element, Paper, glob) {
    Paper.prototype.multitext = function (x, y, txt) {
        txt = txt.split("\n");
        var t = this.text(x, y, txt);
        t.selectAll("tspan:nth-child(n+2)").attr({
            dy: "1.2em",
            x: x
        });
        return t;
    };
});

var counter = 0;

function uniqueID() {
    return ++counter;
}

function extend(obj, props) {
    Settings.foreach(props, function(i, value) {
        obj[i] = props[i];
    });
}

function rect(canvas, props, content) {
    var rect = canvas.rect(props.x, props.y, props.width, props.height);
    rect.attr("fill", Settings.ui.boxFillColor);
    rect.attr("stroke", Settings.ui.boxStrokeColor);
    var textX = props.x + props.width/2;
    var textY = props.y + props.height/2 - 12;
    var text = canvas.multitext(textX, textY, content);
    text.attr({
        "font-size": 20,
        textAnchor: "middle"
    });
    return rect;
}

function line(canvas, x1, y1, x2, y2) {
    var line = canvas.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);
    line.attr("stroke", Settings.ui.wireColor);
    return line;
};

var Interface = function(container) {
    this.canvas = Snap(Settings.width, Settings.height);
    container.appendChild(this.canvas.node);
};

Interface.prototype.render = function() {
    this.canvas.clear();
    this.renderSpawners();
    this.renderServiceCenters();
    this.renderDisposers();
    this.renderEdges();
};

Interface.prototype.renderSpawners = function() {
    var settings = Settings.ui.spawners;
    rect(this.canvas, settings[0], "Origem\n(local)\n" + Stats.local);
    rect(this.canvas, settings[1], "Origem\n(remoto)\n" + Stats.remote);
};

Interface.prototype.renderServiceCenters = function() {
    var settings = Settings.ui.serviceCenter;
    rect(this.canvas, settings.main, "Centro de\nRecepção\n" + Stats.atReceptionCenter);
    rect(this.canvas, settings.first, "Centro de\nServiço 1\n" + Stats.atServiceCenter1);
    rect(this.canvas, settings.second, "Centro de\nServiço 2\n" + Stats.atServiceCenter2);
};

Interface.prototype.renderDisposers = function() {
    var settings = Settings.ui.disposers;
    rect(this.canvas, settings[0], "Fim\n(sucesso)\n" + Stats.success);
    rect(this.canvas, settings[1], "Fim\n(falha)\n" + Stats.failure);
};

Interface.prototype.renderEdges = function() {
    var settings = Settings.ui;
    var spawners = settings.spawners;
    var recepCenter = settings.serviceCenter.main;
    var servCenters = [
        settings.serviceCenter.first,
        settings.serviceCenter.second
    ];
    var disposers = settings.disposers;
    // Spawners -> reception center
    for (var i = 0; i < spawners.length; i++) {
        var spawner = spawners[i];
        line(this.canvas, spawner.x + spawner.width, spawner.y + spawner.height/2,
             recepCenter.x, recepCenter.y + recepCenter.height/2);
    }
    // Reception center -> service centers
    for (var i = 0; i < servCenters.length; i++) {
        var center = servCenters[i];
        line(this.canvas,
             recepCenter.x + recepCenter.width, recepCenter.y + recepCenter.height/2,
             center.x, center.y + center.height/2);
    }
    // service centers -> disposers
    for (var i = 0; i < servCenters.length; i++) {
        for (var j = 0; j < servCenters.length; j++) {
            var center = servCenters[i];
            var disposer = disposers[j];
            line(this.canvas,
                 center.x + center.width, center.y + center.height/2,
                 disposer.x, disposer.y + disposer.height/2);
        }
    }
};

Interface.prototype.spawnMail = function(speed, origin, destination) {
    // var parts = [    
    //     this.canvas.path("M7,9L5.268,7.484l-4.952,4.245C0.496,11.896,0.739,12,1.007,12h11.986    c0.267,0,0.509-0.104,0.688-0.271L8.732,7.484L7,9z"),
    //     this.canvas.path("M13.684,2.271C13.504,2.103,13.262,2,12.993,2H1.007C0.74,2,0.498,2.104,0.318,2.273L7,8    L13.684,2.271z"),
    //     this.canvas.path("M0,2.878L0 11.186 4.833 7.079 z"),
    //     this.canvas.path("M9.167,7.079L14 11.186 14 2.875 z")
    // ];

    // var mailGroup = this.canvas.group(parts);
    // var mail = this.canvas.set();
    // for (var i = 0; i < parts.length; i++) {
    //     parts[i].attr("fill", "#030104");
    //     parts[i].attr("stroke-width", "0");
    //     mailGroup.push(parts[i]);
    //     mail.push(parts[i]);
    // }

    // mailGroup.scale(3, 3);

    // mail.animate({
    //     transform: "R45, 550, 400"
    // }, 2000);
    // mail.animate({
    //     x: 400
    // }, 100, function() {
    //     // TODO: bye cartinha
    //     console.log("ok");
    // });
};

window.Interface = Interface;

})();
