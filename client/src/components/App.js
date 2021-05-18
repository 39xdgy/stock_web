
import '../App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//import { Layout } from 'antd';
import modelComponent from './modelAppComp';
import styled from "styled-components";
import WithInstantSearch from "./modelComponents/TradingData/WithInstantSearch";
import Routes from "./routes";
import Header from "./modelComponents/TradingData/Header";
import { DataProvider } from "./modelComponents/TradingData/MarketDataDetails";
const AppWrapper = styled.div``;

function App() {
  return (
    <div>
      
     {/*<Router>
        <div className='App'>
        
              <div className='App-body'>
              <Route exact path='/' render={() => <DataProvider>
        <WithInstantSearch>
            <Header />
        </WithInstantSearch>
            <Routes />
      </DataProvider>}/>
              </div>
        </div>
  </Router>*/}
     
      {/*<DataProvider>
        <WithInstantSearch>
            <Header />
        </WithInstantSearch>*/}
            <Routes />
      {/*</DataProvider>*/}
  
    </div>
  );
}

export default App;
