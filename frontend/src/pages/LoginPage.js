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
    <div className="login-page">
      <div className="login-page-center">
        <div className="login-container">
          {/* 로그인하세요 멘트 */}
          <h2 className='login-container-text'>Login your account</h2>

          {/* email 입력창 */}
          <div className="input-group">
            <input
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* password 입력창 */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* 비밀번호 찾기 링크 */}
            <p className='link-findpassword-text'>forgot password?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;