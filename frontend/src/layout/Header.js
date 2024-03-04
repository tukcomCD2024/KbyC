import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <Link to={'/'}><button>홈</button></Link>
            &nbsp;&nbsp;
            <Link to={'/board'}><button>게시판</button></Link>
            <hr/>
        </header>
    );
};

export default Header;