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
    var behavior = NumericFilter;
    return {
        title: "Volume de tráfego",
        headers: ["Direção", "LL", "LR", "RL", "RR"],
        content: [
            ["Proporção (%)", params.LL, params.LR, params.RL, params.RR]
        ],
        edit: [null, behavior, behavior, behavior, behavior]
    };
};

Table.successRate = function() {
    var params = settings.successRate;
    var behavior = NumericFilter;
    // var totalBehavior = new AdderMacro([1, 2, 3]);
    var totalBehavior = settings.bind(AdderMacro, [1, 2, 3]);
    var content = [];
    foreach(params, function(key, value) {
        content.push([key, value.success, value.failure, value.delay, 100]);
    });
    return {
        title: "Status por direção da mensagem",
        headers: ["Direção", "Sucesso", "Fracasso", "Adiamento", "Total"],
        content: content,
        edit: [null, behavior, behavior, behavior, totalBehavior]
    };
};

Table.timeBetweenArrivals = function() {
    var params = settings.timeBetweenArrivals;
    var behavior = ExponentialFilter;
    return {
        title: "Tempo entre chegadas",
        headers: ["Origem", "TEC (seg.)"],
        content: [
            ["Local", params.local],
            ["Remota", params.remote]
        ],
        edit: [null, behavior]
    };
};

Table.serviceTimes = function() {
    var params = settings.serviceTimes;
    var behavior = StatisticFilter;
    var content = [];
    foreach(params, function(key, value) {
        content.push([key, value.reception, value.serviceCenter]);
    });
    return {
        title: "Tempos de serviço (seg.)",
        headers: ["Tipo de Proc.", "Recepção", "Centro de Serviço"],
        content: content,
        edit: [null, behavior, behavior]
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

function prepareCell(td, content, behavior) {
    if (behavior instanceof Filter) {
        var input = create("input");
        input.type = "text";
        input.value = content;
        input.classList.add(behavior.css);
        td.appendChild(input);
    } else {
        td.innerHTML = content;
    }
}

var counter = 0;
function uniqueID() {
    return ++counter;
}

function attachEvent(td, behavior) {
    if (!settings.events.hasOwnProperty(td.id)) {
        settings.events[td.id] = [];
    }
    settings.events[td.id].push(behavior);
}

function attachRedirectEvent(td, target) {
    if (!settings.events.hasOwnProperty(td.id)) {
        settings.events[td.id] = [];
    }
    settings.events[td.id].push(target);
}

function getValue(td) {
    if (td.childElementCount > 0) {
        return td.children[0].value;
    }
    return td.innerHTML;
}

function callEvents(td) {
    var events = settings.events;
    if (events.hasOwnProperty(td.id)) {
        var list = events[td.id];
        for (var i = 0; i < list.length; i++) {
            var event = list[i];
            if (event instanceof Filter) {
                console.log("Filter");
            } else if (event instanceof Macro) {
                var params = event.params;
                var values = [];
                for (var i = 0; i < params.length; i++) {
                    values.push(getValue(params[i]));
                }
                td.innerHTML = event.call(values);
            } else {
                // event is a <td>, so call its events
                callEvents(event);
            }
        }
    }
}

function bindBehaviorEvent(td, behavior, row) {
    td.id = uniqueID();
    attachEvent(td, behavior);
    if (behavior instanceof Macro) {
        behavior.setParams(row);
        for (var i = 0; i < row.length; i++) {
            // changes to row[i] trigger events on td
            attachRedirectEvent(row[i], td);
        }
    } else if (behavior instanceof Filter) {
        td.children[0].addEventListener("keyup", function() {
            callEvents(td);
        });
    }
}

Table.toHTML = function(info) {
    var table = create("table");
    prepareTitle(info.title, table, info.headers.length);
    prepareHeaders(info.headers, table);

    var content = info.content;
    for (var i = 0; i < content.length; i++) {
        var tr = create("tr");
        var cells = [];
        for (var j = 0; j < content[i].length; j++) {
            var td = create("td");
            var behavior = null;
            if (info.edit[j] !== null) {
                behavior = new info.edit[j]();
            }

            prepareCell(td, content[i][j], behavior);
            // bindContent(content[i][j], td);
            bindBehaviorEvent(td, behavior, cells);
            cells.push(td);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;
};

window.Table = Table;

})();
