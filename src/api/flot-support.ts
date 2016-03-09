import plotOptions = jquery.flot.plotOptions;

const piconOptions:plotOptions = {
    yaxis: {
        color: "#545454",
        tickColor:"#CCCCCC",
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
        borderColor: '#AAAAAA',
        minBorderMargin: 1,
        margin: 0
    },
    colors: ['#D18B2C', '#00854E']
};

export default {
    piconOptions: piconOptions
}