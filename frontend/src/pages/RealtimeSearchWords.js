import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RealtimeSearchWords.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const RealtimeSearchWords = () => {
    const [wordsList, setWordsList] = useState([]);
    const [wordsList2, setWordsList2] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getRealtimeSearchWords() {
            try {
                const response = await axios.get('/service/realtimesearchwords');
                setWordsList(response.data.words_list);
                setWordsList2(response.data.words_list2);
                setLoading(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getRealtimeSearchWords();
    }, []);

    return (
        <div className='realtime-search-page'>
            {loading && <div>로딩 중...</div>}
            <div className='realtime-search-content-container'>
                <div className='realtime-search-content-container-left'>
                    <div className='realtime-search-rank-container'>
                        <p1>2024.09.10</p1>
                        <div className='realtime-search-rank-wrapper-container'>
                            <div className='realtime-search-rank-wrapper'>
                                <p2>1. </p2>
                                <p2>2. </p2>
                                <p2>3. </p2>
                                <p2>4. </p2>
                                <p2>5. </p2>
                            </div>
                            <div className='realtime-search-rank-wrapper'>
                                <p2>6. </p2>
                                <p2>7. </p2>
                                <p2>8. </p2>
                                <p2>9. </p2>
                                <p2>10. </p2>
                            </div>
                        </div>
                    </div>
                    <div className='realtime-search-rank-text-cloud-container'>
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '20px' }}>
                                {loading && <div>로딩 중...</div>}
                                {wordsList.map((word, index) => (
                                    <p key={index}>
                                        {index + 1}. <Link to={`/trendinfo/${word}`}>{word}</Link><br/>
                                    </p>
                                ))}
                            </div>
                            <div>
                                {wordsList2.map((word, index) => (
                                    <p key={index}>
                                        {index + 1}. <Link to={`/trendinfo/${word}`}>{word}</Link>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='realtime-search-content-container-right'>
                    <div className='realtime-search-rank-detail-container'>
                        <p1>트렌드 A</p1>
                        <div className='realtime-search-rank-detail-article'>
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
                        <div className='realtime-search-rank-detail-post'>
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

export default RealtimeSearchWords;