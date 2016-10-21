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

function rect(canvas, props, content, isDisposer) {
    var rect = canvas.rect(props.x, props.y, props.width, props.height);
    rect.attr("fill", Settings.ui.boxFillColor);
    rect.attr("stroke", Settings.ui.boxStrokeColor);
    var textX = props.x + props.width/2;
    var textY = props.y + props.height/2 - 12;
    if (isDisposer) {
        textY -= 28;
    }
    var text = canvas.multitext(textX, textY, content);
    text.attr({
        "font-size": 20,
        textAnchor: "middle"
    });
    return text;
}

function line(canvas, x1, y1, x2, y2) {
    var line = canvas.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);
    line.attr("stroke", Settings.ui.wireColor);
    return line;
};

var retext = function(container, props, txt) {
    txt = txt.split("\n");
    container.attr({
        text: txt,
    }).selectAll("tspan:nth-child(n+2)").attr({
        dy: "1.2em",
        x: props.x + props.width/2
    });
};

var Interface = function(container) {
    this.canvas = Snap(Settings.width, Settings.height);
    this.statsContainer = null;
    this.spawners = null;
    this.serviceCenters = null;
    this.disposers = null;
    this.edges = false;
    container.appendChild(this.canvas.node);
};

Interface.prototype.setStatsContainer = function(container) {
    this.statsContainer = container;
};

Interface.prototype.info = function(time) {
    return [
        {
            title: "Estatísticas"
        },
        {
            title: "Informações gerais",
            content: [
                ["Tempo de simulação:", time]
            ]
        },
        {
            title: "Mensagens no sistema",
            content: [
                ["Mínimo:", Stats.minNumMessages],
                ["Máximo:", Stats.maxNumMessages],
                ["Média:", Stats.avgNumMessages()]
            ]
        },
        {
            title: "Taxa de ocupação média dos centros",
            content: [
                ["Recepção:", Stats.avgRecCenterOcupation()],
                ["Serviço 1 (local):", Stats.avgLocalServCenterOcupation()],
                ["Serviço 2 (remoto):", Stats.avgRemoteServCenterOcupation()]
            ]
        },
        {
            title: "Tempo de trânsito",
            content: [
                ["Mínimo:", Stats.minTravelTime],
                ["Máximo:", Stats.maxTravelTime],
                ["Média:", Stats.avgTravelTime]
            ]
        },
        {
            title: "Mensagens despachadas",
            content: [
                ["Total:", Stats.success + Stats.failure],
                ["Sucesso:", Stats.success],
                ["Falha:", Stats.failure]
            ]
        },
        {
            title: "Mensagens por tipo",
            content: [
                ["Local:", Stats.local],
                ["Remota:", Stats.remote]
            ]
        },
    ];
};

Interface.prototype.buildReport = function() {
    var info = this.info(Settings.general.simulationTime);
    var content = "";
    for (var i = 0; i < info.length; i++) {
        var data = info[i];
        if (data.title) {
            content += data.title + ":\n";
        }

        if (data.content) {
            for (var j = 0; j < data.content.length; j++) {
                var row = data.content[j];
                content += "\t" + row[0] + " " + Settings.round(row[1], 3) + "\n";
            }
            content += "\n";
        }
    }
    return content;
};

Interface.prototype.report = function() {
    var content = this.buildReport();
    var blob = new Blob([content], {type: "text/plain; charset=utf-8"});
    saveAs(blob, "report.txt");
};

Interface.prototype.printStats = function(time) {
    var info = this.info(time);
    var table = document.createElement("table");
    table.id = "stats_table";
    for (var i = 0; i < info.length; i++) {
        var data = info[i];
        if (data.title) {
            var tr = document.createElement("tr");
            tr.classList.add("title");
            var td = document.createElement("td");
            td.colSpan = 2;
            td.innerHTML = data.title;
            tr.appendChild(td);
            table.appendChild(tr);
        }

        if (data.content) {
            var rows = data.content;
            for (var j = 0; j < rows.length; j++) {
                var tr = document.createElement("tr");
                for (var k = 0; k < rows[j].length; k++) {
                    var td = document.createElement("td");
                    var value = rows[j][k];
                    if (k == 1) {
                        td.innerHTML = Settings.round(value, 3);
                    } else {
                        td.innerHTML = value;
                    }
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        }
        table.appendChild(tr);
    }

    var container = this.statsContainer;
    container.innerHTML = "";
    container.appendChild(table);
};

Interface.prototype.interval = function(speed) {
    return Settings.mailInterval(speed);
};

Interface.prototype.render = function() {
    this.renderSpawners();
    this.renderServiceCenters();
    this.renderDisposers();
    this.renderEdges();
};

Interface.prototype.renderSpawners = function() {
    var settings = Settings.ui.spawners;
    if (!this.spawners) {
        this.spawners = [];
        this.spawners.push(rect(this.canvas, settings[0], ""));
        this.spawners.push(rect(this.canvas, settings[1], ""));
    }

    retext(this.spawners[0], settings[0], "Origem\n(local)\n" + Stats.local);
    retext(this.spawners[1], settings[1], "Origem\n(remoto)\n" + Stats.remote);
};

Interface.prototype.renderServiceCenters = function() {
    var settings = Settings.ui.serviceCenter;
    if (!this.serviceCenters) {
        this.serviceCenters = [];
        this.serviceCenters.push(rect(this.canvas, settings.main, ""));
        this.serviceCenters.push(rect(this.canvas, settings.first, ""));
        this.serviceCenters.push(rect(this.canvas, settings.second, ""));
    }

    retext(this.serviceCenters[0], settings.main, "Centro de\nRecepção\n" + Stats.atReceptionCenter);
    retext(this.serviceCenters[1], settings.first, "Centro de\nServiço 1\n" + Stats.atServiceCenter1);
    retext(this.serviceCenters[2], settings.second, "Centro de\nServiço 2\n" + Stats.atServiceCenter2);
};

Interface.prototype.renderDisposers = function() {
    var settings = Settings.ui.disposers;
    if (!this.disposers) {
        this.disposers = [];
        this.disposers.push(rect(this.canvas, settings[0], "", true));
    }

    retext(this.disposers[0], settings[0], "Fim\nSucesso:\n" + Stats.success + "\nFalha:\n" + Stats.failure);
};

Interface.prototype.renderEdges = function() {
    if (this.edges) {
        return;
    }
    this.edges = true;

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
        for (var j = 0; j < disposers.length; j++) {
            var center = servCenters[i];
            var disposer = disposers[j];
            line(this.canvas,
                 center.x + center.width, center.y + center.height/2,
                 disposer.x, disposer.y + disposer.height/2);
        }
    }
};

Interface.prototype.spawnMail = function(speed, origin, destination, callback) {
    var self = this;
    Snap.load(Settings.mailURL, function(f) {
        var mail = f.select("g");
        self.canvas.append(mail);

        var scale = Settings.mailScaling;

        var scene = new Snap.Matrix();
        scene.translate(origin.x + origin.width,
                        origin.y + origin.height/2 - 15);
        scene.scale(scale, scale);

        // Initial position
        mail.attr({
            transform: scene
        });

        // Animates the mail to the destination
        var dx = destination.x - (origin.x + origin.width) - 42;
        var dy = destination.y + destination.height/2 - (origin.y + origin.height/2) - 15;
        scene.translate(dx/scale, dy/scale);
        mail.animate({
            transform: scene
        }, self.interval(speed), function() {
            mail.remove();
            callback();
        });
    });
};

window.Interface = Interface;

})();
