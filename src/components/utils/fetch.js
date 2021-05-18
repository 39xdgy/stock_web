
import _ from "lodash";

import * as d3 from "d3";


//https://cloud.iexapis.com/stable/stock/aapl/chart/1y?token=pk_930da6c1c50b4e33914febac3ab39fcb
export const fetchChart = async (symbol, range) => {
  const data = await d3.json(
    `https://cloud.iexapis.com/stable/stock/${symbol}/chart/${range}?token=pk_1b77cc50b5cc4138bf37e0c1a87768c5`,
    

    d3.autoType
  );

  return data;

  
};
export const fetchAllCharts = async symbol => {
  const data = await Promise.all([
    await fetchIntradayData(symbol),
    await fetchChart(symbol, "1m"),
    await fetchChart(symbol, "3m"),
    await fetchChart(symbol, "6m"),
    await fetchChart(symbol, "1y"),
    await fetchChart(symbol, "5y"),
    await fetchChart(symbol, "ytd")
  ]);

  return {
    "1D": data[0],
    "1M": data[1],
    "3M": data[2],
    "6M": data[3],
    "1Y": data[4],
    "5Y": data[5],
    YTD: data[6]
  };
};

export const fetchQuote = async symbol => {
  //https://cloud.iexapis.com/stable/stock/AIG/batch?token=pk_930da6c1c50b4e33914febac3ab39fcb&types=quote,logo,stats,news
  const data = await d3.json(
    `https://cloud.iexapis.com/stable/stock/${symbol}/batch?token=pk_1b77cc50b5cc4138bf37e0c1a87768c5&types=quote,logo,stats,news`,
    d3.autoType
  );
  return data;
};


export const fetchIntradayData = async symbol => {
  const period = "1min";
  const data = await d3.json(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${period}&outputsize=full&apikey=TRDGNTGBQG2BI9J0`
  );

  return [
    ...Object.entries(data["Time Series (1min)"]).map(([date, cols]) => {
      return {
        ...cols,
        date: new Date(date),
        open: +cols["1. open"],
        high: +cols["2. high"],
        low: +cols["3. low"],
        close: +cols["4. close"],
        volume: +cols["5. volume"]
      };
    })
  ];
};

const makeApiCall = async (symbol, period = "1y") => {
  let timeParser = d3.timeParse("%Y-%m-%d");
  if (period === "1d") timeParser = d3.timeParse("%Y%m%d%H:%M");

  let prices = [];
  let times = [];
  const d = await d3.json(
    `https://api.iextrading.com/1.0/stock/${symbol}/chart/${period}`
  );

  if (d[0]["date"] == null) {
    makeApiCall(symbol, period);
    return;
  }

  for (let i = 0; i < d.length; i++) {
    if (d[i]["marketNumberOfTrades"] === 0 || d[i]["marketAverage"] === -1) {
      d.splice(i, 1);
      i--;
      continue;
    }

    if (period === "1d") {
      d[i]["close"] = d[i]["marketAverage"];
      d[i]["date"] = timeParser(d[i]["date"] + d[i]["minute"]);
    } else {
      d[i]["date"] = timeParser(d[i]["date"]);
    }

    times.push(d[i]["date"]);
    prices.push(d[i]["close"]);
  }

  return { times, prices, d };

  
};
export const fetchQuoteData = async (symbol, frequency) => {
  const data = await Promise.all([
    await fetchQuote(symbol),
    await fetchAllCharts(symbol)
    
  ]);

  return {
    quote: data[0],
    rangeData: data[1]
  };
};



  const parseSparkData = data => data.map(x=>{  
  let closes = x.response[0].indicators.quote[0].close;
  let timestamps = x.response[0].timestamp.map(ts=>unixTimeParser(ts));
  let dataZip = d3.zip(closes,timestamps);

  const sparkData = {
    symbol: x.symbol,
    data: dataZip.map(d => {
      return { date: d[1], value: d[0] };
    })
  };

  return sparkData;
  }) 

  const unixTimeParser = d3.timeParse("%s");

export const fetchIndiciesData = async symbols => {
  const data = await d3.json(
    `https://cors-anywhere.herokuapp.com/query1.finance.yahoo.com/v7/finance/spark?symbols=${symbols.join(
      ","
    )}&range=2y&interval=1d&indicators=close&includeTimestamps=false&includePrePost=false`,
    d3.autoType
  );

const   parsedData = parseSparkData(data.spark.result);
    return parsedData;

}
   