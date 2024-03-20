import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const NaverNewsSearch = () => {
    const [searchWord, setSearchWord] = useState('');
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);

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
            console.log(response.data.news);
        } catch(error) {
            console.error('에러 발생', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}>
                </input>
                <br/>
                <button type="submit">검색</button>
            </form>
            <hr/>
            {loading && <div>검색 중...</div>}
            <ul>
            {newsList.map((news, index) => (
                <li key={index}>
                    <a href={news.link} target="_blank" rel="noopener noreferrer">{news.title}</a>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default NaverNewsSearch;