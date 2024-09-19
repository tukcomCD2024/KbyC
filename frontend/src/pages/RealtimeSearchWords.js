import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import WordCloud from 'react-wordcloud';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RealtimeSearchWords.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const RealtimeSearchWords = () => {
    const [wordsList, setWordsList] = useState([]);
    const [wordsList2, setWordsList2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newsList, setNewsList] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);
    const [posts, setPosts] = useState([]);
    const [titles, setTitles] = useState([]);


    useEffect(() => {
        async function getRealtimeSearchWords() {
            try {
                const response = await axios.get('/service/realtimesearchwords');
                setWordsList(response.data.words_list);
                setWordsList2(response.data.words_list2);
                console.log(response.data.words_list2);
                const data = response.data.words_list2;

                const today = new Date();
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const day = today.getDate().toString().padStart(2, '0');
                const date = `${year}-${month}-${day}`;

                const response2 = await axios.post('/keyword2/createkeywords', {
                    date: date,
                    names: data,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response2:', response2.data.result.result);
                setTitles(response2.data.result.result);
                setLoading(false);
            }
            catch (error) {
                console.error('에러 발생', error);
            }
        }
        getRealtimeSearchWords();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setPosts([]);
            if (selectedWord) {
                try {
                    const response = await axios.get(`/post/read/tag/${selectedWord}`);
                    setPosts(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error("게시글 가져오기 오류:", error);
                }
            }
        };
        fetchPosts();
    }, [selectedWord]);

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    const handleWordClick = async (word) => {
        setSelectedWord(word);
        console.log(word);
        try {
            const response = await axios.post('/service/navernews', {
                content: word,
                page: 1,
                page2: 1
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

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const onWordClick = (word) => {
        navigate(`/trendinfo/${word.text}`);
    };

    const navigate = useNavigate();

    return (
        <div className='realtime-search-page'>
            {loading && <div>로딩 중...</div>}
            <div className='realtime-search-content-container'>
                <div className='realtime-search-content-container-left'>
                    <div className='realtime-search-rank-container'>
                        <p1>{date}</p1>
                        <div className='realtime-search-rank-wrapper-container'>
                            <div className='realtime-search-rank-wrapper'>
                                {wordsList2.slice(0, 5).map((word, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(word)} style={{ cursor: 'pointer' }}>
                                        {/* {index + 1}. <Link to={`/trendinfo/${word}`}>{word}</Link><br/> */}
                                        {index + 1}. {word}<br/>
                                    </p2>
                                ))}
                            </div>
                            <div className='realtime-search-rank-wrapper'>
                                {wordsList2.slice(5).map((word, index) => (
                                    <p2 key={index} onClick={() => handleWordClick(word)} style={{ cursor: 'pointer' }}>
                                        {/* {index + 6}. <Link to={`/trendinfo/${word}`}>{word}</Link><br/> */}
                                        {index + 6}. {word}<br/>
                                    </p2>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 텍스트 클라우드 및 나머지 */}
                    <div className='realtime-search-rank-text-cloud-container'>
                        {/*<div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '20px' }}>
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
                        </div>*/}
                        <div style={{ width: '1000px', height: '500px' }}>
                            <WordCloud
                                words={titles.map(word => ({ text: word.title, value: word.count }))}
                                callbacks={{
                                    onWordClick: onWordClick,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className='realtime-search-content-container-right'>
                    <div className='realtime-search-rank-detail-container'>
                        <p1>{selectedWord ? selectedWord : '선택된 단어 없음'}</p1>
                        <div className='realtime-search-rank-detail-article'>
                            {newsList.map((news, index) => (
                                <p2 key={index}>
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">{index + 1}. {news.title}</a>
                                </p2>
                            ))}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RealtimeSearchWords;
