import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <Link to={'/'}><button>홈</button></Link>
            &nbsp;&nbsp;
            <Link to={'/userinfo'}><button>회원 정보</button></Link>
            &nbsp;&nbsp;
            <Link to={'/board'}><button>게시판</button></Link>
            &nbsp;&nbsp;
            <Link to={'/service/chatgpt'}><button>ChatGPT</button></Link>
            &nbsp;&nbsp;
            <Link to={'/service/navernews'}><button>네이버 뉴스</button></Link>
            <hr/>
        </header>
    );
};

export default Header;