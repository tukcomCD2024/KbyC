import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WordCloud from 'react-wordcloud';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const GoogleTrends = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    const [counts, setCounts] = useState([]);
    const [loading2, setLoading2] = useState(true);

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
        async function getSearchCounts() {
            try {
                const response = await axios.get('/service/wordcloud');
                setCounts(response.data.result);
                console.log(response.data.result);
                setLoading2(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getSearchCounts();
    }, []);

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
            <div>
                <h1>
                    워드 클라우드
                </h1>
                {loading2 && <div>로딩 중...</div>}
                <div style={{ width: '1000px', height: '500px' }}>
                    <WordCloud words={counts.map(word => ({ text: word.title, value: word.count}))}></WordCloud>
                </div>
            </div>
        </div>
    );
}

export default GoogleTrends;