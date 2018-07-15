import * as $ from "jquery"
import {percentBetweenEquity, percentBetweenPercents} from "./calc"
import {AccountInfoResponse, getAccountInfo} from "./investflow-api"
import t from "./transliterate"
import {Broker} from "./broker"
import Utils from "./site-utils"

const HIGHCHARTS_MODAL_DIV_ID = "iflow_highcharts_modal"

function getRangeButtons(firstEventMillis: number, lastEventMillis: number): Array<any> {
    let buttons: Array<any> = []
    let millisPerMonth = 30 * 24 * 60 * 60 * 1000
    let rangeMillis = lastEventMillis - firstEventMillis

    if (rangeMillis >= millisPerMonth) {
        buttons.push({type: "month", count: 1, text: "1м"})
    }
    if (rangeMillis >= 3 * millisPerMonth) {
        buttons.push({type: "month", count: 3, text: "3м"})
    }
    if (rangeMillis >= 6 * millisPerMonth) {
        buttons.push({type: "month", count: 6, text: "6м"})
    }
    if (rangeMillis >= millisPerMonth) {
        buttons.push({type: "ytd", text: "YTD"})
    }
    if (rangeMillis >= 12 * millisPerMonth) {
        buttons.push({type: "year", count: 1, text: "Год"})
    }
    buttons.push({type: "all", count: 1, text: "Все"})
    return buttons
}

export interface MaxDrawdownInfo {
    fromPrice: number,
    fromDate: number,
    toPrice: number,
    toDate: number,
    drawdown: number
}

export interface AccountChartOptions {
    profitData: number[][],
    balanceData?: number[][],
    equityData?: number[][],
    chartElementSelector: string,
    profitLabelSelector: string;
    fullAccountName: string;
    broker?: number,
    currencySuffix?: string,
    currencyPrefix?: string,
    exportFileName?: string,
    maxDrawdownInfo?: MaxDrawdownInfo
}

function emptyIfNull(val: string): string {
    return val ? val : ""
}

function getDefaultLabelDecimalsForPercent(val: number) {
    return val > 10000 ? 0 : val > 1000 ? 1 : 2
}

let illegalRe = /[\/?<>\\:*|"]/g
const controlRe = /[\x00-\x1f\x80-\x9f]/g
const reservedRe = /^\.+$/

function toSafeFileName(s: string): string {
    let r = s.replace(illegalRe, "_").replace(controlRe, "_").replace(reservedRe, "_")
    r = t.transliterate(r)
    r = r.replace(/[^\w]/gi, "_")
    return r
}

function deriveDecimalPrecision(profitData: number[][], minIdx?: number, maxIdx?: number): number {
    let maxValue: number = 0
    let fromIdx = typeof minIdx === "undefined" ? 0 : minIdx
    let toIdx = typeof  maxIdx === "undefined" ? profitData.length : maxIdx
    for (let i = fromIdx; i < toIdx; i++) {
        let val = profitData[i][1]
        maxValue = Math.max(maxValue, val)
    }
    return maxValue > 10000 ? 0 : (maxValue < 10 ? 4 : 2)
}

function getIdxBeforeOrEquals(timestamp: number, profitData: Array<Array<number>>): number {
    for (let i = 0; i < profitData.length; i++) {
        let t = profitData[i][0]
        if (t > timestamp) {
            return i - 1
        }
    }
    return profitData.length - 1
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
        return
    }

    let startValue = profitData[startEventIdx][1]
    let endValue = profitData[endEventIdx][1]

    let broker = Broker.getBrokerById(options.broker)
    let text
    if (broker.isPercentBasedPrice()) {
        let change = percentBetweenPercents(startValue, endValue)
        const decimals = getDefaultLabelDecimalsForPercent(change)
        text = (change > 0 ? "+" : "") + Utils.formatLargeNumber(change, decimals) + "%"
    } else {
        let percentChange = percentBetweenEquity(startValue, endValue)
        let valueChange = endValue - startValue
        const percentDecimals = getDefaultLabelDecimalsForPercent(percentChange)
        text = (valueChange > 0 ? "+" : "") + emptyIfNull(options.currencyPrefix) + Utils.formatLargeNumber(valueChange, valueDecimals) + emptyIfNull(options.currencySuffix)
            + " или " + (percentChange > 0 ? "+" : "") + Utils.formatLargeNumber(percentChange, percentDecimals) + "%"
    }
    $profitLabel.text(text)
}

function findIndex(arr: number[][], f: (p: number[]) => boolean) {
    for (let idx = 0; idx < arr.length; idx++) {
        const e: number[] = arr[idx]
        if (f(e)) {
            return idx
        }
    }
    return -1
}

function prepareAccountProfitChartOptions(options: AccountChartOptions): any {
    installTranslations()

    let firstEventMillis = -1
    let lastEventMillis = -1
    let profitData = options.profitData
    if (profitData.length > 0) {
        firstEventMillis = profitData[0][0]
        lastEventMillis = profitData[profitData.length - 1][0]
    }
    let buttons: Array<any> = getRangeButtons(firstEventMillis, lastEventMillis)
    const broker = Broker.getBrokerById(options.broker)
    let vState = {
        valueDecimals: broker.isPercentBasedPrice() ? deriveDecimalPrecision(profitData) : 2,
        minShownIdx: 0,
        maxShownIdx: profitData.length - 1,
        maxValue: undefined,
        minValue: undefined
    }
    updateProfitLabel($(options.profitLabelSelector), profitData, 0, profitData.length - 1, vState.valueDecimals, options)

    const cp = emptyIfNull(options.currencyPrefix)
    const cs = emptyIfNull(options.currencySuffix)
    const hasEquity = options.equityData && options.equityData.length > 0
    const hasBalance = options.balanceData && options.balanceData.length > 0
    const hasEquityOrBalance = hasEquity || hasBalance

    let profitChartColor = "#00854E"
    const res = {
        credits: {enabled: false},
        chart: {
            marginBottom: hasEquityOrBalance ? 40 : 0,
            zoomType: "x",
            panning: true,
            panKey: "shift"
        },
        legend: {enabled: false},
        rangeSelector: {
            allButtonsEnabled: true,
            buttons: buttons,
            selected: buttons.length - 1 // All button is active by default
        },
        navigator: {
            maskFill: "rgba(0, 0, 0, 0.1)",
            series: {color: profitChartColor}
        },
        exporting: {
            filename: options.exportFileName ? options.exportFileName : toSafeFileName(options.fullAccountName),
            buttons: {
                contextButton: {
                    align: "right"
                    // y: 20
                }
            },
            scale: 2
        },
        tooltip: {
            xDateFormat: "%d %b %Y",
            shared: true,
            useHtml: true,
            formatter: function () {
                let s = "<span style='font-size: 10px'>" + Highcharts.dateFormat("%d %b %Y", this.x) + "</span><br/>"
                $.each(this.points, function () {
                    //noinspection TypeScriptUnresolvedVariable
                    const to = this.series.tooltipOptions
                    const val = to.valuePrefix + Utils.formatLargeNumber(this.point.y, to.valueDecimals !== "undefined" ? to.valueDecimals : 2) + to.valueSuffix
                    s += `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${val}</b><br/>`
                })

                return s
            }
        },
        plotOptions: {
            line: {
                color: profitChartColor,
                dataLabels: {
                    enabled: false,
                    formatter: function () {
                        return ""
                    }
                }
            }
        },
        yAxis: [],
        xAxis: [{
            ordinal: false,
            events: {
                setExtremes: function (e) {
                    if (options.profitLabelSelector) {
                        let $profitLabel = $(options.profitLabelSelector)
                        if ($profitLabel.length > 0 && typeof e.min !== "undefined" && typeof e.max !== "undefined") {
                            let startEventIdx = Math.max(0, getIdxBeforeOrEquals(e.min, profitData))
                            let endEventIdx = Math.max(startEventIdx, getIdxBeforeOrEquals(e.max, profitData))

                            updateProfitLabel($profitLabel, profitData, startEventIdx, endEventIdx, vState.valueDecimals, options)
                        } else {
                            $profitLabel.text("")
                        }
                    }
                }
            }
        }],
        series: []
    }

    //profit chart
    const pp = broker.isPercentBasedPrice() ? "" : cp
    const ps = broker.isPercentBasedPrice() ? "%" : cs
    const profitSeries: HighchartsSeriesOptions = {
        name: broker.isPercentBasedPrice() ? "Доходность" : "Стоимость",
        data: profitData as [number, number][],
        color: profitChartColor,
        tooltip: {valueDecimals: vState.valueDecimals, valuePrefix: pp, valueSuffix: ps},
        marker: {enabled: false},
        yAxis: 0,
        zIndex: 10
    }
    const mdd = options.maxDrawdownInfo
    if (mdd) {
        profitSeries.zoneAxis = "x"
        profitSeries.zones = [
            {value: mdd.fromDate, color: profitChartColor},
            {value: mdd.toDate, color: "red", fillColor: profitChartColor + "0f"},
            {color: profitChartColor}
        ]
        let idx = findIndex(profitData, (p: number[]) => p[0] == mdd.toDate)
        idx == profitData.length - 1 && idx--
        while (idx > 0 && profitData[idx - 1][1].toFixed(1) == profitData[idx][1].toFixed(1)) idx--
        if (idx > 0) {
            const v = profitData[idx]
            const x = v[0]
            const y = v[1]
            profitData[idx] = {
                x, y, id: "minDD", marker: {enabled: true, radius: 5, fillColor: "green"}, enabledThreshold: 0,
                dataLabels: {
                    enabled: true,
                    allowOverlap: "true",
                    align: "right",
                    format: "просадка: " + mdd.drawdown.toFixed(0) + "%",
                    style: {fontWeight: "normal"},
                    y: 17
                }
            } as any
            profitSeries.turboThreshold = 5000
            // res["annotations"] = [{
            //     labelOptions: {
            //         backgroundColor: "white",
            //         borderColor: "#bbb",
            //         y: 30,
            //         verticalAlign: "bottom"
            //     },
            //     labels: [{
            //         point: "minDD",
            //         text: "просадка: " + mdd.drawdown.toFixed(0) + "%"
            //     }]
            // }]
        }
    }
    res.series.push(profitSeries)
    res.yAxis.push({
        title: {text: "Доходность"},
        height: hasEquityOrBalance ? "47%" : "100%",
        labels: {
            format: pp + "{value}" + ps,
            style: {color: profitChartColor}
        },
        plotLines: [{color: "#555", width: 1, value: 0, zIndex: 10}],
        maxPadding: 0.05,
        lineWidth: hasEquityOrBalance ? 2 : 0
    })

    if (hasEquityOrBalance) {
        res.yAxis.push({
            title: {text: hasEquity && hasBalance ? "Баланс и Средства" : hasEquity ? "Средства" : "Баланс"},
            top: "53%",
            height: "47%",
            offset: 0,
            min: 0,
            maxPadding: 0.05,
            labels: {
                formatter: function () {
                    return cp + Highcharts.numberFormat(this.value, 0, "", ",") + cs
                },
                style: {color: "#446587"}
            },
            lineWidth: 2
        })
    }
    if (hasBalance) {
        //balanceData chart
        res.series.push({
            name: "Баланс",
            color: "#c7c7c7",
            data: options.balanceData,
            marker: {enabled: false},
            tooltip: {valuePrefix: cp, valueSuffix: cs},
            yAxis: res.yAxis.length - 1,
            zIndex: 1,
            turboThreshold: 5000
        })
    }
    if (hasEquity) {
        res.series.push({
            name: "Средства",
            color: "#446587",
            data: options.equityData,
            marker: {enabled: false},
            tooltip: {valuePrefix: cp, valueSuffix: cs},
            yAxis: res.yAxis.length - 1,
            zIndex: 2,
            turboThreshold: 5000
        })
    }
    return res
}

function installTranslations() {
    const langObject: HighchartsLangObject = {
        contextButtonTitle: "Экспорт",
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        shortMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        weekdays: ["Воскресение", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        printChart: "Отправить на печать",

        downloadPNG: "Сохранить в формате PNG",
        downloadJPEG: "Сохранить в формате JPEG",
        downloadPDF: "Сохранить в формате PDF",
        downloadSVG: "Сохранить в формате SVG",

        downloadCSV: "Сохранить в формате CSV",
        downloadXLS: "Сохранить в формате XLS",

        loading: "Загрузка...",
        rangeSelectorZoom: "Период",
        rangeSelectorFrom: "с",
        rangeSelectorTo: "по",
        noData: "Нет данных"
    }
    const options: any = {lang: langObject}
    Highcharts.setOptions(options)
}

function showChart(accountInfo: AccountInfoResponse) {
    // find modal window, create if not found
    let $modalDiv = $("#" + HIGHCHARTS_MODAL_DIV_ID)
    if ($modalDiv.length === 0) {
        $modalDiv = $("<div/>", {id: HIGHCHARTS_MODAL_DIV_ID}).appendTo(document.body)
    }

    // reset old window contents
    $modalDiv.empty()
    const broker = Broker.getBrokerById(accountInfo.broker)
    const percentBasedPrice = broker.isPercentBasedPrice()
    const titleAttr = percentBasedPrice ? "Доходность за выбранный период." : "Изменение стоимости за выбранный период."
    $modalDiv.append(`<div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
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
    </div>`)
    let fullAccountName = accountInfo.name + "/" + accountInfo.account
    let profitLabelId = "profit_label_" + Date.now()
    const headerText = (percentBasedPrice ? "Доходность счета «" + fullAccountName + "»" : "Изменение стоимости «" + fullAccountName + "»") + " за выбранный период: "
    $modalDiv.find(".modal-title-text").text(headerText)
    $modalDiv.find(".modal-title-profit").attr("id", profitLabelId)
    $modalDiv.find(".account-url").attr("href", accountInfo.url)

    let $dialog = $modalDiv.find(".modal-dialog")
    $dialog.width(window.innerWidth * 0.8)
    $dialog.height(window.innerHeight * 0.8)

    // set new contents
    const chartOptions: AccountChartOptions = {
        profitData: accountInfo.profitData,
        balanceData: accountInfo.balanceData,
        equityData: accountInfo.equityData,
        currencyPrefix: accountInfo.currencyPrefix,
        currencySuffix: accountInfo.currencySuffix,
        chartElementSelector: undefined,
        fullAccountName: fullAccountName,
        profitLabelSelector: "#" + profitLabelId,
        broker: accountInfo.broker,
        maxDrawdownInfo: accountInfo.maxDrawdownInfo
    }
    const options = prepareAccountProfitChartOptions(chartOptions)
    options.chart.width = $dialog.width() - 30
    options.chart.height = $dialog.height() - 30
    const $chartEl = $modalDiv.find(".iflow-modal-chart")
    $chartEl.highcharts("StockChart", options)
    enableZoom($chartEl)

    // show modal window
    $modalDiv.find(".modal").first().modal()
}

function enableZoom($container: JQuery): void {
    let chart: any = $container.highcharts()
    //noinspection TypeScriptUnresolvedVariable
    chart.pointer.cmd = chart.pointer.onContainerMouseDown
    //noinspection TypeScriptUnresolvedVariable
    chart.pointer.onContainerMouseDown = function (a) {
        //noinspection JSUnusedGlobalSymbols
        this.zoomX = this.zoomHor = this.hasZoom = a.shiftKey
        //noinspection TypeScriptUnresolvedFunction
        this.cmd(a)
    }
}

interface VsLine {
    name: string,
    // array of points: [timestamp, price]
    data: Array<Array<number>>,
}

interface VsChartOptions {
    chartElementSelector: string;
    accounts: VsLine[];
    scaleHeight: boolean;
}

function prepareVsChartOptions(options: VsChartOptions): any {
    installTranslations()

    const seriesOptions = []
    for (let i = 0; i < options.accounts.length; i++) {
        let a = options.accounts[i]
        seriesOptions.push({
            name: a.name,
            data: a.data
        })
    }

    return {
        rangeSelector: {
            selected: 5,
            buttons: [
                {type: "month", count: 1, text: "1м"},
                {type: "month", count: 3, text: "3м"},
                {type: "month", count: 6, text: "6м"},
                {type: "ytd", text: "YTD"},
                {type: "year", count: 1, text: "Год"},
                {type: "all", text: "Все"}
            ]
        },
        credits: {enabled: false},
        legend: {enabled: true},
        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? " + " : "") + this.value + "%"
                }
            },
            plotLines: [{value: 0, width: 2, color: "silver"}]
        },

        plotOptions: {
            series: {showInNavigator: true}
        },

        tooltip: {
            pointFormat: "<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>",
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    }
}

function addVsChart(options: VsChartOptions) {
    installTranslations()

    function scaleChartHeight() {
        let $chartEl = $(options.chartElementSelector)
        if ($chartEl.length === 1) {
            let newHeight = Math.max(400, $(window).height() - $chartEl.offset().top)
            $chartEl.height(newHeight)
        }
    }

    if (options.scaleHeight) {
        scaleChartHeight()
        $(window).resize(() => scaleChartHeight())
    }

    let hsOptions = prepareVsChartOptions(options)
    let $chartEl = $(options.chartElementSelector)
    $chartEl.highcharts("StockChart", hsOptions)
}

interface TsEquityChartOptions {
    elementId: string
    dates: number[]
    ordersCount: number[]
    minOrderPoints: number[]
    maxOrderPoints: number[]
    minAccountPoints: number[]
    maxAccountPoints: number[]
    closedOrdersPoints: HighchartsDataPoint[]
}

function addTsDrawdownChart(tsOptions: TsEquityChartOptions) {
    installTranslations()
    const perOrder = []
    const perAccount = []
    const orders = []
    const {
        dates,
        minOrderPoints,
        maxOrderPoints,
        minAccountPoints,
        maxAccountPoints,
        ordersCount,
        closedOrdersPoints
    } = tsOptions

    let maxOrdersCount = 0
    for (let i = 0; i < dates.length; i++) {
        perOrder.push([dates[i], minOrderPoints[i], maxOrderPoints[i]])
        perAccount.push([dates[i], minAccountPoints[i], maxAccountPoints[i]])
        orders.push([dates[i], ordersCount[i]])
        maxOrdersCount = Math.max(maxOrdersCount, ordersCount[i])
    }

    const hsOptions = {
        title: {text: ""},
        xAxis: {type: "datetime"},
        yAxis: [
            {
                title: {text: "Пункты"},
                opposite: true,
                endOnTick: false,
                height: "68%",
                lineWidth: 2
            },
            {
                title: {text: "Ордера"},
                opposite: true,
                tickInterval: 1,
                endOnTick: false,
                min: 0,
                height: "27%",
                top: "73%",
                offset: 0,
                lineWidth: 2
            }
        ],
        tooltip: {
            shared: true,
            xDateFormat: "%d %b %Y %H:00"
        },
        credits: {enabled: false},
        exporting: {enabled: false},
        series: [
            {
                name: "Закрытые ордера",
                type: "line",
                color: "#737373",
                data: closedOrdersPoints,
                zIndex: 3,
                step: true,
                marker: {
                    enabled: false
                }
            },
            {
                name: "Один открытый ордер",
                type: "arearange",
                color: "#999",
                data: perOrder,
                zIndex: 2,
                step: true
            } as HighchartsIndividualSeriesOptions,
            {
                name: "Все открытые ордера",
                type: "arearange",
                color: "#ccc",
                data: perAccount,
                zIndex: 1,
                step: true
            },
            {
                name: "Число открытых ордеров",
                type: "column",
                color: "#ddd",
                data: orders,
                zIndex: 0,
                yAxis: 1,
                states: {hover: {color: "#ccc"}}
            }
        ]
    } as HighchartsOptions

    Highcharts.chart(tsOptions.elementId, hsOptions)
}

function attachModalAccountChart(elementSelector: string, broker: number, account: string): void {
    installTranslations()
    $(elementSelector).click(function (e: Event) {
        e.preventDefault()
        getAccountInfo(broker, account).then((accountInfo: AccountInfoResponse) => {
            showChart(accountInfo)
        })
    })
}

function addAccountChart(options: AccountChartOptions) {
    installTranslations()
    let hsOptions = prepareAccountProfitChartOptions(options)
    const $chartEl = $(options.chartElementSelector)
    $chartEl.highcharts("StockChart", hsOptions)
    enableZoom($chartEl)
}

// noinspection JSUnusedGlobalSymbols
export default {
    attachModalAccountChart,
    addAccountChart,
    addVsChart,
    installTranslations,
    addTsDrawdownChart
}
