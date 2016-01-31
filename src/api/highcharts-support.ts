import * as $ from "jquery";
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
    let options = {
        title: {
            text: "",
        },
        credits: {
            enabled: false
        },
        chart: {
            width: $dialog.width() - 30,
            height: $dialog.height() - 30
        },
        rangeSelector: {
            allButtonsEnabled: true,
            selected: 5 // All button
        },
        tooltip: {
            xDateFormat: "%Y-%m-%d",
            valueSuffix: "%"
        },
        plotOptions: {
            line: {
                dataLabels: {
                    format: "{point.y:.2f}%",
                    enabled: true
                }
            }
        },
        series: [{
            name: fullAccountName,
            data: profitHistory,
            tooltip: {
                valueDecimals: 2
            }
        }]
    };

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
    }
}
