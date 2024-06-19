import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WordCloud from 'react-wordcloud';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const NewsKeywords = () => {
    const [wordsData, setWordsData] = useState([]);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [result, setResult] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function getNewsKeywords() {
            try {
                const response = await axios.get('/service/newskeywords');
                setWordsData(response.data.news_keywords);
                setDates(response.data.search_dates);
                setLoading(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getNewsKeywords();
    }, []);

    const handleClick = (date) => {
        setSelectedDate(date);
        const result = wordsData.find(entry => entry.date === date);
        setResult(result);
        console.log(result);
    };

    return (
        <div>
            <h1>
                뉴스 분석
            </h1>
            {loading && <div>로딩 중...</div>}
            {wordsData.map((data, index) => (
                <button key={index} onClick={() => handleClick(data.date)}>
                    {data.date}
                </button>
            ))}
            {selectedDate && result && (
                <div>
                    <h2>{selectedDate}</h2>
                    {result.words.map((keyword, index) => (
                        <p key={index}>
                            {index + 1}. {keyword.word} {keyword.count}
                        </p>
                    ))}
                    <div style={{ width: '1000px', height: '500px' }}>
                    <WordCloud words={result.words.map(word => ({ text: word.word, value: word.count}))}></WordCloud>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsKeywords;    