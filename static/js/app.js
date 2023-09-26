let url = "http://127.0.0.1:5000/api/stocks"
var dataSet;

function init() {
    d3.json(url).then(function(data) {
        dataSet = data;
        bar("AGG", data);

        metadataDisplay("AGG", data);

        lineChart("AGG", data);
        CandlestickChart("AGG", data);
        // Populate the dropdown menu
        var titles = Object.keys(data);

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

    var closePrices = Object.values(idData).map(price => price["7. dividend amount"]);

    var trace = {
        x: dates,
        y: closePrices,
        mode: "line",
    };

    var ldata = [trace];
    var layout = {
        title: `${id} ETF Dividend Amounts`,
        xaxis: {
            title: "Dates"
        },
        yaxis: {
            title: "Dividend Amounts"
        }
    };
    Plotly.newPlot("line", ldata, layout);
}

function CandlestickChart(id, data) {
    // Need to specify which ID is being using and pull data only for that ID.
        idData = data[id]["Weekly Adjusted Time Series"]
        var dates = Object.keys(idData);

        var open = Object.values(idData).map(open => open["1. open"]);
        var close = Object.values(idData).map(close => close["4. close"]);
        var high = Object.values(idData).map(high => high["2. high"]);
        var low = Object.values(idData).map(low => low["3. low"]);
    
        
 
    
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

var sectors = {
    "VNQ": "Real Estate",
    "SPY": "Various",
    "QQQ": "Technology",
    "IWM": "Various",
    "EEM": "Emerging Markets",
    "AGG": "Bonds",
    "VTI": "Various",
    "GLD": "Gold",
    "SLV": "Silver",
    "DBC": "Commodities"

}

var tracking = {
    "VNQ": "Real Estate Investment Trusts",
    "SPY": "the S&P 500 Index",
    "QQQ": "the NASDAQ-100 Index",
    "IWM": "the Russell 2000 Index",
    "EEM": "Companies based in Emerging-market countries",
    "AGG": "U.S. government bonds, corporate bonds, and other fixed-income assets",
    "VTI": "the Entire stock market",
    "GLD": "the Price of Gold",
    "SLV": "the Price of Silver",
    "DBC": "the Performance of various commodities (energy, agriculture, metals)"
}

function metadataDisplay(id, data){
    var metadata = d3.select("#sample-metadata")
    
    console.log(sectors)
    console.log(sectors[id])
    metadata.html("");

    if (sectors[id]) {
        metadata.append('h6').html(`<strong>${id} tracks ${tracking[id]}<strong>`);
        metadata.append('h6').text(`Sector: ${sectors[id]}`);
    };

}


d3.select("#selDataset").on("change", optionChanged);

function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    let id = dropdownMenu.property("value");

    bar(id, dataSet);
    metadataDisplay(id, dataSet)
    lineChart(id, dataSet);
    CandlestickChart(id, dataSet);
    
}

init();