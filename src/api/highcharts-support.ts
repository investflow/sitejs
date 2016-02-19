import * as $ from "jquery";
import * as log from "loglevel";
import {getAccountInfo, AccountInfoResponse} from "./investflow-rest";
import {Broker} from "./broker";
const HIGHCHARTS_MODAL_DIV_ID = "iflow_highcharts_modal";

const HIGHCHARTS_MODAL_DIV_HTML =
    `<div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">
                        <span class="modal-title-text">Доходность счета</span>
                        <span class="txt-muted itl pl15 modal-title-profit" title="Доходность за выбранный период."></span>
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
    </div>`;

function getRangeButtons(firstEventMillis:number, lastEventMillis:number):Array<any> {
    let buttons:Array<any> = [];
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

export interface ProfitChartOptions {
    chartElementSelector: string,
    profitLabelSelector:string;
    fullAccountName:string;
    brokerId?:number
}

function deriveDecimalPrecision(profitHistory:Array<Array<number>>, minIdx?:number, maxIdx?:number):number {
    let maxValue:number = 0;
    let fromIdx = typeof minIdx === "undefined" ? 0 : minIdx;
    let toIdx = typeof  maxIdx === "undefined" ? profitHistory.length : maxIdx;
    for (let i = fromIdx; i < toIdx; i++) {
        let val = profitHistory[i][1];
        maxValue = Math.max(maxValue, val);
    }
    return maxValue > 10000 ? 0 : (maxValue < 10 ? 4 : 2);
}

function percentBetween(startValue:number, endValue:number):number {
    if (startValue <= -100) {
        return 0;
    }
    return 100 * (endValue - startValue) / (startValue + 100);
}

function getIdxBeforeOrEquals(timestamp:number, profitHistory:Array<Array<number>>):number {
    for (let i = 0; i < profitHistory.length; i++) {
        let t = profitHistory[i][0];
        if (t > timestamp) {
            return i - 1;
        }
    }
    return profitHistory.length - 1;
}

/*function selectValue(profitHistory:Array<Array<number>>, fromIdx:number, toIdx:number, fn:(n1:number, n2:number)=>number):number {
 let res = profitHistory[fromIdx][1];
 for (let i = fromIdx + 1; i < toIdx; i++) {
 res = fn(profitHistory[i][1], res);
 }
 return res;
 }*/

function updateProfitLabel($profitLabel:JQuery, profitHistory:Array<Array<number>>, startEventIdx:number, endEventIdx:number, decimals:number) {
    if ($profitLabel.length == 0) {
        return;
    }
    let startValue = profitHistory[startEventIdx][1];
    let endValue = profitHistory[endEventIdx][1];
    let change = percentBetween(startValue, endValue);
    $profitLabel.text(change.toFixed(decimals) + "%");
}

function prepareProfitChartOptions(profitHistory:Array<Array<number>>, options:ProfitChartOptions):any {
    let firstEventMillis = -1;
    let lastEventMillis = -1;
    if (profitHistory.length > 0) {
        firstEventMillis = profitHistory[0][0];
        lastEventMillis = profitHistory[profitHistory.length - 1][0];
    }
    let buttons:Array<any> = getRangeButtons(firstEventMillis, lastEventMillis);
    let vState = {
        valueDecimals: Broker.getBrokerById(options.brokerId) == Broker.MOEX ? deriveDecimalPrecision(profitHistory) : 2,
        minShownIdx: 0,
        maxShownIdx: profitHistory.length - 1,
        maxValue: undefined,
        minValue: undefined
    };
    updateProfitLabel($(options.profitLabelSelector), profitHistory, 0, profitHistory.length - 1, vState.valueDecimals);

    log.debug("decimals on chart: " + vState.valueDecimals);
    return {
        title: {
            text: "",
        },
        credits: {
            enabled: false
        },
        chart: {},
        rangeSelector: {
            allButtonsEnabled: true,
            buttons: buttons,
            selected: buttons.length - 1 // All button is active by default
        },
        tooltip: {
            xDateFormat: "%Y-%m-%d",
            //  valueSuffix: options.valueSuffix
        },
        plotOptions: {
            line: {
                color: "#0093C6",
                dataLabels: {
                    enabled: false,
                    formatter: function () {
                        //let firstX = profitHistory[vState.minShownIdx][0];
                        //let lastX = profitHistory[vState.maxShownIdx][0];
                        //let point:HighchartsPointObject = this["point"];
                        //if (point.x === firstX || point.x === lastX /*|| point.y === vState.minValue || point.y === vState.maxValue*/) {
                        //    return point.y === 0 ? 0 : point.y.toFixed(vState.valueDecimals);
                        //}
                        return "";
                    }
                }
            }
        },
        xAxis: {
            events: {
                setExtremes: function (e) {
                    if (options.profitLabelSelector) {
                        let $profitLabel = $(options.profitLabelSelector);
                        if ($profitLabel.length > 0 && typeof e.min !== "undefined" && typeof e.max !== "undefined") {
                            let startEventIdx = Math.max(0, getIdxBeforeOrEquals(e.min, profitHistory));
                            let endEventIdx = Math.max(startEventIdx, getIdxBeforeOrEquals(e.max, profitHistory));

                            updateProfitLabel($profitLabel, profitHistory, startEventIdx, endEventIdx, vState.valueDecimals);
                            //vState.minShownIdx = e.min == profitHistory[startEventIdx][0] ? startEventIdx : (startEventIdx + 1);
                            //vState.maxShownIdx = endEventIdx;
                            //vState.valueDecimals = deriveDecimalPrecision(profitHistory, vState.minShownIdx, vState.maxShownIdx + 1);
                            //vState.minValue = selectValue(profitHistory, vState.minShownIdx, vState.maxShownIdx + 1, Math.min);
                            //vState.maxValue = selectValue(profitHistory, vState.minShownIdx, vState.maxShownIdx + 1, Math.max);
                        } else {
                            $profitLabel.text("");
                        }
                    }
                }
            }
        },
        series: [{
            name: options.fullAccountName,
            data: profitHistory,
            tooltip: {
                valueDecimals: vState.valueDecimals
            },
            marker: {
                enabled: false,
                //radius: 4
            },
        }]
    };
}

function showChart(accountInfo:AccountInfoResponse) {
    // find modal window, create if not found
    let $modalDiv = $("#" + HIGHCHARTS_MODAL_DIV_ID);
    if ($modalDiv.length === 0) {
        $modalDiv = $("<div/>", {id: HIGHCHARTS_MODAL_DIV_ID}).appendTo(document.body);
    }

    // reset old window contents
    $modalDiv.empty();
    $modalDiv.append(HIGHCHARTS_MODAL_DIV_HTML);
    let fullAccountName = accountInfo.name + "/" + accountInfo.account;
    let profitLabelId = "profit_label_" + Date.now();
    $modalDiv.find(".modal-title-text").text("Доходность счета " + fullAccountName);
    $modalDiv.find(".modal-title-profit").attr("id", profitLabelId);
    $modalDiv.find(".account-url").attr("href", accountInfo.url);

    let $dialog = $modalDiv.find(".modal-dialog");
    $dialog.width(window.innerWidth * 0.8);
    $dialog.height(window.innerHeight * 0.8);

    // set new contents
    let profitHistory = accountInfo.profitHistory;
    let options = prepareProfitChartOptions(profitHistory, {
        chartElementSelector: undefined,
        fullAccountName: fullAccountName,
        profitLabelSelector: "#" + profitLabelId,
        brokerId: accountInfo.broker
    });
    options.chart.width = $dialog.width() - 30;
    options.chart.height = $dialog.height() - 30;
    let $chartEl = $modalDiv.find(".iflow-modal-chart");
    let chart = $chartEl.highcharts("StockChart", options);
    enableZoom($chartEl);

    // show modal window
    $modalDiv.find(".modal").first().modal();
}

function enableZoom($container:JQuery):void {
    let chart:any = $container.highcharts();
    chart.pointer.cmd = chart.pointer.onContainerMouseDown;
    chart.pointer.onContainerMouseDown = function (a) {
        //noinspection JSUnusedGlobalSymbols
        this.zoomX = this.zoomHor = this.hasZoom = a.shiftKey;
        this.cmd(a);
    };
}

export default {
    attachModalAccountChart: function (elementSelector:string, brokerId:number, account:string):void {
        $(elementSelector).click(function (e:Event) {
            e.preventDefault();
            getAccountInfo(brokerId, account).then((accountInfo:AccountInfoResponse)=> {
                showChart(accountInfo);
            });
        });
    },

    addAccountChart: function (profitHistory:Array<Array<number>>, options:ProfitChartOptions) {
        let highchartOptions = prepareProfitChartOptions(profitHistory, options);
        var $chartEl = $(options.chartElementSelector);
        $chartEl.highcharts("StockChart", highchartOptions);
        enableZoom($chartEl);
    }
}
