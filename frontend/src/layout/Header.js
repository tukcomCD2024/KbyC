import React, { useState } from 'react';
import '../App.css'
import logo from '../imgs/Treddit_logo_1.png'

const Header = () => {
    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const [searchWord, setSearchWord] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchWord.trim()) {
            handleNavigation(`/trendinfo/${searchWord}`)
        }
    }

    return (
        <header className='App-header'>
            <button className='App-header-link-logo' onClick={() => handleNavigation('/')}>
                <img src={logo} alt='home' className='App-header-link-logo-image' />
            </button>
            <button className='App-header-link' onClick={() => handleNavigation('/board')}>게시판</button>
            <button className='App-header-link' onClick={() => handleNavigation('/service/navernews')}>네이버 뉴스</button>
            <button className='App-header-link' onClick={() => handleNavigation('/service/googletrends')}>구글 트렌드</button>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='키워드 검색'
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                />
            </form>
            <hr/>
        </header>
    );
};

export default Header;