import React, {useContext} from 'react';
import { Link,Route } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut' 
import '../App.css';

import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const Navigation = () => {
    const currentUser  = useContext(AuthContext);

    const NavigationAuth = () => {
        return(
            <Layout className='hide-mobile'>
                <Sider
                    style={{
                        overflow:'auto',
                        height:'100vh',
                        position:'fixed',
                        left:0,
                    }}
                >
                    <Menu theme='dark' defaultSelectedKeys={['0']} mode='inline'>
                        <Menu.Item key='0' className='logo'>
                            <Link to='/'>STOCKWEB</Link>
                        </Menu.Item>
                        <Menu.Item key='1'>
                            <Link to='/'>Home</Link>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <Link to='/aboutUs'>About Us</Link>
                        </Menu.Item>
                        <Menu.Item key='8'>
                            <Link to='/account'>Account information</Link>
                        </Menu.Item>
                        <Menu.Item key='3'>
                            <Link to='/profile'>Profile</Link>
                        </Menu.Item>
                        <Menu.Item key='4'>
                            <Link to='/charts'>Charts</Link>
                        </Menu.Item>
                        <Menu.Item key='5'>
                            <Link to='/models'>Models</Link>
                        </Menu.Item>
                        <Menu.Item key='6'>
                            <Link to='/News' >News</Link>
                        </Menu.Item>
                        <Menu.Item key='7'>
                            <SignOutButton/>
                        </Menu.Item>
                    </Menu>
                </Sider>
            </Layout>
        );
    };

    const NavigationUnAuth = () => {
        return (
            <Layout className='hide-mobile'>
                <Sider
                    style={{
                        overflow:'auto',
                        height:'100vh',
                        position:'fixed',
                        left:0,
                    }}
                >
                    <Menu theme='dark' defaultSelectedKeys={['0']} mode='inline'>
                        <Menu.Item key='1' className='logo'>
                            <Link to='/'>STOCKWEB</Link>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <Link to='/'>Home</Link>
                        </Menu.Item>
                        <Menu.Item key='3'>
                            <Link to='/aboutUs'>About Us</Link>
                        </Menu.Item>
                        <Menu.Item key='4'>
                            <Link to='/sigin'>Sign-In</Link>
                        </Menu.Item>
                        <Menu.Item key='8'>
                            <Link to='/signup'>Sign-Up</Link>
                        </Menu.Item>
                        <Menu.Item key='5'>
                            <Link to='/charts'>Charts</Link>
                        </Menu.Item>
                        <Menu.Item key='6'>
                            <Link to='/models'>Models</Link>
                        </Menu.Item>
                        <Menu.Item key='7'>
                            <Link to='/news'>News</Link>
                        </Menu.Item>
                        {/* <Menu.Item key='7'>
                            <Link to='/logout'>Logout</Link>
                        </Menu.Item> */}
                    </Menu>
                </Sider>
            </Layout>
        );
    };

    if(currentUser.currentUser){
        return (<div><NavigationAuth/></div>)
    }
    else{
        return (<div><NavigationUnAuth/></div>)
    }
};

export default Navigation;