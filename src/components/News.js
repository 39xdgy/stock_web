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
let testMode = false;

const News = (props) => {
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
    const serverUrl = "https://cors-anywhere.herokuapp.com/http://ownstockmodel.herokuapp.com/api/user/"


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

        async function getUserData() {
            if (content) {
                const { currentUser } = content

                console.log('news current User', currentUser);
                if (currentUser) {
                    let userId = currentUser.uid
                    console.log('user id', userId)

                    try {
                        const user = await axios.get(serverUrl + userId);
                        if (user) {
                            fetchNewsList(user.stockList);
                        } else {
                            throw 'user not found'
                        }

                    } catch (error) {
                        console.log(error);

                    }

                }
            }
        }
        getUserData();

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
    //console.log(props)
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
    //console.log(news);
    const sample = [
        {
            author: "Tina Zeinlinger, Jan Guldner",
            content: "Trading-Apps sind auf dem Vormarsch und mit ihnen der Trend zum immer schnelleren Handeln und Spekulieren. Börsencoaches und Finanzgurus im Internet nutzen das aus. In ihren Online-Seminaren und Vide… [+798 chars]",
            date: "5/18/2021, 8:53:30 AM",
            description: "Tina hat sich als Daytraderin an der Börse versucht. Was sie von Börsentrainern gelernt hat, auf welche Marketingtricks sie reingefallen ist und was CFDs mit Brokkoli zu tun haben.",
            image: "https://www.wiwo.de/images/wiwo_money_mates_640x360px_v2/27180132/2-format11240.jpg",
            key: "2d6f7bba-6b8e-4cbe-85a5-18ebd2a50d59",
            source: "Wirtschafts Woche",
            title: "Daytrading lernen: Funktioniert Geld verdienen mit Trading Apps?",
            url: "https://www.wiwo.de/podcast/money-mates/podcast-money-mates-daytrading-lernen-was-taugen-boersen-seminare-und-onlinekurse/27180130.html"
        },
        {
            author: "Herbert Lash",
            content: "NEW YORK/LONDON (Reuters) - Global stock markets fell on Thursday as a continued rise in the number of coronavirus cases dashed hopes of a swift recovery from the pandemic-induced economic slump and … [+4758 chars]",
            date: "6/18/2020, 3:36:18 PM",
            description: "Global stock markets fell on Thursday as a continued rise in the number of coronavirus cases dashed hopes of a swift recovery from the pandemic-induced economic slump and drove demand for safe-haven currencies such as the dollar and Japanese yen.",
            image: "https://s2.reutersmedia.net/resources/r/?m=02&d=20200618&t=2&i=1522723273&w=1200&r=LYNXMPEG5H1UF",
            key: "a90d5656-99c5-4dd0-8b59-a07cc754c081",
            source: "Reuters",
            title: "World stock markets slip on second wave virus fears, safe-havens rise",
            url: "http://feeds.reuters.com/~r/reuters/topNews/~3/XK0b5K8AM14/world-stock-markets-slip-on-second-wave-virus-fears-safe-havens-rise-idUSKBN23P001"
        },
        {
            author: "FourFourTwo Staff",
            content: "Arsenal manager Mikel Arteta has pinpointed five positions that the club need to strengthen this summer, according to reports.\r\nThe Gunners ran out 1-0 winners against Chelsea on Wednesday thanks to … [+2140 chars]",
            date: "5/13/2021, 6:23:01 AM",
            description: "The Spaniard is keen to improve his squad when the transfer market reopens",
            image: "https://cdn.mos.cms.futurecdn.net/cGSbzSU4G7BjktnaEiwBc5-1200-80.jpg",
            key: "cca9120d-4a70-46c3-ba1a-94150a80d614",
            source: "FourFourTwo",
            title: "Arsenal transfer news: Mikel Arteta wants to strengthen five positions this summer",
            url: "https://www.fourfourtwo.com/news/arsenal-transfer-news-mikel-arteta-wants-to-strengthen-five-positions-this-summer"
        },
        {
            author: "FourFourTwo Staff",
            content: "Liverpool manager Jurgen Klopp has ruled out marquee signings in this summers transfer market.\r\nThe Reds have endured a disappointing season and might need to win all four of their remaining games to… [+2037 chars]",
            date: "5/13/2021, 5:00:01 AM",
            description: "The Reds boss does not expect to entice a world-class superstar to Anfield this summer",
            image: "https://cdn.mos.cms.futurecdn.net/QNerreSfu6u8gfT4DRTHsc-1200-80.jpg",
            key: "1aacad58-ade2-40e9-9803-21d39b9969da",
            source: "FourFourTwo",
            title: "Liverpool transfer news: Jurgen Klopp rules out marquee signings in ‘strange’ market",
            url: "https://www.fourfourtwo.com/news/liverpool-transfer-news-jurgen-klopp-rules-out-marquee-signings-in-strange-market",
        },
        {
            author: "Ryan Gilliam",
            content: "BioWare clearly put some love into the Mass Effect Legendary edition, with a host of small changes included for the biggest of Mass Effect fans. Players discovered one such change over the weekend, w… [+2923 chars]",
            date: "5/17/2021, 11:35:09 AM",
            description: "Tali’Zorah, one of Mass Effect’s most important crewmates, had a rough ending in Mass Effect 3. After players romanced her, they got a stock image of a woman that was supposed to be her on their bed. But with the Mass Effect Legendary Edition, BioWare finally…",
            image: "https://cdn.vox-cdn.com/thumbor/8hnecxOkECAtHBQcVgDwmKrsBpY=/0x0:960x503/fit-in/1200x630/cdn.vox-cdn.com/assets/4689397/mass-effect-2-shepard-tali-romance_960.jpg",
            key: "9e6b5650-8bd9-42cf-97c0-847e7fa4f948",
            source: "Polygon",
            title: "Mass Effect Legendary Edition finally lets players see Tali’s face",
            url: "https://www.polygon.com/22440235/mass-effect-legendary-edition-3-tali-zorah-face-image-controversy-update"
        },
        {
            author: "Ivan Mehta",
            content: "China is one of the biggest markets in the world for Apples products. In its recent quarterly results, the company registered a whopping $17.7 billion in iPhone sales in the region.\r\nHowever, this st… [+3242 chars]",
            date: "5/18/2021, 7:08:17 AM",
            description: "China is one of the biggest markets in the world for Apple's products. In its recent quarterly results, the company registered a whopping $17.7 billion in iPhone sales in the region.\r\n\r\nHowever, ...",
            image: "https://img-cdn.tnwcdn.com/image/tnw?filter_last=1&fit=1280%2C640&url=https%3A%2F%2Fcdn0.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2020%2F06%2FTim-Cook-closeup.jpg&signature=dce038f2370ffd2d2f883d998d5de0a6",
            key: "640e1646-067b-4ce3-a02a-cdeff2aa4d89",
            source: "The Next Web",
            title: "How Apple reportedly gave up control of iCloud for business growth in China",
            url: "http://thenextweb.com/news/apple-icloud-security-china-encryption-nyt-report"
        }
    ]
    let infoDiv = null;
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
    } else {
        infoDiv = <div>These are sample news. Go to localhost:3000 for user following news.</div>
        newsBody = sample.map((singleNews) => {
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
                {infoDiv}
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