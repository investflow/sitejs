import {Broker} from "./broker";

export interface QuoteChartItem {
    account:AccountType;
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

function quotes2Series(data:string):Array<any> {
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
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
                enabled: true,
                title: {
                    text: 'Тип счета<br/><span style="font-size: 10px; color: #999; font-weight: normal">(Нажмите чтобы вкл/выкл)</span><br/> <br/> ',
                    style: {
                        fontStyle: "italic",
                        fontSize: "16px",
                        fontWeight: "normal",
                        color: "#555"
                    }
                },
                useHTML: true,
                labelFormatter: function () {
                    var s = <HighchartsSeriesObject>this;
                    var quoteItem:QuoteChartItem = s.options["quoteItem"];
                    return "<span title='" + quoteItem.account.commissionInfo + "'>" + s.name + "</span title='" + quoteItem.account.commissionInfo + "'>";
                }
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

    $.each(options.series, function (i:number, quoteItem:QuoteChartItem) {
        let processResponse = function (data) {
            var seriesData = quotes2Series(data);
            if (seriesData.length > 0) {
                seriesOptions[i] = {
                    quoteItem: quoteItem,
                    name: quoteItem.account.broker.name + " [" + quoteItem.account.name + "]",
                    data: seriesData,
                    color: "rgba(" + quoteItem.account.broker.rgb + ", 0.65)"
                };
            }
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

class AccountType {
    public static ALFAFOREX_MT4:AccountType = new AccountType(1, "MT4", Broker.ALFAFOREX, "без комиссии", "https://www.alfa-forex.ru/ru/terms/traders/specs.html");
    public static ALPARI_ECN1:AccountType = new AccountType(2, "ecn.mt4", Broker.ALPARI, "без комиссии", "http://www.alpari.ru/ru/trading/trading_terms/");
    public static AMARKETS_ECN:AccountType = new AccountType(3, "ECN", Broker.AMARKETS, "комиссия: $5 за лот", "http://www.amarkets.org/trading/usloviya_torgovli/");
    public static FOREX4YOU_CLASSIC_NDD:AccountType = new AccountType(4, "ecn.mt4", Broker.FOREX4YOU, "комиссия: $8 за лот", "http://www.forex4you.org/account/conditions/");
    public static ROBOFOREX_ECN_PRO_NDD:AccountType = new AccountType(5, "ECN-Pro NDD", Broker.ROBOFOREX, "комиссия: $20 за $1млн оборота", "http://www.roboforex.ru/trade-conditions/account-types/");
    public static WELTRADE_PRO:AccountType = new AccountType(6, "Pro", Broker.WELTRADE, "без комиссии", "https://www.instaforex.com/ru/account_types");

    constructor(public id:number, public name:string, public broker:Broker, public commissionInfo:string, public tradingInfoUrl:string) {
    }

}

export default {
    addQuoteChart: addQuoteChart,
    AccountType: AccountType
}
