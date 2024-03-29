import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

const Header = () => {
    return (
        <header>
            <Link to={'/'}><button className='App-header-link'>홈</button></Link>
            &nbsp;&nbsp;
            <Link to={'/board'}><button className='App-header-link'>게시판</button></Link>
            &nbsp;&nbsp;
            <Link to={'/service/chatgpt'}><button className='App-header-link'>ChatGPT</button></Link>
            &nbsp;&nbsp;
            <Link to={'/service/navernews'}><button className='App-header-link'>네이버 뉴스</button></Link>
            <hr/>
        </header>
    );
};

export default Header;