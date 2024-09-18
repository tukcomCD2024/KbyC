import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WordCloud from 'react-wordcloud';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './GoogleTrends.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const GoogleTrends = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜 상태 추가
    const [result, setResult] = useState(null); // 선택한 날짜의 결과 저장

    const [titles, setTitles] = useState([]);
    const [loading3, setLoading3] = useState(true);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // DatePicker 열림/닫힘 상태
    const [newsList, setNewsList] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);

    useEffect(() => {
        async function getGoogleTrends() {
            try {
                const response = await axios.get('/service/googletrends');
                setTrends(response.data.google_trends);
                setLoading(false);
            } catch (error) {
                console.error('에러 발생', error);
            }
        }
        getGoogleTrends();
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        setSelectedDate(today);
    }, []);

    useEffect(() => {
        async function getTrendNames() {
            try {
                const response = await axios.get('/service/titles');
                const data = response.data.result;
                console.log('Data from first request:', data);

                const today = new Date();
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const day = today.getDate().toString().padStart(2, '0');
                const date = `${year}-${month}-${day}`;

                const response2 = await axios.post('/keyword/createkeywords', {
                    date: date,
                    names: data,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response2:', response2.data.result.result);
                setTitles(response2.data.result.result);
                setLoading3(false);
            } catch (error) {
                console.error('에러 발생', error);
            }
        }
        getTrendNames();
    }, []);

    const handleDateChange = (date) => {
        const localDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            12,
            0,
            0
        );
        const formattedDate = localDate.toISOString().split('T')[0];
        const result = trends.find(entry => entry.date === formattedDate);
        setResult(result);
        setSelectedDate(localDate);
        setIsDatePickerOpen(false);
        setSelectedDate(localDate);
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    const handleWordClick = async (word) => {
        setSelectedWord(word);
        try {
            const response = await axios.post('/service/trendnews', {
                content: word.topic,
                page: 1,
                page2: 5
            }, {
                headers: {
                    'Content-type': 'application/json'
                }
            });
            setNewsList(response.data.news);
        } catch (error) {
            console.error('에러 발생', error);
        }
    };

    return (
        <div className='trend-data-page'>
            {loading && <div>로딩 중...</div>}
            <div className='trend-data-content-container'>
                <div className='trend-data-content-container-left'>
                    <div className='trend-data-rank-container'>
                        <p1 onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} style={{ cursor: 'pointer', display: 'inline-block' }}>
                            {selectedDate ? selectedDate.toISOString().split('T')[0] : '날짜 선택'}
                        </p1>
                        {isDatePickerOpen && (
                            <div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => handleDateChange(date)}
                                    dateFormat="yyyy-MM-dd"
                                    inline
                                />
                            </div>
                        )}
                        <div className='trend-data-rank-wrapper-container'>
                            <div className='trend-data-rank-wrapper'>
                            {selectedDate && result && (
                            <div>
                                {result && result.words.slice(0, 5).map((trend, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(trend)} style={{ cursor: 'pointer' }}>
                                         <Link to={`/trendinfo/${trend.title}`}>{index + 1}.{trend.title}</Link><br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                            </div>
                            {selectedDate && result && (
                            <div>
                                {result && result.words.slice(5, 10).map((trend, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(trend)} style={{ cursor: 'pointer' }}>
                                        <Link to={`/trendinfo/${trend.title}`}>{index + 6}. {trend.title}</Link><br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>
                    <div className='trend-data-rank-text-cloud-container'>
                        {result && (
                            <div style={{ width: '1000px', height: '500px' }}>
                                <WordCloud words={result.words.map(word => ({ text: word.title, value: word.count }))}></WordCloud>
                            </div>
                        )}
                    </div>
                </div>
                <div className='trend-data-content-container-right'>
                    <div className='trend-data-rank-detail-container'>
                        <p1>{selectedWord ? selectedWord.topic : '선택된 단어 없음'}</p1>
                        <div className='trend-data-rank-detail-article'>
                            {newsList.map((news, index) => (
                                <p2 key={index}>
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">{index + 1}. {news.title}</a>
                                </p2>
                            ))}
                            <br1/>
                            <p1>관련 게시글</p1>
                            <p2>1. </p2>
                            <p2>2. </p2>
                            <p2>3. </p2>
                            <p2>4. </p2>
                            <p2>5. </p2>
                        </div>
                        {/* {result && result.words.map((keyword, index) => (
                            <div key={index}>
                                {index + 1}. <Link to={`/trendinfo/${keyword.title}`}>{keyword.title}</Link><br/>
                                검색 횟수 {keyword.count}<br/>
                            </div>
                            ))} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogleTrends;
