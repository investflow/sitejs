import * as $ from "jquery";

const HIGHCHARTS_MODAL_DIV_ID = "iflow_highcharts_modal";

const HIGHCHARTS_MODAL_DIV_HTML = `<div class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Modal title</h4>
            </div>
            <div class="modal-body">
                <div class="iflow-modal-chart"></div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
            </div>
            </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
            </div><!-- /.modal -->`;

function attachModalAccountChart(elementSelector:string, accountKey:string):void {
    $(elementSelector).click(function (e:Event) {
        // find modal window, create if not found
        let $modalDiv = $("#" + HIGHCHARTS_MODAL_DIV_ID);
        if ($modalDiv.length === 0) {
            $modalDiv = $("<div/>", {id: HIGHCHARTS_MODAL_DIV_ID}).appendTo(document.body);
        }

        // reset old window contents
        $modalDiv.empty();
        $modalDiv.append(HIGHCHARTS_MODAL_DIV_HTML);

        // set new contents
        let options = {
            rangeSelector: {
                selected: 1
            },
            title: {
                text: accountKey
            },
            series: [{
                name: 'STOCK',
                data: [[
                    [1233532800000, 13.07],
                    [1233619200000, 13.28],
                    [1233705600000, 13.36],
                    [1233792000000, 13.78],
                    [1233878400000, 14.25],
                    [1234137600000, 14.64],
                    [1234224000000, 13.98],
                    [1234310400000, 13.83],
                    [1234396800000, 14.18],
                    [1234483200000, 14.17],
                    [1234828800000, 13.50],
                    [1234915200000, 13.48],
                    [1235001600000, 12.95],
                    [1235088000000, 13.00],
                    [1235347200000, 12.42],
                    [1235433600000, 12.89],
                    [1235520000000, 13.02],
                    [1235606400000, 12.74],
                    [1235692800000, 12.76]]],
                tooltip: {
                    valueDecimals: 2
                }
            }]
        };

        $modalDiv.find(".iflow-modal-chart").highcharts(options);

        // show modal window
        $modalDiv.find(".modal").first().modal();
        e.preventDefault();
    });
}

export default {
    attachModalAccountChart: attachModalAccountChart
}
