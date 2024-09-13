import React, { useState } from 'react';
import '../App.css'
import logo from '../imgs/Treddit_logo_1.png'
import logo2 from '../imgs/Search_icon_1.png'


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
            <div className='App-header-menu-container'>
                <button className='App-header-link-logo' onClick={() => handleNavigation('/')}>
                    <img src={logo} alt='home' className='App-header-link-logo-image' />
                </button>
                <button className='App-header-link' onClick={() => handleNavigation('/service/topictrends')}>토픽 트렌드</button>
                <button className='App-header-link' onClick={() => handleNavigation('/service/realtimesearchwords')}> 실시간 검색어</button>
                <button className='App-header-link' onClick={() => handleNavigation('/service/googletrends')}>트렌드 데이터</button>
                <button className='App-header-link' onClick={() => handleNavigation('/board')}>게시판</button>
            </div>
            <form class="search-form" onSubmit={handleSubmit}>
                <div className='search-container'>
                    <img src={logo2} alt="search icon" className="search-form-logo-image" />
                    <input
                        type='text'
                        placeholder='키워드 검색'
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                        class="search-input"
                    />
                </div>
            </form>
            <hr/>
        </header>
    );
};

export default Header;