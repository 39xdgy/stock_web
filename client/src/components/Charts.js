import React, {useEffect, useState,useContext} from 'react';
import {AuthContext} from '../firebase/Auth';
import axios from 'axios'
import 'antd/dist/antd.css';
//import uuid from 'uuid'
import { Layout,Row,Col, Select,Radio,Alert,Typography,BackTop} from 'antd';
import { BarChart,Bar, Line, Area,ComposedChart,LineChart,XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
const { Option } = Select;
const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const userTest = {id:'idabc', stockList:['AAPL','IBM','BA','GOOGL','FB','NVDA']}
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

function Charts(props){
   // const {currentUser} = useContext(AuthContext);
    const [userData,setUserData]= useState(undefined);
   const [user,setUser] = useState(undefined);
    //user.stockList
    const[chartData,setChartData] = useState(undefined);
    const[loading, setLoading] = useState(true);
    const [error,setError] = useState(false);
    const [chartType,setType] = useState('Bar');
    const symbol = ['DJI.INDX','NDX.INDX','NYA.INDX']
    
    const key = "AWWY4QSC0AS018VB"
    const func = 'TIME_SERIES_INTRADAY'
    const baseUrl1 = `https://www.alphavantage.co/query?`
    const baseUrl2 = 'http://api.marketstack.com/v1/'
    const func2="eod?"
    const func3="intraday?"
    const key2='access_key=6e1bec4cf9a30953ba06c4b2c17d1fb7&'

  
    const setUserFunc=()=>{
        setUser(userTest);
    }

  
 //effect when user not loggin
    useEffect(()=>{
        async function fetchData(){
            try {
                console.log("user not login useEffect fired.")
                let resultList =[];
                for(let i = 0;i<symbol.length;i++){
                    let syb= symbol[i]
                   // let url = baseUrl1+`function=${func}&symbol=${syb}&interval=15min&apikey=${key}`;
                    let url = baseUrl2+func2+key2+`symbols=${syb}`
                   // console.log(url)
                    const single = await axios.get(url);
                    let {data} = single
                   // console.log("data for chart:\n")
                  //  console.log(data)
                    if(data.data){
                     //   console.log(data.data);
                        let symbolResult = []
                        for(let i =data.data.length -1;i>=0;i--){
                            let curr = data.data[i]
                            //only show today's data
                            //To do: add 1week,1month 6month,1year,5year
                            let xyObject = {
                                date:curr.date.substring(0,10),
                                low:curr.low,
                                high:curr.high,
                                close:curr.close,
                                "Low - High":[curr.low,curr.high],
                                "open - close":[curr.open,curr.close]
                            }
                            symbolResult.push(xyObject)
                        }
                        let obj={
                            index:i,
                            symbol:symbol[i],
                            symbolData:symbolResult
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
    },[])


//Logged in user effect-----------------
useEffect(()=>{
    console.log("logged in user chart userEffect fired!\n")
    setUserFunc();
    try {
        //logged in user useEffect fired
        const today = new Date().toISOString().substring(0,10);
        console.log(today);
        let currentUser = Object.assign(userTest);
        async function fetchData(){
            let userResultList=[]
            //for test
            console.log(currentUser);
            if(currentUser.stockList.length>0){
                for(let i = 0;i<currentUser.stockList.length;i++){
                    let syb = currentUser.stockList[i];
                    //for logged in user, get intraday data.
                    let url = baseUrl2+func3+key2+`symbols=${syb}&interval=15min`
                   // console.log(url);
                    const single = await axios.get(url);
                    let {data} = single
                   // console.log(data)
                    if(data.data){
                        let symbolResult = []
                        for(let i =data.data.length -1;i>=0;i--){//reverse time
                            let curr = data.data[i]
                           // console.log(curr)
                            const today = new Date();
                           // console.log(today.getUTCDate());
                            const currDate = new Date(data.data[i].date);
                            if(today.getUTCDate() === currDate.getUTCDate()){
                                //only show today's data
                                //To do: add 1week,1month 6month,1year,5year
                                let xyObject = {
                                    date:currDate.toLocaleTimeString(),
                                    low:curr.low,
                                    last:curr.last,
                                    high:curr.high,
                                   close:curr.close,
                                    open:curr.open,
                                    "open - last":[curr.open,curr.last],
                                    "Low - High":[curr.low,curr.high],
                                    "open - close":[curr.open,curr.close]
                                }
                                symbolResult.push(xyObject)
                            
                            }
                       
                        }
                        let obj={
                            index:i,
                            symbol:syb,
                            symbolData:symbolResult
                        }
                        userResultList.push(obj);                     
                    }                  
                }
                setUserData(userResultList);
                console.log(userResultList)
                setLoading(false);
            }
        }
        if(!!currentUser){
            fetchData()
        }
        
    } catch (error) {
        console.log(error)
        setError(true);
    }
},[user])

//build bar chart-----------------------
    const buildBarChart=(chartData)=>{
        let data = chartData.symbolData;
            
        return (
        <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12}>
        <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
        <BarChart width={500} height={250} data={data} barCategoryGap={'30%'} reverseStackOrder={true}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date"  padding={{ left: 20, right: 20 }}/>
            <YAxis type="number" domain={['auto', 'auto']} />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="Low - High" fill="#00cc00" />
        </BarChart>
        </Col>
        )
    }
//build line chart-----------------------
    const buildLineChart=(chartData)=>{
        let data = chartData.symbolData;
        
        return (
        <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12}>
        <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
        <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis type="number" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <Line type='natural' dot={false} dataKey="high" stroke="#8884d8" />
        <Line type='natural' dot={false} dataKey="low" stroke="#82ca9d" />
        </LineChart>
        </Col>
        )
    }
//build combo chart-----------------------------
    const buildComChart=(chartData)=>{
        let data = chartData.symbolData;
        
        return (
        <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12}>
        <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
        <ComposedChart width={500} height={250} data={data}>
        <XAxis dataKey="date" />
        <YAxis type="number" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="Low - High" fill="#00cc00" />
        {/* <Bar dataKey="open - close" fill="#cc33ff"/> */}
        <Area type="monotone" dataKey="high" fill=" #4da3ff" stroke=" #cce5ff" />
        </ComposedChart>
        </Col>
        )
    }
//Build Charts for symbol (loggin user)  --------------------
//build bar chart-----------------------
const buildBarChartForUser=(chartData)=>{
    let data = chartData.symbolData;
        
    return (
    <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
    <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
    <BarChart width={500} height={250} data={data} barCategoryGap={'30%'} reverseStackOrder={true}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis type="number" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <Bar dataKey="open - last" fill="#00cc00" />
    </BarChart>
    </Col>
    )
}
//build line chart-----------------------
const buildLineChartForUser=(chartData)=>{
    let data = chartData.symbolData;
    
    return (
    <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
    <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
    <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis type="number" domain={['auto', 'auto']} />
    <Tooltip />
    <Legend verticalAlign="top" height={36}/>
    <Line type='natural' dot={false} dataKey="last" stroke="#4da3ff" />
    </LineChart>
    </Col>
    )
}
//build combo chart-----------------------------
const buildComChartForUser=(chartData)=>{
    let data = chartData.symbolData;
    
    return (
    <Col key={chartData.index.toString()} className="gutter-row" xs={24} sm={24} md={24} lg={12} >
    <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
    <ComposedChart width={500} height={250} data={data}>
    <XAxis dataKey="date" />
    <YAxis type="number" domain={['auto', 'auto']} />
    <Tooltip />
    <Legend verticalAlign="top" height={36}/>
    <CartesianGrid stroke="#f5f5f5" />
    <Bar dataKey="Low - High" fill="#00cc00" />
    {/* <Bar dataKey="open - close" fill="#cc33ff"/> */}
    <Area type="monotone" dataKey="last" fill="#4da3ff" stroke=" #cce5ff" />
    </ComposedChart>
    </Col>
    )
}




//build a selection div ---------

    const handleTypeChange = (e) => {
        setType(e.target.value);
      };
    const buildSelection=()=>{
        return(
            <Radio.Group  value={chartType} onChange={handleTypeChange}>
            <Radio.Button value="Bar">Bar Chart</Radio.Button>
            <Radio.Button value="Line">Line Chart</Radio.Button>
            <Radio.Button value="Combo">Combined Chart</Radio.Button>
            </Radio.Group>

        )
    }

    let body = null
    let userDataDiv = null;
    let selectDiv = buildSelection();
 //return-----------------------------------
   if(userData){
    if(chartType==='Line'){
        userDataDiv = userData.map((chart)=>{
        return buildLineChartForUser(chart);
    })
   }else if(chartType==='Combo'){
    userDataDiv = userData.map((chart)=>{
        return buildComChartForUser(chart);
              
    })
   }else{
        userDataDiv = userData.map((chart)=>{
        return buildBarChartForUser(chart);
    })
   }
   }

   if(chartData){
       if(chartType==='Line'){
            body = chartData.map((chart)=>{
            return buildLineChart(chart);
        })
       }else if(chartType==='Combo'){
            body = chartData.map((chart)=>{
            return buildComChart(chart);
                  
        })
       }else{
            body = chartData.map((chart)=>{
            return buildBarChart(chart);
        })
       }

       return(
           <div>
               <Header className="site-layout-background" style={{ textAlign: 'center' }} style={{ padding: 0 }} >
                   {selectDiv}
               </Header>
               <Typography><Title level={3}>Market Indices</Title></Typography>
                <Row gutter={16}>
                    {body}
                </Row>
                <br/>
                <br/>
                <Typography><Title level={3}>Your Following Stocks</Title></Typography>
                <Row gutter={16}>
                
              
                    {userDataDiv?userDataDiv:(<Typography><Title level={4}>Your are not Following any Stocks</Title></Typography>)}
                </Row>
                <BackTop>
                    <div style={style}>UP</div>
                </BackTop>
           </div>
           
       )
    
   }else if(loading){
       return (    
       <Alert
        message="Loading"
        description="Please wait a second..."
        type="info"
      />)
   }else if(error){
       return (    
       <Alert
        message="404 Error"
        description="Something wrong, please try again."
        type="error"
      />)
   }

}
export default Charts;