import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Charts from './components/Charts'
import News from './components/News'
import { AuthProvider } from './firebase/Auth';
import { Layout } from 'antd';
import SignIn from './components/SignIn';
import Loading from './components/Loading';
import SignUp from './components/SignUp'
import Account from './components/Account'
import PrivateRoute from './components/PrivateRoute'
import Profile from './components/Profile';
import AboutUs from './components/AboutUs';
import Quote from "./components/modelComponents/TradingData/StockDataFolder";
import NotFound from "./components/modelComponents/TradingData/NotFound";
import WithInstantSearch from "./components/modelComponents/TradingData/WithInstantSearch";
import Header from "./components/modelComponents/TradingData/Header";
import { DataProvider } from "./components/modelComponents/TradingData/MarketDataDetails";

const {Content}=Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <header>
            <Navigation />
          </header>
          <Layout className='site-layout'>
            <Content className="main-content" >
              <div className='App-body'>
                <Route exact path='/' component={Home}/>
                <Route exact path='/charts' component={Charts}/>
                <Route exact path='/news' component={News}/>
                <Route exact path='/sigin' component = {SignIn}/>
                <Route exact path='/signup' component = {SignUp}/>
                <Route exact path='/loading' component = {Loading}/>
                <Route exact path='/siginup' component = {SignUp}/>
                <PrivateRoute path="/account" component={Account} />
                <PrivateRoute path="/profile" component={Profile} />
                <Route exact path='/aboutus' component={AboutUs} />
                <Route exact path='/models' render={props =>
                                    <DataProvider>
                                    <WithInstantSearch>
                                        <Header />
                                    </WithInstantSearch>
                                    </DataProvider>
                                  } />
                <Route exact path='/models/:id' render={props => (
                          <DataProvider>
                        <WithInstantSearch>
                            <Header />
                        </WithInstantSearch>
                        <br/>
                          <Quote symbol={props.match.params.id.toLowerCase()} {...props} />
                          </DataProvider>
                        )}
                      />
              </div>
            </Content>
          </Layout>
        </div>
      </Router>
      </AuthProvider>
  );

}

export default App;