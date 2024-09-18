
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WordCloud from 'react-wordcloud';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TopicTrends.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const TopicTrends = () => {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [result, setResult] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function getTopicTrends() {
            try {
                const response = await axios.get('/service/topictrends');
                setTrendData(response.data.topic_trends);
                setResult(response.data.topic_trends[0]); 
                setSelectedWord(response.data.topic_trends[0].words[0]);
                setLoading(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getTopicTrends();
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        setSelectedDate(today);
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
        const result = trendData.find(entry => entry.date === formattedDate);
        setResult(result);
        setIsDatePickerOpen(false);
        console.log(result);
        setSelectedDate(localDate);
    };

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

    const onWordClick = (word) => {
        navigate(`/trendinfo/${word.text}`);
    };

    return (
        <div className='topic-trend-page'>
            {loading && <div>로딩 중...</div>}
            <div className='topic-trend-content-container'>
                <div className='topic-trend-content-container-left'>
                    <div className='topic-trend-rank-container'>
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
                        <div className='topic-trend-rank-wrapper-container'>
                            <div className='topic-trend-rank-wrapper'>
                            {selectedDate && result && (
                            <div>
                                {result.words.slice(0, 5).map((keyword, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(keyword)} style={{ cursor: 'pointer' }}>
                                        <Link to={`/trendinfo/${keyword.topic}`}>{index + 1}. {keyword.topic}</Link><br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                            </div>
                            {selectedDate && result && (
                            <div>
                                {result.words.slice(5, 10).map((keyword, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(keyword)} style={{ cursor: 'pointer' }}>
                                        <Link to={`/trendinfo/${keyword.topic}`}>{index + 6}. {keyword.topic}</Link><br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>
                    <div className='topic-trend-rank-text-cloud-container'>
                        {/* {trendData.map((data, index) => (
                            <button key={index} onClick={() => handleClick(data.date)}>
                                {data.date}
                            </button>
                        ))} */}
                        {/* {selectedDate && result && (
                            <div>
                                <h2>{selectedDate}</h2>
                                {result.words.map((keyword, index) => (
                                    <p key={index}>
                                        {index + 1}. {keyword.topic}
                                    </p>
                                ))}
                                <div style={{ width: '1000px', height: '500px' }}>
                                <WordCloud words={result.words.map(word => ({ text: word.topic, value: word.frequency}))}></WordCloud>
                                </div>
                            </div>
                        )} */}
                        {result && (
                            <div style={{ width: '1000px', height: '500px' }}>
                                <WordCloud words={result.words.map(word => ({ text: word.topic, value: word.frequency }))}></WordCloud>
                            </div>
                        )}
                    </div>
                </div>
                <div className='topic-trend-content-container-right'>
                    <div className='topic-trend-rank-detail-container'>
                        <p1>{selectedWord ? selectedWord.topic : '선택된 단어 없음'}</p1>
                        <div className='topic-trend-rank-detail-article'>
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
                        {/* <div className='topic-trend-rank-detail-article'>
                            {result && (
                                <div>
                                    <h2>{selectedDate}</h2>
                                    {result.words.map((keyword, index) => (
                                        <p key={index}>
                                            {index + 1}. <Link to={`/trendinfo/${keyword.topic}`}>{keyword.topic}</Link> [{keyword.frequency}]
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopicTrends;    

