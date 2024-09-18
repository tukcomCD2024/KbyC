import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    const [loading2, setLoading2] = useState(true);
    const [selectedWord, setSelectedWord] = useState(null);

    const [posts, setPosts] = useState([]);

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

    useEffect(() => {
        const fetchPosts = async () => {
            setPosts([]);
            if (selectedWord) {
                try {
                    const response = await axios.get(`/post/read/tag/${selectedWord.title}`);
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
        const result = trends.find(entry => entry.date === formattedDate);
        setResult(result);
        setSelectedDate(localDate);
        setIsDatePickerOpen(false);
        setSelectedDate(localDate);
    };

    const navigate = useNavigate();

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    const handleWordClick = async (word) => {
        setSelectedWord(word);
        setLoading2(true);
        console.log(word);
        try {
            const response = await axios.post('/service/navernews', {
                content: word.title,
                page: 1,
                page2: 1
            }, {
                headers: {
                    'Content-type': 'application/json'
                }
            });
            setNewsList(response.data.news);
            setLoading2(false);
            console.log(response.data.news);
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
                            {(
                            <div>
                                {trends.slice(0, 5).map((trend, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(trend)} style={{ cursor: 'pointer' }}>
                                         {/* <Link to={`/trendinfo/${trend.title}`}>{index + 1}.{trend.title}</Link><br/> */}
                                         {index + 1}. {trend.title}<br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                            </div>
                            {(
                            <div>
                                {trends.slice(5, 10).map((trend, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(trend)} style={{ cursor: 'pointer' }}>
                                        {/* <Link to={`/trendinfo/${trend.title}`}>{index + 6}. {trend.title}</Link><br/> */}
                                        {index + 6}. {trend.title}<br/>
                                    </p2>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>
                    <div className='trend-data-rank-text-cloud-container'>
                        {(
                            <div style={{ width: '1000px', height: '500px' }}>
                                <WordCloud
                                    words={titles.map(word => ({ text: word.title, value: word.count }))}
                                    callbacks={{
                                        onWordClick: onWordClick,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='trend-data-content-container-right'>
                    <div className='trend-data-rank-detail-container'>
                        <p1>{selectedWord ? selectedWord.title : '선택된 단어 없음'}</p1>
                        <div className='trend-data-rank-detail-article'>
                            {/* {newsList.map((news, index) => (
                                <p2 key={index}>
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">{index + 1}. {news.title}</a>
                                </p2>
                            ))} */}
                            <p1>관련 기사</p1>
                            {selectedWord && loading2 ?
                            <div>로딩 중...</div> :
                            <div>{newsList.map((news, index) => (
                                <p2 key={index}>
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">{news.title}</a><br/>
                                </p2>
                            ))}</div>}
                            {selectedWord && <div>{selectedWord.news_list.map((news, index) => (
                                <p2 key={index}>
                                    <a href={news.news_url} target="_blank">{news.news_title}</a><br/>
                                </p2>
                            ))}</div>}
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
