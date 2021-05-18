import React, {useEffect, useState,useContext} from 'react';
import {AuthContext} from '../firebase/Auth';
import axios from 'axios'
import 'antd/dist/antd.css';
//import uuid from 'uuid'
import { Layout, Row, Col, Select, Radio, Alert, Typography, BackTop } from 'antd';
import { BarChart, Bar, Line, Area, ComposedChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const { Option } = Select;
const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const userTest = { id: 'idabc', stockList: ['AAPL', 'IBM', 'BA', 'GOOGL', 'FB', 'NVDA'] }
let testMode = true;

const style = {
    height: 30,
    width: 30,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#00254d',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
};

function Home(props) {
    // const {currentUser} = useContext(AuthContext);
    const [userData, setUserData] = useState(undefined);
    const [userOneMonData, setUserOneMonData] = useState(undefined);//1 month
    const [userThreeMonData, setUserThreeMonData] = useState(undefined);//3 month
    const [userSixMonData, setUserSixMonData] = useState(undefined);//6 month
    const [userOneYearData, setUserOneYearData] = useState(undefined);//1 year
    const [user, setUser] = useState(undefined);
    //user.stockList
    const [chartData, setChartData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [chartType, setType] = useState('Bar');
    const [timeType, setTime] = useState('today');
    const symbol = ['GOOG', 'AAPL', 'AMZN','NKE','SBUX','BA']

    const key = "AWWY4QSC0AS018VB"
    const func = 'TIME_SERIES_INTRADAY'
    const baseUrl1 = `https://www.alphavantage.co/query?`
    const baseUrl2 = 'https://api.marketstack.com/v1/'
    const func2 = "eod?"
    const func3 = "intraday?"
    const key2 = 'access_key=bf8eddbcab2ddc7e3df6ad363bb3ac55&'


    const setUserFunc = () => {
        setUser(userTest);
    }
    let currentUser = Object.assign(userTest);
    //set delay because of API limitition...
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //effect when user not loggin
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("user not login useEffect fired.")
                let resultList = [];
                for (let i = 0; i < symbol.length; i++) {
                    let syb = symbol[i]
                    // let url = baseUrl1+`function=${func}&symbol=${syb}&interval=15min&apikey=${key}`;
                    let url = baseUrl2 + func2 + key2 + `symbols=${syb}&interval=15min`
                    // console.log(url)
                    const single = await axios.get(url);
                    let { data } = single
                    await sleep(1100);
                    // console.log("data for chart:\n")
                    //  console.log(data)
                    if (data.data) {
                        //   console.log(data.data);
                        let symbolResult = []
                        for (let i = data.data.length - 1; i >= 0; i--) {
                            let curr = data.data[i]
                            //only show today's data
                            //To do: add 1week,1month 6month,1year,5year
                            let xyObject = {
                                date: curr.date.substring(0, 10),
                                low: curr.low,
                                high: curr.high,
                                close: curr.close,
                                "Low - High": [curr.low, curr.high],
                                "open - close": [curr.open, curr.close]
                            }
                            symbolResult.push(xyObject)
                        }
                        let obj = {
                            index: i,
                            symbol: symbol[i],
                            symbolData: symbolResult
                        }
                        resultList.push(obj);
                    }
                }
                setChartData(resultList);
                setLoading(false);
                // console.log(resultList);           
            } catch (error) {
                setError(true);
            }
        }
        fetchData();
        if (!!currentUser) {
            getIntodayData();
            getOneMonthData();
            getThreeMonthData();
            getSixMonthData();
            getOneYearData();
        }

    }, [])

    async function getIntodayData() {
        let userResultList = [];
        if (currentUser.stockList.length > 0) {
            for (let i = 0; i < currentUser.stockList.length; i++) {

                let syb = currentUser.stockList[i];
                //for logged in user, get intraday data.
                let url = baseUrl2 + func3 + key2 + `symbols=${syb}&interval=15min`
                // console.log(url);
                try {
                    const single = await axios.get(url);
                    let { data } = single
                    await sleep(1100);
                    // console.log(data)
                    if (data.data) {
                        let symbolResult = []
                        for (let i = data.data.length - 1; i >= 0; i--) {//reverse time
                            let curr = data.data[i]
                            // console.log(curr)
                            const today = new Date();
                            // console.log(today.getUTCDate());
                            const currDate = new Date(data.data[i].date);
                            if (today.getUTCDate() === currDate.getUTCDate()) {
                                //only show today's data
                                //To do: add 1week,1month 6month,1year,5year
                                let xyObject = {
                                    date: currDate.toLocaleTimeString(),
                                    low: curr.low,
                                    last: curr.last,
                                    high: curr.high,
                                    close: curr.close,
                                    open: curr.open,
                                    "open - last": [curr.open, curr.last],
                                    "Low - High": [curr.low, curr.high],
                                    "open - close": [curr.open, curr.close],
                                }
                                symbolResult.push(xyObject)
                            }
                        }
                        let obj = {
                            index: i,
                            symbol: syb,
                            symbolData: symbolResult
                        }
                        userResultList.push(obj);
                    } else {
                        console.log(error);
                        continue
                    }
                } catch (error) {
                    console.log(error);
                    continue
                }
            }
            setUserData(userResultList);
            console.log('Introday user data', userResultList)
            setLoading(false);
        }
    }


    async function getOneMonthData() {
        let currentUser = Object.assign(userTest);
        let userData = [];
        //for test
        // console.log(currentUser);
        if (currentUser.stockList.length > 0) {
            for (let i = 0; i < currentUser.stockList.length; i++) {
                let syb = currentUser.stockList[i];
                let today = new Date();
                let yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10);
                // console.log('yesterDay',yesterday);
                let endDate = yesterday;
                //  console.log('endDate',endDate);
                let thisMonth = today.getMonth();
                let startDate1; // 1 month ago
                startDate1 = new Date(today.setMonth(thisMonth - 1)).toISOString().substring(0, 10);
                let url_1month = baseUrl2 + func2 + key2 + `symbols=${syb}&date_from=${startDate1}&date_to=${endDate}`;
                try {
                    const getData = await axios.get(url_1month);
                    await sleep(1100);
                    if (getData && getData.data && getData.data.data) {
                        let dataArr = getData.data.data;
                        //console.log('SixMonData',dataArr);
                        let resultList = [];
                        for (let j = dataArr.length - 1; j >= 0; j--) {
                            let curr = dataArr[j];
                            let newElement = {
                                date: curr.date.substring(0, 10),
                                open: curr.open,
                                close: curr.close,
                                high: curr.high,
                                low: curr.low,
                                "Low - High": [curr.low, curr.high],
                                "open - close": [curr.open, curr.close]
                            }
                            resultList.push(newElement);
                        }
                        // console.log('resultList',resultList);
                        let OneMonObj = {
                            index: i,
                            symbol: syb,
                            symbolData: resultList
                        }
                        userData.push(OneMonObj);
                    }
                } catch (error) {
                    console.log(error);
                     continue;
                }
            }
            console.log('One Mon user data', userData);
            setUserOneMonData(userData);
        }

    }

    async function getThreeMonthData() {
        let currentUser = Object.assign(userTest);
        let userData = [];
        //for test
        // console.log(currentUser);
        if (currentUser.stockList.length > 0) {
            for (let i = 0; i < currentUser.stockList.length; i++) {
                let syb = currentUser.stockList[i];
                let today = new Date();
                let yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10);
                // console.log('yesterDay',yesterday);
                let endDate = yesterday;
                //  console.log('endDate',endDate);
                let thisMonth = today.getMonth();
                //  let startDate1; // 1 month ago
                let startDate2; // 6 month ago
                //  let startDate3; // 12 month ago
                // startDate1 = new Date(today.setMonth(thisMonth - 1)).toISOString().substring(0,10);
                startDate2 = new Date(today.setMonth(thisMonth - 3)).toISOString().substring(0, 10);
                let url_3month = baseUrl2 + func2 + key2 + `symbols=${syb}&date_from=${startDate2}&date_to=${endDate}`;
                try {
                    const getData = await axios.get(url_3month);
                    await sleep(1100);
                    if (getData && getData.data && getData.data.data) {
                        let dataArr = getData.data.data;
                        //console.log('SixMonData',dataArr);
                        let resultList = [];

                        for (let j = dataArr.length - 1; j >= 0; j--) {
                            let curr = dataArr[j];
                            let newElement = {
                                date: curr.date.substring(0, 10),
                                open: curr.open,
                                close: curr.close,
                                high: curr.high,
                                low: curr.low,
                                "Low - High": [curr.low, curr.high],
                                "open - close": [curr.open, curr.close]
                            }
                            resultList.push(newElement);
                        }
                        // console.log('resultList',resultList);
                        let ThreeMonObj = {
                            index: i,
                            symbol: syb,
                            symbolData: resultList
                        }
                        userData.push(ThreeMonObj);

                    }
                } catch (error) {
                    console.log(error);
                    // continue;
                }


            }
            console.log('three Month user data', userData);
            setUserThreeMonData(userData);
        }

    }
    //------------get six month data--------------------------------------- 
    async function getSixMonthData() {
        let currentUser = Object.assign(userTest);
        let userData = [];
        //for test
        // console.log(currentUser);
        if (currentUser.stockList.length > 0) {
            for (let i = 0; i < currentUser.stockList.length; i++) {
                let syb = currentUser.stockList[i];
                let today = new Date();
                let yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10);
                // console.log('yesterDay',yesterday);
                let endDate = yesterday;
                //  console.log('endDate',endDate);
                let thisMonth = today.getMonth();
                let startDate3; // 12 month ago
                startDate3 = new Date(today.setMonth(thisMonth - 6)).toISOString().substring(0, 10);
                let url_6month = baseUrl2 + func2 + key2 + `symbols=${syb}&date_from=${startDate3}&date_to=${endDate}`;
               
                try {
                    const getData = await axios.get(url_6month);
                    await sleep(1100);
                    if (getData && getData.data && getData.data.data) {
                        let dataArr = getData.data.data;
                        //console.log('SixMonData',dataArr);
                        let resultList = [];

                        for (let j = dataArr.length - 1; j >= 0; j--) {
                            let curr = dataArr[j];
                            let newElement = {
                                date: curr.date.substring(0, 10),
                                open: curr.open,
                                close: curr.close,
                                high: curr.high,
                                low: curr.low,
                                "Low - High": [curr.low, curr.high],
                                "open - close": [curr.open, curr.close]
                            }
                            resultList.push(newElement);
                        }
                        // console.log('resultList',resultList);
                        let SixMonObj = {
                            index: i,
                            symbol: syb,
                            symbolData: resultList
                        }
                        userData.push(SixMonObj);

                    }
                } catch (error) {
                    console.log(error);
                    // continue;
                }


            }
            console.log('Six Month user data', userData);
            setUserSixMonData(userData);
        }

    }
    //------------get one year data--------------------------------------- 
    async function getOneYearData() {
        let currentUser = Object.assign(userTest);
        let userData = [];
        //for test
        // console.log(currentUser);
        if (currentUser.stockList.length > 0) {
            for (let i = 0; i < currentUser.stockList.length; i++) {
                let syb = currentUser.stockList[i];
                let today = new Date();
                let yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10);
                // console.log('yesterDay',yesterday);
                let endDate = yesterday;
                let thisMonth = today.getMonth();
                let startDate4;  //12 month
                startDate4 = new Date(today.setMonth(thisMonth - 12)).toISOString().substring(0, 10);

                let url_1year = baseUrl2 + func2 + key2 + `symbols=${syb}&date_from=${startDate4}&date_to=${endDate}`;
                try {
                    const getData = await axios.get(url_1year);
                    await sleep(1100);
                    if (getData && getData.data && getData.data.data) {
                        let dataArr = getData.data.data;
                        //console.log('SixMonData',dataArr);
                        let resultList = [];

                        for (let j = dataArr.length - 1; j >= 0; j--) {
                            let curr = dataArr[j];
                            let newElement = {
                                date: curr.date.substring(0, 10),
                                open: curr.open,
                                close: curr.close,
                                high: curr.high,
                                low: curr.low,
                                "Low - High": [curr.low, curr.high],
                                "open - close": [curr.open, curr.close]
                            }
                            resultList.push(newElement);
                        }
                        // console.log('resultList',resultList);
                        let Obj = {
                            index: i,
                            symbol: syb,
                            symbolData: resultList
                        }
                        userData.push(Obj);

                    }
                } catch (error) {
                    console.log(error);
                    //continue;
                }


            }
            console.log('12 Month user data', userData);
            setUserOneYearData(userData);
        }

    }

    //build bar chart-----------------------
    const buildBarChart = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12}>
                <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
                <BarChart width={500} height={250} data={data} barCategoryGap={'30%'} reverseStackOrder={true}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" padding={{ left: 20, right: 20 }} />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="Low - High" fill="#00cc00" />
                </BarChart>
            </Col>
        )
    }
    //build line chart-----------------------
    const buildLineChart = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12}>
                <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
                <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line type='natural' dot={false} dataKey="high" stroke="#8884d8" />
                    <Line type='natural' dot={false} dataKey="low" stroke="#82ca9d" />
                </LineChart>
            </Col>
        )
    }
    //build combo chart-----------------------------
    const buildComChart = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12}>
                <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
                <ComposedChart width={500} height={250} data={data}>
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="Low - High" fill="#00cc00" />
                    {/* <Bar dataKey="open - close" fill="#cc33ff"/> */}
                    <Area type="monotSix" dataKey="close" fill=" #4da3ff" stroke=" #cce5ff" />
                </ComposedChart>
            </Col>
        )
    }
    //Build Charts for symbol (loggin user)  --------------------
    //build bar chart-----------------------
    const buildBarChartForUser = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
                <Typography><Title level={4}>{chartData.symbol}</Title></Typography>

                <BarChart width={500} height={250} data={data} barCategoryGap={'30%'} reverseStackOrder={true}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="open - last" fill="#00cc00" />
                </BarChart>
            </Col>
        )
    }
    //build line chart-----------------------
    const buildLineChartForUser = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
                <Typography><Title level={4}>{chartData.symbol}</Title></Typography>

                <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line type='natural' dot={false} dataKey="last" stroke="#4da3ff" />
                </LineChart>
            </Col>
        )
    }
    //build combo chart-----------------------------
    const buildComChartForUser = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
                <Typography><Title level={4}>{chartData.symbol}</Title></Typography>

                <ComposedChart width={500} height={250} data={data}>
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="Low - High" fill="#00cc00" />
                    {/* <Bar dataKey="open - close" fill="#cc33ff"/> */}
                    <Area type="monotSix" dataKey="last" fill="#4da3ff" stroke=" #cce5ff" />
                </ComposedChart>
            </Col>
        )
    }

    //build a selection div for chart types---------

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };
    const buildSelection = () => {
        return (
            <Radio.Group value={chartType} onChange={handleTypeChange}>
                {/* <Radio.Button value="Bar">Bar Chart</Radio.Button>
                <Radio.Button value="Line">Line Chart</Radio.Button>
                <Radio.Button value="Combo">Combined Chart</Radio.Button> */}
            </Radio.Group>

        )
    }

    //build a selection div for data time ---------
    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };
    const buildTimeSelection = () => {
        return (
            <Radio.Group value={timeType} onChange={handleTimeChange}>
                <Radio.Button value="today">TODAY</Radio.Button>
                <Radio.Button value="1month">1 MONTH</Radio.Button>
                <Radio.Button value="3month">3 MONTH</Radio.Button>
                <Radio.Button value="6month">6 MONTH</Radio.Button>
                <Radio.Button value="1year">1 YEAR</Radio.Button>
            </Radio.Group>

        )
    }

    let body = null
    let userDataDiv = null;
    let showData;
    let selectDiv = buildSelection();
    let selectTimeDiv = buildTimeSelection();
    // set user customized stock data----------------------------------
    if (timeType === '1month') {
        showData = userOneMonData;
        console.log('showData', showData);
    } else if (timeType === '3month') {
        showData = userThreeMonData;
    } else if (timeType === '6month') {
        showData = userSixMonData;
    } else if (timeType === '1year') {
        showData = userOneYearData;
    } else {
        showData = userData;
    }
    console.log('showData', showData);

    if (showData) {
        if (timeType === 'today') {
            if (chartType === 'Bar') {
                userDataDiv = showData.map((chart) => {
                    return buildBarChartForUser(chart);
                })
            } else if (chartType === 'Line') {
                userDataDiv = showData.map((chart) => {
                    return buildLineChartForUser(chart);
                })
            } else if (chartType === 'Combo') {
                userDataDiv = showData.map((chart) => {
                    return buildComChartForUser(chart);

                })
            } else {
                userDataDiv = showData.map((chart) => {
                    return buildBarChartForUser(chart);
                })
            }
        } else {
            if (chartType === 'Bar') {
                userDataDiv = showData.map((chart) => {
                    return buildBarChart(chart);
                })
            } else if (chartType === 'Line') {
                userDataDiv = showData.map((chart) => {
                    return buildLineChart(chart);
                })
            } else if (chartType === 'Combo') {
                userDataDiv = showData.map((chart) => {
                    return buildComChart(chart);

                })
            } else {
                userDataDiv = showData.map((chart) => {
                    return buildBarChart(chart);
                })


            }
        }
    }
    // return---------------------------------
    if (chartData) {
        // if (chartType === 'Bar') {
        //     body = chartData.map((chart) => {
        //         return buildBarChart(chart);
        //     })
        // } else if (chartType === 'Line') {
        //     body = chartData.map((chart) => {
        //         return buildLineChart(chart);
        //     })
        // } else if (chartType === 'Combo') {
        //     body = chartData.map((chart) => {
        //         return buildComChart(chart);

        //     })
        // } else {
        body = chartData.map((chart) => {
            return buildLineChart(chart);
        })
        

        return (
            <div>
                <Title>Welcome to Stock Web!</Title>
                <Header className="site-layout-background" style={{ textAlign: 'center' }} style={{ padding: 0 }} >
                    {selectDiv}
                </Header>
                <Typography><Title level={3}>Popular Stock Prices</Title></Typography>
                <Row gutter={16}>
                    {body}
                </Row>
                <br />
                <br />
                {/* <Typography><Title level={3}>Top Stocks</Title></Typography>
                <Header className="site-layout-background" style={{ textAlign: 'center' }} style={{ padding: 0 }} >
                    {selectTimeDiv}
                </Header>
                <Row gutter={16}>
                    <br />
                    {userDataDiv ? userDataDiv : (<Typography><Title level={4}>Your are not Following any Stocks</Title></Typography>)}
                </Row>
                <BackTop>
                    <div style={style}>UP</div>
                </BackTop> */}
            </div>

        )

    } else if (loading) {
        return (
            <Alert
                message="Loading"
                description="Please wait a second..."
                type="info"
            />)
    } else if (error) {
        return (
            <Alert
                message="404 Error"
                description="Something wrong, please try again."
                type="error"
            />)
    }

}
export default Home;