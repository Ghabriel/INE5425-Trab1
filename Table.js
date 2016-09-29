(function() {
"use strict";

var Table = {};
var settings = Settings;

function create(tag) {
    return document.createElement(tag);
}

Table.trafficDistribution = function() {
    var params = settings.trafficDistribution;
    return {
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
        headers: ["Direção", "Sucesso", "Fracasso", "Adiamento", "Total"],
        content: content
    };
};

Table.toHTML = function(table) {
    var headers = table.headers;
    var content = table.content;

    var table = create("table");
    var tr = create("tr");
    var td;
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
