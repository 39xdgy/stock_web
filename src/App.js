import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
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
import About from './components/About';

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
                {/* <Route exact path='/aboutUs' component = {About}/> */}
                <PrivateRoute path="/account" component={Account} />
                <PrivateRoute path="/profile" component={Profile} />
                <Route exact path='/aboutus' component={About} />
              </div>
            </Content>
          </Layout>
        </div>
      </Router>
      </AuthProvider>
  );

}

export default App;