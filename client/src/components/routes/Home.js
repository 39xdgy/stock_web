import React, { useContext, Component, useRef } from "react";
import { DataContext } from "../modelComponents/TradingData/MarketDataDetails";
import setTitle from "../utils/title";
import WithInstantSearch from "../modelComponents/TradingData/WithInstantSearch";
import { DataProvider } from "../modelComponents/TradingData/MarketDataDetails";
//const AppWrapper = styled.div``;
import '../../App.css';
import Header from "../modelComponents/TradingData/Header";

//import styled from "styled-components";


const Markets = props => {
  
  const context = useContext(DataContext);
  setTitle(null, null);
  return (
    <div>
      {/*}
          <DataProvider>
        <WithInstantSearch>
          <Header />
        </WithInstantSearch>
          </DataProvider>
  */}
    </div>
  );
};

export default Markets;
