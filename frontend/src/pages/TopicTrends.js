
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
    const [loading2, setLoading2] = useState(true);
    const [selectedWord, setSelectedWord] = useState(null);
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function getTopicTrends() {
            try {
                const response = await axios.get('/service/topictrends');
                setTrendData(response.data.topic_trends);
                console.log(response.data.topic_trends);
                // setResult(response.data.topic_trends[0]); 
                // setSelectedWord(response.data.topic_trends[0].words[0]);
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

    useEffect(() => {
        const fetchPosts = async () => {
            setPosts([]);
            if (selectedWord) {
                try {
                    const response = await axios.get(`/post/read/tag/${selectedWord.topic}`);
                    setPosts(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error("게시글 가져오기 오류:", error);
                }
            }
        };
        fetchPosts();
    }, [selectedWord]);

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
        console.log(formattedDate.replace(/[-]/g, ''));
        const result = trendData.find(entry => entry.date === formattedDate.replace(/[-]/g, ''));
        setResult(result);
        setIsDatePickerOpen(false);
        console.log("result", result);
        setSelectedDate(localDate);
    };

    const handleWordClick = async (word) => {
        setSelectedWord(word);
        setLoading2(true);
        try {
            const response = await axios.post('/service/navernews', {
                content: word.topic,
                page: 1,
                page2: 1
            }, {
                headers: {
                    'Content-type': 'application/json'
                }
            });
            setNewsList(response.data.news);
            setLoading2(false);
        } catch (error) {
            console.error('에러 발생', error);
        }
    };

    const onWordClick = (word) => {
        navigate(`/trendinfo/${word.text}`);
    };

    const handleNavigation = (path) => {
        window.location.href = path;
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
                                        {/* <Link to={`/trendinfo/${keyword.topic}`}>{index + 1}. {keyword.topic}</Link><br/> */}
                                        {index + 1}. {keyword.topic}<br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                            </div>
                            {selectedDate && result && (
                            <div>
                                {result.words.slice(5, 10).map((keyword, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(keyword)} style={{ cursor: 'pointer' }}>
                                        {/* <Link to={`/trendinfo/${keyword.topic}`}>{index + 6}. {keyword.topic}</Link><br/> */}
                                        {index + 6}. {keyword.topic}<br/>
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
                                <WordCloud
                                    words={result.words.map(word => ({ text: word.topic, value: word.frequency }))}
                                    callbacks={{
                                        onWordClick: onWordClick,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='topic-trend-content-container-right'>
                    <div className='topic-trend-rank-detail-container'>
                        <p1>{selectedWord ? selectedWord.topic : '선택된 단어 없음'}</p1>
                        <div className='topic-trend-rank-detail-article'>
                            <p1>관련 기사</p1>
                            {selectedWord && loading2 ?
                            <div>로딩 중...</div> :
                            <div>{newsList.map((news, index) => (
                                <p2 key={index}>
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">{index + 1}. {news.title}</a><br/>
                                </p2>
                            ))}</div>}
                            {/* {newsList.map((news, index) => (
                                <p2 key={index}>
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">{index + 1}. {news.title}</a>
                                </p2>
                            ))} */}
                            <br1/>
                            <p1>관련 게시글</p1>
                            {selectedWord && posts &&
                            <div>
                                {posts.map((post) => (
                                <p2 key={post.post_id}>
                                    <span onClick={() => handleNavigation(`/post/${post.post_id}`)}> {post.title} </span>
                                    | {post.writer_name} | {post.post_date.replace("T", " ")}<br/>
                                </p2>
                                ))}
                            </div>}
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

