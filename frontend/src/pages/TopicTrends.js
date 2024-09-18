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

    const navigate = useNavigate();

    useEffect(() => {
        async function getTopicTrends() {
            try {
                const response = await axios.get('/service/topictrends');
                setTrendData(response.data.topic_trends);
                setLoading(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getTopicTrends();
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

    return (
        <div className='topic-trend-page'>
            {loading && <div>로딩 중...</div>}
            <div className='topic-trend-content-container'>
                <div className='topic-trend-content-container-left'>
                    <div className='topic-trend-rank-container'>
                        <p1>{selectedDate}</p1>
                        <div className='topic-trend-rank-wrapper-container'>
                            <div className='topic-trend-rank-wrapper'>
                            {selectedDate && result && (
                            <div>
                                {result.words.slice(0, 5).map((keyword, index) => (
                                    <p2 key={index}>
                                        {index + 1}. <Link to={`/trendinfo/${keyword.topic}`}>{keyword.topic}</Link><br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                            </div>
                            {selectedDate && result && (
                            <div>
                                {result.words.slice(5, 10).map((keyword, index) => (
                                    <p2 key={index}>
                                        {index + 6}. <Link to={`/trendinfo/${keyword.topic}`}>{keyword.topic}</Link><br/>
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
                        {/* <p1>트렌드 A</p1>
                        <div className='topic-trend-rank-detail-article'>
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
                        <div className='topic-trend-rank-detail-post'>
                            <p2>1. </p2>
                            <p2>2. </p2>
                            <p2>3. </p2>
                            <p2>4. </p2>
                            <p2>5. </p2>
                        </div> */}
                        <div className='topic-trend-rank-detail-article'>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopicTrends;    
