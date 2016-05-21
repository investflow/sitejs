import plotOptions = jquery.flot.plotOptions;
import * as $ from "jquery";
import {percentBetweenEquity} from "./calc";
import utils from "./site-utils";

const defaultPiconOptions:plotOptions = {
    yaxis: {
        color: "#545454",
        tickColor: "#CCCCCC",
        labelWidth: 40,
        font: {family: "sans-serif", variant: "small-caps"},
        tickFormatter: function (n) {
            var precision = n > 10 ? 0 : n > 5 ? 1 : 2;
            var power = Math.pow(10, precision || 0);
            return String(Math.round(n * power) / power) + "%";
        }
    },
    xaxis: {
        ticks: []
    },
    grid: {
        borderWidth: 1,
        borderColor: "#AAAAAA",
        minBorderMargin: 1,
        margin: 0
    },
    colors: ["#00854E", "#D18B2C"]
};

const largeValuesPiconOptions:plotOptions = $.extend(true, {}, defaultPiconOptions);
largeValuesPiconOptions["yaxis"]["tickFormatter"] = function (n) {
    return utils.toValueWithSuffix(n)
};

enum PiconChartAlgorithm {
    Value,
    Reinvest,
    NoReinvest
}

/**
 * @param inputData: depends on ChartAlgorithm: either just a value or equity - 100, where 100 is start equity.
 * @param alg
 * @returns {Array[]}
 */
function preparePiconData(inputData:Array<number>, alg:PiconChartAlgorithm):Array<Array<Array<number>>> {
    var result = [];
    if (alg == PiconChartAlgorithm.Value) {
        for (var i = 0; i < inputData.length; i++) {
            result.push([i, inputData[i]]);
        }
    } else if (alg == PiconChartAlgorithm.Reinvest) {
        for (var i = 0; i < inputData.length; i++) {
            result.push([i, inputData[i]]);
        }
    } else if (alg == PiconChartAlgorithm.NoReinvest) {
        var percents = [];
        for (var i = 1; i < inputData.length; i++) {
            var p = percentBetweenEquity(100 + inputData[i - 1], 100 + inputData[i]); // percent between (equityBefore, equityAfter)
            percents.push(p);
        }
        var total = 0;
        result.push([0, 0]);
        for (var i = 0; i < percents.length; i++) {
            total += percents[i];
            result.push([i + 1, total]);
        }
    }
    return [result];
}

function drawPicon(selector:string, values:Array<number>, alg?:PiconChartAlgorithm, opts?:plotOptions) {
    if (!alg) {
        alg = PiconChartAlgorithm.Reinvest;
    }
    let processedData = preparePiconData(values, alg);
    // clone options to adjust legend status
    opts = $.extend(true, {}, opts ? opts : defaultPiconOptions);
    // if (processedData[0].length <= 1) {
    //     opts.yaxis.show = false;
    // }
    var $el = $(selector);
    $.plot($el, processedData, opts);
}

export default {
    piconOptions: defaultPiconOptions,
    largeValuesPiconOptions: largeValuesPiconOptions,
    picon: drawPicon,
    PiconChartAlgorithm: PiconChartAlgorithm
}
