import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Home";
import Quote from "../modelComponents/TradingData/StockDataFolder";
import NotFound from "../modelComponents/TradingData/NotFound";
import WithInstantSearch from "../modelComponents/TradingData/WithInstantSearch";
import Header from "../modelComponents/TradingData/Header";
import { DataProvider } from "../modelComponents/TradingData/MarketDataDetails";

const Router = props => (
  <Switch>
    <Route exact path='/model' render={props =>
       <DataProvider>
       <WithInstantSearch>
           <Header />
       </WithInstantSearch>
       </DataProvider>
       } />
    <Route
      exact
      path='/model/:id'
      render={props => (
        <DataProvider>
       <WithInstantSearch>
           <Header />
       </WithInstantSearch>
        <Quote symbol={props.match.params.id.toLowerCase()} {...props} />
        </DataProvider>
      )}
    />
    <Route component={NotFound} />
  </Switch>
);

export default Router;
