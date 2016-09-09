import {Broker} from "./broker";

export interface QuoteChartItem {
    account: AccountType;
    dataUrl: string;
}

export interface  QuoteChartOptions {
    series: Array<QuoteChartItem>;
    zoomInControlSelector?: string;
    zoomOutControlSelector?: string;
    zoomResetControlSelector?: string;
    summaryBlockSelector?: string;
}

function parseDate(str: string, hourDate: Date): Date {
    let date = new Date(hourDate.getTime());
    let hourEnd = str.indexOf(":");
    let minuteEnd = str.indexOf(":", hourEnd + 1);
    let secondEnd = str.indexOf(".", minuteEnd + 1);
    date.setMinutes(parseInt(str.substr(hourEnd + 1, minuteEnd)));
    date.setSeconds(parseInt(str.substr(minuteEnd + 1, secondEnd)));
    date.setMilliseconds(parseInt(str.substr(secondEnd + 1)));
    return date;
}

function quotes2Series(data: string, hourDate: Date): Array<any> {
    let lines = data.split("\n");
    let series = [];

    for (var i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.length == 0 || line.indexOf("Time") >= 0 || line.indexOf("#") == 0) {
            continue
        }
        let tokens = line.trim().split(",");
        let date = parseDate(tokens[0], hourDate);
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
    const dataMin = Math.max(axis.min - visibleRange * rangeK, extremes.dataMin);
    const dataMax = Math.min(axis.max + visibleRange * rangeK, extremes.dataMax);
    axis.setExtremes(dataMin, dataMax);
}

function zoomIn(chart, rangeK, zoomingPos) {
    var axis = chart.xAxis[0];
    var visibleRange = axis.max - axis.min;
    if (visibleRange <= 1000) {
        return;
    }
    const dataCenter = axis.min + (axis.max - axis.min) * zoomingPos;
    const zoomLeft = (dataCenter - axis.min) * rangeK;
    const zoomRight = (axis.max - dataCenter) * rangeK;
    const dataMin = axis.min + zoomLeft;
    const dataMax = axis.max - zoomRight;
    axis.setExtremes(dataMin, dataMax);
}

function resetZoom(chart) {
    var axis = chart.xAxis[0];
    var extremes = axis.getExtremes();
    axis.setExtremes(extremes.dataMin, extremes.dataMax);
}


function dateFromUrl(dataUrl: string): Date {
    //todo: fix this hack with parsing & TZ
    let yearStart = dataUrl.indexOf("_2") + 1;
    let monthStart = dataUrl.indexOf("_", yearStart + 1) + 1;
    let dayStart = dataUrl.indexOf("_", monthStart + 1) + 1;
    let hourStart = dataUrl.indexOf("_", dayStart + 1) + 1;
    if (hourStart <= 0) {
        return new Date();
    }
    let year = dataUrl.substr(yearStart, 4);
    let month = dataUrl.substr(monthStart, dayStart - monthStart - 1);
    let day = dataUrl.substr(dayStart, hourStart - dayStart - 1);
    let hour = dataUrl.substr(hourStart);
    let utcMillis = Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour));

    return new Date(utcMillis + 3 * 60 * 60 * 1000); //TODO: hack: MSK TZ
}

function addQuoteChart(chartSelector, options: QuoteChartOptions) {

    var seriesOptions = [];
    var seriesCounter = 0;

    function createChart() {
        var $chart = $(chartSelector);
        $chart.highcharts('StockChart', {
            chart: {
                type: 'arearange',
                animation: false,
                marginLeft: 0
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
                    var quoteItem: QuoteChartItem = s.options["quoteItem"];
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
                resetZoom($(chartSelector).highcharts());
            });
        }

        if (options.zoomInControlSelector) {
            $(options.zoomInControlSelector).click(function () {
                zoomIn($(chartSelector).highcharts(), 0.25, 0.5)
            });
        }
        if (options.zoomOutControlSelector) {
            $(options.zoomOutControlSelector).click(function () {
                zoomOut($(chartSelector).highcharts(), 0.25)
            });
        }

        $chart.each(function (idx, chartEl) {
            function MouseWheelHandler(event) {
                var e: MouseWheelEvent = <MouseWheelEvent>(window.event || event);
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                var chart = $(chartSelector).highcharts();
                if (delta > 0) {
                    zoomOut(chart, 0.1);
                } else if (delta < 0) {
                    var $chart = $(chartSelector);
                    var chart = $chart.highcharts();
                    var plotClientX = e.clientX - $chart.offset().left;
                    var zoomingPos = plotClientX > chart.plotWidth ? 0.5 : plotClientX / chart.plotWidth;
                    zoomIn(chart, 0.1, zoomingPos);
                }
                e.preventDefault();
            }

            if (chartEl.addEventListener) {
                // IE9, Chrome, Safari, Opera
                chartEl.addEventListener("mousewheel", MouseWheelHandler, false);
                // Firefox
                chartEl.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

                chartEl.addEventListener("dblclick", function () {
                    resetZoom($(chartSelector).highcharts())
                }, false);
            }
        });

    }

    var reportTemplate = <string>require("./quote-report.html");

    function createSummary() {
        if (!options.summaryBlockSelector) {
            return;
        }
        var $reportBlock = $(options.summaryBlockSelector);
        if ($reportBlock.length == 0) {
            return;
        }
        var html = Mustache.render(reportTemplate, {});
        $reportBlock.append(html);
    }

    $.each(options.series, function (i: number, quoteItem: QuoteChartItem) {
        let processResponse = function (data, hourDate: Date) {
            var seriesData = quotes2Series(data, hourDate);
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
                createSummary();
            }
        };

        let hourDate = dateFromUrl(quoteItem.dataUrl);
        $.ajax(quoteItem.dataUrl, {
            crossDomain: true,
            contentType: "text/plain; charset=utf-8",
            success: function (data) {
                processResponse(data, hourDate);
            },
            error: function () {
                processResponse("", hourDate);
            }
        });
    });
}

class AccountType {
    public static ALFAFOREX_MT4: AccountType = new AccountType(1, "MT4", Broker.ALFAFOREX, "без комиссии", "https://www.alfa-forex.ru/ru/terms/traders/specs.html");
    public static ALPARI_ECN1: AccountType = new AccountType(2, "ecn.mt4", Broker.ALPARI, "без комиссии", "http://www.alpari.ru/ru/trading/trading_terms/");
    public static AMARKETS_ECN: AccountType = new AccountType(3, "ECN", Broker.AMARKETS, "комиссия: $5 за лот", "http://www.amarkets.org/trading/usloviya_torgovli/");
    public static FOREX4YOU_CLASSIC_NDD: AccountType = new AccountType(4, "ecn.mt4", Broker.FOREX4YOU, "комиссия: $8 за лот", "http://www.forex4you.org/account/conditions/");
    public static ROBOFOREX_ECN_PRO_NDD: AccountType = new AccountType(5, "ECN-Pro NDD", Broker.ROBOFOREX, "комиссия: $20 за $1млн оборота", "http://www.roboforex.ru/trade-conditions/account-types/");
    public static WELTRADE_PRO: AccountType = new AccountType(6, "Pro", Broker.WELTRADE, "без комиссии", "https://www.instaforex.com/ru/account_types");

    constructor(public id: number, public name: string, public broker: Broker, public commissionInfo: string, public tradingInfoUrl: string) {
    }

}

export default {
    addQuoteChart: addQuoteChart,
    AccountType: AccountType
}
