import React, {useEffect, useState,useContext} from 'react';
import {AuthContext} from '../firebase/Auth';
import axios from 'axios'
import 'antd/dist/antd.css';
import { v4 as uuidv4 } from 'uuid';
import { Layout,Row,Col, Select,Radio,Alert,Typography,Card,Tag,Image, Comment} from 'antd';
import imageMagick from 'imagemagick';
import fs from 'fs'
import '../App.css';
const { Option } = Select;
const { Meta } = Card;
const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const userTest = {id:'idabc', stockList:['AAPL','IBM','BA','GOOGL','FB','NVDA']}
let testMode = true;

const News=(props)=>{
const[news,setNews] = useState(undefined);
const[loading, setLoading]=useState(true);
const [error,setError]=useState(false);
const[userNews,setUserNews] = useState(undefined);
const [user,setUser] = useState(undefined);
const baseUrl = "https://newsapi.org/v2/top-headlines?"
const key = "apiKey=1e4211b8b7a3444cbbb2e736508f489a"

const setUserFunc=()=>{
    setUser(userTest);
}

  //set delay because of API limitition...
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//get company name from ticker for news search
async function getCompanyName(ticker){
    if(!ticker || ticker==='') throw 'You need to provide ticker'
   // console.log(ticker)
    try {
        const nameData = await axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
        let symbolList = nameData.data
        
      //  console.log(symbolList);
       // console.log(symbolList.length)
        for(let i = 0;i<symbolList.length;i++){
          //  console.log(symbolList[i])
            if(symbolList[i].symbol==ticker){   
                //console.log(symbolList[i])        
                return symbolList[i].name;
            }
        }  
    } catch (error) {
        throw error
    }
}
//shuffle an array
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let x = Math.floor(Math.random() * arr.length);
       let  y = Math.floor(Math.random() * arr.length);
        if (x === y) { //for dont change arr[index] with self !!!
            continue;
        }
        let temp0 = arr[x];
        arr[x] = arr[y];
        arr[y] = temp0;
    }
    return arr
}
// fetch news as an object array---------------------------------
  async function fetchNewsData(){
    let currUser = Object.assign(userTest);
    let resultList = []
    try{
     console.log('news useEffect fired.\n');
     let symbolList = currUser.stockList;
     
     for(let i = 0;i<symbolList.length;i++){
        let companyName =await getCompanyName(symbolList[i]);
        let newName = companyName.split(' ')
        console.log(newName);
        let url = baseUrl+`q=${newName[0]}&${key}`
        const news = await axios.get(url);
        await sleep(1100);
        if(news.data&&news.data.articles){
            if(news.data.articles.length>0){
                console.log(news.data.articles)
                let symbolNews = {
                symbol:symbolList[i],
                news:news.data.articles
            }
            console.log(symbolNews);
            resultList.push(symbolNews) 
         }
        }
     }
     console.log(resultList);
     return resultList
    }catch(error){
        console.log(error)
    }
  }

function imageProcess(id,path){
    
    if(!path||!id) throw 'You need to provide an image path'
   

    imageMagick.resize({
        srcPath:path,
        width: 80,
        height: 40,

    }, function (err,stdout,stderr){
        if(err) throw err;
        fs.writeFileSync(`${id}-resized.jpg`,stdout,'binary');
        console.log(`${id} being processed`);

    })
}

useEffect(()=>{

},[])
  //fetch news data as an random array----------------------
  async function fetchNewsList(){
    let currUser = Object.assign(userTest);
    let resultList = []
    try{
     console.log('news useEffect fired.\n');
     let symbolList = currUser.stockList;
     
     for(let i = 0;i<symbolList.length;i++){
        let companyName = await getCompanyName(symbolList[i]);
        let newName = companyName.split(' ')
       // console.log(newName);
        let url = baseUrl+`q=${newName[0]}&${key}`
       // console.log(url)
        try {
            const news = await axios.get(url);
            if(news.data&&news.data.articles){
               // console.log(news.data.articles)
                if(news.data.articles.length>0){
                  for(let j=0;j<news.data.articles.length;j++){
                      let currNews = news.data.articles[j];
                      let key = uuidv4();
                      console.log('currNews',currNews);
                     // imageProcess(key,currNews.urlToImage);
                    // to do :using imageMagick to process
                    let newsDate = new Date(currNews.publishedAt).toLocaleString()
                    console.log(newsDate);
                       

                       let item = {
                           key:key,
                           title:currNews.title,
                           url: currNews.url,
                         //  image: `../img/${key}-resized.jpg`,
                           image: currNews.urlToImage,
                           content:currNews.content,
                           description:currNews.description,
                           source:currNews.source.name,
                           author:currNews.author,
                           date: newsDate
                           
                       }
                      
                      resultList.push(item);
                  }
             }
            } 
        } catch (error) {
            console.log(error);
            continue;
        }

     }
     let result = shuffle(resultList);
   
     return result;
     
    }catch(error){
       // console.log(error)
        setError(true);
    }
  }



useEffect(async ()=>{
    console.log("logged in user useEffect fired.\n");
    setUserFunc();
    if(user){
        try {
            let newsData = await fetchNewsList(); 
            if(newsData){
                setUserNews(newsData);
                setLoading(false);
                console.log("user News:\n")
                console.log(newsData);
            }
        } catch (error) {
           // console.log(error);
            setError(true);
        }
   
    
    
    }
    
    
},[user])

// build news slide
const buildSlide=(news)=>{

    return(
      <div className = "center" >
        <Card key={news.key}
        
        hoverable
        title={news.title?news.title:" "}
        style={{ width: 700}}
        extra={<a href={news.url}>More</a>}
      >
          <Image  className = "center" src={news.image} width={500} alt="News Image" />
          <p>  
          <Tag color="blue">{news.source}</Tag>
          </p>

          <Comment 
          author = {news.author}
          datetime = {news.date}
          content={news.description?news.description.substring(0,200):""}
          />
      </Card>
        <br/>
      </div>
     
      
    )


}

let newsBody = null
if(userNews){
    console.log("user News:\n");
    console.log(userNews);
   newsBody=userNews.map((news)=>{
      return buildSlide(news);
   })

    return(
        <div >
        <Typography><Title level={3}>News</Title></Typography>
        <div>
        {newsBody}
        </div>
        </div>
    )
}else if(loading){
    return (    
        <Alert
         message="Loading"
         description="Please wait a second..."
         type="info"
       />)
}
else{
    return(
        <Alert
        message="404 Error"
        description="Something wrong, please try again."
        type="error"
      />
    )
}


}
export default News;