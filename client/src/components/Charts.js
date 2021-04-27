import React, {useEffect, useState} from 'react';
import axios from 'axios'
import 'antd/dist/antd.css';
import { Layout,Row,Col, Select,Radio,Alert,Typography} from 'antd';
const { Option } = Select;
import { BarChart,Bar, Line, Area,ComposedChart,LineChart,XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
const { Title } = Typography;
const { Header, Sider, Content } = Layout;


function Charts(){
    const[chartData,setChartData] = useState(undefined);
    const[loading, setLoading] = useState(true);
    const [chartType,setType] = useState('Bar');
    const symbol = ['DJI.INDX','NDX.INDX','NYA.INDX']
    const key = "AWWY4QSC0AS018VB"
    const func = 'TIME_SERIES_INTRADAY'
    const baseUrl1 = `https://www.alphavantage.co/query?`
    const baseUrl2 = 'http://api.marketstack.com/v1/eod?access_key=6e1bec4cf9a30953ba06c4b2c17d1fb7&'
   
 
    useEffect(()=>{
        async function fetchData(){
            try {
                let resultList =[];
                for(let i = 0;i<symbol.length;i++){
                    let syb= symbol[i]
                   // let url = baseUrl1+`function=${func}&symbol=${syb}&interval=15min&apikey=${key}`;
                    let url = baseUrl2+`symbols=${syb}`
                   // console.log(url)
                    const single = await axios.get(url);
                    let {data} = single
                    if(data.data){
                        let symbolResult = []
                        for(let i =data.data.length -1;i>=0;i--){
                            let curr = data.data[i]
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
                console.log(resultList);
                
             
            } catch (error) {
                console.log(error)
            }

        }
        fetchData();

    },[])
//build bar chart-----------------------
    const buildBarChart=(chartData)=>{
        let data = chartData.symbolData;
            
        return (
        <Col key={chartData.index.toString()} className="gutter-row" span={16}>
        <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
        <BarChart width={500} height={250} data={data} barCategoryGap={'30%'} reverseStackOrder={true}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis type="number" domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Low - High" fill="#00cc00" />
        </BarChart>
        </Col>
        )
    }
//build line chart-----------------------
    const buildLineChart=(chartData)=>{
        let data = chartData.symbolData;
        
        return (
        <Col key={chartData.index.toString()} className="gutter-row" span={16}>
        <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
        <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis type="number" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
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
        <Col key={chartData.index.toString()} className="gutter-row" span={16}>
        <Typography><Title level={4}>{chartData.symbol}</Title></Typography>
        <ComposedChart width={500} height={250} data={data}>
        <XAxis dataKey="date" />
        <YAxis type="number" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="Low - High" fill="#00cc00" />
        <Bar dataKey="open - close" fill="#cc33ff"/>
        <Area type="monotone" dataKey="close" fill=" #e6f2ff" stroke=" #cce5ff" />
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
            <Radio.Button value="Combo">Combine Chart</Radio.Button>
            </Radio.Group>

        )
    }

    let body = null
    let selectDiv = buildSelection();
 //return-----------------------------------
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
           <Row gutter={[24,24]}>
               
             {body}
           </Row>
           </div>
       )
    
   }else if(loading){
       return (    
       <Alert
        message="Loading"
        description="Please wait a second..."
        type="info"
      />)
   }else{
       return (    
       <Alert
        message="404 Error"
        description="Something wrong, please try again."
        type="error"
      />)
   }
  
 

}
export default Charts;