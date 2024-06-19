import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
        <div>
            <h1>실시간 검색어</h1>
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
    );
}

export default RealtimeSearchWords;