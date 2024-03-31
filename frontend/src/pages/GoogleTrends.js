import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const GoogleTrends = () => {
    const [trends, setTrends] = useState([]);

    useEffect(() => {
        async function getGoogleTrends() {
            try {
                const response = await axios.get('/service/googletrends');
                setTrends(response.data.google_trends);
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
            {trends.map((trend, index) => (
                <div key={index}>
                    {index + 1}. {trend.title}<br/>
                    검색 횟수 {trend.traffic}<br/>
                    관련 뉴스<br/>
                    <ul>
                        {trend.news_urls.map((url, index) => (
                            <li key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default GoogleTrends;