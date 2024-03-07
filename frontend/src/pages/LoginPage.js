import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('/user/login', {
      username: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      const data = response.data;
      console.log(data);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('username', data.username);
      alert('로그인 되었습니다.');
      navigate('/');
    })
    .catch(error => {
      console.error('에러 발생', error);
      alert('로그인에 실패했습니다.');
    });
  };

  return (
    <div>
      <form>
        <h1>로그인</h1>
        <label>Email</label>
        <br />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleLogin}>
          로그인
        </button>
        &nbsp;
        <button type="button" onClick={() => navigate('/signup')}>회원가입</button>
      </form>
    </div>
  );
};

export default LoginPage;