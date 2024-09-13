import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WordCloud from 'react-wordcloud';
import './GoogleTrends.css';


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
        <div className='trend-data-page'>
        {loading && <div>로딩 중...</div>}
            <div className='trend-data-content-container'>
                <div className='trend-data-content-container-left'>
                    <div className='trend-data-rank-container'>
                        <p1>2024.09.10</p1>
                        <div className='trend-data-rank-wrapper-container'>
                            <div className='trend-data-rank-wrapper'>
                                <p2>1. </p2>
                                <p2>2. </p2>
                                <p2>3. </p2>
                                <p2>4. </p2>
                                <p2>5. </p2>
                            </div>
                            <div className='trend-data-rank-wrapper'>
                                <p2>6. </p2>
                                <p2>7. </p2>
                                <p2>8. </p2>
                                <p2>9. </p2>
                                <p2>10. </p2>
                            </div>
                        </div>
                    </div>
                    <div className='trend-data-rank-text-cloud-container'>
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
                </div>
                <div className='trend-data-content-container-right'>
                    <div className='trend-data-rank-detail-container'>
                        <p1>트렌드 A</p1>
                        <div className='trend-data-rank-detail-article'>
                            <p2>1. </p2>
                            <p2>2. </p2>
                            <p2>3. </p2>
                            <p2>4. </p2>
                            <p2>5. </p2>
                            <p2>6. </p2>
                            <p2>7. </p2>
                            <p2>8. </p2>
                            <p2>9. </p2>
                            <p2>10. </p2>
                        </div>
                        <br1/>
                        <div className='trend-data-rank-detail-post'>
                            <p2>1. </p2>
                            <p2>2. </p2>
                            <p2>3. </p2>
                            <p2>4. </p2>
                            <p2>5. </p2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogleTrends;