import React, { useState } from 'react';
import axios from 'axios';
import './NaverNewsSearch.css'

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const NaverNewsSearch = () => {
    const [searchWord, setSearchWord] = useState('');
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResultMessage, setSearchResultMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNewsList([]);
        setLoading(true);

        try {
            const response = await axios.post('/service/navernews', {
                content: searchWord
            }, {
                headers: {
                    'Content-type': 'application/json'
                }
            });

            setNewsList(response.data.news);
            setSearchResultMessage(`'${searchWord}' 검색 결과`);
            console.log(response.data.news);
        } catch(error) {
            console.error('에러 발생', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='naver-news-search-page'>
            <form onSubmit={handleSubmit} className='search-box'>
                <p>네이버 기사 검색</p>
                <input
                    type="text"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}/>
                <button className='search-button' type="submit">search</button>
            </form>
            
            <div className='result-box'>
                <h1>ds</h1>
                {loading && <div>검색 중...</div>}
                {searchResultMessage && <div>{searchResultMessage}</div>}
                
                <ul>
                {newsList.map((news, index) => (
                    <li key={index}>
                        <a href={news.link} target="_blank" rel="noopener noreferrer">{news.title}</a>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    );
};

export default NaverNewsSearch;