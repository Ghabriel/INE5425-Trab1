(function() {
"use strict";

var Table = {};
var settings = Settings;
var foreach = settings.foreach;

function create(tag) {
    return document.createElement(tag);
}

Table.trafficDistribution = function() {
    var params = settings.trafficDistribution;
    var filter = new NumericFilter();
    return {
        title: "Volume de tráfego",
        headers: ["Direção", "LL", "LR", "RL", "RR"],
        content: [
            ["Proporção (%)", params.LL, params.LR, params.RL, params.RR]
        ],
        edit: [null, filter, filter, filter, filter]
    };
};

Table.successRate = function() {
    var params = settings.successRate;
    var filter = new NumericFilter();
    var content = [];
    foreach(params, function(key, value) {
        content.push([key, value.success, value.failure, value.delay, 100]);
    });
    return {
        title: "Status por direção da mensagem",
        headers: ["Direção", "Sucesso", "Fracasso", "Adiamento", "Total"],
        content: content,
        edit: [null, filter, filter, filter, null]
    };
};

Table.timeBetweenArrivals = function() {
    var params = settings.timeBetweenArrivals;
    var filter = new ExponentialFilter();
    return {
        title: "Tempo entre chegadas",
        headers: ["Origem", "TEC (seg.)"],
        content: [
            ["Local", params.local],
            ["Remota", params.remote]
        ],
        edit: [null, filter]
    };
};

Table.serviceTimes = function() {
    var params = settings.serviceTimes;
    var filter = new StatisticFilter();
    var content = [];
    foreach(params, function(key, value) {
        content.push([key, value.reception, value.serviceCenter]);
    });
    return {
        title: "Tempos de serviço (seg.)",
        headers: ["Tipo de Proc.", "Recepção", "Centro de Serviço"],
        content: content,
        edit: [null, filter, filter]
    };
};

function prepareTitle(title, table, colSpan) {
    var tr = create("tr");
    tr.classList.add("header");

    var td = create("td");
    td.innerHTML = title;
    td.colSpan = colSpan;
    tr.appendChild(td);
    table.appendChild(tr);
}

function prepareHeaders(headers, table) {
    var tr = create("tr");
    tr.classList.add("header");
    for (var i = 0; i < headers.length; i++) {
        var td = create("td");
        td.innerHTML = headers[i];
        tr.appendChild(td);
    }
    table.appendChild(tr);
}

function prepareCell(td, content, filter) {
    if (filter !== null) {
        var input = create("input");
        input.type = "text";
        input.value = content;
        input.classList.add(filter.css);
        td.appendChild(input);
    } else {
        td.innerHTML = content;
    }
}

function bindEditEvent(filter, td) {
    if (filter !== null) {
        // TODO: bind filter to td
    }
}

Table.toHTML = function(info) {
    var table = create("table");
    prepareTitle(info.title, table, info.headers.length);
    prepareHeaders(info.headers, table);

    var content = info.content;
    for (var i = 0; i < content.length; i++) {
        var tr = create("tr");
        for (var j = 0; j < content[i].length; j++) {
            var td = create("td");
            prepareCell(td, content[i][j], info.edit[j]);
            // bindContent(content[i][j], td);
            bindEditEvent(info.edit[j], td);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;
};

window.Table = Table;

})();
