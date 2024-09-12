import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000')  // FastAPI 서버 주소
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/home')
      .then(response => response.json())
      .then(data1 => setData1(data1));
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    alert('로그아웃 되었습니다.');
    localStorage.clear();
    window.location.reload();
  }

  return (
      <div className='home-page'>
        <div className='content-container1'>
        <div class="search-container1">
            <form class="search-form1">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    class="search-input1"
                />
                <button type="submit" class="search-button1">
                  &gt;
                </button>
            </form>
        </div>

          <div className='rank-content-container'>
            <div className='text-cloud-container'>
                sadas
            </div>
            <div className='ranking-container'>
                sdsdsds
            </div>
          </div>
        </div>
        {/* <h1>Welcome to Trenddit</h1>
        {localStorage.getItem('access_token') ?

        <div>
          <h2>{localStorage.username} 계정으로 접속 중입니다. </h2>
          <div className='home-page-button-container'>
            <button onClick={() => navigate('/userinfo')}>회원 정보</button><br/>
            <button onClick={logout}>로그아웃</button>
          </div>
        </div> :

        <div>
          <h2>비회원으로 접속 중입니다. </h2>
          <div className='home-page-button-container'>
            <button onClick={() => navigate('/login')}>로그인</button><br />
            <button onClick={() => navigate('/signup')}>회원가입</button>
          </div>
        </div>} */}
      </div>
  );
}

export default Home;