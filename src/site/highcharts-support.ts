import * as $ from "jquery";
import {percentBetweenPercents, percentBetweenEquity} from "./calc";
import {getAccountInfo, AccountInfoResponse} from "./investflow-api";
import t from "./transliterate";
import {Broker} from "./broker";

const HIGHCHARTS_MODAL_DIV_ID = "iflow_highcharts_modal";

var localizationInstalled = false;

function getRangeButtons(firstEventMillis: number, lastEventMillis: number): Array<any> {
    let buttons: Array<any> = [];
    let millisPerMonth = 30 * 24 * 60 * 60 * 1000;
    let rangeMillis = lastEventMillis - firstEventMillis;

    if (rangeMillis >= millisPerMonth) {
        buttons.push({type: "month", count: 1, text: "1м"});
    }
    if (rangeMillis >= 3 * millisPerMonth) {
        buttons.push({type: "month", count: 3, text: "3м"});
    }
    if (rangeMillis >= 6 * millisPerMonth) {
        buttons.push({type: "month", count: 6, text: "6м"});
    }
    if (rangeMillis >= millisPerMonth) {
        buttons.push({type: "ytd", text: "YTD"});
    }
    if (rangeMillis >= 12 * millisPerMonth) {
        buttons.push({type: "year", count: 1, text: "Год"});
    }
    buttons.push({type: "all", count: 1, text: "Все"});
    return buttons;
}

export interface AccountChartOptions {
    profitData: Array<Array<number>>,
    balanceData?: Array<Array<number>>,
    equityData?: Array<Array<number>>,
    chartElementSelector: string,
    profitLabelSelector: string;
    fullAccountName: string;
    broker?: number,
    currencySuffix?: string,
    currencyPrefix?: string,
    exportFileName?: string
}

function emptyIfNull(val: string): string {
    return val ? val : "";
}

function getDefaultLabelDecimalsForPercent(val: number) {
    return val > 1000 ? 0 : val > 100 ? 1 : 2;
}

var illegalRe = /[\/\?<>\\:\*\|"]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
function toSafeFileName(s: string): string {
    console.log("s: " + s);
    var r = s.replace(illegalRe, '_').replace(controlRe, '_').replace(reservedRe, '_');
    r = t.transliterate(r);
    r = r.replace(/[^\w]/gi, '_');
    console.log("r: " + r);
    return r;
}

function deriveDecimalPrecision(profitData: Array<Array<number>>, minIdx?: number, maxIdx?: number): number {
    let maxValue: number = 0;
    let fromIdx = typeof minIdx === "undefined" ? 0 : minIdx;
    let toIdx = typeof  maxIdx === "undefined" ? profitData.length : maxIdx;
    for (let i = fromIdx; i < toIdx; i++) {
        let val = profitData[i][1];
        maxValue = Math.max(maxValue, val);
    }
    return maxValue > 10000 ? 0 : (maxValue < 10 ? 4 : 2);
}

function getIdxBeforeOrEquals(timestamp: number, profitData: Array<Array<number>>): number {
    for (let i = 0; i < profitData.length; i++) {
        let t = profitData[i][0];
        if (t > timestamp) {
            return i - 1;
        }
    }
    return profitData.length - 1;
}

/*function selectValue(profitData:Array<Array<number>>, fromIdx:number, toIdx:number, fn:(n1:number, n2:number)=>number):number {
 let res = profitData[fromIdx][1];
 for (let i = fromIdx + 1; i < toIdx; i++) {
 res = fn(profitData[i][1], res);
 }
 return res;
 }*/

function updateProfitLabel($profitLabel: JQuery, profitData: Array<Array<number>>, startEventIdx: number, endEventIdx: number, valueDecimals: number, options: AccountChartOptions) {
    if ($profitLabel.length == 0) {
        return;
    }

    let startValue = profitData[startEventIdx][1];
    let endValue = profitData[endEventIdx][1];

    let broker = Broker.getBrokerById(options.broker);
    let text;
    if (broker.isPercentBasedPrice()) {
        let change = percentBetweenPercents(startValue, endValue);
        const decimals = getDefaultLabelDecimalsForPercent(change);
        text = (change > 0 ? "+" : "") + change.toFixed(decimals) + "%";
    } else {
        let percentChange = percentBetweenEquity(startValue, endValue);
        let valueChange = endValue - startValue;
        const percentDecimals = getDefaultLabelDecimalsForPercent(percentChange);
        text = (valueChange > 0 ? "+" : "") + emptyIfNull(options.currencyPrefix) + valueChange.toFixed(valueDecimals) + emptyIfNull(options.currencySuffix)
            + " или " + (percentChange > 0 ? "+" : "") + percentChange.toFixed(percentDecimals) + "%";
    }
    $profitLabel.text(text);
}

function prepareAccountProfitChartOptions(options: AccountChartOptions): any {
    ensureLocalizationIsInstalled();
    let firstEventMillis = -1;
    let lastEventMillis = -1;
    let profitData = options.profitData;
    if (profitData.length > 0) {
        firstEventMillis = profitData[0][0];
        lastEventMillis = profitData[profitData.length - 1][0];
    }
    let buttons: Array<any> = getRangeButtons(firstEventMillis, lastEventMillis);
    var broker = Broker.getBrokerById(options.broker);
    let vState = {
        valueDecimals: broker.isPercentBasedPrice() ? deriveDecimalPrecision(profitData) : 2,
        minShownIdx: 0,
        maxShownIdx: profitData.length - 1,
        maxValue: undefined,
        minValue: undefined
    };
    updateProfitLabel($(options.profitLabelSelector), profitData, 0, profitData.length - 1, vState.valueDecimals, options);

    var cp = emptyIfNull(options.currencyPrefix);
    var cs = emptyIfNull(options.currencySuffix);
    var hasEquity = options.equityData && options.equityData.length > 0;
    var hasBalance = options.balanceData && options.balanceData.length > 0;
    const hasEquityOrBalance = hasEquity || hasBalance;

    let profitChartColor = "#00854E";
    var res = {
        credits: {
            enabled: false
        },
        chart: {
            marginBottom: hasEquityOrBalance ? 40 : 0
        },
        legend: {
            enabled: hasEquityOrBalance,
            align: "center",
            layout: "horizontal",
        },
        rangeSelector: {
            allButtonsEnabled: true,
            buttons: buttons,
            selected: buttons.length - 1 // All button is active by default
        },
        navigator: {
            maskFill: "rgba(0, 0, 0, 0.1)",
            series: {
                color: profitChartColor,
            }
        },
        exporting: {
            filename: options.exportFileName ? options.exportFileName : toSafeFileName(options.fullAccountName),
            buttons: {
                contextButton: {
                    align: "right",
                    // y: 20
                }
            },
            scale: 2,
        },
        tooltip: {
            xDateFormat: "%Y-%m-%d",
            shared: true,
            useHtml: true,
            formatter: function () {
                var s = "<span style='font-size: 10px'>" + Highcharts.dateFormat("%Y-%m-%d", this.x) + "</span><br/>";
                $.each(this.points, function () {
                    //noinspection TypeScriptUnresolvedVariable
                    var to = this.series.tooltipOptions;
                    var val = to.valuePrefix + this.point.y.toFixed(to.valueDecimals !== "undefined" ? to.valueDecimals : 2) + to.valueSuffix;
                    s += `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${val}</b><br/>`
                });

                return s;
            }
        },
        plotOptions: {
            line: {
                color: profitChartColor,
                dataLabels: {
                    enabled: false,
                    formatter: function () {
                        return "";
                    }
                }
            }
        },
        yAxis: [],
        xAxis: {
            ordinal: false,
            events: {
                setExtremes: function (e) {
                    if (options.profitLabelSelector) {
                        let $profitLabel = $(options.profitLabelSelector);
                        if ($profitLabel.length > 0 && typeof e.min !== "undefined" && typeof e.max !== "undefined") {
                            let startEventIdx = Math.max(0, getIdxBeforeOrEquals(e.min, profitData));
                            let endEventIdx = Math.max(startEventIdx, getIdxBeforeOrEquals(e.max, profitData));

                            updateProfitLabel($profitLabel, profitData, startEventIdx, endEventIdx, vState.valueDecimals, options);
                        } else {
                            $profitLabel.text("");
                        }
                    }
                }
            }
        },
        series: []
    };

    //profit chart
    var profitPrefix = cp;
    var profitSuffix = broker.isPercentBasedPrice() ? "%" : cs;
    res.series.push({
        name: broker.isPercentBasedPrice() ? "Доходность" : "Стоимость",
        data: profitData,
        color: profitChartColor,
        lineWidth: 3,
        tooltip: {
            valueDecimals: vState.valueDecimals,
            valuePrefix: profitPrefix,
            valueSuffix: profitSuffix
        },
        marker: {
            enabled: false,
        },
        yAxis: 0,
        zIndex: 10
    });
    res.yAxis.push({
        labels: {
            format: profitPrefix + "{value}" + profitSuffix,
            style: {
                color: hasEquityOrBalance ? profitChartColor : "#333333"
            }
        },
        maxPadding: 0.05
    });

    if (hasEquityOrBalance) {
        res.yAxis.push({
            min: 0,
            maxPadding: 0.05,
            labels: {
                style: {
                    color: "#5b81a4"
                }
            }
        });
    }
    if (hasBalance) {
        //balanceData chart
        res.series.push({
            name: "Баланс",
            color: "#9cb3c9",
            data: options.balanceData,
            marker: {
                enabled: false,
            },
            tooltip: {
                valuePrefix: cp,
                valueSuffix: cs,
            },
            yAxis: res.yAxis.length - 1,
            zIndex: 1
        });
    }
    if (hasEquity) {
        res.series.push({
            name: "Средства",
            color: "#5b81a4",
            data: options.equityData,
            marker: {
                enabled: false,
            },
            tooltip: {
                valuePrefix: cp,
                valueSuffix: cs,
            },
            yAxis: res.yAxis.length - 1,
            zIndex: 2
        });
    }
    return res;
}

function ensureLocalizationIsInstalled() {
    if (localizationInstalled) {
        return;
    }
    localizationInstalled = true;
    let langObject: HighchartsLangObject = {
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        weekdays: ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        printChart: "Отправить на печать",
        downloadPNG: 'Сохранить в формате PNG',
        downloadJPEG: 'Сохранить в формате JPEG',
        downloadPDF: 'Сохранить в формате PDF',
        downloadSVG: 'Сохранить в формате SVG',
        loading: 'Загрузка...',
        rangeSelectorZoom: "Период",
        rangeSelectorFrom: "с",
        rangeSelectorTo: "по"
    };
    let options: any = {lang: langObject};
    Highcharts.setOptions(options);
}
function showChart(accountInfo: AccountInfoResponse) {
    // find modal window, create if not found
    let $modalDiv = $("#" + HIGHCHARTS_MODAL_DIV_ID);
    if ($modalDiv.length === 0) {
        $modalDiv = $("<div/>", {id: HIGHCHARTS_MODAL_DIV_ID}).appendTo(document.body);
    }

    // reset old window contents
    $modalDiv.empty();
    var broker = Broker.getBrokerById(accountInfo.broker);
    const percentBasedPrice = broker.isPercentBasedPrice();
    var titleAttr = percentBasedPrice ? "Доходность за выбранный период." : "Изменение стоимости за выбранный период.";
    $modalDiv.append(`<div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">
                        <span class="modal-title-text"></span><span class="txt-muted itl pl15 modal-title-profit" title="${titleAttr}"></span>
                    </h4>
                </div>
                <div class="modal-body">
                    <div class="iflow-modal-chart"></div>
                </div>
                <div class="modal-footer">
                    <a class="btn btn-success account-url" target="_blank" >Страница счета</a>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                 </div>
            </div>
        </div>
    </div>`);
    let fullAccountName = accountInfo.name + "/" + accountInfo.account;
    let profitLabelId = "profit_label_" + Date.now();
    const headerText = (percentBasedPrice ? "Доходность счета «" + fullAccountName + "»" : "Изменение стоимости «" + fullAccountName + "»") + " за выбранный период: ";
    $modalDiv.find(".modal-title-text").text(headerText);
    $modalDiv.find(".modal-title-profit").attr("id", profitLabelId);
    $modalDiv.find(".account-url").attr("href", accountInfo.url);

    let $dialog = $modalDiv.find(".modal-dialog");
    $dialog.width(window.innerWidth * 0.8);
    $dialog.height(window.innerHeight * 0.8);

    // set new contents
    let options = prepareAccountProfitChartOptions({
        profitData: accountInfo.profitData,
        balanceData: accountInfo.balanceData,
        equityData: accountInfo.equityData,
        currencyPrefix: accountInfo.currencyPrefix,
        currencySuffix: accountInfo.currencySuffix,
        chartElementSelector: undefined,
        fullAccountName: fullAccountName,
        profitLabelSelector: "#" + profitLabelId,
        broker: accountInfo.broker
    });
    options.chart.width = $dialog.width() - 30;
    options.chart.height = $dialog.height() - 30;
    let $chartEl = $modalDiv.find(".iflow-modal-chart");
    let chart = $chartEl.highcharts("StockChart", options);
    enableZoom($chartEl);

    // show modal window
    $modalDiv.find(".modal").first().modal();
}

function enableZoom($container: JQuery): void {
    let chart: any = $container.highcharts();
    //noinspection TypeScriptUnresolvedVariable
    chart.pointer.cmd = chart.pointer.onContainerMouseDown;
    //noinspection TypeScriptUnresolvedVariable
    chart.pointer.onContainerMouseDown = function (a) {
        //noinspection JSUnusedGlobalSymbols
        this.zoomX = this.zoomHor = this.hasZoom = a.shiftKey;
        this.cmd(a);
    };
}

export default {
    attachModalAccountChart: function (elementSelector: string, broker: number, account: string): void {
        $(elementSelector).click(function (e: Event) {
            e.preventDefault();
            getAccountInfo(broker, account).then((accountInfo: AccountInfoResponse)=> {
                showChart(accountInfo);
            });
        });
    },

    addAccountChart: function (options: AccountChartOptions) {
        let highchartOptions = prepareAccountProfitChartOptions(options);
        var $chartEl = $(options.chartElementSelector);
        $chartEl.highcharts("StockChart", highchartOptions);
        enableZoom($chartEl);
    }
}
