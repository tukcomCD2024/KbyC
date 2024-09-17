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
      <div className='home-page'>
        <div className='content-container1'>
        <div class="search-container1">
            <form class="search-form1" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    class="search-input1"
                />
                <button class="search-button1" type="submit">
                  &gt;
                </button>
            </form>
        </div>

          <div className='rank-content-container'>
            <div className='text-cloud-container'>
                sadas
            </div>
            <div className='ranking-container'>
                <p1>2024.09.10</p1>
                <br1/>
                <div className='ranking-content-container'>
                  <p2>1. </p2>
                  <p2>2. </p2>
                  <p2>3. </p2>
                  <p2>4. </p2>
                  <p2>5. </p2>
                  <p2>6. </p2>
                  <p2>7. </p2>
                  <p2>8. </p2>
                  <p2>9. </p2>
                  <p2>10. </p2>
                </div>
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