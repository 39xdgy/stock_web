import React, { useState, useEffect, useContext } from "react";
import { Segment } from "semantic-ui-react";
import QuoteData from "./StockQuoteData";
import { DataContext } from "../MarketDataDetails";

export default props => {
  
  const {
    fetchingQuote,
    fetchingIncidies,
    handleSymbolChange,
    YahooChartDataFetcher,
    YahooQuoteFetcher,
    
    quoteData
  } = useContext(DataContext);
  const [ticker, setTicker] = useState(props.symbol);
  useEffect(() => {
    handleSymbolChange(ticker);
    
  }, [ticker]);
  useEffect(() => setTicker(props.symbol), [props.symbol]);
    
  return (
    <Segment
      loading={fetchingQuote.loading && !fetchingIncidies.loading}
      style={{ minHeight: "300px" }}>
      {ticker ? (
        !fetchingQuote.loading && (
          <QuoteData
            symbol={props.symbol}
            quote={quoteData.quote}
            chartDataHandler={YahooChartDataFetcher}
          />
        )
      ) : (
        <h1>NO DATA</h1>
      )}
    </Segment>
  );
};
