import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <>
      <div>
        <h1>FastAPI and React.js</h1>
        {data && <p>{data.Hello}</p>}
        {data1 && <p>{data1.Home}</p>}
      </div>
      {localStorage.getItem('access_token') ?

      <div>
        <button onClick={() => navigate('/userinfo')}>회원 정보</button><br/>
        <button onClick={logout}>로그아웃</button><br />
        {localStorage.username} 접속 중
      </div> :

      <div>
        <button onClick={() => navigate('/login')}>로그인</button><br />
        <button onClick={() => navigate('/signup')}>회원가입</button>
      </div>}
    </>
  );
}

export default Home;