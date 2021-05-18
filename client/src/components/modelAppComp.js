
import '../App.css';

import styled from "styled-components";
import WithInstantSearch from "./modelComponents/TradingData/WithInstantSearch";
import Routes from "./routes";
import Header from "./modelComponents/TradingData/Header";
import { DataProvider } from "./modelComponents/TradingData/MarketDataDetails";
const AppWrapper = styled.div``;

function App() {
  return (
    <div>
      {/*<AppWrapper>
          <DataProvider>
        <WithInstantSearch>
            {//<Header />
}
</WithInstantSearch>*/}
            <Routes />
          {/*</DataProvider>
      </AppWrapper>*/}
    </div>
  );
}

export default App;
