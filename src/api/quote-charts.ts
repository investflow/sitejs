import {Broker} from "./broker";

export interface QuoteChartItem {
    broker:Broker;
    dataUrl:string;
}

export interface  QuoteChartOptions {
    series:Array<QuoteChartItem>;
    zoomInControlSelector?:string;
    zoomOutControlSelector?:string;
    zoomResetControlSelector?:string;
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

function zoomOut(chart, rangeK) {
    var axis = chart.xAxis[0];
    var extremes = axis.getExtremes();
    var visibleRange = axis.max - axis.min;
    axis.setExtremes(Math.max(axis.min - visibleRange * rangeK, extremes.dataMin), Math.min(axis.max + visibleRange * rangeK, extremes.dataMax));
}

function zoomIn(chart, rangeK) {
    var axis = chart.xAxis[0];
    var visibleRange = axis.max - axis.min;
    if (visibleRange <= 1000) {
        return;
    }
    axis.setExtremes(axis.min + visibleRange * rangeK, axis.max - visibleRange * rangeK);
}

function addQuoteChart(chartSelector, options:QuoteChartOptions) {

    var seriesOptions = [];
    var seriesCounter = 0;

    function createChart() {
        var $chart = $(chartSelector);
        $chart.highcharts('StockChart', {
            chart: {
                type: 'arearange',
                animation: false,
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

        if (options.zoomResetControlSelector) {
            $(options.zoomResetControlSelector).click(function () {
                var chart = $(chartSelector).highcharts();
                var axis = chart.xAxis[0];
                var extremes = axis.getExtremes();
                axis.setExtremes(extremes.dataMin, extremes.dataMax);
            });
        }

        if (options.zoomInControlSelector) {
            $(options.zoomInControlSelector).click(function () {
                var chart = $(chartSelector).highcharts();
                zoomIn(chart, 0.25)
            });
        }
        if (options.zoomOutControlSelector) {
            $(options.zoomOutControlSelector).click(function () {
                var chart = $(chartSelector).highcharts();
                zoomOut(chart, 0.25)
            });
        }

        $chart.each(function (idx, chartEl) {
            function MouseWheelHandler(event) {
                var e:MouseWheelEvent = <MouseWheelEvent>(window.event || event);
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                var chart = $(chartSelector).highcharts();
                if (delta > 0) {
                    zoomOut(chart, 0.1);
                } else if (delta < 0) {
                    zoomIn(chart, 0.1);
                }
            }

            if (chartEl.addEventListener) {
                // IE9, Chrome, Safari, Opera
                chartEl.addEventListener("mousewheel", MouseWheelHandler, false);
                // Firefox
                chartEl.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
            }
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
