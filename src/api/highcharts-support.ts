import * as $ from "jquery";
import * as log from "loglevel";
import {getAccountInfo, AccountInfoResponse} from "./investflow-rest";

const HIGHCHARTS_MODAL_DIV_ID = "iflow_highcharts_modal";

const HIGHCHARTS_MODAL_DIV_HTML =
    `<div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Доходность счета</h4>
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
export interface IProfitChartOptions {
    fullAccountName:string,
    valueSuffix:string;
}

export class ProfitChartOptions implements IProfitChartOptions {
    //noinspection JSUnusedLocalSymbols
    constructor(public fullAccountName:string, public valueSuffix = "") {
    }
}

function deriveDecimalPrecision(profitHistory:Array<Array<number>>):number {
    let maxValue:number = 0;
    for (let i = 0; i < profitHistory.length; i++) {
        let val = profitHistory[i][1];
        maxValue = Math.max(maxValue, val);
    }
    return maxValue > 10000 ? 0 : (maxValue < 10 ? 4 : 2);
}

function prepareProfitChartOptions(profitHistory:Array<Array<number>>, options:IProfitChartOptions):any {
    let firstEventMillis = -1;
    let lastEventMillis = -1;
    if (profitHistory.length > 0) {
        firstEventMillis = profitHistory[0][0];
        lastEventMillis = profitHistory[profitHistory.length - 1][0];
    }
    let buttons:Array<any> = getRangeButtons(firstEventMillis, lastEventMillis);
    let valueDecimals = deriveDecimalPrecision(profitHistory);
    log.debug("decimals on chart: " + valueDecimals);
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
            valueSuffix: options.valueSuffix
        },
        plotOptions: {
            line: {
                //dataLabels: {
                //    format: "{point.y:." + valueDecimals + "f}",
                //    enabled: true
                //}
            }
        },
        series: [{
            name: options.fullAccountName,
            data: profitHistory,
            tooltip: {
                valueDecimals: valueDecimals
            }
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
    $modalDiv.find(".modal-title").text("Доходность счета " + fullAccountName);
    $modalDiv.find(".account-url").attr("href", accountInfo.url);

    var $dialog = $modalDiv.find(".modal-dialog");
    $dialog.width(window.innerWidth * 0.8);
    $dialog.height(window.innerHeight * 0.8);

    // set new contents
    var profitHistory = accountInfo.profitHistory;
    var options = prepareProfitChartOptions(profitHistory, new ProfitChartOptions(fullAccountName));
    options.chart.width = $dialog.width() - 30;
    options.chart.height = $dialog.height() - 30;
    $modalDiv.find(".iflow-modal-chart").highcharts("StockChart", options);

    // show modal window
    $modalDiv.find(".modal").first().modal();
}
export default {
    attachModalAccountChart: function (elementSelector:string, brokerId:number, account:string):void {
        $(elementSelector).click(function (e:Event) {
            e.preventDefault();
            getAccountInfo(brokerId, account).then((accountInfo:AccountInfoResponse)=> {
                    showChart(accountInfo);
                }
            );
        });
    },

    addAccountChart: function (elementSelector:string, accountName:string, profitHistory:Array<Array<number>>) {
        var options = new ProfitChartOptions(accountName);
        var highchartOptions = prepareProfitChartOptions(profitHistory, options);
        $(elementSelector).highcharts("StockChart", highchartOptions);
    }
}
