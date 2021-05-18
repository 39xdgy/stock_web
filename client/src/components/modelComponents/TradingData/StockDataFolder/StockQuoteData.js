import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { Grid, Segment, Header, Image, Label } from "semantic-ui-react";
import Clock from "react-live-clock";
import StatsPrice from "./UpdateStatsPrice";
import StatsDetails from "./UpdateStatsDetails";
import DarkButtons from "../../extraFeaturesFolder/DarkButtonsDisplay";
import NotFound from "../NotFound";
import LineChart from "../ChartsFolder/LCDiagram";
// import { quoteFormatting } from "../../../utils/format";
import setTitle from "../../../utils/title";
import HeikinAshi from "../ChartsFolder/HADiagram";
import StylizedCandleStickChart from "../ChartsFolder/StylizedCandlestick";

const unixTimeParser = d3.timeParse("%s");

const fetchDynamicTodayData = async symbol => {
  const range = "today";
  {
    const data = await d3.json(
      `https://api.iextrading.com/1.0/stock/aapl/chart/dynamic?chartReset=true`
    );

    data.data.forEach(d => {
      let year = d.date.slice(0, 4);
      let month = d.date.slice(4, 6);
      let day = d.date.slice(6, 8);
      const stringDate = `${year}-${month}-${day}T${d.minute}`;
      d.date = new Date(stringDate);
    });
    return data.data;
  }
};

const fetchIntradayData = async symbol => {
  const period = "1min";
  const data = await d3.json(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${period}&outputsize=full&apikey=TRDGNTGBQG2BI9J0`
  );

  return [
    ...Object.entries(data["Time Series (1min)"]).map(([date, cols]) => {
      return {
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

export const colorPerf = num => {
  if (num > 0) {
    return "green";
  } else if (num < 0) {
    return "red";
  }
  return "black";
};
const PeerPerformance = ({ peers, peerData }) => {
  // console.log(peerData)
  return peers.map((peer, i) =>
    !peerData[peer] ? null : !peerData[peer].chart.length > 0 ? null : (
      <LineChart
        style={{ display: "inlineBlock" }}
        key={`${i}-${peerData[peer].quote.symbol}`}
        name={peerData[peer].quote.symbol}
        companyName={peerData[peer].quote.companyName}
        data={peerData[peer].chart}
        latestPrice={peerData[peer].quote.latestPrice}
        changePercent={peerData[peer].quote.changePercent}
        volume={peerData[peer].quote.latestVolume}
        width='150'
        height='75'
      />
    )
  );
};

const QuoteData = props => {
  console.log(props.quote);

  // format quote data
  //const { quote, stats, logo, news } = props.data.quote;
  const [chartData, setChartData] = useState(null);
  //const display = quoteFormatting(quote, stats);
  setTitle(props.symbol, props.quote.regularMarketPrice);

  const [activePeriod, setActivePeriod] = useState("YTD");
  const [imgSrc, setImgSrc] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    let p1 = 0,
      p2 = 99999999999,
      interval = "1d";

    const intraDayFetcher = async () => {
      const data = await fetchIntradayData(props.symbol);
      setChartData(data);
    };
    if (activePeriod === "1D") {
      intraDayFetcher();
    } else {
      if (activePeriod.endsWith("M")) {
        let num = [...activePeriod][0];
        let d = new Date(Date.now());
        d.setMonth(d.getMonth() - num);
        console.log(d);

        p1 = Math.floor(d.getTime() / 1000);

      } else if (activePeriod.endsWith("Y")) {
        let num = [...activePeriod][0];
        let d = new Date(Date.now());
        d.setYear(d.getFullYear() - num);
        p1 = Math.floor(d.getTime() / 1000);
        // p2=(Date.now()/1000).toString();
        // p2=p2.slice(0,p2.length-4)
      } else if (activePeriod === "YTD") {
        p1 = new Date(d3.timeYear(Date.now())).getTime() / 1000;
        // p2=(Date.now()/1000).toString();
        // p2=p2.slice(0,p2.length-4)
      }
      const fetcher = async (s, i, _p1, _p2) => {
        let data = await props.chartDataHandler(s, i, _p1, _p2);
        setChartData(data);
      };

      fetcher(props.symbol, interval, p1, p2);
    }
    return;
  }, [activePeriod]);

  // useEffect(() => {
  //   setImgSrc(logo.url);
  // }, [logo.url]);
  console.log(props.quote);

  return (
    <Segment>
      <Grid columns={3}>
        <Grid.Column width={2}>
          {imgSrc ? (
            <Image
              onError={e => setImgSrc(null)}
              bottom
              src={imgSrc}
              size='small'
            />
          ) : null}
        </Grid.Column>
        <Grid.Column width={11}>
          <Header
            style={{
              fontFamily: "Dancing Script",
              fontSize: "4vw",
              fontWeight: "800"
            }}
            textAlign='center'>
            {props.quote.longName} ({props.quote.symbol})
          </Header>
        </Grid.Column>
        <Grid.Column width={2}>
          <StatsPrice
            last={props.quote.regularMarketPrice}
            change={props.quote.regularMarketChange}
            percent={props.quote.regularMarketChangePercent}
            color={colorPerf(props.quote.regularMarketChange)}
          />
        </Grid.Column>
      </Grid>

      <Grid stackable>
        {!chartData ? (
          "NO DATA"
        ) : (
          <>
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                position: "block"
              }}>
              <HeikinAshi
                style={{ margin: "auto" }}
                height={600}
                data={chartData}
                type='hybrid'
                ticker={props.symbol}
                xAxis='date'
                yAxis='volume'
              />
            </div>

            <DarkButtons
              default={"YTD"}
              timeRangeArray={["1d", "1m", "3m", "6m", "1y", "ytd", "max"]}
              clickEffect={setActivePeriod}
            />
            <StatsDetails data={props.quote} />
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                position: "block"
              }}>
              <StylizedCandleStickChart
                style={{ margin: "auto" }}
                height={600}
                data={chartData}
                ticker={props.symbol}
                // logo={imgSrc}
              />
            </div>
          </>
        )}

      </Grid>
    </Segment>
  );
};
export default QuoteData;
