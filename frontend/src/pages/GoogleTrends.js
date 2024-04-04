import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const GoogleTrends = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
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
    );
}

export default GoogleTrends;