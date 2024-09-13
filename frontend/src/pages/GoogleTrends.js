import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WordCloud from 'react-wordcloud';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const GoogleTrends = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    // const [counts, setCounts] = useState([]);
    // const [loading2, setLoading2] = useState(true);

    const [titles, setTitles] = useState([]);
    const [loading3, setLoading3] = useState(true);

    useEffect(() => {
        async function getGoogleTrends() {
            try {
                const response = await axios.get('/service/googletrends');
                setTrends(response.data.google_trends);
                setLoading(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getGoogleTrends();
    }, []);

    useEffect(() => {
        async function getTrendNames() {
            try {
                // 첫 번째 API 호출: 데이터 가져오기
                const response = await axios.get('/service/titles');
                const data = response.data.result;
                console.log('Data from first request:', data);

                const today = new Date();
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const day = today.getDate().toString().padStart(2, '0');
                const date = `${year}-${month}-${day}`;

                // 두 번째 API 호출: 데이터 보내기
                const response2 = await axios.post('/keyword/createkeywords', {
                    date: date,
                    names: data, // `data`를 사용하여 POST 요청
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // 두 번째 요청의 결과를 로그에 출력
                console.log('Response2:', response2.data.result.result);
                setTitles(response2.data.result.result);
                setLoading3(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getTrendNames();
    }, []);

    // useEffect(() => {
    //     async function getSearchCounts() {
    //         try {
    //             const response = await axios.get('/service/wordcloud');
    //             setCounts(response.data.result);
    //             console.log(response.data.result);
    //             setLoading2(false);
    //         }
    //         catch (error) {
    //             console.error('에러 발생', error);
    //         }
    //     }
    //     getSearchCounts();
    // }, []);

    return (
        <div>
            <div>
                <h1>
                    구글 트렌드
                </h1>
                {loading && <div>로딩 중...</div>}
                {trends.map((trend, index) => (
                    <div key={index}>
                        {index + 1}. <Link to={`/trendinfo/${trend.title}`}>{trend.title}</Link><br/>
                        검색 횟수 {trend.traffic}<br/>
                        관련 뉴스<br/>
                        <ul>
                            {trend.news_list.map((news, index) => (
                                <li key={index}>
                                    <a href={news.news_url} target="_blank" rel="noopener noreferrer">{news.news_title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {/* <div>
                <h1>
                    워드 클라우드
                </h1>
                {loading2 && <div>로딩 중...</div>}
                <div style={{ width: '1000px', height: '500px' }}>
                    <WordCloud words={counts.map(word => ({ text: word.title, value: word.count}))}></WordCloud>
                </div>
            </div> */}
            <div>
                <h1>
                    워드 클라우드
                </h1>
                {loading3 && <div>로딩 중...</div>}
                <div style={{ width: '1000px', height: '500px' }}>
                    <WordCloud words={titles.map(word => ({ text: word.title, value: word.count}))}></WordCloud>
                </div>
            </div>
        </div>
    );
}

export default GoogleTrends;