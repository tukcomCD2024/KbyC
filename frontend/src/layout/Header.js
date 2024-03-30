import React from 'react';
import '../App.css'
import logo from '../imgs/Treddit_logo_1.png'

const Header = () => {
    const handleNavigation = (path) => {
        window.location.href = path;
    };

    return (
        <header className='App-header'>
            <button className='App-header-link-logo' onClick={() => handleNavigation('/')}>
                <img src={logo} alt='home' className='App-header-link-logo-image' />
            </button>
            <button className='App-header-link' onClick={() => handleNavigation('/board')}>게시판</button>
            <button className='App-header-link' onClick={() => handleNavigation('/service/navernews')}>네이버 뉴스</button>
            <hr/>
        </header>
    );
};

export default Header;