import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios'
import 'antd/dist/antd.css';
import { v4 as uuidv4 } from 'uuid';
import { Row, Col, Alert, Typography, Card, Tag, Image, Comment, BackTop } from 'antd';
import imageMagick from 'imagemagick';
import fs from 'fs'
import '../App.css';
import SearchNews from './SearchNews';


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

const userTest = { id: 'idabc', stockList: ['AAPL', 'IBM', 'BA', 'GOOGL', 'FB', 'NVDA'] }
let testMode = true;

const News = () => {
    const content = useContext(AuthContext);
    const [news, setNews] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userNews, setUserNews] = useState(undefined);
    const [searchNews, setSearchNews] = useState(undefined);
    const [user, setUser] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const baseUrl = "https://newsapi.org/v2/top-headlines?"
    const key = "apiKey=1e4211b8b7a3444cbbb2e736508f489a"

    const setUserFunc = () => {
        setUser(userTest);
    }

    //set delay because of API limitition...
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    //get company name from ticker for news search
    async function getCompanyName(ticker) {
        if (!ticker || ticker === '') throw 'You need to provide ticker'
        // console.log(ticker)
        try {
            const nameData = await axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
            let symbolList = nameData.data

            //  console.log(symbolList);
            // console.log(symbolList.length)
            for (let i = 0; i < symbolList.length; i++) {
                //  console.log(symbolList[i])
                if (symbolList[i].symbol == ticker) {
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
            let y = Math.floor(Math.random() * arr.length);
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
    async function fetchNewsData() {
        let currUser = Object.assign(userTest);
        let resultList = []
        try {
            console.log('news useEffect fired.\n');
            let symbolList = currUser.stockList;

            for (let i = 0; i < symbolList.length; i++) {
                let companyName = await getCompanyName(symbolList[i]);
                let newName = companyName.split(' ')
                console.log(newName);
                let url = baseUrl + `q=${newName[0]}&${key}`
                const news = await axios.get(url);
                await sleep(1100);
                if (news.data && news.data.articles) {
                    if (news.data.articles.length > 0) {
                        console.log(news.data.articles)
                        let symbolNews = {
                            symbol: symbolList[i],
                            news: news.data.articles
                        }
                        console.log(symbolNews);
                        resultList.push(symbolNews)
                    }
                }
            }
            console.log(resultList);
            return resultList
        } catch (error) {
            console.log(error)
        }
    }

    function imageProcess(id, path) {

        if (!path || !id) throw 'You need to provide an image path'


        imageMagick.resize({
            srcPath: path,
            width: 80,
            height: 40,

        }, function (err, stdout, stderr) {
            if (err) throw err;
            fs.writeFileSync(`${id}-resized.jpg`, stdout, 'binary');
            console.log(`${id} being processed`);

        })
    }


    useEffect(() => {
        //fetch public news-------
        async function fetchPulicNews() {

            let resultList = []
            try {
                console.log('news useEffect fired.\n');
                let symbolList = ['stock', 'NASDAQ', 'market'];

                for (let i = 0; i < symbolList.length; i++) {

                    // console.log(newName);
                    let url = baseUrl + `q=${symbolList[i]}&${key}`
                    // console.log(url)
                    try {
                        const news = await axios.get(url);
                        if (news.data && news.data.articles) {
                            // console.log(news.data.articles)
                            if (news.data.articles.length > 0) {
                                for (let j = 0; j < news.data.articles.length; j++) {
                                    let currNews = news.data.articles[j];
                                    let key = uuidv4();
                                    //  console.log('publicNews:',currNews);
                                    // imageProcess(key,currNews.urlToImage);
                                    // to do :using imageMagick to process
                                    let newsDate = new Date(currNews.publishedAt).toLocaleString()
                                    //  console.log(newsDate);
                                    let item = {
                                        key: key,
                                        title: currNews.title,
                                        url: currNews.url,
                                        //  image: `../img/${key}-resized.jpg`,
                                        image: currNews.urlToImage,
                                        content: currNews.content,
                                        description: currNews.description,
                                        source: currNews.source.name,
                                        author: currNews.author,
                                        date: newsDate

                                    }

                                    resultList.push(item);
                                }
                            }
                        }
                    } catch (error) {
                        // console.log(error);
                        continue;
                    }
                }
                let result = shuffle(resultList);
                setNews(result);
                setLoading(false);
            } catch (error) {
                // console.log(error)
                setError(true);
            }
        }

        //fetch news data as an random array----------------------
        async function fetchNewsList(stockList) {
            //let currUser = Object.assign(userTest);
            let resultList = []
            try {
                console.log('news useEffect fired.\n');
                let symbolList = stockList;
                if (symbolList.length > 0) {
                    for (let i = 0; i < symbolList.length; i++) {
                        let companyName = await getCompanyName(symbolList[i]);
                        let newName = companyName.split(' ')
                        // console.log(newName);
                        let url = baseUrl + `q=${newName[0]}&${key}`
                        // console.log(url)
                        try {
                            const news = await axios.get(url);
                            if (news.data && news.data.articles) {
                                // console.log(news.data.articles)
                                if (news.data.articles.length > 0) {
                                    for (let j = 0; j < news.data.articles.length; j++) {
                                        let currNews = news.data.articles[j];
                                        let key = uuidv4();
                                        // console.log('public News',currNews);
                                        // imageProcess(key,currNews.urlToImage);
                                        // to do :using imageMagick to process
                                        let newsDate = new Date(currNews.publishedAt).toLocaleString()
                                        //console.log(newsDate);
                                        let item = {
                                            key: key,
                                            title: currNews.title,
                                            url: currNews.url,
                                            //  image: `../img/${key}-resized.jpg`,
                                            image: currNews.urlToImage,
                                            content: currNews.content,
                                            description: currNews.description,
                                            source: currNews.source.name,
                                            author: currNews.author,
                                            date: newsDate

                                        }

                                        resultList.push(item);
                                    }
                                }
                            }
                        } catch (error) {
                            // console.log(error);
                            continue;
                        }

                    }
                    let result = shuffle(resultList);

                    setUserNews(result);
                    setLoading(false);
                }

            } catch (error) {
                // console.log(error)
                setError(true);
            }
        }
        fetchPulicNews();

        if (content) {
            const { currentUser } = content
            if (!!currentUser) {
                try {
                    fetchNewsList(currentUser.stockList);
                } catch (error) {
                    // console.log(error);
                    setError(true);
                }

            }
        }

    }, [])
    let searchDataDiv = null;
    useEffect(() => {
        async function fetchSearchNews() {

            let resultList = []

            console.log('search news useEffect fired.\n');

            let url = baseUrl + `q=${searchTerm}&${key}`
            try {
                const news = await axios.get(url);
                if (news.data && news.data.articles) {
                    // console.log(news.data.articles)
                    if (news.data.articles.length > 0) {
                        for (let j = 0; j < news.data.articles.length; j++) {
                            let currNews = news.data.articles[j];
                            let key = uuidv4();
                            //  console.log('publicNews:',currNews);
                            // imageProcess(key,currNews.urlToImage);
                            // to do :using imageMagick to process
                            let newsDate = new Date(currNews.publishedAt).toLocaleString()
                            //  console.log(newsDate);
                            let item = {
                                key: key,
                                title: currNews.title,
                                url: currNews.url,
                                //  image: `../img/${key}-resized.jpg`,
                                image: currNews.urlToImage,
                                content: currNews.content,
                                description: currNews.description,
                                source: currNews.source.name,
                                author: currNews.author,
                                date: newsDate

                            }

                            resultList.push(item);
                        }
                        setSearchNews(resultList);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.log(error)
            }


        }
        if (searchTerm) {
            fetchSearchNews();
        }

    }, [searchTerm]);
    const searchValue = async (value) => {
        setSearchTerm(value);
    };
    // build news slide
    const buildSlide = (news) => {

        return (
            <Col key={news.key} className="gutter-row" xs={24} sm={24} md={12} lg={8} >

                <Card key={news.key}
                    hoverable
                    style={{ padding: '8px 0' }}
                    title={news.title ? news.title : " "}
                    // style={{ width: 700}}
                    extra={<a href={news.url} aria-label="more content link">More</a>}
                >
                    <Image className="center" src={news.image} alt="News Image" />
                    <p>
                        <Tag color="blue">{news.source}</Tag>
                    </p>

                    <Comment
                        author={news.author}
                        datetime={news.date}
                        content={news.description ? news.description.substring(0, 200) : ""}
                    />
                </Card>

            </Col>


        )


    }

    let newsBody = null


    if (searchNews) {
        newsBody = searchNews.map((singleNews) => {
            return buildSlide(singleNews);
        })
    } else if (userNews) {
        newsBody = userNews.map((news) => {
            return buildSlide(news);
        })
    } else if (news) {
        newsBody = news.map((singleNews) => {
            return buildSlide(singleNews);
        })
    }




    if (loading) {
        return (
            <Alert
                message="Loading"
                description="Please wait a few seconds..."
                type="info"
            />)
    }
    else {
        return (
            <div >
                {/* <SearchNews searchValue={searchValue} /> */}
                <br />
                <Row gutter={16}>
                    {newsBody}
                </Row>
                <BackTop>
                    <div style={style}>UP</div>
                </BackTop>
            </div>
        )
    }


}
export default News;