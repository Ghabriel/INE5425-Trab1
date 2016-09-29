(function() {
"use strict";

var Table = {};
var settings = Settings;

function foreach(obj, callback) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            callback(i, obj[i]);
        }
    }
}

function create(tag) {
    return document.createElement(tag);
}

Table.trafficDistribution = function() {
    var params = settings.trafficDistribution;
    return {
        title: "Volume de tráfego",
        headers: ["Direção", "LL", "LR", "RL", "RR"],
        content: [
            ["Proporção (%)", params.LL, params.LR, params.RL, params.RR]
        ]
    };
};

Table.successRate = function() {
    var params = settings.successRate;
    var content = [];
    foreach(params, function(key, value) {
        content.push([key, value.success, value.failure, value.delay, 100]);
    });
    return {
        title: "Status por direção da mensagem",
        headers: ["Direção", "Sucesso", "Fracasso", "Adiamento", "Total"],
        content: content
    };
};

Table.timeBetweenArrivals = function() {
    var params = settings.timeBetweenArrivals;
    return {
        title: "Tempo entre chegadas",
        headers: ["Origem", "TEC (seg.)"],
        content: [
            ["Local", params.local],
            ["Remota", params.remote]
        ]
    };
};

Table.serviceTimes = function() {
    var params = settings.serviceTimes;
    var content = [];
    foreach(params, function(key, value) {
        content.push([key, value.reception, value.serviceCenter]);
    });
    return {
        title: "Tempos de serviço (seg.)",
        headers: ["Tipo de Proc.", "Recepção", "Centro de Serviço"],
        content: content
    };
};

Table.toHTML = function(table) {
    var title = table.title;
    var headers = table.headers;
    var content = table.content;

    var table = create("table");

    var tr = create("tr");
    tr.classList.add("header");

    var td = create("td");
    td.innerHTML = title;
    td.colSpan = headers.length;
    tr.appendChild(td);
    table.appendChild(tr);

    tr = create("tr");
    tr.classList.add("header");
    for (var i = 0; i < headers.length; i++) {
        td = create("td");
        td.innerHTML = headers[i];
        tr.appendChild(td);
    }
    table.appendChild(tr);

    for (var i = 0; i < content.length; i++) {
        tr = create("tr");
        for (var j = 0; j < content[i].length; j++) {
            td = create("td");
            td.innerHTML = content[i][j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;
};

window.Table = Table;

})();
