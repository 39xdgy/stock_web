import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios'
import '../antd.css';
import '../App.css';
//import uuid from 'uuid'
import { Layout, Row, Col, Select, Radio, Alert, Typography, BackTop } from 'antd';
import { BarChart, Bar, Line, Area, ComposedChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const { Header } = Layout;
const userTest = { id: 'idabc', stockList: ['AAPL', 'IBM', 'BA', 'GOOGL', 'FB'] }
let testMode = false;

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

function Charts() {
    const content = useContext(AuthContext);
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
    const symbol = ['DJI.INDX', 'NDX.INDX', 'NYA.INDX']


    const baseUrl2 = 'https://api.marketstack.com/v1/'
    const func2 = "eod?"
    const func3 = "intraday?"
    const key2 = 'access_key=bc3f4991e9abb86d188bede651d502f4&'
    const serverUrl = "https://cors-anywhere.herokuapp.com/https://ownstockmodel.herokuapp.com/api/user/"
    //const serverUrl = "http://localhost:3006/api/user/"


    //set delay because of API limitition...
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //effect when user not loggin
    useEffect(async () => {
        async function fetchData() {
            try {
                
                console.log("user not login useEffect fired.")
                let resultList = [];
                for (let i = 0; i < symbol.length; i++) {
                    await sleep(1100);
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
        //get introday 
        async function getIntodayData(stockList) {
            if (!stockList) throw 'no stockList'
            let userResultList = [];
            if (stockList.length > 0) {
                for (let i = 0; i < stockList.length; i++) {

                    let syb = stockList[i];
                    //for logged in user, get intraday data.
                    let url = baseUrl2 + func3 + key2 + `symbols=${syb}&interval=15min`
                    // console.log(url);
                    await sleep(1100);
                    try {
                        const single = await axios.get(url);
                        let { data } = single

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
                            // console.log(error);
                            continue
                        }
                    } catch (error) {
                        //  console.log(error);
                        continue
                    }
                }
                setUserData(userResultList);
                console.log('Introday user data', userResultList)
                setLoading(false);

            }
        }

        //get One Month data
        async function getOneMonthData(stockList) {
            if (!stockList) throw 'no stockList'
            let userData = [];

            if (stockList.length > 0) {
                for (let i = 0; i < stockList.length; i++) {
                    let syb = stockList[i];
                    let today = new Date();
                    let yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10);
                    // console.log('yesterDay',yesterday);
                    let endDate = yesterday;
                    //  console.log('endDate',endDate);
                    let thisMonth = today.getMonth();
                    let startDate1; // 1 month ago
                    startDate1 = new Date(today.setMonth(thisMonth - 1)).toISOString().substring(0, 10);
                    let url_1month = baseUrl2 + func2 + key2 + `symbols=${syb}&date_from=${startDate1}&date_to=${endDate}`;
                    await sleep(1100);
                    try {
                        const getData = await axios.get(url_1month);

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
        //get threee month data
        async function getThreeMonthData(stockList) {
            if (!stockList) throw 'no stockList'
            let userData = [];

            if (stockList.length > 0) {
                for (let i = 0; i < stockList.length; i++) {
                    let syb = stockList[i];
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
                    await sleep(1100);
                    try {
                        const getData = await axios.get(url_3month);

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
                        continue;
                    }


                }
                console.log('three Month user data', userData);
                setUserThreeMonData(userData);

            }

        }
        //------------get six month data--------------------------------------- 
        async function getSixMonthData(stockList) {
            if (!stockList) throw 'no stockList'
            let userData = [];
            //for test

            if (stockList.length > 0) {
                for (let i = 0; i < stockList.length; i++) {
                    let syb = stockList[i];
                    let today = new Date();
                    let yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10);
                    // console.log('yesterDay',yesterday);
                    let endDate = yesterday;
                    //  console.log('endDate',endDate);
                    let thisMonth = today.getMonth();
                    let startDate3; // 12 month ago
                    startDate3 = new Date(today.setMonth(thisMonth - 6)).toISOString().substring(0, 10);
                    let url_6month = baseUrl2 + func2 + key2 + `symbols=${syb}&date_from=${startDate3}&date_to=${endDate}`;
                    await sleep(1100);
                    try {
                        const getData = await axios.get(url_6month);

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
                        continue;
                    }


                }
                console.log('Six Month user data', userData);
                setUserSixMonData(userData);

            }

        }
        //------------get one year data--------------------------------------- 
        async function getOneYearData(stockList) {
            if (!stockList) throw 'no stockList'

            let userData = [];
            //for test

            if (stockList.length > 0) {
                for (let i = 0; i < stockList.length; i++) {
                    let syb = stockList[i];
                    let today = new Date();
                    let yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10);
                    // console.log('yesterDay',yesterday);
                    let endDate = yesterday;
                    let thisMonth = today.getMonth();
                    let startDate4;  //12 month
                    startDate4 = new Date(today.setMonth(thisMonth - 12)).toISOString().substring(0, 10);

                    let url_1year = baseUrl2 + func2 + key2 + `symbols=${syb}&date_from=${startDate4}&date_to=${endDate}&limit=500`;
                    await sleep(1100);
                    try {
                        const getData = await axios.get(url_1year);

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
                        continue;
                    }


                }
                console.log('12 Month user data', userData);
                setUserOneYearData(userData);
            }

        }

        fetchData();
        //get user info
 
       
            if (content) {
                const { currentUser } = content
               // console.log(currenUser);
                if (currentUser) {
                    let userId = currentUser.uid 
                    console.log('user id', userId)
                    try {
                        let user = await axios.get(serverUrl+userId);
                        console.log(user);
                       // let user = Object.assign({},userTest)
                        console.log('test user here', user)
                        if(user){
                            let sl = user.data;
                            console.log('sl',sl)
                            getIntodayData(user.data.stockList);
                            getOneMonthData(user.data.stockList);
                            getThreeMonthData(user.data.stockList);
                            getSixMonthData(user.data.stockList);
                            getOneYearData(user.data.stockList);
                        }else{
                            throw 'user not found'
                        }
                        
                    } catch (error) {
                        console.log(error);
                    }
    
                }
    
    
    
            }
        
      


    }, [])


    //build bar chart-----------------------
    const buildBarChart = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
                <Typography><p className="chartName">{chartData.symbol}</p></Typography>
                <BarChart width={500} height={250} data={data} barCategoryGap={'30%'} reverseStackOrder={true}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" padding={{ left: 20, right: 20 }} />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={40} />
                    <Bar dataKey="Low - High" fill="#008800" />
                </BarChart>
            </Col>
        )
    }
    //build line chart-----------------------
    const buildLineChart = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
                <Typography><p className="chartName">{chartData.symbol}</p></Typography>
                <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={40} />
                    <Line type='natural' dot={false} dataKey="high" stroke="#6e69cb" />
                    <Line type='natural' dot={false} dataKey="low" stroke="#008800" />
                </LineChart>
            </Col>
        )
    }
    //build combo chart-----------------------------
    const buildComChart = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
                <Typography><p className="chartName">{chartData.symbol}</p></Typography>
                <ComposedChart width={500} height={250} data={data}>
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={40} />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="Low - High" fill="#008800" />
                    {/* <Bar dataKey="open - close" fill="#cc33ff"/> */}
                    <Area type="monotSix" dataKey="close" fill=" #4da3ff" stroke="#267bad" />
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
                <Typography><p className="chartName">{chartData.symbol}</p></Typography>

                <BarChart width={500} height={250} data={data} barCategoryGap={'30%'} reverseStackOrder={true}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={40} />
                    <Bar dataKey="open - last" fill="#008800" />
                </BarChart>
            </Col>
        )
    }
    //build line chart-----------------------
    const buildLineChartForUser = (chartData) => {
        let data = chartData.symbolData;

        return (
            <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
                <Typography><p className="chartName">{chartData.symbol}</p></Typography>

                <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={40} />
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
                <Typography><p className="chartName">{chartData.symbol}</p></Typography>

                <ComposedChart width={500} height={250} data={data}>
                    <XAxis dataKey="date" />
                    <YAxis type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={40} />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="Low - High" fill="#008800" />
                    {/* <Bar dataKey="open - close" fill="#cc33ff"/> */}
                    <Area type="monotSix" dataKey="last" fill="#4da3ff" stroke="#267bad" />
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
            <Radio.Group value={chartType} onChange={handleTypeChange} >
                <Radio.Button value="Bar">Bar Chart</Radio.Button>
                <Radio.Button value="Line">Line Chart</Radio.Button>
                <Radio.Button value="Combo">Combined Chart</Radio.Button>
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
    } else if (timeType === '3month') {
        showData = userThreeMonData;
    } else if (timeType === '6month') {
        showData = userSixMonData;
    } else if (timeType === '1year') {
        showData = userOneYearData;
    } else if(timeType === 'today') {
        showData = userData; // intraday data
    }else{
        showData = chartData
    }
    // console.log('showData', showData);

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
        if (chartType === 'Bar') {
            body = chartData.map((chart) => {
                return buildBarChart(chart);
            })
        } else if (chartType === 'Line') {
            body = chartData.map((chart) => {
                return buildLineChart(chart);
            })
        } else if (chartType === 'Combo') {
            body = chartData.map((chart) => {
                return buildComChart(chart);

            })
        } else {
            body = chartData.map((chart) => {
                return buildBarChart(chart);
            })
        }
    }
    if(chartData || showData){
        return (
            <div>
                <Header className="site-layout-background" style={{ textAlign: 'center' }} style={{ padding: 0 }} >
                    {selectDiv}
                </Header>
                <Typography><p className="chartTitle">Market Indices</p></Typography>
                <Row gutter={16}>
                    {body}
                </Row>
                <br />
                <br />
                <Typography><p className="chartTitle">Your Following Stocks</p></Typography>
                <Header className="site-layout-background" style={{ textAlign: 'center' }} style={{ padding: 0 }} >
                    {selectTimeDiv}
                </Header>
                <Row gutter={16}>
                    <br />
                    {userDataDiv ? userDataDiv : (<Typography><p className="Info">Your are not Following any stocks or you need to log in to see the data.</p></Typography>)}
                </Row>
                <BackTop>
                    <div style={style}>UP</div>
                </BackTop>
            </div>

        )

    } else if (loading) {
        return (
            <Alert
                message="Loading"
                description="Please wait a few seconds..."
                type="info"
            />)
    } else if (error) {
        return (
            <Alert
                message="404 Error"
                description="Something wrong, please try again later."
                type="error"
            />)
    }

}
export default Charts;