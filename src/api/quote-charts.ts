import {Broker} from "./broker";

export interface QuoteChartItem {
    broker:Broker;
    dataUrl:string;
}

export interface  QuoteChartOptions {
    series:Array<QuoteChartItem>;
}

function parseDate(str:string):Date {
    let date = new Date();
    let hourEnd = str.indexOf(":");
    let minuteEnd = str.indexOf(":", hourEnd + 1);
    let secondEnd = str.indexOf(".", minuteEnd + 1);
    date.setHours(parseInt(str.substr(0, hourEnd)));
    date.setMinutes(parseInt(str.substr(hourEnd + 1, minuteEnd)));
    date.setSeconds(parseInt(str.substr(minuteEnd + 1, secondEnd)));
    date.setMilliseconds(parseInt(str.substr(secondEnd + 1)));
    return date;
}

function quotes2Series(data:string) {
    let lines = data.split("\n");
    let series = [];

    for (var i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.length == 0 || line.indexOf("Time") >= 0 || line.indexOf("#") == 0) {
            continue
        }
        let tokens = line.trim().split(",");
        let date = parseDate(tokens[0]);
        let bid = parseFloat(tokens[1]);
        let ask = parseFloat(tokens[2]);
        series.push([date.getTime(), bid, ask]);
    }
    return series;
}

function addQuoteChart(chartSelector, options:QuoteChartOptions) {

    var seriesOptions = [];
    var seriesCounter = 0;

    function createChart() {
        $(chartSelector).highcharts('StockChart', {
            chart: {
                type: 'arearange'
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                enabled: true,
            },
            exporting: {
                enabled: true,
            },
            rangeSelector: {
                selected: 4,
                inputEnabled: false,
                buttonTheme: {
                    visibility: 'hidden'
                },
                labelStyle: {
                    visibility: 'hidden'
                }
            },
            xAxis: {
                ordinal: false,
            },
            series: seriesOptions
        });
    }

    $.each(options.series, function (i, quoteItem) {
        let processResponse = function (data) {
            var seriesData = quotes2Series(data);
            seriesOptions[i] = {
                name: quoteItem.broker.name,
                data: seriesData,
                color: "rgba(" + quoteItem.broker.rgb + ", 0.65)"
            };
            seriesCounter += 1;
            if (seriesCounter === options.series.length) {
                createChart();
            }
        };

        $.ajax(quoteItem.dataUrl, {
            crossDomain: true,
            contentType: "text/plain; charset=utf-8",
            success: function (data) {
                processResponse(data);
            },
            error: function () {
                processResponse("");
            }
        });
    });
}

export default {
    addQuoteChart: addQuoteChart
}
