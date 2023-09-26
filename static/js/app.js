//let url = "https://weeklyadjusteddata.s3.us-west-1.amazonaws.com/alpha_vantage_data.json";
let url = "http://127.0.0.1:5000/api/stocks"
var dataSet;
//const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('stock.db');

function init() {
    d3.json(url).then(function(data) {
        dataSet = data;
        bar("SPY", data);

        //metadataDisplay("SPY", data);
        console.log(data);
        lineChart("SPY", data);
        CandlestickChart("SPY", data);
        // Populate the dropdown menu
        var titles = Object.keys(data);
        console.log(titles);
        let dropdownMenu = d3.select("#selDataset");
        titles.forEach(function(name) {
            dropdownMenu.append("option").text(name).property("value", name);
    
        });
    });
}

function lineChart(id, data) {
// Need to specify which ID is being using and pull data only for that ID.
    idData = data[id]["Weekly Adjusted Time Series"]
    var dates = Object.keys(idData);
    console.log(dates)

    var closePrices = Object.values(idData).map(price => price["5. adjusted close"]);
    console.log(closePrices);

    var trace = {
        x: dates,
        y: closePrices,
        mode: "line",
    };

    var ldata = [trace];
    var layout = {
        title: `${id} ETF Weekly Adjusted Closing Prices`,
        xaxis: {
            title: "Dates"
        },
        yaxis: {
            title: "Adjusted Close Prices"
        }
    };
    Plotly.newPlot("line", ldata, layout);
}

function CandlestickChart(id, data) {
    // Need to specify which ID is being using and pull data only for that ID.
        idData = data[id]["Weekly Adjusted Time Series"]
        var dates = Object.keys(idData);
        console.log(dates)
        var open = Object.values(idData).map(open => open["1. open"]);
        var close = Object.values(idData).map(close => close["4. close"]);
        var high = Object.values(idData).map(high => high["2. high"]);
        var low = Object.values(idData).map(low => low["3. low"]);
    
        
        console.log(open);
    
        var trace = {
            x: dates,
            close: close,
            high: high, 
            low: low,
            open: open,
            type: "candlestick",
            name: `${id}`, // ETF name
        };
    
        var cdata = [trace];
        var layout = {
            title: `Candlestick Chart for ${id} ETF Weekly Price Movements`,
            xaxis: {
                title: "Weeks"
            },
            yaxis: {
                title: "Prices"
            }
        };
        Plotly.newPlot("candlestick-chart-container", cdata, layout);
    }


let chart; // have to initialize chart before destroying

function bar(id, data) {
    idData = data[id]["Weekly Adjusted Time Series"]
    var dates = Object.keys(idData);
    var volume = Object.values(idData).map(volume => volume["6. volume"]);
    console.log(dates);
    console.log(volume);
    
    //const bchart = document.getElementById("bar")//.getContext("2d");
    
    const canvas = document.getElementById("barChart");
    
    if (chart) {
        chart.destroy();
    }
    const bchart = canvas.getContext("2d");
    
    chart = new Chart(bchart, {
        type: "bar",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Weekly Trading volumes",
                    data: volume,
                    backgroundColor: "rgba(75, 192, 192, 0.6)"
                },
            ],
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date",
                    },
                },
                y: {
                    beginAtZero: true,
                    title:{
                        display: true,
                        text: "Trading Volume",
                    },
                },
            },
        },
    })
};




d3.select("#selDataset").on("change", optionChanged);

function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    let id = dropdownMenu.property("value");
    //console.log(id);
    //hbar(id, dataSet);
    bar(id, dataSet);
    //metadataDisplay(id, dataSet)
    lineChart(id, dataSet);
    CandlestickChart(id, dataSet);
    
}

init();