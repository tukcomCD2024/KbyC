import React from 'react';
import '../App.css'

const Header = () => {
    const handleNavigation = (path) => {
        window.location.href = path;
    };

    return (
        <header className='App-header'>
            <button className='App-header-link-logo' onClick={() => handleNavigation('/')}>홈</button>
            <button className='App-header-link' onClick={() => handleNavigation('/board')}>게시판</button>
            <button className='App-header-link' onClick={() => handleNavigation('/service/chatgpt')}>ChatGPT</button>
            <button className='App-header-link' onClick={() => handleNavigation('/service/navernews')}>네이버 뉴스</button>
            <hr/>
        </header>
    );
};

export default Header;