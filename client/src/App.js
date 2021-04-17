import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';

import { AuthProvider } from './firebase/Auth';
import { Layout } from 'antd';

const {Content}=Layout;

function App() {
  return (
      <Router>
        <div className='App'>
          <header>
            <Navigation />
          </header>
          <Layout className='site-layout'>
            <Content className='main-conten'>
              <div className='App-body'>
                <Route exact path='/' component={Home}/>
              </div>
            </Content>
          </Layout>
        </div>
      </Router>
  );

}

export default App;